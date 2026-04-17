#!/usr/bin/env node
'use strict';

/**
 * OpenAPI to Markdown Converter
 *
 * Converts OpenAPI specification (v2 or v3) to structured markdown documentation.
 * Standalone utility with zero external dependencies (only Node.js stdlib).
 *
 * Usage:
 *   node scripts/utils/openapi-to-markdown.js [spec.json] [service-name] [source-url]
 *
 * Or as module:
 *   const { convert } = require('./openapi-to-markdown');
 *   const md = convert(specJson, 'Payment Service', 'https://api.example.com/swagger');
 */

const fs = require('fs');
const path = require('path');

// ─── OpenAPI Converter ──────────────────────────────────────────────────────

class OpenAPIConverter {
  constructor(spec, serviceName, sourceUrl) {
    this.spec = spec;
    this.serviceName = serviceName || this.extractServiceName();
    this.sourceUrl = sourceUrl || '';
    this.version = this.detectVersion();
  }

  detectVersion() {
    // v3: openapi: "3.x"
    // v2: swagger: "2.0"
    if (this.spec.openapi) return 3;
    if (this.spec.swagger) return 2;
    return 3; // default to v3
  }

  extractServiceName() {
    if (this.version === 3) {
      return this.spec.info?.title || 'API';
    } else {
      return this.spec.info?.title || 'API';
    }
  }

  getBaseUrl() {
    if (this.version === 3) {
      // v3: servers[0].url
      const server = this.spec.servers?.[0];
      if (!server) return '';
      return server.url || '';
    } else {
      // v2: scheme://host/basePath
      const scheme = this.spec.schemes?.[0] || 'https';
      const host = this.spec.host || '';
      const basePath = this.spec.basePath || '';
      if (!host) return '';
      return `${scheme}://${host}${basePath}`;
    }
  }

  getAuthType() {
    if (this.version === 3) {
      // securitySchemes in v3
      const schemes = this.spec.components?.securitySchemes;
      if (!schemes) return 'None';

      const typeMap = {
        apiKey: 'API Key',
        http: 'HTTP',
        oauth2: 'OAuth2',
        openIdConnect: 'OpenID Connect',
      };

      const schemeKeys = Object.keys(schemes);
      if (schemeKeys.length === 0) return 'None';

      const firstScheme = schemes[schemeKeys[0]];
      const type = typeMap[firstScheme.type] || firstScheme.type;

      if (firstScheme.type === 'http') {
        return `${type} (${firstScheme.scheme})`;
      }
      return type;
    } else {
      // securityDefinitions in v2
      const defs = this.spec.securityDefinitions;
      if (!defs) return 'None';

      const typeMap = {
        apiKey: 'API Key',
        basic: 'Basic Auth',
        oauth2: 'OAuth2',
      };

      const defKeys = Object.keys(defs);
      if (defKeys.length === 0) return 'None';

      const firstDef = defs[defKeys[0]];
      return typeMap[firstDef.type] || firstDef.type;
    }
  }

  getSpecVersion() {
    if (this.version === 3) {
      return this.spec.openapi || '3.0.0';
    } else {
      return this.spec.swagger || '2.0';
    }
  }

  extractEndpoints() {
    const endpoints = [];
    const paths = this.spec.paths || {};

    Object.entries(paths).forEach(([pathKey, pathValue]) => {
      if (!pathValue || typeof pathValue !== 'object') return;

      // Skip special keys ($ref, etc)
      const methods = Object.keys(pathValue).filter(
        key => !key.startsWith('$') && ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(key.toLowerCase())
      );

      methods.forEach(method => {
        const operation = pathValue[method];
        if (!operation || typeof operation !== 'object') return;

        const summary = operation.summary || operation.operationId || '(no summary)';
        endpoints.push({
          method: method.toUpperCase(),
          path: pathKey,
          summary: summary.substring(0, 60),
          fullSummary: operation.summary || '',
          operation,
          requestBody: operation.requestBody,
          parameters: operation.parameters || [],
          responses: operation.responses || {},
        });
      });
    });

    return endpoints;
  }

