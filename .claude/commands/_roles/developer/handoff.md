---
description: Tạo session summary trước khi kết thúc — để session sau có thể làm tiếp
allowed-tools: Read, Write, Edit, Bash(git *)
---

## Handoff — Kết thúc Session

Tạo một handoff note đầy đủ để session sau có thể tiếp tục ngay mà không mất context.

### Bước thực hiện

1. **Thu thập thông tin** (song song):
   - Đọc `tasks/in-progress.md` — tasks nào đang dở
   - Chạy `git status` + `git diff --stat` — files nào chưa commit
   - Đọc `knowledge/blockers.md` — blockers hiện tại

2. **Tổng hợp session** — nhìn lại conversation hiện tại:
   - Đã hoàn thành được gì?
   - Đang làm dở gì, đang ở bước nào?
   - **Những gì đã thử mà KHÔNG hoạt động** (quan trọng — tránh retry)
   - Phát hiện insight hay vấn đề gì quan trọng?

3. **Cập nhật các files**:
   - Move tasks đã xong → `tasks/done.md`
   - Cập nhật progress trong `tasks/in-progress.md`
   - Append log vào `logs/YYYY-MM-DD.md`
   - Cập nhật `status.md`

4. **Ghi `sessions/latest.md`** theo format:

```markdown
# Session Handoff

**Date:** YYYY-MM-DD HH:MM
**Session duration:** ~X hours
**Agent(s):** @agent1, @agent2

## Tóm tắt session
- [x] Hoàn thành: ...
- [x] Hoàn thành: ...

## Đang dở dang
### [TASK-ID] Tên task
- Progress: X%
- Đang ở bước: [mô tả cụ thể]
- Files đang sửa: `path/to/file.ts` (dòng X-Y)
- Approach: [đang dùng approach gì]

## Files chưa commit
- `file.ts` — [thay đổi gì]

## Next action
**Việc đầu tiên khi mở session mới:**
> [Mô tả cụ thể, actionable — ví dụ: "Tiếp tục implement hàm validateToken ở file auth.ts:45, đang xử lý edge case khi token expired"]

## Những gì đã thử mà KHÔNG hoạt động
> Section này cực kỳ quan trọng — session sau KHÔNG retry những thứ đã fail.

- **[approach đã thử]** — failed vì: [lý do cụ thể / error message]
- **[approach đã thử]** — failed vì: [lý do cụ thể]

## Context quan trọng
[Thông tin gì mà agent mới cần biết để không bị lost]

## Blockers
[Nếu có]
```

5. **Báo cáo** tóm tắt ngắn cho user biết đã lưu gì.
