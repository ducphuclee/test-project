---
name: frontend-design
description: Tạo UI có visual direction rõ ràng, production-grade. Đọc khi build landing page, dashboard, app shell, hoặc bất kỳ surface nào mà visual quality quan trọng ngang code quality.
origin: ECC
---

# Frontend Design

Dùng khi task không chỉ là "make it work" mà là "make it look designed."

## When to Activate

- Build landing page, dashboard, app shell từ đầu
- Upgrade giao diện bland thành intentional
- Implement frontend nơi typography, composition, motion quan trọng
- User yêu cầu UI "đẹp", "professional", "có style riêng"

## Product Type → Visual Direction

Xác định product type TRƯỚC khi chọn direction. Mỗi type có design constraints riêng:

| Product Type | Direction | Color Mood | Typography | Anti-Patterns |
|---|---|---|---|---|
| SaaS B2B | Minimal + structured | Trust blue / neutral | Professional, clear hierarchy | Dark by default, heavy animation |
| SaaS B2C | Friendly + energetic | Vibrant accent | Approachable, rounded | Too formal, dense |
| Dashboard / Analytics | Dense + informative | Neutral + semantic colors | Mono/tabular for data | Too much whitespace, decorative |
| E-commerce | Product-first | Warm/neutral bg | CTA-strong, clear hierarchy | Color overload, carousel spam |
| Marketing / Landing | Bold + memorable | Brand dominant | Editorial, display | Generic hero, purple gradient |
| Healthcare / Fintech | Clean + trustworthy | Calm blue / green | Clear, readable | Playful, heavy animation |
| Mobile (iOS) | Native + fluid | System-aligned | SF-Pro-style alignment | Web patterns on mobile |
| Mobile (Android) | Material + adaptive | Dynamic color | Adaptive weight | iOS-specific patterns |

> Nếu không rõ product type → hỏi trước khi bắt đầu design.

## Core Principle

**Chọn một direction và commit vào nó.**

UI safe-average thường tệ hơn một aesthetic mạnh, coherent với vài lựa chọn bold.

---

## Design Workflow

### Bước 1 — Frame the interface (trước khi code)

Xác định:
- **Purpose** — interface này làm gì?
- **Audience** — ai dùng?
- **Emotional tone** — cảm giác muốn user có là gì?
- **Visual direction** — chọn một trong các hướng dưới đây
- **One thing to remember** — user rời đi nhớ điều gì?

**Possible directions** (chọn một, không mix):
- Brutally minimal
- Editorial / magazine
- Industrial
- Luxury (dark hoặc light)
- Playful
- Geometric / Swiss
- Retro-futurist
- Soft & organic
- Maximalist / bento

### Bước 2 — Build the visual system

Định nghĩa trước khi viết component nào:

```css
/* Typography */
--font-display: ...;     /* heading, hero */
--font-body: ...;        /* body text */
--font-mono: ...;        /* code, data */

/* Color */
--color-bg: ...;
--color-surface: ...;
--color-accent: ...;     /* 1 accent chính, dùng có chủ ý */
--color-text: ...;
--color-muted: ...;

/* Spacing rhythm */
--space-1: 4px;
--space-2: 8px;
--space-4: 16px;
--space-8: 32px;
--space-16: 64px;

/* Motion */
--duration-fast: 150ms;
--duration-base: 250ms;
--easing-default: cubic-bezier(0.4, 0, 0.2, 1);
```

> Nếu project đã có design tokens → dùng đúng tokens đó, không tự thêm.

### Token Architecture — 3 Layers

Tổ chức tokens theo 3 layers để enable theme switching và dark mode:

```css
/* Layer 1 — Primitive (raw values, KHÔNG dùng trực tiếp trong components) */
--primitive-blue-500: #4299e1;
--primitive-gray-900: #1a202c;
--primitive-space-4: 16px;

/* Layer 2 — Semantic (purpose-named, DÙNG trong components) */
--color-action-primary: var(--primitive-blue-500);
--color-text-default: var(--primitive-gray-900);
--space-content: var(--primitive-space-4);

/* Layer 3 — Component (component-specific overrides) */
--button-bg: var(--color-action-primary);
--card-padding: var(--space-content);
```

**Rule:** Components chỉ tham chiếu Semantic tokens — không bao giờ dùng Primitive trực tiếp.
**Dark mode:** Chỉ cần swap Semantic layer. Primitive và Component giữ nguyên.

### Design System Persistence

Khi bắt đầu project, tạo `design-system/MASTER.md` — source of truth dùng xuyên suốt:

```
design-system/
├── MASTER.md          ← global rules (tokens, direction, typography)
└── pages/
    ├── landing.md     ← page-specific overrides
    ├── dashboard.md
    └── checkout.md
```

