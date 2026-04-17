---
description: Developer bootstrap — phân tích codebase, extract conventions, populate .project-info/
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git *), Bash(ls *), Bash(cat *), Bash(npm *), Bash(gitnexus *), Bash(cp *), Bash(rm *), Bash(find *), Bash(mkdir *), Bash(grep *)
---

# Dev Bootstrap — Developer Analysis Pipeline

> Chỉ chạy sau khi bootstrap.md đã detect role = developer.
> Có thể chạy trực tiếp `/dev-bootstrap` để re-analyze.

---

## PHASE 0 — DETECT STATE

```bash
cat .project-info/meta.md 2>/dev/null
```

**Nếu `meta.md` tồn tại** → hỏi:
```
Project đã bootstrap lần cuối vào [date].
  [F] Full re-analysis   — phân tích lại toàn bộ (~3-5 phút)
  [P] Patterns only      — cập nhật patterns.md từ code mới (~1 phút)
  [S] Skip               — dùng thông tin hiện có
```
- S → DỪNG.
- P → chỉ chạy Phase 3 (patterns), bỏ qua 1-2 và 4-6.
- F → tiếp tục toàn bộ.

**Nếu không có `meta.md`** → tiếp tục.

### Project có code chưa?

```bash
ls -la
cat README.md 2>/dev/null
cat package.json 2>/dev/null
git log --oneline -5 2>/dev/null
```

Không có `src/`, `app/`, code files → DỪNG: "Project trống, chạy lại sau khi có code."

### GitNexus

```bash
gitnexus status
```

- Indexed → dùng GitNexus MCP cho Phase 1.
- Not indexed → hỏi: "Chạy `gitnexus analyze`? (Y/n)"
  - Y → chạy background, dùng Glob+Read song song trong lúc chờ.
  - N → dùng Glob + Read + Grep.

---

## PHASE 1 — ARCHITECTURE ANALYSIS

> Đọc template tại `.project-info/architecture_template.md`.

### Scan structure

```
Glob("src/**/*", "app/**/*", "lib/**/*", "packages/**/*")
```

Map ra:
- Top-level modules và trách nhiệm
- Layer separation (api, services, models, utils...)
- Entry points
- Config files quan trọng

### Identify pattern

- Monolith / Modular monolith / Microservices
- MVC / Clean Architecture / Hexagonal / Feature-based
- Frontend: Pages Router / App Router / SPA / SSR

GitNexus (nếu indexed):
```
gitnexus_query({ query: "main entry points and module structure" })
```

### Trace data flow

Đọc entry point + route/handler files: request → layers → storage.

### External integrations

Tìm fetch, axios, SDK calls → liệt kê external services.

### Entry point archetype

**TypeScript/JavaScript:**
```bash
find src/ -name "index.ts" -o -name "index.js" 2>/dev/null | head -20
grep -r "export \* from\|export {" src/ --include="index.ts" -l | head -5
```

**Python:**
```bash
find . -name "__init__.py" | head -20
```

**Java/Kotlin:**
```bash
find src/ -name "*.java" -o -name "*.kt" | xargs grep -l "^package " | head -10
```

| Pattern | Archetype |
|---|---|
| Nhiều `index.ts` với `export * from` | Barrel Entry Point |
| `__init__.py` với re-exports | Package Init |
| Public facade class | Package Root Class |
| Import trực tiếp | Direct Import |

**→ Tạo `.project-info/architecture.md`**

---

## PHASE 2 — STACK ANALYSIS

> Đọc template tại `.project-info/stack_template.md`.

Đọc song song:
- `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml`
- `tsconfig.json` / `.eslintrc*` / `prettier.config.*`
- `Dockerfile` / `docker-compose.yml`
- `.env.example`
- `README.md`

Extract: runtime versions, framework, key dependencies, build tools, env vars.

**→ Tạo `.project-info/stack.md`**

---

## PHASE 3 — CONVENTION EXTRACTION (4-tier)

> Đọc template tại `.project-info/conventions_template.md`.

### Tier 0 — Team Standards

```bash
cat STANDARD.md 2>/dev/null
```

Nếu tồn tại → đọc toàn bộ, extract rules, label `[STANDARD]`. Tier này thắng mọi tier khác.

### Tier 1 — Config files

```
.eslintrc* / eslint.config.*  → naming, style
prettier.config.*              → formatting
tsconfig.json                  → strictness, path aliases
commitlint.config.*            → commit convention
```

Label: `[AUTO - từ config]`

### Tier 2 — Frequency analysis

