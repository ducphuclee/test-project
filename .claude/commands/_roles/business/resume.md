---
description: Khôi phục context design session — load design system, artifact đang làm, handoff notes
allowed-tools: Read, Glob, Bash(git *)
---

# Resume — Business Context

Khôi phục context để tiếp tục làm việc.

## Bước 1 — Branch và trạng thái

```bash
git branch --show-current
git log --oneline -5
```

## Bước 2 — Design system

Đọc song song:
```bash
cat .project-info/conventions/design.md 2>/dev/null
cat .project-info/component-catalog.md 2>/dev/null
```

Tóm tắt:
- Design tokens đang dùng (colors, fonts, spacing)
- Số components có sẵn trong catalog

## Bước 3 — Artifacts đang làm

```bash
git diff --name-only HEAD~3..HEAD 2>/dev/null | grep -E "\.(tsx|jsx|vue|html|css)$"
```

Đọc nhanh 2-3 file UI được sửa gần nhất để biết đang build gì.

## Bước 4 — Handoff notes gần nhất

```bash
ls .design-handoff/ 2>/dev/null | sort -r | head -3
```

Đọc file handoff mới nhất nếu có — biết commit trước đã ghi chú gì cho developer.

## Bước 5 — Báo cáo context

Tóm tắt ngắn gọn:

```
## Design Context

Branch:       business/ten-minh
Last commit:  [message]

Design System:
  - Colors:   [primary, background, accent]
  - Fonts:    [display, body]
  - Radius:   [value]

Components:   [số lượng] có sẵn
  Hay dùng:   Button (4 variants), Card, Input, Modal...

Đang làm:     [tên artifact từ git log]
              [file paths]

Ghi chú cũ:  [nếu có handoff notes]
```

Hỏi: "Tiếp tục với [artifact] hay bắt đầu task mới?"
