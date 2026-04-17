---
description: Build UI cho business — compose từ component library, thay layout, hoặc update theme
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git *), Bash(ls *)
---

# Design

**Arguments:** $ARGUMENTS

---

## Phase -1 — Mở Browser Session

Đây là bước đầu tiên, chạy **trước Phase 0**, ngay khi user bắt đầu design session.

Mục tiêu: browser luôn mở và sẵn sàng trong suốt quá trình build — không phải chờ xong mới xem.

```bash
# 1. Xác định project type
if [ -f "package.json" ]; then
  DEV_SCRIPT=$(node -e "const p=require('./package.json'); console.log(p.scripts?.dev || p.scripts?.start || '')" 2>/dev/null)
fi

# 2. Tìm port đang dùng hoặc pick port mới
PORT=3333
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do PORT=$((PORT+1)); done

# 3. Start server tùy project type
if [ -n "$DEV_SCRIPT" ]; then
  # Framework project (Vite, Next.js, etc.) — dùng dev server
  npm run dev &
  SERVER_PID=$!
  sleep 2
  # Detect actual port từ output nếu cần
else
  # HTML prototype — dùng live-server với auto-reload
  if command -v npx &>/dev/null; then
    npx --yes live-server . --port=$PORT --no-browser --quiet &
  else
    python3 -m http.server $PORT &
  fi
  SERVER_PID=$!
  sleep 1
fi

# 4. Lưu PID để cleanup sau
echo "$SERVER_PID" > .design-session.pid
echo "$PORT" >> .design-session.pid

# 5. Mở browser
open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" 2>/dev/null
```

Báo cho user:
```
Browser đã mở tại http://localhost:[PORT]

Tôi sẽ build từng phần — bạn sẽ thấy UI hình thành dần dần.
Góp ý bất cứ lúc nào, không cần đợi tôi xong.
```

> Nếu không mở được browser → tiếp tục bình thường, báo user URL để tự mở.

---

## Phase 0 — Design Language Lock

Trước khi làm bất kỳ thứ gì, kiểm tra design language đã được lock chưa:

```bash
cat design-system/MASTER.md 2>/dev/null || echo "NOT_FOUND"
```

**Nếu MASTER.md tồn tại:**
- Load product type, direction, tokens, rules từ MASTER.md
- Mọi quyết định visual phải consistent với MASTER.md
- Nếu request mâu thuẫn với MASTER.md → warn user trước khi tiếp tục

**Nếu MASTER.md chưa tồn tại (first time):**
Hỏi user 3 câu trước khi build bất cứ gì:

```
Để giữ design nhất quán, tôi cần biết:

1. Product type: SaaS B2B / SaaS B2C / Dashboard / E-commerce / Marketing / Healthcare / Mobile iOS / Mobile Android / Khác?
2. Feeling muốn tạo: professional / friendly / bold / calm / premium / playful?
3. Light hay dark dominant?
```

Sau khi có câu trả lời → tạo `design-system/MASTER.md` theo template `.claude/skills/frontend-design/templates/design-system-master.md` TRƯỚC KHI build UI.

> Không bao giờ bỏ qua Phase 0 — đây là foundation của mọi design decision sau này.

---

## Bước 1 — Kiểm tra role và context

```bash
cat .project-info/user-role.md 2>/dev/null
```

Nếu role là `developer` → cảnh báo nhẹ: "Command này dành cho business. Tiếp tục? [Y/n]"

Đọc song song:
```bash
cat .project-info/conventions/design.md 2>/dev/null   # design tokens của project
cat .project-info/stack.md 2>/dev/null                 # framework đang dùng
```

Đọc `.claude/skills/frontend-design/SKILL.md` để nắm methodology.

---

## Bước 2 — Catalog component library

Scan components do developer đã chuẩn bị:

```bash
# Tùy framework detect được từ stack.md
ls src/components/ 2>/dev/null
ls components/ 2>/dev/null
ls app/components/ 2>/dev/null
```

Đọc nhanh 5-10 component quan trọng nhất (Button, Input, Card, Modal, Form...) để biết:
- Props/variants có sẵn
- Import path
- Cách dùng

> Đây là palette của business — CHỈ dùng components này khi compose UI.
> Không tự tạo component mới trừ khi không có gì phù hợp và user đồng ý.

---

## Bước 3 — Detect mode

Phân tích `$ARGUMENTS`:

| Arguments | Mode |
|-----------|------|
| `layout [mô tả hoặc path ảnh]` | Layout mode |
| `theme [mô tả thay đổi]` | Theme mode |
| `iterate [mô tả]` | Iterate mode |
| `audit` | Audit mode |
| Mô tả UI trực tiếp / rỗng | Compose mode |

---

## COMPOSE mode (default)

> Dùng khi: business member nhận yêu cầu từ PM/chief và muốn build artifact nhanh để proposal.

Nếu `$ARGUMENTS` rỗng → hỏi:
```
Bạn muốn build gì?
Mô tả ngắn gọn (ví dụ: "trang checkout 3 bước", "dashboard analytics với chart", "profile page mobile-first")
```

**Workflow:**
1. Hiểu yêu cầu — trang/section gì, ai dùng, mục tiêu chính
2. Chọn components từ catalog phù hợp với yêu cầu
3. Nếu design.md có tokens → dùng đúng color variables, spacing, radius
4. Nếu không có design.md → áp dụng template đang active (xem `.claude/skills/frontend-design/templates/`)
5. Build page mới trong `proposal-template/src/pages/` — thêm route vào `src/App.tsx`

