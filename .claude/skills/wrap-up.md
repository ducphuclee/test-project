---
name: wrap-up
description: Closing ritual sau khi hoàn thành task — commit, learn patterns, PR. Use this skill sau khi tất cả tasks hoàn thành và tests pass.
origin: project
---

# Skill: Wrap-up

PM đọc skill này sau khi task/feature hoàn thành. Thực hiện từng bước, hỏi user trước mỗi action quan trọng.

## Bước 0 — Đóng task trong task manager

Đọc `.project-manager/tasks/in-progress.md`. Nếu có task đang active:

1. Copy task entry sang `.project-manager/tasks/done.md` theo format:
   ```markdown
   ## [TASK-ID] Tên task
   **Completed:** YYYY-MM-DD
   **By:** @[agent]
   **Summary:** [1-2 câu mô tả những gì đã làm]
   ```
2. Xóa task đó khỏi `in-progress.md` (giữ nguyên header + format comment)
3. Nếu task có **Backlog ref** → update backlog task status = Done via MCP backlog tool

Nếu không có task nào trong in-progress.md → bỏ qua bước này.

---

## Bước 1 — Hỏi commit

Hỏi user:
```
Task đã xong. Bạn muốn commit không?

[A] Có, commit
[B] Không, để sau
```

Nếu chọn **B** → skip toàn bộ, chuyển sang Bước 4 (learn).

## Bước 2 — Xác nhận files

Chạy:
```bash
git status --short
git diff --stat HEAD
```

Hiển thị danh sách files changed. Hỏi user:
```
Các files sau sẽ được commit:
  M  src/components/Button/index.tsx
  M  src/hooks/useAuth.ts
  A  src/services/auth.service.ts

Bạn muốn:
[A] Commit tất cả
[B] Bỏ qua một số file (cho biết file nào)
```

Nếu user chọn B → stage chỉ những files user xác nhận.

## Bước 3 — Commit

**Generate commit message** theo Conventional Commits dựa trên changes:

```
<type>(<scope>): <description>

feat(auth): add login with OAuth2
fix(button): correct disabled state styling
chore(deps): upgrade react to 18.3
```

Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`

Hiển thị message cho user, hỏi:
```
Commit message:
  "feat(auth): add OAuth2 login flow"

Ổn không?
[A] Commit
[B] Sửa message
```

Sau khi approve → thực hiện:
```bash
git add [files đã chọn]
git commit -m "[message]"
```

Sau đó chạy:
```bash
gitnexus analyze
```

Báo cáo: "Committed. GitNexus index updated."

## Bước 3.5 — Sync AGENTS.md (nếu CLAUDE.md thay đổi)

Kiểm tra CLAUDE.md có trong danh sách files vừa commit không:
```bash
git diff HEAD~1 --name-only | grep "CLAUDE.md"
```

Nếu **có** → hỏi user:
```
CLAUDE.md vừa được cập nhật. AGENTS.md cần được sync để
các tool khác (Codex, Gemini Code...) nhận được changes mới nhất.

Nội dung AGENTS.md hiện tại khác với CLAUDE.md ở [X điểm].

Bạn muốn sync AGENTS.md không?
[A] Có, sync ngay
[B] Không cần
```

Nếu chọn **A**:
1. Đọc nội dung hiện tại của `AGENTS.md`
2. Đọc nội dung hiện tại của `CLAUDE.md`
3. Hiển thị diff ngắn gọn: phần nào sẽ thay đổi trong AGENTS.md
4. Hỏi confirm lần cuối:
```
Sẽ cập nhật AGENTS.md với nội dung từ CLAUDE.md.
Confirm? [Y/N]
```
5. Nếu Y → ghi AGENTS.md = nội dung CLAUDE.md → commit thêm:
```bash
git add AGENTS.md
git commit -m "chore(agents): sync AGENTS.md with CLAUDE.md"
```

Nếu **không có** CLAUDE.md trong changes → bỏ qua bước này.

## Bước 4 — Hỏi PR

```
Bạn muốn tạo PR không?

[A] Có → load skill .claude/skills/pr (nếu có) hoặc chạy /pr
[B] Không
```

## Bước 5 — Hỏi learn

```
Bạn muốn capture patterns từ session này không?
(/learn sẽ trích xuất insights vào .project-info/patterns.md)

[A] Có → chạy /learn
[B] Không, xong rồi
```

## Kết thúc

Báo cáo tổng kết:
```
## Wrap-up complete

- Commit: [hash] "[message]"
- GitNexus: index updated
- AGENTS.md: synced / skipped / not needed
- PR: [link nếu có] / skipped
- Patterns: saved / skipped
```
