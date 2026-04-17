---
description: Trích xuất patterns và learnings từ session hiện tại, lưu vào .project-info/patterns.md
allowed-tools: Read, Edit, Write, Bash(git *)
---

## Learn từ Session

Nhìn lại toàn bộ conversation và code changes trong session này, trích xuất những gì đáng ghi nhớ.

### Những gì cần extract:

**1. Patterns mới phát hiện**
- Codebase conventions chưa có trong CLAUDE.md
- Cách project handle một vấn đề cụ thể
- Gotchas hoặc anti-patterns cần tránh

**2. Debugging insights**
- Root cause của bugs đã fix
- Cách reproduce và verify
- Điều kiện gây ra lỗi

**3. Workflow improvements**
- Steps nào tốn thời gian không cần thiết?
- Có thể optimize pipeline ở đâu?

**4. Reusable solutions**
- Code patterns đã viết có thể dùng lại
- Commands hoặc queries hữu ích

---

### Thực hiện

1. Đọc `.project-info/patterns.md` hiện tại (nếu có) để tránh duplicate
2. Trích xuất learnings từ session
3. Format theo cấu trúc dưới đây
4. **Merge vào .project-info/patterns.md** — không overwrite, chỉ append/update

### Format entry mới:

```markdown
## [Tên pattern/learning]
**Ngày:** YYYY-MM-DD
**Context:** [Phát hiện khi làm gì]

[Mô tả pattern hoặc learning]

**Ví dụ:**
\`\`\`
[Code hoặc command example nếu có]
\`\`\`

**Áp dụng khi:** [Khi nào dùng pattern này]
```

---

### Sau khi cập nhật .project-info/patterns.md

Báo cáo ngắn gọn:
- Đã thêm X patterns mới
- Đã cập nhật Y patterns cũ
- Highlight 1-2 learning quan trọng nhất
