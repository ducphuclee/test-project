---
description: Deploy UI proposal lên Vercel preview để stakeholder review
allowed-tools: Read, Bash(git *), Bash(vercel *), Bash(npm *), Bash(node *), Bash(npx *), Bash(cat *), Bash(sleep *), Bash(command *)
---

# Deploy — Vercel Preview

Deploy UI proposal từ business branch lên Vercel để share preview link với team và stakeholder.

**Arguments:** $ARGUMENTS

---

## Quy tắc quan trọng

- **Luôn deploy preview** — KHÔNG bao giờ deploy production từ business branch
- Chỉ deploy code trên branch hiện tại (business branch của bạn)
- Sau khi có preview URL → ghi vào handoff notes để developer và stakeholder xem

---

## Bước 1: Đọc skill và deploy

Đọc `.claude/skills/_roles/business/deploy-to-vercel/SKILL.md` để nắm đầy đủ deployment flow, sau đó thực hiện theo đúng hướng dẫn trong đó.

Tóm tắt flow (chi tiết xem SKILL.md):

1. Gather project state: git remote, `.vercel/` config, `vercel whoami`, teams list
2. Chọn deploy method phù hợp:
   - Linked + git remote → git push (hỏi xác nhận trước)
   - Linked + no git remote → `vercel deploy -y --no-wait`
   - Not linked + authenticated → link first, then deploy
   - Not linked + not authenticated → install CLI, login, link, deploy
3. Lấy preview URL

---

## Bước 2: Ghi preview URL vào handoff

Sau khi deploy thành công, cập nhật handoff notes:

```bash
ls .design-handoff/ 2>/dev/null | sort -r | head -1
```

Nếu có file handoff mới nhất → tìm section `## Preview` và điền URL vào.

Nếu không có → nhắc user: "Chạy `/commit` để tạo handoff file kèm preview URL này."

---

## Output mẫu

```
Deploy thành công!

Preview URL: https://ten-project-abc123.vercel.app
Branch:      business/ten-cua-ban

Share link này với stakeholder hoặc PM để review.
Claim URL (nếu cần transfer ownership): https://vercel.com/claim-deployment?code=...

Tiếp theo:
  - Ghi URL vào handoff: /commit [mô tả]
  - Hoặc share trực tiếp preview link ở trên
```
