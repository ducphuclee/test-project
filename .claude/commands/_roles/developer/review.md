---
description: Review code hiện tại hoặc một PR URL
allowed-tools: Bash(git *), Bash(gh *)
---

## Code Review Task

Thực hiện code review kỹ lưỡng.

### Nếu có PR URL trong arguments:
```
gh pr view $ARGUMENTS
gh pr diff $ARGUMENTS
```

### Nếu không có arguments - review changes hiện tại:
```
git diff HEAD
git diff --cached
```

### Pass 1 — CRITICAL (chạy trước, block merge nếu fail)

- **SQL & Data Safety**: string interpolation trong SQL, TOCTOU races, N+1 queries thiếu eager loading
- **Race Conditions**: read-check-write không có uniqueness constraint, find-or-create không có unique index
- **LLM Output Trust Boundary**: LLM-generated values ghi DB không validate, LLM output render thành HTML, user content interpolate vào system prompt, LLM URL fetch không có allowlist (SSRF)
- **Injection**: SQL injection, command injection (`shell=True` + f-string), `eval()`/`exec()` trên LLM output
- **Enum/Value Completeness**: value mới có được trace qua tất cả consumers chưa? allowlists cập nhật chưa? case/if chains handle chưa?

### Pass 2 — INFORMATIONAL (flag nhưng không block)

- **Logic & Correctness**: edge cases, error handling, business logic đúng chưa?
- **Performance**: N+1 query, O(n²) loops, unnecessary re-renders, bundle size
- **Code Quality**: conventions, readability, duplicate code, tests đầy đủ chưa?
- **Breaking Changes**: API contract thay đổi, dependency mới không cần thiết?
- **Completeness Gaps**: implement 80% khi 100% chỉ tốn thêm <30 phút nữa?

### Fix-First Heuristic

**Tự động fix (không hỏi):**
- Dead code / unused variables
- N+1 queries (thiếu eager loading)
- Stale comments mâu thuẫn với code
- Magic numbers → named constants
- Thiếu LLM output validation

**Phải hỏi user trước:**
- Security issues (auth, XSS, injection)
- Race conditions
- Design decisions
- Fixes >20 lines
- Enum completeness
- Xóa functionality

### Output format:

```
Review: N issues (X critical, Y informational)

AUTO-FIXED:
- [file:line] Vấn đề → fix đã apply

CRITICAL (cần sửa trước merge):
- [file:line] Mô tả → recommended fix

INFORMATIONAL:
- [file:line] Mô tả → recommended fix
```

Nếu không có issues: `Review: No issues found.`

**Target:** $ARGUMENTS
