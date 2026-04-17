---
name: git-worktree
description: Git worktree isolation — khi nào dùng, setup, merge strategy, safety rules. Thay thế Archon's worktree layer bằng native git capability.
origin: project
---

# Skill: Git Worktree

Git worktrees cho phép checkout nhiều branches cùng lúc vào các thư mục riêng biệt — không cần stash, không cần context switch.

## Khi nào dùng worktree

| Tình huống | Dùng worktree? | Lý do |
|-----------|---------------|-------|
| Hotfix trong khi đang làm feature dở | **Có** | Không stash feature, không mix context |
| Review PR trong khi đang code | **Có** | Checkout PR branch mà không mất local changes |
| Experiment với approach khác | **Có** | Thử mà không ảnh hưởng branch chính |
| Task độc lập hoàn toàn chạy song song | **Có** | `/parallel` skill dùng pattern này |
| Task nhỏ < 30 phút | **Không** | Overhead không đáng |
| Task có shared files với task đang làm | **Không** | Conflict khi merge, phức tạp hơn stash |

## Setup

```bash
# Tạo worktree mới từ main
git worktree add ../[project]-hotfix main

# Tạo worktree với branch mới
git worktree add -b feat/experiment ../[project]-experiment

# Tạo worktree từ remote branch (review PR)
git worktree add ../[project]-pr-123 origin/feat/some-pr
```

**Convention thư mục:** `../[project-name]-[purpose]` — nằm ngoài repo chính, không bị tracked.

## Làm việc trong worktree

```bash
cd ../[project]-hotfix

# Làm việc bình thường — commit, push như repo thường
git add .
git commit -m "fix(auth): ..."
git push origin hotfix/critical-bug
```

Mỗi worktree có working directory và index riêng. Branch checkout trong worktree này **không** ảnh hưởng repo chính.

## Merge strategy

### Sau khi hotfix xong → merge vào main:
```bash
# Trong repo chính
git merge hotfix/critical-bug --no-ff
git branch -d hotfix/critical-bug
git worktree remove ../[project]-hotfix
```

### Sau khi experiment xong → cherry-pick nếu thành công:
```bash
# Lấy commit hash từ experiment
git log ../[project]-experiment --oneline

# Cherry-pick vào branch đang làm
git cherry-pick [hash]
git worktree remove ../[project]-experiment
```

### Sau khi parallel tasks xong → merge theo thứ tự:
```bash
# Merge task ít conflict nhất trước
git merge feat/task-a --no-ff
git merge feat/task-b --no-ff  # resolve conflicts nếu có
git worktree remove ../[project]-task-a
git worktree remove ../[project]-task-b
```

## Cleanup

```bash
# Xem tất cả worktrees
git worktree list

# Xóa worktree (branch vẫn còn)
git worktree remove ../[project]-hotfix

# Xóa cả worktree lẫn branch
git worktree remove ../[project]-hotfix
git branch -d hotfix/critical-bug

# Prune worktrees không còn tồn tại trên disk
git worktree prune
```

## Safety rules

- **Không checkout cùng một branch trong 2 worktrees** — git sẽ báo lỗi, nhưng cần biết để tránh
- **Không xóa thư mục worktree bằng `rm -rf`** — dùng `git worktree remove` để git cleanup metadata
- **Không commit vào detached HEAD** — luôn checkout branch trước khi commit
- **Worktree không share stash** — `git stash` trong worktree A không visible ở worktree B
- **Worktree chia sẻ `.git/`** — config, hooks, và pack objects là chung → hook scripts chạy trên tất cả

## Liên kết với /parallel skill

Khi `/parallel` chạy nhiều tasks độc lập, mỗi task nên có worktree riêng:

```
Task A → worktree ../[project]-task-a (branch: feat/task-a)
Task B → worktree ../[project]-task-b (branch: feat/task-b)
```

PM merge lần lượt sau khi cả hai done, resolve conflicts nếu có.
