---
description: Review Pull Request toàn diện — tóm tắt changes + code quality + CI status
allowed-tools: Bash(git *), Bash(gh *), Agent
---

## PR Review

**Target:** $ARGUMENTS

---

### Bước 1 — Fetch PR info

Nếu `$ARGUMENTS` là PR number hoặc URL:
```bash
gh pr view $ARGUMENTS --json number,title,body,author,baseRefName,headRefName,state,statusCheckRollup
gh pr diff $ARGUMENTS
```

Nếu không có arguments → review PR hiện tại của branch đang đứng:
```bash
gh pr view --json number,title,body,author,baseRefName,headRefName,state,statusCheckRollup
gh pr diff
```

---

### Bước 2 — Spawn agents song song

Spawn **đồng thời** hai agents với đầy đủ PR diff:

**@explorer** — tóm tắt changes:
> Đọc diff, trả lời:
> - Files nào thay đổi và tại sao?
> - Logic chính được thêm/sửa/xóa là gì?
> - Có breaking changes không?
> Viết ngắn gọn để reviewer nắm được trong 30 giây.

**@reviewer** — code quality:
> Đọc diff, đánh giá: correctness, security, performance, conventions, tests.
> Label: MUST FIX / SHOULD FIX / SUGGESTION / PRAISE

---

### Bước 3 — Output tổng hợp

```
## PR Review: #[number] — [title]

**Author:** @[author] | **Base:** [base] ← [head]
**CI:** ✅ passing / ❌ failing / ⏳ pending

---

### Summary
[Tóm tắt từ @explorer — 5-10 dòng, đủ để hiểu PR làm gì]

Files changed: X | Insertions: +Y | Deletions: -Z

---

### Code Quality

**MUST FIX** (block merge)
- `file.ts:42` — [mô tả]

**SHOULD FIX**
- `file.ts:15` — [mô tả]

**SUGGESTION**
- [gợi ý]

**PRAISE**
- [điểm tốt]

---

### Checklist
- [ ] Title theo Conventional Commits
- [ ] CI passing
- [ ] Không có MUST FIX

### Verdict
APPROVE ✅ / REQUEST CHANGES ❌ / COMMENT 💬
```

---

### Bước 4 — Hỏi post review

```
Review xong. Bạn muốn:
[A] Post review lên GitHub PR
[B] Chỉ xem, không post
```

Nếu chọn A:
```bash
gh pr review $PR_NUMBER --[approve|request-changes|comment] --body "[review content]"
```
