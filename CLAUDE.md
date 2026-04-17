# Project Instructions — Business Branch

## Bootstrap Guard

**Status:** BOOTSTRAPPED_BUSINESS
**Role:** business
**Branch:** business (orphan — design artifacts only)
**Bootstrapped:** 2026-04-17 15:05 UTC

---

## Default Behavior

**Bạn là trợ lý của business member.** Hỗ trợ build UI artifacts, prototypes, documents.

Khi cần thiết, spawn sub-agents:
- `@gan-generator`: Tạo design & prototypes  
- `@gan-evaluator`: Review design quality
- `@explorer`: Map design artifacts
- `@coder`: API prototyping, code demonstration
- `@spec-reviewer`: Kiểm tra artifact đúng yêu cầu
- `@solution-architect`: Design decisions phức tạp

---

## Project Overview

**Project Name:** Test Project — Business Branch
**Type:** Design & Product Management
**Branch Model:** Orphan (no code, design artifacts only)
**Source of Truth:** Atlassian Confluence + `docs/` markdown

## Project Structure

```
business (orphan branch)/
├── .design-handoff/     # Design handoffs to developers
├── .claude/             # Business-specific Claude configs
├── .project-manager/    # Session & backlog tracking
├── backlog/
│   ├── tasks/          # Product tasks & issues
│   └── docs/           # Requirements, specs, PRD
├── docs/               # Business documentation
└── CLAUDE.md           # This file
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `/bootstrap` | Re-run business bootstrap or refresh |
| `/business-bootstrap` | Refresh component catalog |
| `/design [mô tả]` | Build UI from component catalog |
| `/design layout` | Change layout/composition |
| `/design theme` | Change visual/colors |
| `/deploy` | Deploy UI to preview |
| `/commit` | Commit + create handoff |
| `/handoff` | Prepare handoff for developers |
| `/prp-prd` | Create product requirements |
| `/prp-plan` | Convert PRD to implementation plan |
| `/dev-feedback` | Send feedback to developers |
| `/spec-revision` | Revise spec based on dev feedback |
| `/resume` | Load previous session |
| `/checkpoint` | Save session state |
| `/learn` | Extract design patterns |

## Agents Available

| Agent | Purpose |
|-------|---------|
| `@explorer` | Find components, understand codebase |
| `@coder` | Build complex artifacts or prototypes |
| `@spec-reviewer` | Verify artifacts match requirements |
| `@gan-generator` | Generate design variations |
| `@gan-evaluator` | Evaluate design quality |
| `@doc-writer` | Write specs, handoff notes |
| `@solution-architect` | Complex product decisions |

## Skills & Resources

| Topic | Resource |
|-------|----------|
| Frontend Design | `.claude/skills/frontend-design/SKILL.md` |
| Design System | `.claude/skills/design-system/SKILL.md` |
| Presentations | `.claude/skills/frontend-slides/SKILL.md` |
| Research | `.claude/skills/deep-research/SKILL.md` |
| Planning | `.claude/skills/blueprint/SKILL.md` |
| Components | `.project-info/component-catalog.md` |

## Next Steps

Design work flow:
1. `/design [mô tả]` — Create UI mockups from catalog
2. `/deploy` — Preview and share
3. `/handoff` — Prepare for developers
4. `/commit` — Commit with handoff notes
