---
name: design-system
description: Use this skill to generate or audit design systems, check visual consistency, and review PRs that touch styling.
origin: ECC
---

# Design System — Generate & Audit Visual Systems

## When to Use

- Starting a new project that needs a design system
- Auditing an existing codebase for visual consistency
- Before a redesign — understand what you have
- When the UI looks "off" but you can't pinpoint why
- Reviewing PRs that touch styling

## How It Works

### Mode 1: Generate Design System

Analyzes your codebase and generates a cohesive design system:

```
1. Scan CSS/Tailwind/styled-components for existing patterns
2. Extract: colors, typography, spacing, border-radius, shadows, breakpoints
3. Research 3 competitor sites for inspiration (via browser MCP)
4. Propose a design token set (JSON + CSS custom properties)
5. Generate DESIGN.md with rationale for each decision
6. Create an interactive HTML preview page (self-contained, no deps)
```

Output: `DESIGN.md` + `design-tokens.json` + `design-preview.html`

### Mode 2: Visual Audit

Scores your UI across 10 dimensions (0-10 each):

```
1. Color consistency — are you using your palette or random hex values?
2. Typography hierarchy — clear h1 > h2 > h3 > body > caption?
3. Spacing rhythm — consistent scale (4px/8px/16px) or arbitrary?
4. Component consistency — do similar elements look similar?
5. Responsive behavior — fluid or broken at breakpoints?
6. Dark mode — complete or half-done?
7. Animation — purposeful or gratuitous?
8. Accessibility — contrast ratios, focus states, touch targets
9. Information density — cluttered or clean?
10. Polish — hover states, transitions, loading states, empty states
```

Each dimension gets a score, specific examples, and a fix with exact file:line.

### Mode 3: AI Slop Detection

Identifies generic AI-generated design patterns:

```
- Gratuitous gradients on everything
- Purple-to-blue defaults
- "Glass morphism" cards with no purpose
- Rounded corners on things that shouldn't be rounded
- Excessive animations on scroll
- Generic hero with centered text over stock gradient
- Sans-serif font stack with no personality
```

## Examples

**Generate for a SaaS app:**
```
/design-system generate --style minimal --palette earth-tones
```

**Audit existing UI:**
```
/design-system audit --url http://localhost:3000 --pages / /pricing /docs
```

**Check for AI slop:**
```
/design-system slop-check
```

### Mode 4: Design Language Lock

Tạo và maintain `design-system/MASTER.md` — single source of truth để giữ ngôn ngữ thiết kế thống nhất.

**Khi nào dùng:**
- Bắt đầu project mới cần design system
- Nhiều pages/screens cần visual consistency
- Team design + dev cần shared reference

**3-layer token architecture** (enforce trong mọi component):
- Primitive tokens → raw values, không dùng trực tiếp
- Semantic tokens → purpose-named, dùng trong components
- Component tokens → component-specific overrides

**Hierarchical page overrides:**
```
design-system/MASTER.md        ← global defaults
design-system/pages/landing.md ← override cho landing page
design-system/pages/dashboard.md ← override cho dashboard
```
Load MASTER.md first → check pages/{page}.md → page rules override global.

**Generate:**
```
/design-system generate → tạo MASTER.md từ design decisions hiện tại
/design-system page [name] → tạo page-specific override template
```
