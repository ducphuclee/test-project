---
description: Cập nhật Design Doc hoặc PRD sau khi đã approve — track thay đổi, impact analysis, notify dev.
argument-hint: <tên feature hoặc path/to/doc>
allowed-tools: Read, Write, Edit, mcp__backlog__document_update, mcp__backlog__task_edit
---

# Spec Revision

**Trigger:** "Sửa spec", "update PRD", "tôi muốn thay đổi", "requirement thay đổi", "revise design doc"

**Mục đích:** Sửa một spec đã approve (Design Doc hoặc PRD) mà không cần restart từ đầu. Mọi thay đổi được document, justified, và communicate rõ ràng.

**Prerequisite:** Đã có Design Doc hoặc PRD tồn tại

---

## Bước 1 — Xác định phạm vi thay đổi

Phân loại scope của thay đổi:

- **A — Nhỏ:** Wording, details, clarification (không ảnh hưởng logic)
- **B — Trung bình:** Một section hoặc user story mới (ảnh hưởng một phần scope)
- **C — Fundamental:** Problem statement, target user, hoặc approach (restart từ đầu?)

**Nếu loại C:** Warning —
> "Đây là thay đổi fundamental. Có thể ảnh hưởng toàn bộ design. Bạn có muốn chạy Office Hour lại cho feature này không? Hay tiếp tục sửa trực tiếp?"

---

## Bước 2 — Capture thay đổi

Hỏi user mô tả thay đổi muốn thực hiện:

1. **What:** Thay đổi gì cụ thể?
2. **Why:** Lý do (user feedback / technical constraint / business decision / new info)?
3. **Impact:** Ảnh hưởng đến section nào khác?

**Không implement ngay** — collect tất cả thay đổi trước.

---

## Bước 3 — Impact Analysis

Với từng thay đổi, check:

| Thay đổi | Sections bị ảnh hưởng | PRD cần update? | Dev team cần biết? |
|---------|----------------------|-----------------|-------------------|
| [change] | [sections] | Yes/No | Yes/No |

Nếu impact lớn → warn:
> "Thay đổi này ảnh hưởng đến [X]. Nếu đã có Handoff, dev team cần được thông báo. Tiếp tục?"

---

## Bước 4 — "May I update?" Protocol

Show tóm tắt các thay đổi sẽ implement:

> **Tôi sẽ update [tên file] với:**
>
> **Thêm:**
> - [item 1]
>
> **Sửa:**
> - [section X]: '[old]' → '[new]'
>
> **Xóa:**
> - [item nếu có]
>
> Confirm để tôi proceed?

---

## Bước 5 — Update Spec

Sau khi user confirm:

1. **Cập nhật file spec** với Change Log (thêm vào đầu, sau frontmatter):
   ```
   **Change Log:**
   - [YYYY-MM-DD] v2: [thay đổi] — Reason: [lý do]
   - [YYYY-MM-DD] v1: Initial
   ```

2. **Update annotations trong spec:**
   ```
   > **Note [date]:** [thay đổi] — [lý do]
   ```

3. **Cập nhật backlog document** nếu có via `mcp__backlog__document_update`

---

## Bước 6 — Communication

Hỏi user:

> "Thay đổi đã lưu. Cần notify ai không?
> - Dev team (nếu đã handoff)
> - Stakeholders (nếu đã present)
> - Team khác"

Nếu yes → tạo Change Summary:

```
📝 **Spec Update — [Feature]**
Version: v[N] (updated [date])
Changes: [1-2 sentences]
Impact: [affected areas]
Action: [review updated doc / no action needed]
```
