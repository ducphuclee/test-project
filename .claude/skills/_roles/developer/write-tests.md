---
description: Viết unit tests và integration tests (Playwright / curl) cho code vừa implement
---

# Skill: Write Tests

## Bước 0 — Xác định loại test cần viết

| Code vừa implement | Test type |
|-------------------|-----------|
| Pure function / utility / service | Unit |
| React component (isolated) | Unit |
| API endpoint | Integration (curl) |
| UI flow / form / navigation | Integration (Playwright) |

Một feature thường cần **cả hai**: unit cho logic bên trong, integration cho đầu ra.

---

## Unit Tests

### Nguyên tắc

- Test **behavior**, không test implementation details
- Mỗi test case chỉ assert **một điều**
- Mock tại boundaries: HTTP, DB, file system, time
- Chạy độc lập — không phụ thuộc thứ tự, không phụ thuộc network

### Structure chuẩn

```typescript
describe('getUserById', () => {
  it('returns user when valid id provided', async () => {
    // Arrange
    const userId = 'user-123';
    mockDb.findById.mockResolvedValue({ id: userId, name: 'John' });

    // Act
    const result = await getUserById(userId);

    // Assert
    expect(result).toEqual({ id: userId, name: 'John' });
  });

  it('throws NotFoundError when user does not exist', async () => {
    mockDb.findById.mockResolvedValue(null);
    await expect(getUserById('ghost')).rejects.toThrow(NotFoundError);
  });
});
```

### Checklist unit test

- [ ] Happy path
- [ ] Edge cases: null, undefined, empty, boundary values
- [ ] Error cases: invalid input, external failures
- [ ] Async operations handled (await / rejects)
- [ ] Không hardcode values — dùng variables hoặc factories

### Chạy unit test

```bash
npm test -- --testPathPattern="<filename>"
# hoặc theo stack: pytest tests/unit/, go test ./...
```

---

## Integration Tests — Frontend (Playwright)

### Khi nào dùng

- User flow: login, signup, checkout, form submission
- Navigation giữa các pages
- UI state sau action (error message, success toast, redirect)

### Structure chuẩn

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test('shows error when credentials are wrong', async ({ page }) => {
    // Arrange
    await page.goto('/login');

    // Act
    await page.fill('[name=email]', 'wrong@email.com');
    await page.fill('[name=password]', 'wrongpass');
    await page.click('[type=submit]');

    // Assert
    await expect(page.locator('[data-testid=error-msg]'))
      .toContainText('Invalid credentials');
  });

  test('redirects to dashboard after successful login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', 'user@example.com');
    await page.fill('[name=password]', 'correctpass');
    await page.click('[type=submit]');

    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Checklist Playwright

- [ ] Dùng `data-testid` attributes — không dùng CSS class làm selector
- [ ] `await expect(...)` với assertions có timeout tự động
- [ ] Mỗi test độc lập — setup state trong `test.beforeEach` nếu cần
- [ ] Không hardcode URLs — dùng env hoặc playwright.config base URL

### Chạy Playwright

```bash
npx playwright test                     # headless
npx playwright test --headed            # xem browser
npx playwright test auth.spec.ts        # 1 file
npx playwright test --ui                # interactive UI mode
```

---

## Integration Tests — Backend (curl)

### Khi nào dùng

- API endpoint mới
- Verify HTTP status code, response body shape, headers
- Test side effects (record được tạo/xóa trong DB)

### Structure chuẩn

```bash
#!/bin/bash
# scripts/test-api.sh
BASE_URL="http://localhost:3000"

echo "=== POST /users ==="
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}')

BODY=$(echo "$RESPONSE" | head -n -1)
STATUS=$(echo "$RESPONSE" | tail -n 1)

# Assert status
[ "$STATUS" = "201" ] || { echo "FAIL: expected 201, got $STATUS"; exit 1; }

# Assert body has id
echo "$BODY" | jq -e '.id' > /dev/null || { echo "FAIL: response missing id"; exit 1; }

echo "PASS: POST /users → 201 with id"

echo "=== GET /users/:id ==="
USER_ID=$(echo "$BODY" | jq -r '.id')
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/users/$USER_ID")
STATUS=$(echo "$RESPONSE" | tail -n 1)

[ "$STATUS" = "200" ] || { echo "FAIL: expected 200, got $STATUS"; exit 1; }
echo "PASS: GET /users/$USER_ID → 200"
```

### Pattern với auth header

```bash
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123"}' \
  | jq -r '.token')

curl -s "$BASE_URL/api/protected" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

### Checklist curl tests

- [ ] Assert HTTP status code
- [ ] Assert response body shape (dùng `jq -e`)
- [ ] Test cả happy path lẫn error cases (401, 404, 422)
- [ ] Server phải đang chạy trước khi test
- [ ] Cleanup state sau test nếu cần (xóa records vừa tạo)

### Chạy curl tests

```bash
# Start server trước
npm run dev &
sleep 2

# Chạy tests
bash scripts/test-api.sh

# Hoặc dùng httpx (Python) / supertest (Node) nếu prefer
```

---

## Project Convention

> Đọc `.project-info/conventions/testing.md` nếu tồn tại — chứa test runner cụ thể, mock patterns, naming conventions của project.
