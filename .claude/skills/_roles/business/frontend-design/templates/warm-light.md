# DESIGN.md — Warm Light

> Style: Soft, approachable, brand-friendly. Inspired by Stripe, Resend, Superhuman.
> Warm không phải là màu vàng — đây là system tạo cảm giác welcoming và trustworthy.

---

## Visual Theme & Atmosphere

**Direction:** Warm light với subtle depth và brand color rõ ràng.
**Mood:** Welcoming, trustworthy, polished. Dành cho consumer products, SaaS tools.
**One principle:** Brand color phải memorable — 1 màu chủ đạo, mọi thứ phục vụ nó.

---

## Color Palette & Roles

```css
/* Backgrounds — warm-tinted, không pure white */
--color-bg:        #fafafa;   /* canvas — slightly warm white */
--color-surface:   #ffffff;   /* cards — pure white trên bg */
--color-surface-2: #f4f4f5;   /* secondary surfaces, hover */

/* Border */
--color-border:       #e4e4e7;
--color-border-strong: #d4d4d8;

/* Text */
--color-text:   #18181b;   /* primary — warm near-black */
--color-text-2: #71717a;   /* secondary — zinc-500 */
--color-text-3: #a1a1aa;   /* tertiary — zinc-400 */

/* Brand — tùy chỉnh theo product */
/* Ví dụ dưới đây: violet như Stripe */
--color-brand:       #635bff;   /* primary brand */
--color-brand-light: #ede9fe;   /* brand tint cho backgrounds */
--color-brand-dark:  #4f46e5;   /* hover state */
--color-brand-fg:    #ffffff;

/* Semantic */
--color-success:   #16a34a;
--color-success-bg: #f0fdf4;
--color-warning:   #d97706;
--color-warning-bg: #fffbeb;
--color-error:     #dc2626;
--color-error-bg:  #fef2f2;
```

**Rules:**
- Brand color dùng cho: primary CTA, active links, highlights, loading states.
- `--color-brand-light` dùng cho: badge backgrounds, selected states, highlights.
- Backgrounds warm nhẹ (#fafafa) tạo cảm giác ấm áp hơn #ffffff thuần.

---

## Typography Rules

```css
/* Font stack */
--font-sans: 'Inter', 'DM Sans', -apple-system, sans-serif;
--font-display: 'Cal Sans', 'Fraunces', serif; /* optional: cho hero headings */
--font-mono: 'JetBrains Mono', monospace;

/* Size scale */
--text-xs:   0.75rem;  /* 12px */
--text-sm:   0.875rem; /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg:   1.125rem; /* 18px */
--text-xl:   1.25rem;  /* 20px */
--text-2xl:  1.5rem;   /* 24px */
--text-3xl:  2rem;     /* 32px */
--text-4xl:  2.5rem;   /* 40px */
--text-5xl:  3.5rem;   /* 56px — hero only */
```

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Hero H1 | 4xl–5xl | 700 | text |
| H2 | 2xl–3xl | 600 | text |
| H3 | xl | 600 | text |
| Body | base | 400 | text |
| Lead text | lg | 400 | text-2 |
| Caption | sm | 400 | text-2 |
| Label | xs | 500 | text-2 |

**Letter spacing:** `-0.02em` cho headings ≥2xl. Normal cho body.
**Line height:** 1.6 cho body (readable). 1.2 cho headings.

---

## Component Stylings

### Buttons

```
Primary:    bg-[--color-brand] text-white shadow-sm
            hover: bg-[--color-brand-dark]
            active: scale-[0.98]
Secondary:  bg-white text-[--color-text] border border-[--color-border] shadow-sm
            hover: bg-[--color-surface-2]
Ghost:      transparent text-[--color-text-2]
            hover: bg-[--color-surface-2] text-[--color-text]
Destructive: bg-[--color-error] text-white
```

Padding: `h-10 px-4` (default) / `h-8 px-3 text-sm` (small) / `h-12 px-6 text-lg` (large)
Border radius: `rounded-lg` (8px) — friendly, không sharp
**Đặc biệt:** Primary button có `shadow-sm` — subtle elevation tạo cảm giác clickable

### Cards

```css
background: var(--color-surface); /* white card trên fafafa bg */
border: 1px solid var(--color-border);
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
```

Hover: `box-shadow: 0 4px 12px rgba(0,0,0,0.08)`
Selected/Active: `border-color: var(--color-brand)` + `box-shadow: 0 0 0 3px var(--color-brand-light)`

### Inputs

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 8px;
padding: 10px 14px;
font-size: var(--text-sm);
box-shadow: 0 1px 2px rgba(0,0,0,0.04);
/* Focus: */
border-color: var(--color-brand);
box-shadow: 0 0 0 3px var(--color-brand-light), 0 1px 2px rgba(0,0,0,0.04);
```

### Navigation

Topbar: white bg, bottom border, height 64px, shadow-sm.
Brand logo: left. Nav links: center. CTA button: right.
Active link: `--color-brand`, `font-weight: 500`.

---

## Layout Principles

**Spacing scale:** 4px base — 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.

**Max widths:**
- Marketing pages: 1120px với padding 24px
- App content: 1024px
- Narrow content (blog, docs): 720px
- Wide (landing sections): full-bleed với inner max

**Section padding:** 96px vertical trên desktop. 64px trên mobile.

**Grid:** 12-column, gap-8 (32px). 3-column feature grid phổ biến.

---

## Depth & Elevation

Warm light dùng **subtle shadows** (không border-based):

| Level | Shadow |
|-------|--------|
| Card resting | `0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)` |
| Card hover | `0 4px 12px rgba(0,0,0,0.08)` |
| Dropdown | `0 8px 24px rgba(0,0,0,0.12)` |
| Modal | `0 24px 64px rgba(0,0,0,0.16)` |

Background sections để tạo separation: alternating `#fafafa` / `#ffffff`.

---

## Do's and Don'ts

**Do:**
- Rounded corners (8-12px) — tạo cảm giác friendly
- Subtle shadows trên cards — depth không overwhelming
- Brand color tint cho success/selected states
- Section backgrounds để group content trên landing pages
- Generous line-height (1.6) — comfortable reading

**Don't:**
- Flat design hoàn toàn — người dùng cần visual cues
- Too many accent colors — 1 brand color chính
- Sharp 4px corners — quá harsh cho warm aesthetic
- Dense layouts — warm style cần breathing room

---

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|---------|
| < 640px | Single column, section padding 40px vertical |
| 640–1024px | 2-column grids |
| > 1024px | 3-column grids, full layout |

CTA buttons: full-width trên mobile.
Hero text: scale down 1 step trên mobile.

---

## Agent Prompt Guide

```
Follow DESIGN.md. Use warm light style:
- Warm white canvas (#fafafa), pure white cards
- Single brand color (violet #635bff), use for primary actions
- Inter font, generous line-height (1.6)
- Subtle shadow-based depth, not flat
- Rounded corners (8-12px), friendly and approachable
- Breathing room — don't crowd elements
```

**Quick colors:**
- Canvas: `#fafafa`
- Surface: `#ffffff`
- Text: `#18181b`
- Muted: `#71717a`
- Brand: `#635bff`
- Border: `#e4e4e7`

**Thay brand color:** Đổi `#635bff` thành màu brand của project. Cập nhật `--color-brand-light` thành tint 10% của màu đó.
