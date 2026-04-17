# Architecture

**Project Type:** Test/Configuration Project
**Pattern:** Tool/Library Configuration
**Architecture:** Modular configuration with role-based separation

---

## Overview

Test project for validating both developer and business workflows in Claude ecosystem.

## Structure

```
test-project/
├── .claude/              # Claude AI configurations
│   ├── agents/          # Agent role definitions (developer, business)
│   ├── commands/        # CLI commands for both roles
│   ├── rules/           # Coding rules, testing, git, security
│   └── skills/          # Role-specific skills and templates
├── .project-info/       # Project metadata and analysis
├── .project-manager/    # Session management and task tracking
├── docs/                # Business documentation & requirements
├── scripts/             # Utility scripts (KG, design search, hooks)
└── .mcp.json           # MCP server configuration
```

## Key Modules

### .claude/ — Configuration Hub
- **agents/**: Developer and business agent definitions
- **commands/**: Orchestration commands for each role
- **rules/**: Shared rules (coding-style, testing, git-workflow, security, project-manager)
- **skills/**: Role-specific skills (orchestrate, wrap-up, bootstrap)

### .project-manager/ — Project State
- **tasks/**: Task tracking (in-progress, done, backlog)
- **sessions/**: Session checkpoints and recovery
- **knowledge/**: Decisions, blockers, context
- **status.md**: Current project status

### docs/ — Business Source of Truth
- Markdown documentation
- Links to Atlassian Confluence (https://ipas-tech.atlassian.net/wiki/spaces/SUB/overview)

## Data Flow

```
User (Developer or Business)
    ↓
/bootstrap (entry command)
    ↓
Role detection → .project-info/user-role.md
    ↓
Developer path:           Business path:
- /dev-bootstrap         - /business-bootstrap
- Analyze codebase       - Setup design handoff
- Extract conventions    - Create backlog structure
- Create .project-info/  - Initialize worktree
    ↓                        ↓
CLAUDE.md updated       CLAUDE.md updated
(Role: developer)       (Role: business)
```

## Entry Points

- **Developer**: `/dev-bootstrap` → analyzes codebase, extracts conventions, populates .project-info/
- **Business**: `/business-bootstrap` → sets up design artifacts, backlog, handoff structure
- **Shared**: `.claude/agents/pm.md` is the PM default for both roles

## External Integrations

- **Atlassian Confluence**: Source of truth for business documentation
- **MCP Servers**: Backlog (task management), Playwright (browser automation), Sequential Thinking
