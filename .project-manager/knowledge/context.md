# Project Context

Thông tin quan trọng mà agents mới cần biết để làm việc hiệu quả.
Khác với CLAUDE.md (conventions) — file này chứa context THỰC TẾ của project đang chạy.

---

## Business Context

Project này là **Smart Bootstrap System** — framework quản lý workflow cho Claude Code với 2 roles:
- **Developer**: implement features trên feature branches, merge vào main qua PR
- **Business (BA/Designer)**: tạo UI proposals trên branch `business`, commit kèm handoff notes cho dev

**Demo deadline:** 2026-04-16 (tuần tới). Luồng cốt lõi cần hoàn thiện:
Business (yêu cầu → docs → UI → Vercel) → Developer (pull worktree → implement → PR).

## Technical Context

**Skills đã có và hoạt động:**
- `/prp-prd` — PRD generator 7 phases, lưu vào `.claude/PRPs/prds/`
- `/design` — 5 modes: compose/layout/theme/iterate/audit
- `/deploy` — Vercel preview (SKILL.md path đã fix: `.claude/skills/_roles/business/deploy-to-vercel/`)
- `/commit` (business) — tự động tạo `.design-handoff/YYYY-MM-DD-HH-MM.md`
- `/from-handoff` — developer đọc handoff → implement checklist (mới tạo 2026-04-09)
- SessionStart hook — auto-sync `.worktrees/business/`, surface context

**Branch strategy:**
- Developer: nhiều branches (`feat/xxx`, `fix/xxx`) → merge main qua PR — KHÔNG cố định
- Business: branch cố định `business` (hoặc personal branch fork từ `business`)

## Team & Process

**Learning từ gstack (Garry Tan / YC CEO):**
- Đang nghiên cứu project `gstack/` (đã clone vào thư mục này) để học patterns
- Docs phân tích: `docs/gstack-analysis.md`, `docs/GSTACK_PATTERNS_TO_ADOPT.md`, `docs/GSTACK_SUMMARY.md`
- Ưu tiên học: triết lý (ETHOS) → skills thực tế → kỹ thuật nâng cao

## External Dependencies

- **Vercel** — deploy preview cho business UI proposals (cần `vercel` CLI)
- **Git worktrees** — developer dùng `.worktrees/business/` để xem design mà không switch branch

## Known Gotchas

- `/deploy` command trước đây reference sai SKILL.md path → đã fix 2026-04-09
- Developer branch KHÔNG phải `main` mặc định — là bất kỳ feature branch nào đang làm
- `.design-handoff/` file được tạo tự động khi business chạy `/commit` — developer đọc file này qua `/from-handoff`
- Stop hook có thể false-positive khi context chứa deadline/future plans — đã fix prompt 2026-04-09