**Output:**
- Tạo file vào đúng folder cấu trúc project (hỏi nếu không chắc)
- Static/prototype — không cần real API, dùng mock data
- Sau khi tạo xong: chạy `/commit` để tạo design handoff

---

## LAYOUT mode

> Dùng khi: layout/bố cục cần thay đổi nhưng design system giữ nguyên.
> Input có thể là: mô tả text, path ảnh, Figma URL.

```
/design layout trang landing đổi sang 2-column hero thay vì centered
/design layout ./mockup.png
```

**Workflow:**
1. Nếu có ảnh → đọc ảnh, extract bố cục (grid, sections, positioning)
   - **Bỏ qua màu sắc trong ảnh** — giữ nguyên design tokens của project
   - Chỉ lấy: số cột, thứ tự sections, whitespace proportions, responsive breakpoints
2. Nếu có text → hiểu yêu cầu bố cục
3. Đọc file hiện tại cần thay đổi
4. Restructure layout, giữ nguyên:
   - Color variables (`--primary`, `--background`...)
   - Component variants đang dùng
   - Typography scale
5. Không đổi logic, chỉ đổi CSS layout classes/structure

---

## THEME mode

> Dùng khi: giữ nguyên bố cục nhưng thay đổi visual — màu sắc, button style, animation...
> Thay đổi ở cấp độ design system, ảnh hưởng toàn bộ UI.

```
/design theme đổi accent color sang orange, button bo tròn hơn
/design theme thêm subtle animation cho card hover
/design theme switch sang dark mode
```

**Workflow:**
1. Hiểu thay đổi muốn làm
2. Xác định scope:
   - Toàn project → update `conventions/design.md` + propagate xuống
   - Chỉ một page/component → update inline
3. Nếu toàn project:
   - Update `.project-info/conventions/design.md` trước (source of truth)
   - Update CSS variables / tailwind config
   - Scan và update components bị ảnh hưởng
4. Nếu chỉ local → update trực tiếp file đó

**Checklist trước khi xong:**
- [ ] Contrast ratio đủ (text trên background đạt AA)
- [ ] Hover/focus states vẫn visible
- [ ] Dark mode (nếu có) vẫn nhất quán

---

## ITERATE mode

> Dùng khi: muốn đẩy chất lượng visual lên cao qua nhiều vòng Generator → Evaluator.
> Inspired by ECC's gan-design — ưu tiên visual excellence hơn feature completeness.

```
/design iterate "landing page cho SaaS B2B"
/design iterate --max 5 "dashboard analytics"
```

**Setup:**
- Tạo thư mục tạm `.design-iterate/`
- Viết brief vào `.design-iterate/brief.md`
- Rubric: Design Quality (35%) · Originality (30%) · Craft (25%) · Functionality (10%)

**Vòng lặp (mặc định 3 vòng, tối đa `--max N`):**

```
Generator:  "PRIMARY goal là visual excellence.
             Stunning half-finished > functional ugly.
             Push for creative leaps — unusual layouts,
             custom animations, distinctive color work."

Evaluator:  "Would this win a design award?
             Score 0-10 mỗi dimension.
             Specific critique với ví dụ thực tế."
```

Mỗi vòng:
1. Generator tạo/cải thiện artifact dựa trên critique vòng trước
2. Evaluator chấm điểm + viết critique cụ thể
3. Nếu Design Quality + Originality ≥ 7.5 → dừng, báo cáo
4. Nếu chưa đạt → tiếp vòng tiếp

**Cuối cùng:**
- Output artifact vào đúng folder project
- Xóa `.design-iterate/`
- Báo điểm cuối và những gì đã cải thiện

---

## AUDIT mode

> Dùng khi: muốn kiểm tra UI hiện tại có nhất quán, polished, không bị "AI slop" không.
> Đọc `.claude/skills/design-system/SKILL.md` để biết chi tiết.

```
/design audit              — audit toàn bộ UI
/design audit src/pages/   — audit một folder cụ thể
```

**Chấm điểm trên 10 chiều (0-10):**
1. Color consistency
2. Typography hierarchy
3. Spacing rhythm
4. Component consistency
5. Responsive behavior
6. Dark mode (nếu có)
7. Animation — purposeful hay gratuitous?
8. Accessibility — contrast, focus states, touch targets
9. Information density
10. Polish — hover states, loading states, empty states

**AI Slop Detection** — flag nếu có:
- Gradient tím-xanh generic
- Glass morphism vô nghĩa
- Hero centered text trên stock gradient
- Bo tròn mọi thứ không phân biệt
- Animation scroll quá nhiều

**Output:** điểm từng chiều + file:line cụ thể + fix gợi ý.

---

## Kết thúc (mọi mode)

Sau khi build xong, báo user:

```
Hoàn thành [layout/theme/compose] cho [tên artifact].
Browser vẫn đang mở tại http://localhost:[PORT] — bạn có thể xem lại bất cứ lúc nào.

Files:
- [path 1]
- [path 2]

Bước tiếp theo:
  - Lưu lại để lần sau tiếp tục
  - Share link với team: tôi deploy lên preview nhé?
```

Hỏi user có muốn tiếp tục chỉnh sửa không. Nếu không:

```bash
# Cleanup browser session
if [ -f .design-session.pid ]; then
  kill $(head -1 .design-session.pid) 2>/dev/null
  rm .design-session.pid
fi
```

Báo: "Đã tắt server preview. Browser session kết thúc."