  resolveRef(ref) {
    // Resolve local $ref like "#/components/schemas/Foo" or "#/definitions/Foo"
    if (!ref || !ref.startsWith('#/')) return null;
    const parts = ref.slice(2).split('/');
    let obj = this.spec;
    for (const part of parts) {
      obj = obj?.[part];
      if (!obj) return null;
    }
    return obj;
  }

  buildExample(schema, depth = 0, maxDepth = 3, seen = new Set()) {
    if (!schema || typeof schema !== 'object') return null;

    // Handle $ref — resolve it
    if (schema.$ref) {
      const refKey = schema.$ref;
      if (seen.has(refKey)) return '(circular)';
      const resolved = this.resolveRef(refKey);
      if (!resolved) return schema.$ref.split('/').pop();
      const nextSeen = new Set(seen).add(refKey);
      return this.buildExample(resolved, depth, maxDepth, nextSeen);
    }

    if (depth > maxDepth) return '...';

    // allOf / oneOf / anyOf — use first
    if (schema.allOf) return this.buildExample(schema.allOf[0], depth, maxDepth, seen);
    if (schema.oneOf) return this.buildExample(schema.oneOf[0], depth, maxDepth, seen);
    if (schema.anyOf) return this.buildExample(schema.anyOf[0], depth, maxDepth, seen);

    // Array
    if (schema.type === 'array' || schema.items) {
      const item = this.buildExample(schema.items || {}, depth + 1, maxDepth, seen);
      return [item];
    }

    // Object
    if (schema.type === 'object' || schema.properties) {
      const props = schema.properties || {};
      const keys = Object.keys(props).slice(0, 8);
      const obj = {};
      for (const key of keys) {
        obj[key] = this.buildExample(props[key], depth + 1, maxDepth, seen);
      }
      if (Object.keys(props).length > 8) {
        obj['...'] = `(${Object.keys(props).length - 8} more fields)`;
      }
      return obj;
    }

    // Enum
    if (schema.enum) return schema.enum[0];

    // Primitives
    const typeExamples = {
      string: schema.format === 'date-time' ? '2024-01-01T00:00:00Z'
            : schema.format === 'date' ? '2024-01-01'
            : schema.format === 'uuid' ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
            : 'string',
      integer: 0,
      number: 0.0,
      boolean: true,
    };
    return typeExamples[schema.type] ?? schema.type ?? null;
  }

  getSchemaFromContent(content) {
    // Try application/json first, then */* fallback
    return content?.['application/json']?.schema
        || content?.['*/*']?.schema
        || content?.['application/xml']?.schema
        || null;
  }

  extractSchema(schema, depth = 0, maxDepth = 2) {
    // Legacy wrapper kept for compatibility
    return this.buildExample(schema, depth, maxDepth);
  }

  buildMarkdown() {
    const parts = [];

    // Header
    parts.push(`# ${this.serviceName} API`);
    parts.push('');

    // Metadata
    const baseUrl = this.getBaseUrl();
    const auth = this.getAuthType();
    const version = this.getSpecVersion();

    parts.push(`**Base URL:** ${baseUrl || '(not specified)'}`);
    parts.push(`**Auth:** ${auth}`);
    parts.push(`**Version:** ${version}`);
    if (this.sourceUrl) {
      parts.push(`**Source:** ${this.sourceUrl}`);
    }
    parts.push(`**Imported:** ${new Date().toISOString().split('T')[0]}`);
    parts.push('');

    // Endpoints table
    const endpoints = this.extractEndpoints();

    if (endpoints.length === 0) {
      parts.push('No endpoints found.');
      return parts.join('\n');
    }

    parts.push('## Endpoints');
    parts.push('');

    const table = ['| Method | Path | Description |', '|--------|------|-------------|'];
    const displayCount = Math.min(endpoints.length, 20);

    endpoints.slice(0, displayCount).forEach(ep => {
      table.push(`| ${ep.method} | \`${ep.path}\` | ${ep.summary} |`);
    });

    if (endpoints.length > displayCount) {
      parts.push(table.join('\n'));
      parts.push('');
      parts.push(`*... and ${endpoints.length - displayCount} more endpoints*`);
      parts.push('');
    } else {
      parts.push(table.join('\n'));
      parts.push('');
    }

    // Detailed sections (only top 20)
    if (endpoints.length > 0) {
      parts.push('## Chi tiết');
      parts.push('');

      const detailCount = Math.min(endpoints.length, 20);

      endpoints.slice(0, detailCount).forEach(ep => {
        this.appendEndpointDetail(parts, ep);
      });

      if (endpoints.length > detailCount) {
        parts.push(`### ... and ${endpoints.length - detailCount} more endpoints`);
        parts.push('');
        parts.push('Run all endpoints in the Endpoints table above.');
        parts.push('');
      }
    }

    return parts.join('\n');
  }

