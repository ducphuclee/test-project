---
description: Checklist review chi tiết — dùng bởi Reviewer agent hoặc khi review thủ công
---

# Skill: Code Review Checklist

Checklist đầy đủ để review có hệ thống, không bỏ sót.

## 1. Correctness

- [ ] Logic có đúng với yêu cầu không?
- [ ] Tất cả branches của conditionals đều được handle?
- [ ] Loop termination conditions đúng chưa?
- [ ] Off-by-one errors?
- [ ] Null / undefined / empty cases được handle?
- [ ] Async/await được dùng đúng chỗ? Không có unhandled promise?
- [ ] Race conditions có thể xảy ra không?

## 2. Security

- [ ] Input từ user được validate và sanitize?
- [ ] SQL queries dùng parameterized statements (không string concat)?
- [ ] Không có hardcoded secrets, API keys, passwords?
- [ ] Authentication checks đúng chỗ?
- [ ] Authorization checks đủ chưa (không chỉ check login)?
- [ ] Sensitive data không bị log hoặc expose trong response?
- [ ] File uploads được validate type và size?
- [ ] Rate limiting cho sensitive endpoints?

## 3. Performance

- [ ] Database queries trong vòng lặp? (N+1 problem)
- [ ] Missing indexes cho queries thường xuyên?
- [ ] Large data sets được paginate?
- [ ] Expensive computations được cache khi cần?
- [ ] Unused imports hoặc dead code?
- [ ] Memory leaks: event listeners không được remove, intervals không được clear?

## 4. Error Handling

- [ ] Errors được catch ở đúng level?
- [ ] Error messages có đủ context để debug?
- [ ] Không swallow errors (`catch (e) {}` trống)?
- [ ] User nhận error message phù hợp (không expose stack trace)?
- [ ] Retry logic cho transient failures (network, DB)?

## 5. Code Quality

- [ ] Tên hàm/biến mô tả đúng ý nghĩa?
- [ ] Hàm không quá 30 dòng?
- [ ] Hàm không có quá 4 params?
- [ ] Không có logic duplicate?
- [ ] Magic numbers/strings được đặt tên thành constants?
- [ ] Comments giải thích WHY, không phải WHAT?
- [ ] Không có commented-out code?

## 6. Tests

- [ ] Happy path được test?
- [ ] Edge cases được test (null, empty, boundary)?
- [ ] Error cases được test?
- [ ] Tests có tên mô tả rõ ràng?
- [ ] Tests không phụ thuộc vào nhau?
- [ ] Coverage đủ cho code mới?

## 7. Maintainability

- [ ] Code tuân thủ conventions trong CLAUDE.md?
- [ ] Breaking changes được document?
- [ ] Dependencies mới có cần thiết không? Có alternative nhẹ hơn?
- [ ] Environment variables mới được thêm vào `.env.example`?
- [ ] Database migrations có down migration?

## Verdict

Sau khi check xong, phân loại:

| Label | Nghĩa |
|-------|-------|
| **BLOCKER** | Phải fix trước khi merge |
| **MAJOR** | Nên fix — ảnh hưởng quality |
| **MINOR** | Optional — style, suggestion |
| **PRAISE** | Điểm tốt |
| **QUESTION** | Cần clarify |
