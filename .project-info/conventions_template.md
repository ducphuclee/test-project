# Coding Conventions

> File này được rút ra từ code THỰC TẾ của project bởi `/bootstrap`.
> Đây là nguồn sự thật — quan trọng hơn CLAUDE.md khi có xung đột.
> Agents PHẢI tuân theo để code nhất quán với codebase hiện tại.

---

## Naming Conventions

<!-- Rút ra từ code thực tế -->

### Files & Folders
<!-- kebab-case? camelCase? PascalCase? -->

### Variables & Functions
<!-- Ví dụ từ code: getUserById, format_currency, ... -->

### Classes & Types
<!-- PascalCase? Interface prefix I? -->

### Constants
<!-- UPPER_SNAKE_CASE? camelCase? -->

---

## Code Patterns

### Function Style
<!-- Arrow functions hay function declarations? Async/await hay promises? -->

### Error Handling Pattern
<!-- try/catch ở đâu? Custom errors? -->

### Import Order
<!-- Thứ tự: external → internal → types? -->

### Export Style
<!-- Named exports hay default exports? -->

---

## File Structure Pattern

<!-- Mỗi module được tổ chức như thế nào? -->
```
module/
  ├── index.ts        # public API
  ├── module.service.ts
  ├── module.types.ts
  └── module.test.ts
```

---

## Testing Conventions

### File naming
<!-- *.test.ts? *.spec.ts? __tests__/? -->

### Test structure
<!-- describe/it? test()? -->

### Mock pattern
<!-- jest.mock? vi.mock? -->

---

## Examples từ codebase

<!-- /bootstrap tự điền các ví dụ code thực tế ở đây -->
<!-- Đây là phần quan trọng nhất — agents học bằng cách đọc ví dụ -->
