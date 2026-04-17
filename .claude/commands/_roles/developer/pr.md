---
description: Tạo Pull Request với description đầy đủ
allowed-tools: Bash(git *), Bash(gh *)
---

## Pull Request Task

Tạo một Pull Request cho branch hiện tại.

### Bước thực hiện:

1. Chạy song song:
   - `git status` - xem trạng thái
   - `git log --oneline main..HEAD` - xem commits sẽ vào PR
   - `git diff main...HEAD --stat` - xem files thay đổi
   - `gh pr list` - xem PR hiện có

2. Phân tích TẤT CẢ commits (không chỉ commit cuối) để hiểu scope của PR

3. Nếu chưa push: `git push -u origin <branch>`

4. Tạo PR với format:
   ```
   Title: <type>(<scope>): <mô tả ngắn dưới 70 ký tự>

   Body:
   ## What changed
   - [bullet points mô tả WHAT]

   ## Why
   [Giải thích WHY, context, motivation]

   ## How to test
   - [ ] Step 1
   - [ ] Step 2

   ## Screenshots (nếu có UI change)

   ## Checklist
   - [ ] Tests pass
   - [ ] No console errors
   - [ ] Reviewed own code
   ```

**Base branch:** $ARGUMENTS (mặc định: main)
