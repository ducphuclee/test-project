---
description: Trích xuất design patterns từ session — lưu vào .project-info/design-patterns.md
allowed-tools: Read, Write, Edit, Glob, Bash(git *)
---

# Learn — Trích xuất Design Patterns

Sau mỗi session, extract những gì đã học được về design preferences của project/team.

## Bước 1 — Xem lại session

```bash
git log --oneline -10
git diff HEAD~5..HEAD --name-only 2>/dev/null
```

Đọc các file UI đã tạo/sửa trong session.

## Bước 2 — Nhận diện patterns

Tìm các pattern lặp lại hoặc quyết định có chủ đích:

**Layout patterns:**
- Cách tổ chức grid/columns hay dùng
- Breakpoint decisions
- Spacing conventions thực tế (không phải lý thuyết)

**Component usage patterns:**
- Variant nào của Button hay được chọn và trong context nào
- Cách combine Card + các elements bên trong
- Form layout pattern hay dùng

**Visual preferences:**
- Có xu hướng dùng border hay shadow?
- Animation level (subtle hay pronounced?)
- Density preference (compact hay spacious?)

**Anti-patterns phát hiện:**
- Những gì đã thử nhưng không ổn về visual
- Combinations component không hợp

## Bước 3 — Cập nhật design patterns

Đọc `.project-info/design-patterns.md` nếu có, sau đó merge patterns mới:

```markdown
# Design Patterns

> Extracted from design sessions. Agents đọc file này để hiểu visual preferences.

## Layout
- [pattern] — [evidence từ code]

## Component Usage
- [pattern] — [example]

## Visual Preferences
- [preference] — [observed in session X]

## Anti-patterns
- [what NOT to do] — [lý do]
```

Chỉ thêm patterns có evidence rõ ràng (xuất hiện 2+ lần hoặc được user confirm).

## Bước 4 — Báo cáo

```
Learned X patterns từ session này:
  - [pattern 1]
  - [pattern 2]

Đã thêm vào .project-info/design-patterns.md
```