**React/Next.js:**
```bash
grep -r "use client" src/ --include="*.tsx" -l | wc -l
grep -r "export default function" src/ --include="*.tsx" -l | wc -l
grep -rn "^export function use" src/ --include="*.ts" -l | wc -l
```

**TypeScript:**
```bash
grep -rn "^interface " src/ --include="*.ts" | wc -l
grep -rn "^type " src/ --include="*.ts" | wc -l
```

Label: `[INFERRED - X/Y files]`

### Tier 3 — Code samples

```bash
git log --name-only --pretty="" -30 | grep -E "\.(ts|tsx|js|jsx|py)$" | sort -u | head -5
```

Đọc từng file, copy ví dụ thực tế: naming, imports, error handling, state management.
Label: `[EXAMPLE từ code thực]`

### Tier 4 — Interview

Hỏi 3 câu quan trọng nhất:
1. "Business logic đặt ở layer nào? (service / hook / component / ...)"
2. "Conventions nào mà new dev hay mắc lỗi?"
3. "Quy tắc về state management / data fetching?"

Label: `[CONFIRMED BY TEAM]`

### Output

**Summary:** `.project-info/conventions.md` — quick reference, 3-5 rules/domain.

**Atomic files** (chỉ tạo khi có đủ data):
```
.project-info/conventions/components.md
.project-info/conventions/hooks.md
.project-info/conventions/stores.md
.project-info/conventions/selectors.md
.project-info/conventions/services.md
.project-info/conventions/testing.md
.project-info/conventions/api.md
.project-info/conventions/design.md   ← xem Phase 3.5
```

---

## PHASE 3.5 — DESIGN SYSTEM EXTRACTION

> Chỉ chạy nếu project là frontend (React/Next.js/Vue).
> Output: `.project-info/conventions/design.md`

### Có design system chưa?

```bash
cat tailwind.config.* 2>/dev/null | head -30
grep -r "css-variables\|--primary\|--background" src/ --include="*.css" -l 2>/dev/null | head -3
cat components.json 2>/dev/null
```

**Không có tokens** → hỏi:
```
Project chưa có design system. Chọn template:
[1] Minimal Light  — Clean, precise (Vercel, Notion)
[2] Dark Pro       — Dark-native (Linear, Cursor)
[3] Warm Light     — Soft, brand-friendly (Stripe, Resend)
[4] Tự mô tả
[5] Skip
```
- 1-3 → copy từ `.claude/skills/frontend-design/templates/` vào `design.md`
- 4 → hỏi thêm mô tả
- 5 → bỏ qua Phase 3.5

**Có tokens** → extract:

```bash
cat src/app/shadcn-theme.css 2>/dev/null
cat tailwind.config.* 2>/dev/null
cat components.json 2>/dev/null
grep -r "@font-face\|font-family\|--font" src/ --include="*.css" | head -20
grep -r "fontSize\|fontFamily\|colors\|spacing" tailwind.config.* 2>/dev/null
```

Extract: Typography · Color System · Spacing & Radius · Motion · Component Library.

Output format `conventions/design.md`:
```markdown
# Design System Conventions
> Extracted by /dev-bootstrap. Đọc trước khi viết UI.

## Typography
- Display font: [name] — headings h1-h2
- Body font: [name]
- Mono font: [name]
- Scale: [tailwind / custom]

## Color System
CSS variables (tại [file]):
- --background: [value]
- --foreground: [value]
- --primary: [value]
[...]
Dark mode: [có / không, cách implement]

## Spacing & Radius
- Border radius: --radius = [value]
- Container: [pattern]

## Motion
- Library: [CSS / Framer Motion / Motion]
- Standard transition: [pattern]

## Component Library
- UI Library: [Shadcn / Radix / custom]
- Import: import { Button } from "@/components/ui/button"
- Icons: [lucide-react / heroicons]
```

---

## PHASE 3.5.1 — DESIGN CSV DATABASE

> Chạy ngay sau Phase 3.5. Bỏ qua nếu Phase 3.5 bị skip.

Tạo `.project-info/design-data/` với 4 CSV files từ data thực của project:

### `colors.csv`
`name,hex_or_var,semantic_role,usage,tailwind_class,constraints`

### `typography.csv`
`name,font_family,size_token,weight,line_height,usage,tailwind_class`

### `components.csv`
`name,import_path,variants,sizes,default_variant,usage_context,notes`

### `ux-guidelines.csv`
`id,rule,reason,applies_to,severity`  (severity: CRITICAL | HIGH | MEDIUM)

### Search script

```bash
ls scripts/design-search.js 2>/dev/null || echo "MISSING"
```

Nếu MISSING → tạo từ template tại `.claude/skills/frontend-design/SKILL.md` phần "Design Search Script".

