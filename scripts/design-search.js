#!/usr/bin/env node
/**
 * Design Data Search — BM25 + keyword search over project design CSVs
 *
 * Usage:
 *   node scripts/design-search.js "<query>"
 *   node scripts/design-search.js "<query>" --csv colors
 *   node scripts/design-search.js "<query>" --csv components --top 5
 *
 * Available CSVs: colors | typography | components | ux-guidelines
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), '.project-info', 'design-data');

const CSV_CONFIG = {
  colors: {
    file: 'colors.csv',
    searchCols: ['name', 'semantic_role', 'usage', 'tailwind_class', 'constraints'],
    outputCols: ['name', 'hex_or_var', 'tailwind_class', 'usage', 'constraints'],
  },
  typography: {
    file: 'typography.csv',
    searchCols: ['name', 'font_family', 'usage', 'tailwind_class'],
    outputCols: ['name', 'font_family', 'size_token', 'weight', 'tailwind_class'],
  },
  components: {
    file: 'components.csv',
    searchCols: ['name', 'variants', 'usage_context', 'notes'],
    outputCols: ['name', 'import_path', 'variants', 'default_variant', 'usage_context'],
  },
  'ux-guidelines': {
    file: 'ux-guidelines.csv',
    searchCols: ['rule', 'reason', 'applies_to'],
    outputCols: ['id', 'severity', 'rule', 'applies_to'],
  },
};

// --- CSV parser (handles quoted fields) ---
function parseCSV(content) {
  const lines = content.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = splitCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] || '').trim()]));
  });
}

function splitCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

// --- BM25 scoring ---
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function bm25Score(docTokens, queryTerms, avgDocLen, docFreqs, numDocs, k1 = 1.5, b = 0.75) {
  const docLen = docTokens.length;
  const termCounts = {};
  for (const t of docTokens) termCounts[t] = (termCounts[t] || 0) + 1;

  let score = 0;
  for (const term of queryTerms) {
    const tf = termCounts[term] || 0;
    if (tf === 0) continue;
    const df = docFreqs[term] || 1;
    const idf = Math.log((numDocs - df + 0.5) / (df + 0.5) + 1);
    const tfNorm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLen / avgDocLen)));
    score += idf * tfNorm;
  }
  return score;
}

// --- Search ---
function search(query, csvName, topN = 3) {
  const config = CSV_CONFIG[csvName];
  if (!config) {
    console.error(`Unknown CSV: "${csvName}". Available: ${Object.keys(CSV_CONFIG).join(', ')}`);
    process.exit(1);
  }

  const filePath = path.join(DATA_DIR, config.file);
  if (!fs.existsSync(filePath)) {
    console.log(`[${csvName}] No data at ${filePath}. Run /bootstrap to generate.`);
    return;
  }

  const rows = parseCSV(fs.readFileSync(filePath, 'utf8'));
  if (rows.length === 0) {
    console.log(`[${csvName}] Empty CSV.`);
    return;
  }

  const queryTerms = tokenize(query);

  // Build tokenized docs
  const tokenizedDocs = rows.map(row =>
    tokenize(config.searchCols.map(col => row[col] || '').join(' '))
  );

  const avgDocLen = tokenizedDocs.reduce((s, d) => s + d.length, 0) / tokenizedDocs.length;

  // Document frequencies per query term
  const docFreqs = {};
  for (const term of queryTerms) {
    docFreqs[term] = tokenizedDocs.filter(d => d.includes(term)).length;
  }

  // Score rows
  const scored = rows
    .map((row, i) => ({
      row,
      score: bm25Score(tokenizedDocs[i], queryTerms, avgDocLen, docFreqs, rows.length),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .filter(r => r.score > 0);

  if (scored.length === 0) {
    console.log(`[${csvName}] No results for "${query}"`);
    return;
  }

  console.log(`\n=== ${csvName} — "${query}" (top ${scored.length}) ===`);
  for (const { row } of scored) {
    const parts = config.outputCols
      .filter(col => row[col])
      .map(col => `  ${col}: ${row[col]}`);
    console.log(parts.join('\n'));
    console.log('');
  }
}

// --- CLI ---
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  console.log([
    'Usage: node scripts/design-search.js "<query>" [options]',
    '',
    'Options:',
    '  --csv <name>   Search specific CSV: colors | typography | components | ux-guidelines',
    '  --top <n>      Number of results per CSV (default: 3)',
    '',
    'Examples:',
    '  node scripts/design-search.js "primary button"',
    '  node scripts/design-search.js "error color" --csv colors',
    '  node scripts/design-search.js "form input" --csv components --top 5',
  ].join('\n'));
  process.exit(0);
}

const query = args.find(a => !a.startsWith('--')) || '';
const csvIdx = args.indexOf('--csv');
const topIdx = args.indexOf('--top');
const csvArg = csvIdx !== -1 ? args[csvIdx + 1] : null;
const topN = topIdx !== -1 ? parseInt(args[topIdx + 1], 10) : 3;

if (!query) {
  console.error('Error: query is required.');
  process.exit(1);
}

if (csvArg) {
  search(query, csvArg, topN);
} else {
  for (const csvName of Object.keys(CSV_CONFIG)) {
    search(query, csvName, topN);
  }
}
