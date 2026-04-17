---
description: Thêm standard mới vào project — từ file hoặc viết tay, confirm trước khi apply
allowed-tools: Read, Edit, Glob
---

## New Standard

Thêm coding standard mới vào project conventions.

---

### Bước 1 — Hỏi nguồn

```
Bạn muốn thêm standard theo cách nào?

[A] Đọc từ file — cho biết đường dẫn file
[B] Viết tay — mô tả standard trực tiếp
```

---

### Nếu chọn A — Đọc từ file

1. Hỏi user: "File ở đường dẫn nào?"
2. Đọc toàn bộ file
3. Parse và extract các rules — nhóm theo domain:
   - **components**: folder structure, naming, single responsibility
   - **hooks**: hook types, patterns, naming
   - **stores**: state management, action naming
   - **selectors**: selector naming, memoization
   - **services**: HTTP, auth, error handling
   - **testing**: test runner, mock patterns, naming
   - **api**: response format, status codes

4. Hiển thị summary để user confirm:

```
Tìm thấy [X] rules từ file "[filename]":

### components
- [STANDARD] ComponentName phải là folder/index.tsx
- [STANDARD] Không tạo ComponentName.tsx flat file

### hooks
- [STANDARD] Hook orchestration: useXPageModel pattern
- [STANDARD] Không render JSX trong hook

### ...

Bạn muốn:
[A] Apply tất cả
[B] Chọn từng rule (tôi sẽ hỏi từng cái)
[C] Bỏ qua
```

---

### Nếu chọn B — Viết tay

1. Hỏi user: "Mô tả standard bạn muốn thêm:"
2. Hỏi thêm: "Standard này thuộc domain nào? (components / hooks / stores / services / testing / api / other)"
3. Tóm tắt lại:

```
Standard sẽ được thêm vào:
  Domain: [domain]
  Rule: "[nội dung user mô tả]"
  File: .project-info/conventions/[domain].md

Confirm? [Y/N]
```

---

### Bước 2 — Apply

Sau khi user confirm:

1. Đọc `.project-info/conventions/[domain].md`
2. Thêm rules mới vào đúng section, label `[STANDARD - added YYYY-MM-DD]`
3. Nếu file chưa tồn tại → tạo mới từ template tối thiểu
4. Cập nhật `STANDARD.md` ở root — append rules mới vào section tương ứng (nếu chưa có)

Báo cáo:
```
Đã thêm [X] rules:
- .project-info/conventions/components.md — 2 rules
- .project-info/conventions/hooks.md — 1 rule
- STANDARD.md — synced
```
