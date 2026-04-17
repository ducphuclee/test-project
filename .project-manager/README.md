# Project Manager

Thư mục này là **bộ nhớ dài hạn của project** — dùng để track tiến độ, lưu context, và đảm bảo continuity giữa các sessions.

## Agents phải làm gì

### Khi BẮT ĐẦU làm việc
1. Đọc `status.md` — biết project đang ở đâu
2. Đọc `sessions/latest.md` — biết session trước dừng ở đâu
3. Đọc `tasks/in-progress.md` — tasks nào đang dở

### Khi NHẬN task mới
1. Thêm vào `tasks/backlog.md` nếu chưa có
2. Move sang `tasks/in-progress.md` khi bắt đầu
3. Ghi log vào `logs/YYYY-MM-DD.md`

### Khi HOÀN THÀNH task
1. Move từ `in-progress.md` sang `tasks/done.md`
2. Cập nhật `status.md`
3. Ghi log

### Khi KẾT THÚC session
Chạy `/handoff` để tạo session summary vào `sessions/latest.md`

### Khi GẶP quyết định quan trọng
Ghi vào `knowledge/decisions.md` theo format ADR

### Khi GẶP blocker
Ghi vào `knowledge/blockers.md`

## File quan trọng nhất

| File | Mục đích | Cập nhật khi |
|------|----------|-------------|
| `status.md` | Trạng thái tổng quan | Sau mỗi milestone |
| `sessions/latest.md` | Handoff note | Cuối mỗi session |
| `tasks/in-progress.md` | Tasks đang làm | Liên tục |
| `knowledge/decisions.md` | Quyết định kỹ thuật | Khi có decision mới |

## Commit convention

Các thay đổi trong `.project-manager/` nên được commit với prefix:
```
chore(pm): update task status / log session / add decision
```
