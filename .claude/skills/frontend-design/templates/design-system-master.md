# Design System: [Project Name]

> Source of truth cho ngôn ngữ thiết kế của project.
> Mọi design decision phải reference file này.
> Last Updated: [date]

---

## Product Identity

- **Product Type:** [SaaS B2B / SaaS B2C / Dashboard / E-commerce / Marketing / Healthcare / Mobile]
- **Visual Direction:** [Minimal + structured / Friendly + energetic / Bold + memorable / Clean + trustworthy]
- **Dominant Mode:** [Light / Dark]
- **Feeling:** [professional / friendly / bold / calm / premium / playful]

---

## Design Tokens

### Primitive (không dùng trực tiếp trong components)

```css
/* Colors */
--primitive-brand-500: [hex];
--primitive-gray-50: [hex];
--primitive-gray-900: [hex];
--primitive-success: [hex];
--primitive-warning: [hex];
--primitive-error: [hex];

/* Spacing */
--primitive-space-1: 4px;
--primitive-space-2: 8px;
--primitive-space-4: 16px;
--primitive-space-8: 32px;
--primitive-space-16: 64px;
```

### Semantic (dùng trong components)

```css
/* Action */
--color-action-primary: var(--primitive-brand-500);
--color-action-primary-hover: [darker shade];

/* Text */
--color-text-default: var(--primitive-gray-900);
--color-text-muted: [muted hex];
--color-text-inverse: #ffffff;

/* Surface */
--color-bg: var(--primitive-gray-50);
--color-surface: #ffffff;
--color-border: [border hex];

/* Semantic states */
--color-success: var(--primitive-success);
--color-warning: var(--primitive-warning);
--color-error: var(--primitive-error);

/* Spacing */
--space-xs: var(--primitive-space-1);
--space-sm: var(--primitive-space-2);
--space-md: var(--primitive-space-4);
--space-lg: var(--primitive-space-8);
--space-xl: var(--primitive-space-16);
```

---

## Typography

```css
/* Fonts */
--font-display: '[Display Font]', sans-serif;   /* Headings, hero */
--font-body: '[Body Font]', sans-serif;          /* Body text */
--font-mono: '[Mono Font]', monospace;           /* Code, data */

/* Scale */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--text-4xl: 36px;
--text-display: 48px;
```

---

## Motion

```css
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
--easing-default: cubic-bezier(0.4, 0, 0.2, 1);
--easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Design Rules (Non-Negotiable)

1. [Rule 1 — ví dụ: "Không dùng gradient nếu không có lý do cụ thể"]
2. [Rule 2 — ví dụ: "Border radius nhất quán: buttons 6px, cards 12px, pills 999px"]
3. [Rule 3 — ví dụ: "1 accent color duy nhất, không mix accents"]
4. [Rule 4 — ví dụ: "Icon size: 16px inline, 20px standalone, 24px touch target"]

---

## Accessibility Baseline

- Text contrast: ≥ 4.5:1 (AA)
- Focus: visible outline 2px, color `var(--color-action-primary)`, offset 2px
- Touch targets: ≥ 44px
- Platform: [WCAG 2.1 AA / Apple HIG / Material]

---

## Page Overrides

Xem thư mục `design-system/pages/` cho page-specific overrides.
Page rules override global rules khi conflict.
