# Architecture Decision Records (ADR)

Ghi lại các quyết định kỹ thuật quan trọng — tại sao chọn A thay vì B.
Đọc trước khi thay đổi architecture để hiểu context.

---

## Format

```markdown
## ADR-001: [Tên quyết định]
**Date:** YYYY-MM-DD
**Status:** Proposed / Accepted / Deprecated / Superseded

### Context
Tại sao cần đưa ra quyết định này?

### Decision
Đã quyết định làm gì?

### Alternatives considered
- Option A: ... (lý do không chọn)
- Option B: ... (lý do không chọn)

### Consequences
- Lợi: ...
- Hạn chế: ...
```

---

## ADR-001: Developer không cố định branch main
**Date:** 2026-04-09
**Status:** Accepted

### Context
Use cases ban đầu mô tả "developer làm việc trên main". Cần clarify vì thực tế developer có nhiều feature branches.

### Decision
Developer làm việc trên nhiều branches (`feat/xxx`, `fix/xxx`) theo Git workflow bình thường, merge vào `main` qua PR. KHÔNG cố định một branch cụ thể. Chỉ branch `business` là cố định (dành cho Business role).

### Consequences
- Lợi: Đúng với Git workflow chuẩn, không artificial constraint
- Lợi: Developer có thể làm nhiều features song song trên branches khác nhau
- Hạn chế: SessionStart hook phải detect branch hiện tại thay vì assume `main`

---

## ADR-002: Học từ gstack của Garry Tan
**Date:** 2026-04-09
**Status:** Accepted

### Context
Project gstack (github.com/garrytan/gstack) có nhiều patterns hay về AI-assisted development workflow. Đã clone vào `gstack/` để nghiên cứu.

### Decision
Học theo thứ tự: Triết lý (ETHOS) → Skills thực tế → Kỹ thuật nâng cao. Cherry-pick patterns phù hợp, không copy nguyên xi vì scope khác nhau (gstack: single developer; claude-test: dual-role business+dev).

### Patterns ưu tiên adopt (xem GSTACK_PATTERNS_TO_ADOPT.md):
1. **Phase 1:** Preamble pattern, Learnings system, ELI16 mode
2. **Phase 2:** Template + codegen, Forcing questions, Diff-based tests
3. **Phase 3:** Skill routing, Cross-model analysis

### Consequences
- Lợi: Tiếp thu kinh nghiệm thực chiến từ hệ thống đã production-tested
- Hạn chế: Cần filter vì gstack single-user, claude-test dual-role — không phải pattern nào cũng applicable

### Learning Progress
- **Cấp 1 ✅ DONE:** ETHOS.md, AGENTS.md, ARCHITECTURE.md → 12 patterns (PATTERN-001 to PATTERN-012)
- **Cấp 2 ✅ DONE:** investigate, office-hours, review, retro → 8 patterns (PATTERN-013 to PATTERN-020)
- **Cấp 3 ✅ DONE:** Browser daemon, SKILL.md codegen, Three-tier testing → 6 patterns (PATTERN-021 to PATTERN-026)
- **Cấp 4 ✅ DONE:** docs/skills.md mega-reference, autoplan pipeline, CEO/eng review, CSO security → 4 patterns (PATTERN-027 to PATTERN-030)
- **Cấp 5 ✅ DONE:** Canary monitoring, pair-agent, OpenClaw multi-agent, team mode, docs/designs/* → 17 patterns (PATTERN-031 to PATTERN-047)
- **Cấp 6 ✅ DONE:** Eng/CEO review cognitive patterns, OpenClaw anti-sycophancy, red-team, security categories, devex, document-release → 9 patterns (PATTERN-048 to PATTERN-056)
- **Cấp 7 ✅ DONE:** Review specialists army, Greptile triage, DX hall of fame, QA taxonomy, self-learning roadmap, session intelligence → 9 patterns (PATTERN-057 to PATTERN-065)
- **Cấp 8 ✅ DONE:** Browser architecture, design shotgun, sidebar message flow, design system, browser data platform, team mode, CHANGELOG style → 7 patterns (PATTERN-066 to PATTERN-072)
- **Cấp 9 ✅ DONE:** Design binary, multi-host architecture, GStack Browser vision, remote pairing, preamble bootstrap, gstack philosophy → 6 patterns (PATTERN-073 to PATTERN-078)
- **Cấp 10 ✅ DONE:** /ship workflow, land-and-deploy, setup-deploy, benchmark, auto-upgrade, design artifacts, test infrastructure LLM-as-judge → 7 patterns (PATTERN-079 to PATTERN-085)
- **Cấp 11 ✅ DONE:** Safety modes, health, routing, OpenClaw dispatch, pre-landing review, devex-review, ML prompt injection, Conductor sidebar, CEO/office-hours OpenClaw skills → 11 patterns (PATTERN-086 to PATTERN-096)
- **Cấp 11 bổ sung:** /cso 15-phase security audit, 6 forcing questions from office-hours, prerequisite skill offer, dropdown/portal detection → 4 patterns (PATTERN-097 to PATTERN-100)
- **TỔNG KẾT:** 100 patterns từ toàn bộ gstack codebase — comprehensive coverage hoàn chỉnh 🎯
