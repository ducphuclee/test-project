# Developer Onboarding

## Quick Start

1. **Understand the structure**: Read `.project-info/architecture.md`
2. **Know the conventions**: Read `.project-info/conventions.md`
3. **Understand the stack**: Read `.project-info/stack.md`
4. **Setup for development**: Follow setup commands below

## Setup Commands

```bash
# Clone repository
git clone https://github.com/ducphuclee/test-project.git
cd test-project

# Install dependencies (when app code exists)
npm install

# Activate development environment
# Claude will do this automatically during /bootstrap
```

## Project Layout

- `.claude/`: All Claude configurations
- `.project-manager/`: Session state, tasks, knowledge base
- `.project-info/`: Analysis artifacts (architecture, stack, conventions)
- `docs/`: Business documentation
- `scripts/`: Utilities (kg.js for knowledge graph, design-search.js)

## Key Workflows

### Session Start

```bash
/resume          # Load previous session checkpoint
```

### Development Task

```bash
/tdd            # Start TDD workflow
/test           # Run test suite
/pr             # Create pull request
```

### Code Review

```bash
/review         # Review code for quality
```

### Session End

```bash
/handoff        # Save session checkpoint
/learn          # Extract patterns for future reference
```

## Important Directories & Files

| Path | Purpose |
|------|---------|
| `.claude/` | Configuration hub (read often) |
| `.project-info/` | Analysis & metadata (reference only) |
| `.project-manager/` | Session state & task tracking |
| `.project-manager/tasks/in-progress.md` | Active work items |
| `.project-manager/knowledge/decisions.md` | Architecture decisions |
| `docs/` | Business requirements & specifications |

## Common Tasks

### Implement a Feature

1. Ensure spec is in `docs/` (or Atlassian link)
2. Run `/tdd` to start test-first development
3. Write tests → implement → verify
4. Run `/commit` for conventional commits
5. Run `/pr` for pull request

### Fix a Bug

1. Write regression test (reproduce bug)
2. Fix implementation
3. Verify test passes
4. Document in `.project-manager/knowledge/blockers.md` if complex
5. Commit & PR

### Refactor Code

1. Ensure all tests pass before refactoring
2. Make surgical changes (only what's needed)
3. Run full test suite after
4. Follow conventions.md for naming/structure
5. Commit & PR

## Things NOT to Do

- [ ] Don't commit `.env` files (added to .gitignore)
- [ ] Don't commit API keys or secrets
- [ ] Don't skip tests (TDD is mandatory)
- [ ] Don't force push to main
- [ ] Don't leave console.log in production code
- [ ] Don't make changes beyond what's in the spec
- [ ] Don't refactor unrelated code while fixing a bug
- [ ] Don't claim "done" without running tests

## Understanding the Project

This is a **configuration & workflow test project** that validates the Claude ecosystem's developer and business integration.

### Key Points

1. **Dual-role design**: The project supports both developer and business workflows
2. **Source of truth**: Business documentation lives in `docs/` and Atlassian Confluence
3. **Separation**: Developer code on `main` branch, business artifacts on `business` branch (orphan)
4. **Worktree isolation**: `.worktrees/business/` keeps business context separate
5. **Task tracking**: `.project-manager/tasks/` is the execution log

## Knowledge Graph

The project uses a Knowledge Graph (KG) for memory persistence:

```bash
node scripts/kg.js list              # See all entities
node scripts/kg.js context "topic"   # Load context for a topic
node scripts/kg.js add-entity ...    # Add decision/pattern/module
```

This persists learnings across sessions.

## Getting Help

- **Code conventions**: `.claude/rules/coding-style.md`
- **Testing**: `.claude/rules/testing.md`
- **Git workflow**: `.claude/rules/git-workflow.md`
- **Security**: `.claude/rules/security.md`
- **Architecture decisions**: `.project-manager/knowledge/decisions.md`

## Next Steps

1. Read `.project-info/architecture.md` to understand the system
2. Read `.project-info/conventions.md` for coding standards
3. Set your git user: `git config user.name "Your Name"` (if not already set)
4. When ready to work, run `/resume` to load session context