  appendEndpointDetail(parts, endpoint) {
    const { method, path, fullSummary, requestBody, parameters, responses } = endpoint;

    parts.push(`### ${method} ${path}`);
    parts.push('');

    if (fullSummary) {
      parts.push(`**Mô tả:** ${fullSummary}`);
      parts.push('');
    }

    // Parameters
    if (parameters.length > 0) {
      parts.push('**Parameters:**');
      parameters.forEach(param => {
        const type = param.schema?.type || 'string';
        const required = param.required ? ' (required)' : '';
        const desc = param.description || '';
        parts.push(`- \`${param.name}\`: ${type}${required} — ${desc}`);
      });
      parts.push('');
    }

    // Request body
    if (requestBody) {
      const schema = this.getSchemaFromContent(requestBody.content);
      if (schema) {
        const example = this.buildExample(schema);
        parts.push('**Request Body:**');
        parts.push('```json');
        parts.push(JSON.stringify(example, null, 2));
        parts.push('```');
        parts.push('');
      }
    }

    // Responses
    if (Object.keys(responses).length > 0) {
      const successCode = Object.keys(responses).find(code =>
        code.startsWith('2') || code === 'default'
      );

      if (successCode) {
        const response = responses[successCode];
        const schema = this.getSchemaFromContent(response.content);

        parts.push(`**Response ${successCode}:**`);
        if (schema) {
          const example = this.buildExample(schema);
          parts.push('```json');
          parts.push(JSON.stringify(example, null, 2));
          parts.push('```');
        } else if (response.description) {
          parts.push(response.description);
        }
        parts.push('');
      }

      // Error codes
      const errorCodes = Object.keys(responses).filter(code => code.startsWith('4') || code.startsWith('5'));
      if (errorCodes.length > 0) {
        parts.push(`**Errors:** ${errorCodes.join(', ')}`);
        parts.push('');
      }
    }

    parts.push('');
  }
}

// ─── Module exports & CLI handler ───────────────────────────────────────────

function convert(spec, serviceName, sourceUrl) {
  const converter = new OpenAPIConverter(spec, serviceName, sourceUrl);
  return converter.buildMarkdown();
}

// CLI mode
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node openapi-to-markdown.js <spec.json> [service-name] [source-url]');
    console.error('');
    console.error('Examples:');
    console.error('  node openapi-to-markdown.js spec.json "Payment Service" "https://api.example.com/swagger"');
    console.error('  node openapi-to-markdown.js spec.json');
    process.exit(1);
  }

  const specFile = args[0];
  const serviceName = args[1] || null;
  const sourceUrl = args[2] || '';

  // Read spec file
  let spec;
  try {
    let content = fs.readFileSync(specFile, 'utf8');
    spec = JSON.parse(content);
    // Handle double-encoded JSON (from Playwright browser_evaluate with filename)
    if (typeof spec === 'string') spec = JSON.parse(spec);
  } catch (err) {
    console.error(`Error reading spec file: ${err.message}`);
    process.exit(1);
  }

  // Convert and output
  try {
    const markdown = convert(spec, serviceName, sourceUrl);
    console.log(markdown);
  } catch (err) {
    console.error(`Conversion error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { convert, OpenAPIConverter };
