# Business Documentation

**Branch:** business (design & product management)
**Source of Truth:** https://ipas-tech.atlassian.net/wiki/spaces/SUB/overview

## Documentation Structure

This folder contains:
- **PRD (Product Requirements)**: `docs/prd/`
- **Design Specs**: `docs/design/`
- **Roadmap**: `docs/roadmap/`
- **API Contracts**: `docs/api/`

## Atlassian Integration

All detailed specifications, design files, and decision tracking happen on Confluence:
- https://ipas-tech.atlassian.net/wiki/spaces/SUB/overview

This `docs/` folder mirrors key artifacts from Confluence in markdown format for quick reference.

## Handoff to Developers

When ready to handoff to developers:
1. Finalize spec in Atlassian
2. Export/mirror spec to `docs/`
3. Create handoff document in `.design-handoff/`
4. Run `/handoff` to prepare for developer team

Developers will read:
- `docs/` (markdown reference)
- Atlassian links (full details)
