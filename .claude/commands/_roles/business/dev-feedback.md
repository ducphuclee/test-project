---
description: Xử lý câu hỏi hoặc feedback từ developer — clarify spec, giải quyết blockers, update nếu cần.
argument-hint: <mô tả feedback từ dev>
allowed-tools: Read, Write, Edit, mcp__backlog__document_update, mcp__backlog__task_edit
---

# Dev Feedback Loop

**Trigger:** "Dev hỏi về", "dev không build được", "spec unclear", "implementation issue", "dev phát hiện vấn đề"

**Mục đích:** Structured loop để incorporate developer feedback vào spec sau Handoff — không để changes chỉ tồn tại trong Slack

**Prerequisite:** Đã có Handoff doc

---

## Tại sao quan trọng?

Sau Handoff, dev phát hiện:
- Spec thiếu edge case
- Technical constraint ngăn approach planned
- Requirement mơ hồ khi implement
- Scope lớn hơn estimate

Nếu không document lại, team bị split: "spec says X" vs "code does Y". Debt ngay từ sprint đầu.

---

## Bước 1 — Capture Dev Question/Issue

> "Dev đang gặp vấn đề gì cụ thể? Paste câu hỏi/comment của họ."

**Phân loại feedback:**

| Type | Description | Action |
|------|-------------|--------|
| **Clarification** | Spec unclear, cần biết thêm | Answer + update spec |
| **Technical Blocker** | Approach không feasible | Propose alternative |
| **Scope Discovery** | Feature lớn hơn estimate | Scope negotiation |
| **Bug in Spec** | Logic error / contradiction | Fix spec, notify dev |

---

## Bước 2 — Draft Response/Resolution

**Clarification:**
> "Dựa trên Design Doc, clarification là:
> [Answer cụ thể]
> Tôi sẽ thêm vào spec."

**Technical Blocker:**
> "Approach hiện tại ([describe]) không feasible vì [dev's reason].
>
> Alternatives:
> A) [Alternative 1] — Trade-off: [pros/cons]
> B) [Alternative 2] — Trade-off: [pros/cons]
>
> Option nào?"

**Scope Discovery:**
> "Dev estimate [scope] thay vì [original]. Options:
> A) Proceed — accept longer timeline
> B) Trim v1 — cut [feature]
> C) Phase — [part A] now, [part B] later
>
> Discuss với dev?"

**Bug in Spec:**
> "Spec có contradiction:
> [Section X] nói A nhưng [Section Y] nói B.
> Correct là: [decision]
> Fix ngay."

---

## Bước 3 — Update Spec

Sau khi resolution được agree:

1. **Update relevant spec file** (PRD hoặc Handoff) với clarification/fix
2. **Thêm note:**
   ```
   > **Note [date]:** [What changed] — based on dev feedback
   ```
3. **Nếu Technical Blocker** → run Spec Revision để update approach properly

---

## Bước 4 — Cập nhật backlog

**Nếu Clarification:**
→ Confirm spec đã update, không cần log thêm

**Nếu Technical Blocker / Scope Change:**
→ Update backlog document:
```
**Implementation Adjustment — [Feature]**
- **Decision:** [what changed]
- **Why:** Technical constraint discovered during implementation
- **Original:** [was]
- **New:** [is]
```

**Nếu Bug in Spec:**
→ Log pattern để học lại next time:
```
- [Feature]: [Type of ambiguity] gây confusion. Next time: [preventive measure]
```

---

## Bước 5 — Close the Loop với Dev

Tạo update message:

```
✅ **Spec Updated — [Feature]**

Your question about [X]: [Answer/Resolution]

Changes:
- [File]: [What changed]

[If scope change]: New estimate: [timeline]

Confirm unblocked? Other questions?
```

---

## Khi nào escalate?

Nếu feedback reveal **fundamental issue** (wrong user / wrong problem / wrong approach):

→ **Dừng.** Không patch spec.
→ **Nói thẳng:** "Đây không phải issue nhỏ. Nếu [concern] đúng, cần rethink feature từ đầu. Muốn Office Hour lại không?"
