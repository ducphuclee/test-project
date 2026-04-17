# Git Workflow

## Commit Format (Conventional Commits)

```
<type>(<scope>): <description>

feat(auth): add OAuth2 login
fix(cart): prevent duplicate items
chore(deps): upgrade to Next.js 15
```

Types: `feat` `fix` `chore` `docs` `test` `refactor` `perf` `ci`

Rules:
- Description lowercase, no trailing period
- Scope = module/layer affected
- Body explains WHY if not obvious

## Branch Naming

```
feat/[ticket-id]-short-description
fix/[ticket-id]-short-description
chore/description
docs/description
```

## Pull Request Workflow

1. Analyze full commit history — not just latest commit
2. Use `git diff [base-branch]...HEAD` to see all changes
3. PR title follows Conventional Commits format
4. Description: WHY (motivation) + WHAT (summary)
5. Pass all CI checks before requesting review
6. At least 1 reviewer approval before merge

## Forbidden

- No force push to `main`/`master`
- No direct commits to `main` — always via PR
- No committing `.env` or secrets
- No `--no-verify` to skip hooks

## Checklist Before Creating PR

- [ ] All tests pass locally
- [ ] No debug code or `console.log` left in
- [ ] No secrets or `.env` files staged
- [ ] PR description explains WHY
