---
description: Test-Driven Development — viết test trước, implement sau. Dùng khi implement feature mới hoặc fix bug.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# TDD Workflow

Thực hiện Red → Green → Refactor. **KHÔNG viết code trước khi có failing test.**

## Bước 1 — Hiểu yêu cầu

Trước khi viết bất kỳ thứ gì:
- Xác định behavior cần test (không phải implementation)
- Liệt kê các cases: happy path, edge cases, error paths
- Đọc `.claude/rules/testing.md` để nhớ conventions

## Bước 2 — RED: Viết failing test

Viết test mô tả behavior mong muốn. Test phải **fail** trước.

```typescript
// Đặt tên theo behavior, không phải implementation
it('returns empty array when user has no orders', async () => {
  // Arrange
  const user = createTestUser({ id: 'u1' });

  // Act
  const orders = await getOrdersByUser('u1');

  // Assert
  expect(orders).toEqual([]);
});
```

Chạy test, **verify nó FAIL**:
```bash
# Điền lệnh test thực tế từ .claude/rules/testing.md
npm test -- --testPathPattern="[tên file test]"
```

Nếu test pass ngay mà chưa có implementation → test đang test sai thứ.

## Bước 3 — GREEN: Implement tối thiểu

Viết **ít code nhất có thể** để test pass. Không over-engineer ở bước này.

Chạy lại test → **verify PASS**.

## Bước 4 — REFACTOR: Cải thiện

Với tests đang green, refactor thoải mái:
- Xóa duplication
- Cải thiện naming
- Extract helper functions
- Tối ưu performance nếu cần

Chạy lại test sau mỗi thay đổi → phải vẫn PASS.

## Bước 5 — Lặp lại

Thêm test case tiếp theo (edge case, error path...) và lặp lại từ Bước 2.

## Bước 6 — Verify coverage

```bash
# Điền lệnh coverage từ .claude/rules/testing.md
npm run coverage
```

Target: ≥ 80% cho code mới. 100% cho logic quan trọng (auth, payment, core business logic).

## Checklist hoàn thành

- [ ] Tất cả cases đã có test (happy path + edge cases + error paths)
- [ ] Mọi test đều đã từng FAIL trước khi PASS
- [ ] Coverage ≥ 80%
- [ ] Không có test nào test implementation details
- [ ] Mocks chỉ dùng tại boundaries (HTTP, DB, filesystem)

## Khi fix bug

Bug fix **bắt buộc** có regression test:
1. Viết test reproduce bug → RED
2. Fix bug → GREEN
3. Test này sẽ ngăn bug tái phát mãi mãi

## Delegate

Nếu cần deep TDD guidance → spawn `@coder` với instruction đọc `.claude/rules/testing.md` trước khi implement.
