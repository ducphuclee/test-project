---
description: Chạy tests và tự động fix nếu có lỗi
allowed-tools: Bash(npm *), Bash(npx *), Bash(node *), Bash(git *)
---

## Test Task

Chạy test suite và xử lý kết quả.

### Bước thực hiện:

1. Xác định test runner từ `package.json`:
   - Jest: `npm test`
   - Vitest: `npm run test`
   - Pytest: `python -m pytest`

2. Chạy tests: `npm test $ARGUMENTS`

3. Nếu tests PASS: Báo cáo kết quả và coverage (nếu có)

4. Nếu tests FAIL:
   - Đọc error message cẩn thận
   - Xác định root cause (không chỉ symptom)
   - Fix lỗi
   - Chạy lại tests để verify
   - Nếu vẫn fail sau 2 lần thử, báo cáo và hỏi user

### Lưu ý:
- Chạy tests trong background nếu cần nhiều thời gian
- KHÔNG sửa test để pass - sửa implementation
- Nếu test sai logic, hỏi user trước khi sửa test

**Filter/pattern:** $ARGUMENTS
