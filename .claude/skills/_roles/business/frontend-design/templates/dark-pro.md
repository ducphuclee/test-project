# DESIGN.md — Dark Pro

> Style: Dark-native, high precision, engineered aesthetic. Inspired by Linear, Cursor, Warp.
> Dark không phải là màu đen trên trắng lộn ngược — đây là hệ thống riêng biệt.

---

## Visual Theme & Atmosphere

**Direction:** Dark-native với achromatic palette + single brand accent.
**Mood:** Focused, powerful, precise. Dành cho power users làm việc nhiều giờ.
**One principle:** Depth qua luminance stepping — mỗi layer sáng hơn một chút, không qua màu sắc.

---

## Color Palette & Roles

```css
/* Background layers — mỗi layer sáng hơn */
--color-bg:        #09090b;   /* canvas nền — near black */
--color-surface:   #111113;   /* cards, panels */
--color-surface-2: #1a1a1d;   /* hover, secondary panels */
--color-surface-3: #232326;   /* active states, selected */

/* Border — semi-transparent white */
--color-border:       rgba(255,255,255,0.07);
--color-border-strong: rgba(255,255,255,0.12);

/* Text */
--color-text:   #f4f4f5;   /* primary — near white */
--color-text-2: #a1a1aa;   /* secondary — zinc-400 */
--color-text-3: #71717a;   /* tertiary — zinc-500 */

/* Brand accent — indigo/violet như Linear */
--color-accent:    #5e6ad2;   /* background */
--color-accent-2:  #7c7fe8;   /* interactive, hover */
--color-accent-fg: #ffffff;

/* Semantic */
--color-success:   #22c55e;
--color-warning:   #f59e0b;
--color-error:     #ef4444;
```

**Rules:**
- Accent màu DÙNG ÍT — chỉ cho primary action và interactive highlights.
- Text trên dark background: không bao giờ dùng #ffffff thuần — dùng `rgba(255,255,255,0.9)` hoặc `#f4f4f5`.
- Đừng invert light mode thành dark — thiết kế riêng.

---

## Typography Rules

```css
/* Font stack */
--font-sans: 'Inter Variable', -apple-system, sans-serif;
/* OpenType features for Inter: font-feature-settings: "cv01", "ss03" */
--font-mono: 'Berkeley Mono', 'JetBrains Mono', 'Fira Code', monospace;

/* Size scale */
--text-xs:   0.6875rem; /* 11px */
--text-sm:   0.8125rem; /* 13px */
--text-base: 0.9375rem; /* 15px */
--text-lg:   1.0625rem; /* 17px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  2rem;      /* 32px */
--text-4xl:  2.5rem;    /* 40px */
```

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Hero H1 | 4xl | 600 | text |
| H2 | 2xl | 600 | text |
| H3 | xl | 500 | text |
| Body | base | 400 | text |
| Caption | sm | 400 | text-2 |
| Label | xs | 500 | text-3, uppercase, tracking-wide |
| Code | sm | 400 | text-2, font-mono |

**Letter spacing:**
- Headings lớn (≥3xl): `-0.03em` — compressed, engineered look
- Labels uppercase: `0.08em`
- Body: `-0.01em`

---

## Component Stylings

### Buttons

```
Primary:    bg-[--color-accent] text-white — hover: bg-[--color-accent-2]
Secondary:  bg-[--color-surface-2] text-[--color-text] border border-[--color-border]
            hover: bg-[--color-surface-3] border-[--color-border-strong]
Ghost:      transparent text-[--color-text-2] — hover: bg-[--color-surface-2]
Destructive: bg-transparent text-[--color-error] border border-[--color-error]/30
             hover: bg-[--color-error]/10
```

Padding: `h-8 px-3 text-sm` (default) / `h-7 px-2.5 text-xs` (small)
Border radius: `rounded-md` (6px)

### Cards

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 8px;
padding: 16px 20px;
/* Subtle top highlight — optional, signature dark UI touch */
box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
```

Hover: `border-color: var(--color-border-strong), background: var(--color-surface-2)`

### Inputs

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 6px;
padding: 7px 10px;
font-size: var(--text-sm);
color: var(--color-text);
/* Focus: */
border-color: var(--color-accent);
box-shadow: 0 0 0 3px rgba(94,106,210,0.15);
```

### Navigation

Sidebar: `--color-bg` bg, right border `--color-border`, width 224px.
Top item spacing: 4px gap.
Active: `bg-[--color-surface-2]` + `text-[--color-text]` + `rounded-md`.
Inactive: `text-[--color-text-3]` hover `text-[--color-text-2]`.

---

## Layout Principles

**Spacing scale:** 4px base — 4, 8, 12, 16, 20, 24, 32, 48, 64px.

**Max widths:**
- Sidebar layout: 224px sidebar + flex-1 content
- Content max: 900px
- Modal: 480–640px

**Density:** Compact hơn light mode — 12-14px font, 32px row height, 16px padding trong cards.

**Grid:** 12-column cho page layouts. Flex cho component layouts. Gap: 12-16px.

---

## Depth & Elevation

Dark UI dùng **luminance stepping** không phải shadow:

| Level | Background | Border |
|-------|-----------|--------|
| Page canvas | `#09090b` | — |
| Card/Panel | `#111113` | `rgba(255,255,255,0.07)` |
| Hover | `#1a1a1d` | `rgba(255,255,255,0.10)` |
| Selected | `#232326` | `rgba(255,255,255,0.12)` |
| Dropdown | `#1a1a1d` + shadow-xl | `rgba(255,255,255,0.12)` |
| Modal | `#111113` + overlay + shadow-2xl | `rgba(255,255,255,0.10)` |

Shadow chỉ dùng cho floating elements (dropdowns, tooltips, modals).

---

## Do's and Don'ts

**Do:**
- Dùng rgba border thay vì solid border trên dark
- Compact spacing — power users appreciate density
- Single brand accent, used purposefully
- Monospace font cho code, numbers, technical labels
- Subtle inset highlight (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.04)`) cho depth

**Don't:**
- White (#ffffff) text on dark — trop harsh, use `#f4f4f5`
- Colored backgrounds cho sections — dark system không cần màu để phân biệt
- Heavy drop shadows — luminance stepping đã tạo depth
- Light mode color assumptions ("invert nó là xong")

---

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|---------|
| < 768px | Sidebar collapse, hamburger menu |
| 768–1024px | Narrow sidebar (icon only) hoặc collapsible |
| > 1024px | Full sidebar + content |

Touch targets: 44×44px minimum.
Compact density của dark pro được relax thêm trên mobile.

---

## Agent Prompt Guide

```
Follow DESIGN.md. Use dark pro style:
- Near-black canvas (#09090b), luminance-stepped surfaces
- Single indigo accent (#5e6ad2), use sparingly
- Inter Variable with OpenType cv01/ss03 features
- Semi-transparent white borders (rgba(255,255,255,0.07))
- Compact density — 13px body, 32px row heights
- No colored backgrounds — depth through luminance only
```

**Quick colors:**
- Canvas: `#09090b`
- Surface: `#111113`
- Text: `#f4f4f5`
- Muted: `#a1a1aa`
- Accent: `#5e6ad2`
- Border: `rgba(255,255,255,0.07)`
