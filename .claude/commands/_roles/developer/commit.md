---
description: Tạo git commit thông minh theo Conventional Commits
allowed-tools: Bash(git *)
---

## Commit Task

Tạo một git commit cho các thay đổi hiện tại.

### Bước thực hiện:

1. Chạy `git status` và `git diff` để xem các thay đổi
2. Chạy `git log --oneline -5` để xem style commit của project
3. Phân tích các thay đổi và xác định:
   - **type**: feat / fix / chore / docs / test / refactor / perf / ci
   - **scope**: phần nào của codebase bị ảnh hưởng (optional)
   - **description**: mô tả ngắn gọn bằng tiếng Anh, viết thường, không dấu chấm cuối
4. Stage các file phù hợp (KHÔNG dùng `git add .` nếu có file nhạy cảm)
5. Tạo commit với message theo format:
   ```
   <type>(<scope>): <description>

   [optional body: giải thích WHY nếu cần]
   ```

### Lưu ý:
- KHÔNG commit file `.env`, credentials, hoặc file nhạy cảm
- KHÔNG dùng `--no-verify`
- Nếu có argument `$ARGUMENTS`, dùng làm gợi ý cho commit message

**Arguments:** $ARGUMENTS

---

## Nếu role là Business

Kiểm tra `.project-info/user-role.md`. Nếu chứa `business`:

**Trước khi commit**, tạo design handoff file:

1. Chạy `git diff --staged --name-only` để lấy danh sách files thay đổi
2. Tạo file `.design-handoff/YYYY-MM-DD-HH-MM.md` với nội dung:

```markdown
# Design Handoff — YYYY-MM-DD HH:MM

## Commit
<type>(<scope>): <description>  ← commit message vừa tạo

## Files thay đổi
- src/pages/...
- src/components/...

## Components đã dùng
← Liệt kê các component import từ src/components/ trong files thay đổi

## Ghi chú cho Developer
← Những gì còn static, cần API thật, cần logic thật:
- [page X] form submit chưa có handler → cần endpoint POST /api/...
- [component Y] data đang hardcode → cần fetch từ ...
- [flow Z] còn thiếu error state

## Preview
← Nếu biết Vercel preview URL, ghi vào đây. Nếu không, để trống.
```

3. Stage file handoff: `git add .design-handoff/`
4. Commit tất cả cùng nhau (code + handoff file)

> Mục đích: Developer pull worktree về chỉ cần đọc file này để hiểu ngay cần implement gì.
