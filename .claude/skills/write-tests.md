---
description: Viết unit và integration tests chuẩn cho code vừa implement
---

# Skill: Write Tests

Viết tests cho code được chỉ định. Áp dụng khi agent Coder vừa implement xong hoặc khi cần tăng coverage.

## Nguyên tắc

- Test **behavior**, không test implementation details
- Mỗi test case chỉ assert **một điều**
- Tên test phải mô tả rõ: `should [behavior] when [condition]`
- Không mock những thứ không cần thiết
- Arrange → Act → Assert (AAA pattern)

## Structure chuẩn

```typescript
describe('ComponentName / functionName', () => {
  // Happy path
  it('should return user when valid id provided', async () => {
    // Arrange
    const userId = 'user-123';
    const expected = { id: userId, name: 'John' };
    mockDb.findById.mockResolvedValue(expected);

    // Act
    const result = await getUserById(userId);

    // Assert
    expect(result).toEqual(expected);
  });

  // Edge cases
  it('should throw NotFoundError when user does not exist', async () => {
    mockDb.findById.mockResolvedValue(null);
    await expect(getUserById('ghost')).rejects.toThrow(NotFoundError);
  });

  // Error handling
  it('should throw when database is unavailable', async () => {
    mockDb.findById.mockRejectedValue(new Error('DB down'));
    await expect(getUserById('id')).rejects.toThrow();
  });
});
```

## Checklist trước khi xong

- [ ] Happy path covered
- [ ] Edge cases: null, undefined, empty, boundary values
- [ ] Error cases: invalid input, external failures
- [ ] Async operations handled đúng (await, rejects)
- [ ] No hardcoded values — dùng variables hoặc factories
- [ ] Tests có thể chạy độc lập (không phụ thuộc thứ tự)

## Chạy và verify

```bash
npm test -- --testPathPattern="<filename>"
```

Đảm bảo tất cả tests pass trước khi báo cáo xong.

## Project Convention

> Đọc `.project-info/conventions/testing.md` nếu tồn tại trước khi viết tests.
> File này chứa: test runner cụ thể, mock patterns, file location, naming của project.
