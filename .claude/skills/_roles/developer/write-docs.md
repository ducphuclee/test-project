---
description: Viết documentation rõ ràng cho function, module, hoặc API
---

# Skill: Write Docs

Viết docs đủ để người mới hiểu và dùng được mà không cần hỏi.

## Nguyên tắc

- Giải thích **WHY** (tại sao tồn tại) và **WHEN** (khi nào dùng) — không chỉ WHAT
- Luôn có **ví dụ thực tế**, không chỉ abstract description
- Docs phải sync với code — docs sai còn tệ hơn không có docs
- Viết cho người **chưa biết gì về module này**

## Function / Method JSDoc

```typescript
/**
 * Tính tổng tiền của đơn hàng sau khi áp dụng discount và tax.
 *
 * Dùng khi cần hiển thị giá cuối cho user hoặc tạo invoice.
 * KHÔNG dùng cho internal calculations — dùng `calculateRawTotal` thay.
 *
 * @param items - Danh sách sản phẩm trong đơn hàng
 * @param discountCode - Mã giảm giá (optional). Trả về full price nếu không có.
 * @param taxRate - Tax rate (0-1). Default: 0.1 (10%)
 * @returns Tổng tiền đã bao gồm discount và tax, rounded đến 2 decimal
 * @throws {InvalidDiscountError} Nếu discountCode không hợp lệ
 * @throws {ValidationError} Nếu items trống
 *
 * @example
 * const total = calculateOrderTotal(
 *   [{ price: 100, quantity: 2 }],
 *   'SAVE20',
 *   0.08
 * );
 * // Returns: 172.80 (200 - 20% discount + 8% tax)
 */
export function calculateOrderTotal(
  items: OrderItem[],
  discountCode?: string,
  taxRate = 0.1
): number { ... }
```

## Module / File header

```typescript
/**
 * Auth Service — xử lý authentication và session management.
 *
 * Responsibilities:
 * - JWT token generation và validation
 * - Session lifecycle (create, refresh, revoke)
 * - Rate limiting cho login attempts
 *
 * NOT responsible for:
 * - User management (xem UserService)
 * - Permission checks (xem AuthorizationService)
 *
 * @module auth/auth.service
 */
```

## README cho module/feature

```markdown
# [Module Name]

> Một câu mô tả module làm gì.

## Khi nào dùng

[Dùng module này khi... Không dùng khi...]

## Quick start

\`\`\`typescript
import { AuthService } from './auth.service';

const auth = new AuthService(config);
const token = await auth.login(email, password);
\`\`\`

## API

### `methodName(params)`
[Mô tả ngắn]

**Parameters:**
- `param1` (string): ...
- `param2` (number, optional): ... Default: X

**Returns:** Promise\<Token\> — ...

**Throws:** AuthError khi credentials sai

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tokenExpiry` | number | 3600 | Token TTL in seconds |

## Examples

[Ví dụ use cases thực tế]
```

## Checklist

- [ ] Mô tả WHY và WHEN, không chỉ WHAT
- [ ] Có ít nhất 1 example thực tế
- [ ] Params và return type được document
- [ ] Errors/exceptions được liệt kê
- [ ] Edge cases và limitations được mention
- [ ] Không document những thứ tự hiểu từ tên (over-documentation)
