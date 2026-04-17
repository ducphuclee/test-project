---
description: Kết thúc một phase làm việc — squash toàn bộ thành doc hoàn chỉnh, reset task manager sạch sẽ cho phase mới
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git *)
---

# Phase Close

**Arguments:** $ARGUMENTS (optional: tên phase, ví dụ "auth-system" hoặc "trading-dashboard")

---

## Mục tiêu

Đóng sổ một phase làm việc một cách rõ ràng:
1. Thu thập toàn bộ công việc đã làm thành một doc hoàn chỉnh
2. Reset task manager về trạng thái sạch
3. Sẵn sàng bắt đầu phase mới

---

## Bước 1 — Thu thập memory của phase

Đọc tất cả:

```bash
cat .project-manager/tasks/done.md
cat .project-manager/tasks/in-progress.md
cat .project-manager/knowledge/decisions.md
cat .project-manager/knowledge/context.md
cat .project-manager/sessions/latest.md
```

Đọc thêm nếu có:
```bash
cat .project-manager/knowledge/blockers.md 2>/dev/null
git log --oneline -20  # commits của phase này
```

---

## Bước 2 — Xác định tên phase

Nếu `$ARGUMENTS` có tên → dùng làm slug (lowercase, dấu gạch ngang).

Nếu không → hỏi user:
```
Phase này tên là gì?
(Ví dụ: "auth-system", "trading-dashboard", "user-onboarding", "design-v1")
```

---

## Bước 3 — Tạo Phase Doc

Tạo `backlog/docs/phases/[slug]-[YYYY-MM-DD].md` với nội dung tổng hợp từ dữ liệu đã đọc:

```markdown
# Phase: [Tên Phase]

**Ngày đóng:** [YYYY-MM-DD]
**Branch:** [git branch hiện tại]
**Commits:** [số commits trong phase]

## Tổng kết

[1-3 câu mô tả phase này đã làm được gì, kết quả chính]

## Công việc hoàn thành

[Copy tasks từ done.md — giữ nguyên format]

## Quyết định quan trọng

[Copy từ knowledge/decisions.md]

## Context đã học

[Copy những điểm vẫn còn relevant từ knowledge/context.md]

## Blockers đã gặp và giải quyết

[Copy từ blockers.md nếu có — chỉ những cái đã resolved]

## Files chính đã tạo/sửa

[git log --name-only của phase, tổng hợp các file quan trọng nhất]
```

---

## Bước 4 — Xác nhận trước khi clean

Sau khi tạo xong doc, báo user:

```
📄 Phase doc đã tạo: backlog/docs/phases/[slug]-[date].md

Tôi sẽ reset:
- tasks/in-progress.md → sạch
- tasks/done.md → sạch
- knowledge/context.md → sạch
- sessions/checkpoint.md → sạch

Xác nhận để tôi dọn dẹp?
```

Chờ user xác nhận (Y/yes/có) trước khi tiếp tục.

---

## Bước 5 — Reset Task Manager

Sau khi user xác nhận, dùng Write tool để reset từng file:

**tasks/in-progress.md:**
```
# Tasks — In Progress

_Không có task đang làm. Phase mới bắt đầu._
```

**tasks/done.md:**
```
# Tasks — Done

_Chưa có task nào hoàn thành trong phase này._
```

**knowledge/context.md:**
```
# Context

_Phase mới. Context sẽ được cập nhật khi có thông tin._
```

**sessions/checkpoint.md:**
```
# Checkpoint

_Phase mới. Chưa có checkpoint._
```

---

## Bước 5.5 — KG Consolidation

Gộp knowledge của phase vào KG trước khi reset.

### 1. Tạo phase document entity

```bash
node scripts/kg.js add-entity \
  --type document \
  --id "phase-[slug]" \
  --name "Phase: [Tên Phase]" \
  --status done

node scripts/kg.js add-obs "document:phase-[slug]" \
  --type link \
  --text "backlog/docs/phases/[slug]-[date].md"
```

### 2. Promote tasks → decisions/patterns

Với mỗi task đã hoàn thành trong phase, xem observations của nó có chứa:
- **Quyết định quan trọng** → tạo `decision:` entity mới (nếu chưa có), link đến phase doc
- **Pattern code** → tạo `pattern:` entity mới (nếu chưa có), link đến phase doc

```bash
# Xem tasks của phase
node scripts/kg.js list --type task --status done

# Với mỗi task có giá trị promote:
node scripts/kg.js add-entity --type decision --id "[slug]" --name "[Quyết định]"
node scripts/kg.js add-obs "decision:[slug]" --type fact --text "[Lý do + trade-off]"
node scripts/kg.js add-rel --from "decision:[slug]" --rel "related-to" --to "document:phase-[slug]"
```

### 3. Promote hoặc prune ephemeral entities

```bash
# Xem tất cả ephemeral còn lại
node scripts/kg.js list --horizon ephemeral

# Task/issue có learnings đáng nhớ → promote lên phase trước khi prune
node scripts/kg.js promote "task:[id]" --to phase

# Prune toàn bộ ephemeral còn lại (tasks đã xong, issues đã resolved)
node scripts/kg.js prune --horizon ephemeral
```

### 4. Link modules touched

Nếu phase có chạm vào module nào → ghi lại relation:
```bash
node scripts/kg.js add-rel \
  --from "document:phase-[slug]" \
  --rel "touches" \
  --to "module:[name]"
```

---

## Bước 6 — Cập nhật Status

Cập nhật `.project-manager/status.md`:
- `Current Focus` → "Phase mới — chưa xác định"
- Thêm vào `Quick Stats`: link đến phase doc vừa tạo
- Reset `Progress` section

---

## Báo cáo cuối

```
✅ Phase "[tên]" đã được đóng lại.

📄 backlog/docs/phases/[slug]-[date].md — lưu lại toàn bộ công việc
🧠 KG updated — decisions/patterns promoted, tasks archived
🧹 Task manager đã được reset sạch sẽ

Bắt đầu phase mới — bạn muốn làm gì tiếp theo?
```
