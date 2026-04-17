---
description: Lưu working state để resume chính xác — git state, decisions, next steps. Gọi khi sắp kết thúc session, chuyển context, hoặc trước khi break dài.
argument-hint: [ghi chú ngắn về trạng thái hiện tại - optional]
allowed-tools: Read, Write, Bash(git *)
---

# /checkpoint — Lưu Working State

Lưu lại đúng nơi đang làm để session sau `/resume` vào chính xác, không mất thời gian tìm lại.

## Bước 1 — Thu thập git state

```bash
git branch --show-current
git rev-parse HEAD
git status --short
git stash list
```

## Bước 2 — Đọc context hiện tại

Đọc song song:
- `.project-manager/tasks/in-progress.md` — task đang làm
- `.project-manager/sessions/latest.md` — session notes
- `.project-manager/knowledge/blockers.md` — blockers nếu có

**Technical Assumptions đang pending validate:**
- Đọc `.project-manager/tasks/in-progress.md` — có assumption nào được flag chưa?

## Bước 3 — Xác định next step

Nếu `$ARGUMENTS` có nội dung → dùng làm ghi chú trạng thái.

Nếu không → dựa vào tasks/in-progress.md để xác định next action cụ thể nhất có thể.

## Bước 4 — Ghi checkpoint

Ghi vào `.project-manager/sessions/checkpoint.md`:

```markdown
# Checkpoint

**Saved:** [timestamp ISO 8601]
**Branch:** [branch name]
**Commit:** [short hash] — [commit message đầu tiên]

## Git State

**Staged:**
[danh sách files staged — hoặc "none"]

**Unstaged:**
[danh sách files unstaged — hoặc "none"]

**Stashes:**
[danh sách stashes — hoặc "none"]

## Đang làm

**Task:** [tên task từ in-progress.md]
**Progress:** [X%]
**Currently:** [đang làm gì cụ thể]
**Files đang sửa:** [list files]

## Decisions đã làm session này

[Ghi các quyết định kỹ thuật quan trọng đã đưa ra — nếu không rõ thì để trống]

## Technical Assumptions Cần Validate

| Assumption | Impact | Validated? |
|------------|--------|-----------|
| [VD: API endpoint /users/profile trả về field `avatar_url`] | High | No |

> Nếu có assumption High-impact chưa validated → ghi vào Next step.

## Next step (cụ thể nhất có thể)

> [Câu lệnh hoặc action tiếp theo — đủ cụ thể để session sau làm ngay không cần đoán]

## Notes

[$ARGUMENTS nếu có — hoặc ghi chú từ context]
```

## Bước 5 — Xác nhận

Nếu có Technical Assumptions chưa validated → nhắc: 
"Còn [N] assumption kỹ thuật chưa validate. Nên clarify với business/API team trước khi tiếp tục."

Báo cáo cho user:

```
Checkpoint saved.

Branch: [branch]  Commit: [hash]
Task: [task name] — [X%]

Next step: [next step]

Resume bất cứ lúc nào bằng /resume.
```
