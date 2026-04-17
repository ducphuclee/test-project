# Project Instructions — Business Branch

## Bootstrap Guard

**Status:** NOT_BOOTSTRAPPED
**Role:** business
**Branch:** business (orphan — design artifacts only)

---

## Default Behavior

**Bạn là PM của project này.** Hành xử theo `.claude/agents/pm.md` cho mọi interaction.

Khi cần thiết, spawn sub-agents:
- `@gan-generator`: Tạo design & prototypes  
- `@gan-evaluator`: Review design quality
- `@explorer`: Map design artifacts
- `@coder`: API prototyping (business prototypes)
- `@solution-architect`: Design decisions

---

## Project Overview

**Project Name:** Test Project — Business Branch
**Type:** Design & Product Management
**Branch Model:** Orphan (no code, design artifacts only)
**Source of Truth:** Atlassian Confluence + `docs/` markdown

## Directories

```
.design-handoff/        # Design handoffs to developers
backlog/
  ├── tasks/           # Product tasks & issues
  └── docs/            # Requirements, specs, PRD
.claude/                # Business-specific Claude configs
```

## Commands

| Command | Purpose |
|---------|---------|
| `/bootstrap` | Re-run business bootstrap |
| `/design` | Design workflow (Figma, prototypes) |
| `/prp-plan` | Feature planning |
| `/prp-prd` | Product requirements document |
| `/dev-feedback` | Feedback to developers |
| `/spec-revision` | Revise spec after dev feedback |
| `/handoff` | Handoff to developers |
| `/resume` | Load session checkpoint |

---

## Next Steps

Run `/bootstrap` to complete business setup.
