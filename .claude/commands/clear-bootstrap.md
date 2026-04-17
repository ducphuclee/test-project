---
description: Xóa skills/commands/agents của role không dùng sau bootstrap. Developer trigger thủ công — không tự động.
allowed-tools: Read, Bash(cat *), Bash(rm -rf *), Bash(git *)
---

# Clear Bootstrap — Dọn dẹp role không dùng

Xóa toàn bộ `_roles/[other-role]/` trong agents, commands, skills — dựa theo role đã bootstrap.

---

## Bước 1 — Đọc role hiện tại

```bash
cat .project-info/user-role.md
```

Lấy giá trị `**Role:**` — phải là `business` hoặc `developer`.

Nếu không đọc được → DỪNG: "Chưa bootstrap. Chạy `/bootstrap` trước."

---

## Bước 2 — Liệt kê và xác nhận

Liệt kê toàn bộ `_roles/` sẽ bị xóa (cả hai roles):

```bash
find .claude/agents/_roles .claude/commands/_roles .claude/skills/_roles -maxdepth 1 -mindepth 1 -type d 2>/dev/null
```

Báo cáo với user:

```
Sẽ xóa toàn bộ _roles/ staging directories:
- .claude/agents/_roles/    (cả business + developer)
- .claude/commands/_roles/  (cả business + developer)
- .claude/skills/_roles/    (cả business + developer)

Files của role [current-role] đã được copy ra top-level khi bootstrap.
_roles/ chỉ là staging source — không cần nữa.
Worktree business vẫn giữ nguyên bản sao của chính nó.

Xác nhận xóa? (có/không)
```

Chờ xác nhận. Nếu không → DỪNG.

---

## Bước 3 — Xóa

```bash
rm -rf .claude/agents/_roles
rm -rf .claude/commands/_roles
rm -rf .claude/skills/_roles
```

---

## Bước 4 — Commit

```bash
git add -A
git commit -m "chore(bootstrap): remove _roles staging dirs — [current-role] activated"
```

---

## Bước 5 — Báo cáo

```
✓ Đã xóa toàn bộ _roles/ staging directories.
Branch này ([current-branch]) chỉ còn [current-role] configuration.
Worktree business không bị ảnh hưởng.

Lưu ý: nếu cần re-bootstrap sau này, copy lại từ _template/.
```
