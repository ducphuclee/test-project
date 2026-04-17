---
description: Chuẩn bị materials để present cho stakeholders hoặc revisit past decisions. Mode A = present, Mode B = revisit.
argument-hint: <tên feature/decision và audience>
allowed-tools: Read, Write, mcp__backlog__document_create
---

# Stakeholder Alignment

**Trigger:** "Present cho team", "xin approval", "get buy-in", "present cho sếp", "revisit quyết định"

**Mục đích:** Chuẩn bị materials để trình bày findings/quyết định cho stakeholders hoặc re-open past decisions với context mới

**Output:** Executive Brief hoặc Decision Revision record

---

## Xác định Mode

> "Bạn cần làm gì?
>
> **A — Present findings cho stakeholders** — chuẩn bị material trình bày
> **B — Revisit một quyết định** — có thông tin mới hoặc context thay đổi"

---

## Mode A: Present to Stakeholders

### Step 1 — Xác định audience

> "Bạn sẽ present cho ai?
> - **C-level / Board:** cần executive summary, ROI, risk
> - **Team lead / Manager:** cần scope, timeline, dependencies
> - **Cross-functional team:** cần workflow, who does what
> - **External stakeholder:** cần value proposition, deliverables"

### Step 2 — Load context

Đọc Design Doc / PRD / memories.md. Tóm tắt:
- Feature đang discuss
- Key decisions
- Current status

### Step 3 — Tạo Executive Brief

**Cho C-level / Board:**

```markdown
# [Feature] — Executive Brief

**Date:** YYYY-MM-DD | **Decision needed?** Yes/No

## The Opportunity
[Problem + why now + business impact]

## Our Approach
[Bullets: what, why this approach]

## Expected Outcomes
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| [metric] | [now] | [goal] | [when] |

## Investment Required
- Time: [estimate]
- Resources: [who]
- Budget: [if applicable]

## Risks & Mitigations
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| [risk] | High/Med/Low | [plan] |

## Ask
[Clear action: Approve / Feedback / Allocate resources]
```

**Cho Team / Cross-functional:**

```markdown
# [Feature] — Team Alignment

## What & Why
[2-3 sentences]

## Scope
**In:** [bullets]
**Out (v1):** [bullets]

## Who Does What
| Team | Action | By When |
|------|--------|---------|
| Dev | [implement X] | [date] |
| Design | [review] | [date] |
| QA | [test] | [date] |

## Key Decisions
[From decision log — relevant items only]

## Next Steps
[3 bullets max]
```

### Step 4 — Presentation Tips

> - Gửi doc trước 24h nếu cần time đọc
> - Chuẩn bị câu trả lời cho 3 objections thường gặp
> - Nói thẳng: bạn cần **decision** hay **feedback**?

---

## Mode B: Revisit Past Decision

### Step 1 — Xác định quyết định

> "Quyết định nào bạn muốn re-open? Lý do?"

Load từ memories.md hoặc decision log.

### Step 2 — Present old vs new context

```markdown
## Decision Revisit: [Title]

**Original Decision:** [date]
[Decision + rationale từ lúc đó]

**New Context:**
[Thông tin mới / gì thay đổi]

**Options:**
- **Keep:** [pros/cons]
- **Revise to:** [alternative + why]
- **Explore further:** [nếu cần thêm info]
```

### Step 3 — Facilitate discussion

> "Bạn play devil's advocate cho option nào? Hay bạn đã có preference?"

Present arguments nếu cần.

### Step 4 — Log revised decision

Update backlog document:

```
### [YYYY-MM-DD] [Decision] — REVISED
- **Decision:** [new]
- **Why:** [new context + reasoning]
- **Supersedes:** Decision from [date]
- **Alternatives rejected:** [why no longer valid]
```