**Retrieval rule:** Load MASTER.md trước → kiểm tra pages/{page}.md → page rules win nếu conflict.

> Template: xem `.claude/skills/frontend-design/templates/design-system-master.md`

### Bước 3 — Compose with intention

Ưu tiên:
- **Asymmetry** khi cần sharpen hierarchy
- **Overlap** khi cần tạo depth
- **Strong whitespace** khi cần clarify focus
- **Dense layout** chỉ khi product cần density

Tránh default card grid đồng đều trừ khi đó là lựa chọn đúng đắn.

### Bước 4 — Make motion meaningful

Dùng animation để:
- Reveal hierarchy (stagger, entrance)
- Stage information (progressive disclosure)
- Reinforce user action (feedback)
- Tạo 1-2 memorable moments

**Không** scatter generic micro-interactions khắp nơi. Một load sequence được thiết kế tốt mạnh hơn 20 hover effects random.

---

## Strong Defaults

### Background

Tránh flat empty background. Dùng:
- Gradients
- Mesh / noise texture
- Subtle patterns
- Layered transparency

### Typography

- Chọn font có character, không dùng system font stack mặc định cho design-led pages
- Pair display face với body face khi phù hợp
- Establish size scale rõ ràng: display → h1 → h2 → body → caption

### Color

- 1 dominant field + selective accents
- Tránh rainbow palette cân bằng đều
- Tránh purple-gradient-on-white trừ khi product thực sự cần

---

## Anti-Patterns — Không bao giờ làm

| Pattern | Vấn đề |
|---------|--------|
| Hero: centered headline + gradient blob + CTA | Generic SaaS template |
| Card grid đồng đều không hierarchy | Không có visual flow |
| Random accent colors không có system | Thiếu coherence |
| Placeholder-feeling typography | Trông unfinished |
| Animation vì dễ thêm, không vì lý do | Distraction, không value |
| Dark mode mặc định không có lý do | Lazy default |

---

## Accessibility — Non-Negotiables (CRITICAL)

Thiếu bất kỳ mục nào = **không ship**:

| Rule | Minimum | Lý do |
|------|---------|-------|
| Text contrast | ≥ 4.5:1 (AA) | Screen readers + low vision |
| Large text contrast | ≥ 3:1 | WCAG compliance |
| Focus rings | Visible alternative bắt buộc | Keyboard navigation |
| Touch targets | ≥ 44×44px | Fat finger, motor disabilities |
| Icon-only buttons | `aria-label` bắt buộc | Screen readers |
| Images | `alt` text (hoặc `alt=""` nếu decorative) | Screen readers |
| State changes | Transition ≥ 100ms | Screen reader notification |

**Anti-patterns bị cấm:**
```css
/* CẤM — invisible focus */
button:focus { outline: none; }

/* ĐÚNG */
button:focus-visible {
  outline: 2px solid var(--color-action-primary);
  outline-offset: 2px;
}
```

**Platform targets:**
- Web: WCAG 2.1 AA
- iOS: Apple HIG accessibility (44pt targets)
- Android: Material accessibility (48dp targets)

---

## Quality Gate — Pre-Delivery Checklist

### CRITICAL (block ship nếu fail)
- [ ] Color contrast ≥ 4.5:1 cho body text, ≥ 3:1 cho large text
- [ ] Focus visible trên mọi interactive element (không `outline: none`)
- [ ] Touch targets ≥ 44px trên mọi clickable element
- [ ] Alt text cho mọi non-decorative image
- [ ] ARIA labels cho icon-only buttons
- [ ] Interface có clear visual point of view — không phải "clean minimal" vague

### HIGH (fix trước launch)
- [ ] Responsive hoạt động ở 375px / 768px / 1280px
- [ ] Loading states cho mọi async action
- [ ] Error states có message rõ ràng
- [ ] Empty states có content (không để trống)
- [ ] Tokens dùng đúng — không hardcode hex/px random
- [ ] Typography scale nhất quán từ display → caption
- [ ] Color và motion support product — không chỉ decorate

### MEDIUM (next sprint OK)
- [ ] Animation có `prefers-reduced-motion` fallback
- [ ] Dark mode tested (nếu supported)
- [ ] Keyboard navigation tested end-to-end
- [ ] Kết quả không trông như generic AI UI

---

## Khi làm trong existing product

- Đọc `.project-info/conventions/design.md` để lấy tokens hiện tại
- Match visual system đã có — không tự introduce tokens mới
- Áp dụng composition và motion principles trong giới hạn design system
- Mục tiêu: component trông đúng như phần còn lại của app
