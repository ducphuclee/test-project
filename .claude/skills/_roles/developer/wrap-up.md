---
name: wrap-up
description: Closing ritual sau khi hoàn thành task — commit, learn patterns, PR. Use this skill sau khi tất cả tasks hoàn thành và tests pass.
origin: project
---

# Skill: Wrap-up

PM đọc skill này sau khi task/feature hoàn thành. Thực hiện từng bước, hỏi user trước mỗi action quan trọng.

## Bước 0 — Wrap-up summary (BẮT BUỘC trước khi hỏi commit)

Chạy các lệnh sau để lấy data thực tế, sau đó hiển thị:

```bash
git diff --stat HEAD          # files đã thay đổi
npm test 2>&1 | tail -20      # unit test results (hoặc lệnh tương đương)
```

Format hiển thị:
```
## Wrap-up: [Tên task/feature]

### Đã làm
- [x] [task 1]
- [x] [task 2]

### Files thay đổi
[output thực tế từ git diff --stat HEAD]

### Test results
Unit: X passed, Y failed
Integration: [playwright / curl output nếu đã chạy]
```

## Bước 1 — Hỏi commit

Sau khi hiển thị summary, hỏi user:
```
Bạn muốn commit không?

[A] Có, commit
[B] Không, để sau
```

**KHÔNG được chạy git commit trước khi user trả lời "Có" hoặc chọn [A].**

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
