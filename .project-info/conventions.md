# Code & Process Conventions

## Naming Conventions

**Files & Directories** (kebab-case):
```
scripts/design-search.js
.claude/agents/pm.md
.project-manager/tasks/in-progress.md
```

**Configuration Files**:
- `*.md`: Markdown documentation
- `*.json`: JSON config
- `*.js`: JavaScript utilities

**Branches**:
- `main`: Developer (code)
- `business`: Business artifacts (orphan, no code)
- Feature: `feat/[description]`
- Fix: `fix/[description]`

## Git Conventions

**Commit Format** (Conventional Commits):
```
<type>(<scope>): <description>

feat(agents): add solution-architect agent
fix(bootstrap): handle missing remote gracefully
chore(deps): update MCP version
docs(README): add setup instructions
```

Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`

**Rules**:
- No force push to main
- All changes via PR
- At least 1 reviewer approval before merge
- No secrets in commits (.env, API keys)
- Use --no-edit for rebases only when appropriate

## Project Structure Conventions

### .claude/ Organization

```
.claude/
├── agents/              # PM core + role-specific agents
│   ├── pm.md           # [SHARED] Default PM for both roles
│   ├── _roles/
│   │   ├── developer/   # @coder, @explorer, @debugger, @reviewer, etc.
│   │   └── business/    # @gan-generator, @gan-evaluator, etc.
│   
├── commands/            # CLI commands
│   ├── bootstrap.md     # Entry point (shared)
│   ├── dev-bootstrap.md # Developer setup
│   ├── business-bootstrap.md # Business setup
│   ├── _roles/
│   │   ├── developer/   # /commit, /pr, /test, /tdd, etc.
│   │   └── business/    # /design, /dev-feedback, /prp-plan, etc.
│   
├── rules/              # Shared rules (apply to both roles)
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md
│   ├── security.md
│   └── project-manager.md
│   
├── skills/             # Role-specific skills
│   ├── _roles/
│   │   ├── developer/   # orchestrate.md, wrap-up.md, write-tests.md, etc.
│   │   └── business/    # frontend-design/, blueprint/, deploy-to-vercel/
│   
└── settings.json       # Default settings
```

**Activation Rule**:
- Developer: Copy `_roles/developer/*` → `.claude/commands/`, `.claude/agents/`, `.claude/skills/`
- Business: Copy `_roles/business/*` → same locations, use orphan branch

### .project-info/ (Analysis Artifacts)

```
.project-info/
├── user-role.md                    # [GENERATED] Current user role & branch
├── architecture.md                 # [PHASE 1] System design
├── stack.md                        # [PHASE 2] Technology choices
├── conventions.md                  # [PHASE 3] Code patterns (this file)
├── onboarding.md                   # [PHASE 4] Developer onboarding
├── meta.md                         # [PHASE 6] Bootstrap metadata
├── patterns.md                     # [LEARNED] Patterns from code analysis
├── design-data/
│   ├── colors.csv                 # Design tokens
│   ├── typography.csv
│   ├── components.csv
│   └── ux-guidelines.csv
└── conventions/                    # Atomic convention files
    ├── components.md
    ├── hooks.md
    ├── services.md
    ├── testing.md
    └── design.md
```

### .project-manager/ (State & Tracking)

```
.project-manager/
├── status.md                       # Current project status
├── tasks/
│   ├── in-progress.md             # Active tasks with doc refs
│   ├── done.md                    # Completed tasks
│   └── backlog.md                 # Future work
├── sessions/
│   ├── checkpoint.md              # Last saved state
│   └── latest.md                  # Current session notes
├── knowledge/
│   ├── decisions.md               # Architecture decisions (with rationale)
│   ├── blockers.md                # Current blockers & workarounds
│   └── context.md                 # Long-term context
└── logs/
    └── [session logs]
```

## Task Lifecycle Convention

```
1. Business writes spec in docs/ (link to Atlassian)
2. PM assigns → adds to .project-manager/tasks/in-progress.md (with doc ref)
3. Agent executes → updates Progress, Currently fields
4. Complete → moves to .project-manager/tasks/done.md
```

**Task format**:
```markdown
## [TASK-ID] Short name

- **Doc ref:** `docs/file.md` or Atlassian URL
- **Started:** YYYY-MM-DD
- **Agent:** @coder / @explorer / etc.
- **Progress:** 0% → 100%
- **Currently:** What's being done now
- **Files:** Changed files
```

## Anti-Patterns to Avoid

1. **Hardcoding secrets** → Use environment variables or secret manager
2. **Skipping tests** → TDD is mandatory; write tests first
3. **"It works" merges** → PR must have at least 1 approval + all tests pass
4. **Committing console.log** → Remove debug code before commit
5. **Force push to main** → Never; use revert or new PR if needed
6. **Isolated decisions** → Document in knowledge/ with rationale
7. **Outdated .project-manager/status.md** → Update after each milestone

## Review Checklist

Before marking work complete:

- [ ] Code follows conventions (naming, structure, style)
- [ ] No hardcoded secrets or .env in commits
- [ ] Tests written first (TDD), all pass
- [ ] PR description explains WHY
- [ ] At least 1 approval + CI green
- [ ] No console.log or debug code left
- [ ] Task tracking updated (.project-manager/)

## Tools & Commands

**Task Management**:
- MCP Backlog: `backlog mcp start`
- Knowledge Graph: `node scripts/kg.js`

**Development**:
- Git: Follow git-workflow.md
- Tests: Follow testing.md
- Code Style: Follow coding-style.md
