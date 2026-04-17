---
description: Đọc lại context từ session trước và tiếp tục công việc đang dở
allowed-tools: Read, Bash(git *)
---

## Resume — Tiếp tục công việc

Đọc lại project state và tiếp tục từ nơi đã dừng.

### Bước 1 — Kiểm tra checkpoint

```bash
test -f .project-manager/sessions/checkpoint.md && echo "CHECKPOINT_EXISTS" || echo "NO_CHECKPOINT"
git branch --show-current
git status --short
```

### Bước 2A — Nếu có checkpoint

Đọc `.project-manager/sessions/checkpoint.md` → đây là source of truth chính xác nhất.

Báo cáo ngắn gọn:

```
Resume từ checkpoint [timestamp]

Branch: [branch]  Commit: [hash]
Task: [task] — [X%]

Git state: [staged/unstaged files nếu có, hoặc "clean"]

Next step:
> [next step từ checkpoint]

Tiếp tục không?
```

Chờ user xác nhận → làm ngay next step, không hỏi thêm.

### Bước 2B — Nếu không có checkpoint

Đọc song song:
- `.project-manager/sessions/latest.md`
- `.project-manager/status.md`
- `.project-manager/tasks/in-progress.md`
- `.project-manager/knowledge/blockers.md`

Báo cáo:

```
## Project Status

**Đang làm:** [task name] — [X%]
**Dừng ở:** [mô tả cụ thể]
**Blockers:** [nếu có]

## Uncommitted changes
[danh sách files nếu có]

## Tôi đề xuất tiếp tục:
> [Next action cụ thể]

Bạn có muốn tiếp tục không?
```

Chờ xác nhận → tiếp tục.

---

> Tip: Gõ `/checkpoint` trước khi kết thúc session để `/resume` lần sau chính xác hơn nhiều.
