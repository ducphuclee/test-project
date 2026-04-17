---
description: Kết thúc design session — tóm tắt những gì đã làm, ghi chú cho developer
allowed-tools: Read, Write, Glob, Bash(git *)
---

# Handoff — Business Session End

Lưu lại design session để tiếp tục lần sau hoặc bàn giao cho developer.

## Bước 1 — Artifacts đã tạo/sửa

```bash
git diff --name-only HEAD 2>/dev/null
git log --oneline -10
```

Liệt kê tất cả file UI đã thay đổi trong session này.

## Bước 2 — Tóm tắt design decisions

Với mỗi artifact, ghi lại:
- Layout approach đã chọn (và tại sao)
- Components đã dùng
- Deviations từ design system (nếu có, và lý do)
- Những gì còn placeholder/static

## Bước 3 — Ghi chú cho developer

Những gì business member đã làm static mà developer cần implement thật:
- Form handlers chưa có → API endpoint cần
- Data đang hardcode → cần fetch từ đâu
- Interactions còn thiếu → animation, transitions
- Edge cases chưa design → empty states, error states, loading states

## Bước 4 — Tạo session snapshot

Tạo/update `.design-handoff/session-[YYYY-MM-DD].md`:

```markdown
# Design Session — YYYY-MM-DD

## Artifacts

### [Tên page/component]
- File: `src/pages/...`
- Mô tả: [làm gì]
- Components dùng: Button (primary), Card, Input
- Status: Complete / In Progress / Needs Review

## Design Decisions
- [Decision 1]: [lý do]
- [Decision 2]: [lý do]

## Cần Developer Implement
- [ ] [page X] form submit → `POST /api/endpoint`
- [ ] [component Y] data thật từ `GET /api/...`
- [ ] [flow Z] add loading state
- [ ] [component W] mobile responsive breakpoint

## Những gì KHÔNG hoạt động
(design approaches đã thử nhưng bỏ — để tránh lặp lại)
- [approach A]: [lý do không dùng]

## Preview
Vercel: [URL nếu có]
Branch: [tên branch hiện tại]

## Next Session
[Tiếp tục làm gì]
```

## Bước 5 — Commit nếu có thay đổi chưa commit

Hỏi: "Commit và push các thay đổi này không? [Y/n]"
- Nếu Y → chạy `/commit`
- Nếu N → lưu snapshot và dừng
