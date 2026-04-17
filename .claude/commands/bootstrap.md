---
description: Bootstrap entry — kiểm tra git, detect role, delegate sang dev-bootstrap hoặc business-bootstrap
allowed-tools: Read, Write, Edit, Bash(git *), Bash(ls *), Bash(cat *), Bash(cp *), Bash(rm *), Bash(find *), Bash(mkdir *)
---

# Bootstrap — Entry Point

Detect role và delegate toàn bộ setup sang file tương ứng.

---

## PHASE -2 — GIT INITIALIZATION CHECK

Chạy song song:

```bash
git status 2>&1
git remote -v
```

- `git status` fail ("not a git repository") → DỪNG:
  ```
  Chưa có git repo. Chạy: git init && git remote add origin <url>
  Sau đó chạy lại /bootstrap.
  ```

- Không có remote → DỪNG:
  ```
  Git repo chưa có remote. Chạy: git remote add origin <url>
  Sau đó chạy lại /bootstrap.
  ```

### Branch `business` trên remote?

```bash
git fetch origin 2>/dev/null
git branch -r | grep "origin/business"
```

- **CÓ** → tiếp tục Phase -1.
- **KHÔNG CÓ** → hỏi:
  ```
  Branch `business` chưa tồn tại.
  [Y] Tạo ngay   [N] Bỏ qua
  ```
  - Chọn Y:
    ```bash
    git checkout -b business
    git push -u origin business
    git checkout -
    ```

---

## PHASE -1 — ROLE DETECTION

```bash
cat .project-info/user-role.md 2>/dev/null
```

- **File tồn tại** → đọc role, nhảy thẳng tới phần delegate bên dưới (bỏ qua hỏi).
- **Không có** → hỏi:
  ```
  Bạn tham gia project này với vai trò nào?
    [B] Business  — tạo UI proposals, prototypes, artifacts
    [V] Developer — implement features, build logic, API
  ```

Lưu vào `.project-info/user-role.md`:
```
**Role:** business
**Set:** YYYY-MM-DD
```

### Nếu chọn Business

```bash
git fetch origin business 2>/dev/null
git branch -a | grep "business"
```

- Branch chưa có → DỪNG: "Developer cần tạo branch business trước. Chạy lại sau."

- Branch có → hỏi:
  ```
  Tạo branch cá nhân riêng không?
    [Y] Có — tạo branch riêng (nhiều business member)
    [N] Không — làm trực tiếp trên business
  ```
  - Y → hỏi tên, `git checkout -b <tên> origin/business`, ghi `**Branch:** <tên>` vào user-role.md
  - N → `git checkout business`, ghi `**Branch:** business`

Cập nhật `CLAUDE.md`: thay `**Role:** [business / developer — điền bởi /bootstrap]` → `**Role:** business`

Activate business environment:
```bash
find .claude/commands -maxdepth 1 -name "*.md" ! -name "bootstrap.md" -delete
cp .claude/commands/_roles/business/*.md .claude/commands/

find .claude/skills -maxdepth 1 -name "*.md" -delete
rm -rf .claude/skills/frontend-design .claude/skills/design-system \
       .claude/skills/frontend-slides .claude/skills/deep-research \
       .claude/skills/blueprint 2>/dev/null
cp -r .claude/skills/_roles/business/* .claude/skills/

find .claude/agents -maxdepth 1 -name "*.md" ! -name "pm.md" -delete
cp .claude/agents/_roles/business/*.md .claude/agents/
```

→ **Đọc `.claude/commands/business-bootstrap.md` và thực thi toàn bộ.**

### Nếu chọn Developer

Cập nhật `CLAUDE.md`: thay `**Role:** [business / developer — điền bởi /bootstrap]` → `**Role:** developer`

→ **Đọc `.claude/commands/dev-bootstrap.md` và thực thi toàn bộ.**
