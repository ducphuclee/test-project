# Coding Style

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate existing ones:
- Return new copies instead of modifying in place
- Use spread operator, `Object.assign`, or equivalent immutable patterns
- Rationale: prevents hidden side effects, easier debugging, safe concurrency

## Core Principles

- **KISS** — simplest solution that works; optimize for clarity over cleverness
- **DRY** — extract repeated logic; introduce abstractions when repetition is real, not speculative
- **YAGNI** — do not build features before they are needed

## Functions

- One function does one thing (Single Responsibility)
- Pure functions when possible — avoid hidden side effects
- Names describe intent: `getUserById`, `formatCurrency` — not `process`, `handle`, `do`
- Max ~50 lines; split into focused pieces if larger

## File Organization

- Many small files > few large files
- 200–400 lines typical, 800 max
- Organize by feature/domain, not by type

## Error Handling

- Handle errors explicitly at every level — never swallow silently
- Validate at system boundaries (user input, external APIs, file content)
- Log errors with full context (user id, request id, input params)
- Provide user-friendly messages in UI; detailed logs on server

## Naming

- Variables/functions: `camelCase`
- Booleans: `is`, `has`, `should`, `can` prefixes
- Classes/types/interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case`

## Code Smells to Avoid

- Deep nesting (>4 levels) — use early returns
- Magic numbers — use named constants
- Long functions — split into focused pieces
- No `console.log` in production code

## Checklist Before Marking Work Complete

- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling at boundaries
- [ ] No hardcoded values — use constants or config
- [ ] No mutation — immutable patterns used
- [ ] No `console.log` / debug statements left in

## Project-Specific Overrides

> /bootstrap sẽ thêm vào đây sau khi phân tích codebase.
> Ví dụ: "dùng Zod cho validation", "functional components only", "snake_case for Python"
