---
description: Refactor code an toàn — cải thiện structure mà không thay đổi behavior
---

# Skill: Refactor

Refactor code theo từng bước nhỏ, có thể verify sau mỗi bước.

## Nguyên tắc vàng

> **Refactor = thay đổi structure, KHÔNG thay đổi behavior.**
> Tests phải pass trước, trong, và sau khi refactor.

## Quy trình

### 1. Đảm bảo có tests trước
Nếu chưa có tests → dùng skill `write-tests` trước.
Tests chính là safety net cho toàn bộ quá trình refactor.

### 2. Xác định mục tiêu refactor
- Giảm complexity? (hàm quá dài, quá nhiều params)
- Loại bỏ duplication? (DRY)
- Cải thiện naming?
- Tách concerns? (SRP)
- Cải thiện performance?

### 3. Refactor từng bước NHỎ

Sau **mỗi bước**, chạy tests để verify không có regression.

**Extract function** (hàm quá dài):
```typescript
// Before
function processOrder(order) {
  // 50 dòng validate
  // 30 dòng calculate
  // 40 dòng save
}

// After
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order);
  return saveOrder({ ...order, total });
}
```

**Extract constant** (magic numbers/strings):
```typescript
// Before
if (retryCount > 3) { ... }
// After
const MAX_RETRY_COUNT = 3;
if (retryCount > MAX_RETRY_COUNT) { ... }
```

**Simplify conditionals**:
```typescript
// Before
if (!isValid) { return false; }
return true;
// After
return isValid;
```

**Replace nested conditions với early return**:
```typescript
// Before
function process(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // actual logic
      }
    }
  }
}

// After
function process(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  // actual logic
}
```

## Red flags cần refactor

- Hàm > 30 dòng
- Hàm có > 4 params (dùng object thay)
- Nested if > 2 levels
- Duplicate code xuất hiện > 2 lần
- Tên biến: `data`, `temp`, `x`, `result` mà không rõ nghĩa
- Comment giải thích WHAT thay vì WHY

## Checklist

- [ ] Tests pass trước khi bắt đầu
- [ ] Refactor từng bước nhỏ
- [ ] Tests pass sau mỗi bước
- [ ] Không thêm feature trong khi refactor
- [ ] Commit riêng refactor và feature changes

## Project Convention

> Đọc `.project-info/conventions/components.md` hoặc `hooks.md` hoặc `services.md` tùy loại code đang refactor.
