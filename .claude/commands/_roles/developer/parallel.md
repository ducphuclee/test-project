---
description: Chạy nhiều agents song song cho các tasks độc lập, tổng hợp kết quả
---

## Parallel Execution

**Tasks:** $ARGUMENTS

Phân tích các tasks được đưa ra và xác định tasks nào **độc lập** (không phụ thuộc nhau).

### Nguyên tắc parallel

```
Chạy song song khi:           Chạy tuần tự khi:
────────────────────          ─────────────────────
Tasks không share state       Task B cần output của A
Tasks đọc file khác nhau      Tasks sửa cùng một file
Research & exploration        Plan → Implement → Test
```

### Thực hiện

1. **Phân loại tasks** thành nhóm có thể parallel:
   ```
   Nhóm 1 (song song): task A, task B, task C
   Nhóm 2 (sau nhóm 1): task D (cần kết quả A+B)
   Nhóm 3 (sau nhóm 2): task E
   ```

2. **Spawn đồng thời** tất cả agents trong cùng một nhóm bằng cách gọi nhiều Agent tool calls trong **cùng một response**.

3. **Chờ tất cả** hoàn thành trước khi chuyển nhóm tiếp.

4. **Tổng hợp kết quả**: merge outputs, resolve conflicts nếu có.

### Ví dụ pattern

```
// Chạy đồng thời - gọi trong cùng một response:
Agent(@explorer "tìm auth logic")
Agent(@explorer "tìm user model")
Agent(@explorer "tìm test coverage")

// Sau khi tất cả xong, mới chạy:
Agent(@coder "implement với context từ 3 explorations trên")
```

### Tasks: $ARGUMENTS
