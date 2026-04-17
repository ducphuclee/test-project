# Testing Requirements

## Hai loại test bắt buộc

### 1. Unit Test
- **Scope:** functions, utilities, pure logic, business rules
- **Tool:** Jest / Vitest / pytest / Go test (tùy stack)
- **Location:** cạnh source file — `user.ts` → `user.test.ts`
- **Mock:** tại boundaries — HTTP, DB, file system, time. KHÔNG mock internal modules
- **Coverage:** ≥ 80% cho code mới

### 2. Integration Test
- **Scope:** verify hệ thống hoạt động end-to-end từ góc nhìn user/consumer

**Frontend → Playwright:**
```bash
npx playwright test                    # chạy tất cả
npx playwright test --headed           # xem browser
npx playwright test auth.spec.ts       # chạy 1 file
```
- Test real browser interaction: click, fill form, navigate
- Không mock API — test với backend thật hoặc mock server (MSW)
- Mỗi critical user flow = 1 spec file

**Backend → curl / httpx:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}' \
  | jq '.id'                           # assert response shape
```
- Test real HTTP request/response cycle
- Chạy với server đang running (local hoặc test env)
- Verify: status code, response body, side effects (DB state)

---

## TDD Workflow (MANDATORY)

```
1. Viết test trước → RED  (test fail — chứng minh test có ý nghĩa)
2. Implement tối thiểu → GREEN  (test pass)
3. Refactor → IMPROVE  (chạy lại, vẫn pass)
```

**Áp dụng cho cả unit lẫn integration:**
- Unit: viết test function trước, implement function sau
- Integration (Playwright): viết spec trước, implement UI/API sau
- Integration (curl): viết expected response trước, implement endpoint sau

---

## Test Structure (AAA Pattern)

```
// Arrange — set up data, state, server
// Act     — call function / click button / send request
// Assert  — verify result, UI state, response
```

## Test Naming

Mô tả behavior, không mô tả implementation:
```
'returns empty array when no results found'
'shows error message when login fails'
'POST /users returns 201 with created user id'
```

---

## Quyết định loại test

| Tình huống | Test type |
|-----------|-----------|
| Pure function / utility | Unit |
| React component (isolated) | Unit |
| API endpoint (HTTP in/out) | Integration (curl) |
| User flow (login, checkout) | Integration (Playwright) |
| Database query logic | Unit (mock DB) |
| Full form submission | Integration (Playwright) |

---

## Rules

- Fix implementation, không fix test (trừ khi test sai)
- Mỗi bug fix phải có regression test
- Không claim "tests pass" mà không chạy lệnh và đọc output
- Chạy full test suite trước khi commit

## Test Commands

> /bootstrap sẽ điền sau khi detect stack:
> - Unit run: `[npm test / pytest / go test ./...]`
> - Unit watch: `[npm test --watch]`
> - Unit coverage: `[npm run coverage]`
> - Integration (Playwright): `[npx playwright test]`
> - Integration (curl): `[bash scripts/integration-test.sh]`

## Checklist Before Marking Work Complete

- [ ] Unit tests viết trước khi implement (TDD)
- [ ] Integration test cover critical flow
- [ ] Tất cả tests pass (đã chạy lệnh, đọc output)
- [ ] Coverage ≥ 80% cho code mới
- [ ] Regression test thêm cho bug fix
