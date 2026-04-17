# DESIGN.md — Minimal Light

> Style: Clean, precise, content-first. Inspired by Vercel, Notion, Raycast.
> Tất cả quyết định design phục vụ cho content — không có decoration thừa.

---

## Visual Theme & Atmosphere

**Direction:** Brutally minimal — whitespace IS the design.
**Mood:** Calm, focused, professional. Người dùng không bao giờ cảm thấy bị overwhelmed.
**One principle:** Nếu có thể bỏ đi mà không mất thông tin → bỏ.

---

## Color Palette & Roles

```css
/* Background layers */
--color-bg:        #ffffff;   /* canvas chính */
--color-surface:   #f9fafb;   /* cards, sidebars */
--color-surface-2: #f3f4f6;   /* hover states, subtle dividers */

/* Border */
--color-border:    #e5e7eb;   /* dividers, card borders */
--color-border-strong: #d1d5db;

/* Text */
--color-text:      #111827;   /* primary — near black */
--color-text-2:    #6b7280;   /* secondary — medium gray */
--color-text-3:    #9ca3af;   /* tertiary — light gray */

/* Brand accent — use sparingly */
--color-accent:    #171717;   /* near-black accent (như Vercel) */
--color-accent-fg: #ffffff;

/* Semantic */
--color-success:   #16a34a;
--color-warning:   #d97706;
--color-error:     #dc2626;
```

**Rules:**
- 1 accent màu duy nhất. Tránh rainbow.
- Interactive elements: near-black on white, hover → gray-100.
- Không dùng màu chỉ để decorate — màu phải có semantic meaning.

---

## Typography Rules

```css
/* Font stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

/* Size scale */
--text-xs:   0.75rem;   /* 12px — labels, captions */
--text-sm:   0.875rem;  /* 14px — secondary text, UI labels */
--text-base: 1rem;      /* 16px — body text */
--text-lg:   1.125rem;  /* 18px — lead text */
--text-xl:   1.25rem;   /* 20px — card titles */
--text-2xl:  1.5rem;    /* 24px — section headings */
--text-3xl:  1.875rem;  /* 30px — page headings */
--text-4xl:  2.25rem;   /* 36px — hero headings */
```

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Hero H1 | 4xl–5xl | 600–700 | text |
| H2 | 2xl–3xl | 600 | text |
| H3 | xl | 600 | text |
| Body | base | 400 | text |
| Caption | sm | 400 | text-2 |
| Label | xs | 500 | text-2 |
| Code | sm | 400 | text, font-mono |

**Letter spacing:** -0.02em cho headings lớn. 0 cho body.
**Line height:** 1.5 cho body. 1.2 cho headings.

---

## Component Stylings

### Buttons

```
Primary:    bg-[--color-accent] text-white — hover: opacity-90
Secondary:  bg-[--color-surface-2] text-[--color-text] border border-[--color-border]
Ghost:      transparent — hover: bg-[--color-surface]
Destructive: bg-[--color-error] text-white
```

Padding: `h-9 px-4` (default) / `h-7 px-3 text-sm` (small) / `h-11 px-6` (large)
Border radius: `rounded-md` (6px)

### Cards

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 8px;
padding: 20px 24px;
/* NO box-shadow — border đã đủ depth */
```

Hover: `border-color: var(--color-border-strong)`

### Inputs

```css
background: var(--color-bg);
border: 1px solid var(--color-border);
border-radius: 6px;
padding: 8px 12px;
font-size: var(--text-sm);
/* Focus: */
outline: 2px solid var(--color-accent);
outline-offset: 2px;
```

### Navigation

Topbar: white bg, bottom border `--color-border`, height 56px.
Active link: `--color-text` + `font-weight: 500`.
Inactive: `--color-text-2`.

---

## Layout Principles

**Spacing scale:** 4px base unit — 4, 8, 12, 16, 24, 32, 48, 64, 96px.

**Max widths:**
- Content: 768px
- Wide: 1024px
- Full: 1280px
- Sidebar layout: 240px + flex-1

**Grid:** 12-column, gap-6 (24px). Mobile: single column.

**Whitespace philosophy:** Err on the side of MORE space. Dense UI làm mọi thứ trở nên ít quan trọng hơn.

---

## Depth & Elevation

Minimal system sử dụng **border thay vì shadow**:

| Level | Phương pháp |
|-------|-------------|
| Flat | `border: 1px solid --color-border` |
| Raised | `border + shadow-sm` (0 1px 2px rgba(0,0,0,0.06)) |
| Floating (dropdown) | `shadow-lg` + `border` |
| Modal | `shadow-2xl` + overlay |

Tránh stack nhiều shadow levels.

---

## Do's and Don'ts

**Do:**
- Generous padding — ít nhất 20-24px trong cards
- Consistent spacing rhythm (multiples of 4)
- Gray scale trước khi thêm màu
- Typography hierarchy rõ qua size/weight, không qua màu

**Don't:**
- Gradient backgrounds trên surfaces chính
- More than 2 font weights trên một screen
- Colored borders chỉ để decorate
- Animation trên layout shifts

---

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|---------|
| < 640px | Single column, padding 16px |
| 640–1024px | 2 columns, padding 24px |
| > 1024px | Full layout, max-width applied |

Touch targets: minimum 44×44px.
Navigation: collapse sang hamburger < 768px.

---

## Agent Prompt Guide

Khi build UI với template này, nói với agent:

```
Follow DESIGN.md. Use minimal light style:
- White backgrounds, gray surfaces
- Near-black accent (#171717)
- Inter font, tight letter-spacing on headings
- Border-based depth, no shadows on flat surfaces
- Generous whitespace — if in doubt, add more space
```

**Quick colors:**
- Canvas: `#ffffff`
- Surface: `#f9fafb`
- Text: `#111827`
- Muted: `#6b7280`
- Accent: `#171717`
- Border: `#e5e7eb`