---

## PHASE 3.6 — UPDATE RULES FROM CONVENTIONS

### `.claude/rules/coding-style.md`

Tìm `## Project-Specific Overrides`, thay bằng rules thực tế từ Tier 0-3:

```markdown
## Project-Specific Overrides
> Extracted by /dev-bootstrap on YYYY-MM-DD.

### Naming [SOURCE]
- [rule]

### Anti-patterns [SOURCE]
- [rule]
```

### `.claude/rules/testing.md`

Điền `## Test Commands` từ `package.json` scripts:
```markdown
## Test Commands
- Run: `npm test`
- Watch: `npm test -- --watch`
- Coverage: `npm run coverage`
```

### Nếu có `STANDARD.md`

Prepend rules với label `[STANDARD]` vào đầu `coding-style.md`.

---

## PHASE 4 — ONBOARDING

> Đọc template tại `.project-info/onboarding_template.md`.

Tổng hợp:
1. Setup commands từ README + scripts
2. Entry points quan trọng
3. "Không làm" list từ conventions + gotchas

**→ Tạo `.project-info/onboarding.md`**

---

## PHASE 5 — UPDATE CLAUDE.md

1. Thay `**Status:** NOT_BOOTSTRAPPED` → `**Status:** BOOTSTRAPPED_DEVELOPER`
2. Điền `## Project Overview` từ Phase 2.
3. Thay `## Commands`:

```markdown
## Commands

| Command | Dùng khi |
|---------|----------|
| `/bootstrap` | Re-analyze project |
| `/dev-bootstrap` | Re-run developer analysis |
| `/resume` | Mở session mới |
| `/handoff` | Kết thúc session |
| `/learn` | Trích xuất patterns |
| `/commit` | Conventional commit |
| `/pr` | Pull request |
| `/review` | Review code |
| `/tdd` | TDD workflow |
| `/test` | Chạy tests |
| `/parallel` | Tasks song song |
```

---

## PHASE 6 — META + ACTIVATE + REPORT

> Chạy phase này SAU KHI Phase 1–5 đã hoàn thành. Không push remote, không tạo branch cho đến bước cuối.

### Bước 6.1 — Tạo `.project-info/meta.md`

```markdown
# Bootstrap Meta

**Bootstrapped:** YYYY-MM-DD HH:MM
**By:** Claude [model]
**Stack:** [Next.js 15 + TypeScript + Tailwind]
**Architecture:** [App Router, Feature-based]

## Files generated
- architecture.md  ✓
- conventions.md   ✓
- stack.md         ✓
- onboarding.md    ✓
- patterns.md      (populated by /learn)
- design-data/     (CSV database)

## Re-bootstrap
Run `/dev-bootstrap` to update.
```

### Bước 6.2 — Đảm bảo .gitignore đúng

Kiểm tra `.gitignore` có các entries sau không. Nếu thiếu → thêm vào:

```
.worktrees/
.project-manager/
kg/
node_modules/
.env
.env.local
.DS_Store
```

### Bước 6.3 — Activate developer tools

```bash
find .claude/commands -maxdepth 1 -name "*.md" ! -name "bootstrap.md" ! -name "business-bootstrap.md" -delete
cp .claude/commands/_roles/developer/*.md .claude/commands/
# business-bootstrap.md đã ở root commands — giữ nguyên để dùng ở Bước 6.6

find .claude/skills -maxdepth 1 -name "*.md" -delete
rm -rf .claude/skills/frontend-design .claude/skills/design-system \
       .claude/skills/frontend-slides .claude/skills/deep-research \
       .claude/skills/blueprint .claude/skills/deploy-to-vercel 2>/dev/null
cp -r .claude/skills/_roles/developer/* .claude/skills/

find .claude/agents -maxdepth 1 -name "*.md" ! -name "pm.md" -delete
cp .claude/agents/_roles/developer/*.md .claude/agents/
```

### Bước 6.4 — Kiểm tra remote

```bash
git remote -v
```

**Nếu chưa có remote:**
```
⚠️  Project chưa có remote repository.
Thêm remote trước khi tiếp tục:
  git remote add origin <URL>

Sau khi thêm remote, gõ "tiếp tục" để hoàn thành bootstrap.
```
→ Dừng, chờ user thêm remote và xác nhận.

**Nếu đã có remote** → tiếp tục Bước 6.5.

### Bước 6.5 — Tạo business branch (orphan)

Business branch phải là **orphan** — không kế thừa codebase từ main, chỉ chứa design artifacts.

```bash
# Kiểm tra branch business đã tồn tại chưa
git branch -r | grep "origin/business"
```

