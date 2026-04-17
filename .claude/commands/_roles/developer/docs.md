---
description: Tạo hoặc cập nhật documentation cho code
allowed-tools: Bash(git *)
---

## Documentation Task

Tạo/cập nhật documentation cho: **$ARGUMENTS**

### Xác định loại docs cần tạo:

**Nếu không có arguments** - scan project và tạo docs tổng quan:
1. Đọc cấu trúc project
2. Đọc các file chính
3. Tạo/cập nhật README.md

**Nếu có file/function cụ thể** - tạo docs cho phần đó:

#### API Documentation
```markdown
## `functionName(params)`

Mô tả ngắn gọn về chức năng.

**Parameters:**
- `param1` (type): Mô tả
- `param2` (type, optional): Mô tả, default: value

**Returns:** type - Mô tả

**Throws:** ErrorType - Khi nào throw

**Example:**
```typescript
const result = functionName(value1, value2);
```
```

#### README Template
```markdown
# Project Name

> Mô tả một câu về dự án

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features
- Feature 1
- Feature 2

## API Reference
...

## Contributing
...
```

### Nguyên tắc:
- Docs phải accurate và up-to-date với code
- Giải thích WHY, không chỉ WHAT
- Include examples thực tế
- Viết cho người mới tham gia project

**Target:** $ARGUMENTS
