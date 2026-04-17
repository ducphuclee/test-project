# Technology Stack

## Runtime

- **Primary Language**: JavaScript / Node.js
- **Config Format**: JSON, Markdown, JavaScript

## Key Dependencies & Tools

### MCP (Model Context Protocol) Servers

- **backlog**: Task management via CLI (used by both business & dev)
- **sequential-thinking**: Chain-of-thought reasoning for complex planning
- **playwright**: Browser automation for E2E testing

### Scripting & Utilities

- **kg.js**: Knowledge graph management (entity tracking, observation logging)
- **design-search.js**: Design token search utility
- **Hooks**: Auto-checkpoint, guard-commit, session tracking

### Configuration Files

- **.mcp.json**: MCP server definitions
- **.claude/settings.json**: Claude project settings
- **.claude/settings.local.json**: Local overrides
- **.gitignore**: Git configuration (includes .worktrees/, .project-manager/, kg/)

## Build & Deployment

- **Package Manager**: npm (defined but minimal setup)
- **No build tooling**: Pure configuration project

## Environment

- **.env**: Not yet configured (none in example)
- **Secrets**: Never hardcoded (use ENV_VAR syntax in .mcp.json)

## CI/CD & Git

- **Git Workflow**: Conventional commits, PR-based, no force push to main
- **Remote**: https://github.com/ducphuclee/test-project.git
- **Branch Strategy**: 
  - `main`: Developer code
  - `business`: Design & business artifacts (orphan branch)
  - `.worktrees/business/`: Git worktree for isolated business context

## Documentation

- **Markdown**: Lightweight config documentation
- **Source of Truth**: Atlassian Confluence at https://ipas-tech.atlassian.net/wiki/spaces/SUB/overview
- **Sync**: docs/ folder synced with Confluence, developer reads both

## Project-Specific Setup

No application code yet — this is a configuration & workflow test project.
Future additions may include:
- React/Next.js frontend (proposal-template/ exists as throwaway prototype)
- Node.js backend services
- TypeScript for type safety
