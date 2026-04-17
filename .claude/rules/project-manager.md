# Project Manager Rules

Agents PHẢI tuân theo các quy tắc này khi làm việc với task management.

---

## Two-Tier Task System

Hai layers với vai trò khác nhau:

| Layer | Location | Chủ sở hữu | Mục đích | Ai đọc |
|-------|----------|-----------|---------|--------|
| **Documents** | `docs/` + Atlassian links | Business viết | WHAT to build — spec, requirements, design | Business + Developer |
| **Agent execution** | `.project-manager/tasks/` | Agent tự ghi | HOW agent đang làm — session scratchpad | Agent resume, PM |
| **Session recovery** | `.project-manager/sessions/` | Auto hook | Checkpoint cho /resume | Agent only |

**Source of truth:** Business viết markdown trong `docs/`, kèm link Atlassian Confluence. Developer đọc cả hai.

---

## Khi nhận task từ docs

Khi PM assign task từ `docs/` cho agent, ghi vào `.project-manager/tasks/in-progress.md` với **doc ref**:

```markdown
## [TASK-ID] Tên task ngắn gọn

- **Doc ref:** `docs/[filename].md` hoặc Atlassian URL
- **Started:** YYYY-MM-DD
- **Agent:** @coder
- **Progress:** 40%
- **Currently:** [đang làm gì cụ thể]
- **Files:** `src/auth/login.ts`, `tests/auth.test.ts`
```

---

## Task Lifecycle

```
Business viết doc trong docs/ (kèm Atlassian link nếu có)
    ↓
PM assign → ghi vào .project-manager/tasks/in-progress.md (có doc ref)
    ↓
Agent thực hiện → cập nhật Progress và Currently
    ↓
Hoàn thành → move sang .project-manager/tasks/done.md
```

---

## Khi nào ghi gì

| Sự kiện | File |
|---------|------|
| Task mới từ docs | `.project-manager/tasks/in-progress.md` (có doc ref hoặc Atlassian URL) |
| Hoàn thành task | `.project-manager/tasks/done.md` |
| Phát hiện bug/task mới | Tạo doc mới trong `docs/` hoặc báo business update Atlassian |
| Quyết định kỹ thuật | `knowledge/decisions.md` |
| Blocker | `knowledge/blockers.md` |
| Context dài hạn | `knowledge/context.md` |
| Kết thúc session | `sessions/latest.md` (qua `/handoff`) |

---

## Format tasks/in-progress.md

```markdown
## [TASK-ID] Tên task ngắn gọn

- **Doc ref:** `docs/[filename].md` hoặc `https://ipas-tech.atlassian.net/wiki/...`
- **Started:** YYYY-MM-DD
- **Agent:** @coder
- **Progress:** 40%
- **Currently:** [đang làm gì cụ thể]
- **Files:** `src/auth/login.ts`, `tests/auth.test.ts`
```

---

## status.md phải luôn phản ánh thực tế

Cập nhật `Current Focus` và `Quick Stats` sau mỗi milestone — không để outdated.