**Nếu chưa có branch business:**

Hỏi user:
```
Tạo business branch cho designer/PM không?
[Y] Có — tạo ngay (orphan branch, chỉ chứa design files)
[N] Không — bỏ qua
```

Nếu Y:
```bash
# Tạo orphan branch — không có history từ main
git checkout --orphan business
git rm -rf . --quiet

# Tạo cấu trúc tối thiểu cho business
mkdir -p backlog/tasks backlog/docs .design-handoff

# Copy .claude config cho business role
mkdir -p .claude/agents .claude/commands .claude/skills .claude/rules
cp -r .claude/agents/_roles/business/* .claude/agents/ 2>/dev/null || true
cp -r .claude/commands/_roles/business/* .claude/commands/ 2>/dev/null || true
cp -r .claude/skills/_roles/business/* .claude/skills/ 2>/dev/null || true
cp .claude/rules/*.md .claude/rules/ 2>/dev/null || true

# Tạo CLAUDE.md tối giản cho business
cat > CLAUDE.md << 'EOF'
# Project Instructions

## Bootstrap Guard
**Status:** NOT_BOOTSTRAPPED
**Role:** business

Run `/bootstrap` to start.
EOF

git add .
git commit -m "chore: init business branch (design-only)"

# Quay về main
git checkout main

# Tạo worktree từ business branch
git worktree add .worktrees/business business
```

**Nếu đã có branch business** → chỉ tạo worktree:
```bash
git worktree add .worktrees/business business 2>/dev/null || echo "Worktree đã tồn tại"
```

### Bước 6.6 — Bootstrap business (tùy chọn)

Chỉ hỏi SAU KHI worktree đã sẵn sàng:

```
Business branch đã tạo tại .worktrees/business/
Bootstrap business ngay không?
[Y] Có (~2-3 phút)
[N] Không — business member tự bootstrap sau
```

- **Y** → Đọc `.claude/commands/_roles/business/business-bootstrap.md` và thực thi trong context của `.worktrees/business/`
- **N** → Bỏ qua

### Bước 6.7 — Push (bước CUỐI CÙNG)

Chỉ push SAU KHI mọi thứ đã xong:

```bash
# Push main branch
git push -u origin main

# Push business branch nếu đã tạo
git push -u origin business 2>/dev/null || true
```

### KG Index — Tạo knowledge graph index

Sau khi `.project-info/` đã được ghi, tạo KG entries để PM biết tìm thông tin ở đâu.

**Modules** (từ architecture.md):

Với mỗi top-level module tìm được trong Phase 1:
```bash
node scripts/kg.js add-entity --type module --id "[module-slug]" --name "[Module Name]"
node scripts/kg.js add-obs "module:[module-slug]" --type link \
  --text ".project-info/architecture.md#[section]"
```

**Stack decisions** (từ stack.md):

Với mỗi tech choice quan trọng (framework, database, auth, deploy):
```bash
node scripts/kg.js add-entity --type decision --id "stack-[tech]" --name "Dùng [Tech] cho [purpose]"
node scripts/kg.js add-obs "decision:stack-[tech]" --type link --text ".project-info/stack.md"
```

**Conventions** (từ conventions.md):

```bash
node scripts/kg.js add-entity --type document --id "conventions" --name "Code Conventions"
node scripts/kg.js add-obs "document:conventions" --type link --text ".project-info/conventions.md"
```

Với mỗi atomic convention file tạo được:
```bash
node scripts/kg.js add-entity --type document --id "conventions-[domain]" --name "[Domain] Conventions"
node scripts/kg.js add-obs "document:conventions-[domain]" --type link \
  --text ".project-info/conventions/[domain].md"
```

**Patterns** (nếu patterns.md đã có):
```bash
node scripts/kg.js add-entity --type document --id "patterns" --name "Learned Patterns"
node scripts/kg.js add-obs "document:patterns" --type link --text ".project-info/patterns.md"
```

---

### Báo cáo

```
## Dev Bootstrap Complete ✓

Role:         Developer
Stack:        [React 18 · TypeScript · Tailwind]
Architecture: [CRA SPA, Feature-based]
GitNexus:     [Indexed / Not indexed]
Design CSV:   [N colors, N components, N rules]
Worktree:     .worktrees/business/ [created / exists / pending]
Business:     [Bootstrapped / Pending]

Files created in .project-info/:
  architecture.md · conventions.md · stack.md
  onboarding.md · meta.md · design-data/

KG Index:     [N modules, N decisions, N documents] → query: node scripts/kg.js list

Next: commit .project-info/ và .claude/ vào repo để team dùng chung.
```
