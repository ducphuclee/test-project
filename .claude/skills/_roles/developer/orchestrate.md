---
name: orchestrate
description: Full pipeline orchestration — plan→explore→code→review→test. Use this skill when user chọn full pipeline (option A) cho feature implementation.
origin: project
---

# Skill: Orchestrate (Full Pipeline)

PM đọc skill này khi user chọn full pipeline. Thực hiện từng bước theo thứ tự.

## Bước 1 — Explore (song song)

Spawn các Agent tool calls **đồng thời**:
- `@explorer`: map codebase liên quan đến task
- Đọc `.project-info/architecture.md` nếu tồn tại
- Đọc `.project-info/patterns.md` nếu tồn tại

## Bước 2 — Per-task loop

Với **mỗi task** trong spec (theo thứ tự, không song song):

```
┌─────────────────────────────────────────────┐
│  @coder — implement task                     │
│    input: spec task + explorer output        │
│           + .project-info/patterns.md        │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│  @spec-reviewer — spec compliance?           │
│    "Code đúng và đủ spec chưa?"             │
└────┬────────────────────────┬───────────────┘
FAIL (≤3 lần)            PASS ✓
     │                        ▼
     │         ┌──────────────────────────────┐
     │         │  @reviewer — code quality?   │
     │         │    BLOCKER / MAJOR / MINOR   │
     │         └────┬─────────────────────────┘
     │         FAIL (≤3 lần)         PASS ✓
     │              │                  ▼
     ▼              ▼       ┌──────────────────────────────┐
  @coder fix    @coder fix  │  Task checkpoint (tự động)   │
  (retry policy)            │  Update in-progress.md:      │
                            │  - task N: ✓ done            │
                            │  - task N+1: current         │
                            └──────────────┬───────────────┘
                                           ▼
                                     task tiếp theo
```

**Quy tắc:**
- Thứ tự bắt buộc: spec compliance TRƯỚC, quality SAU
- Retry theo Retry Policy (T→2T→4T→escalate) trong pm.md — không retry với cùng input
- Không chuyển task tiếp theo cho đến khi cả hai review PASS
- **Per-task checkpoint là bắt buộc** — update in-progress.md ngay sau khi task PASS để resume mid-pipeline không mất progress

## Bước 3 — Final verify

Sau khi tất cả tasks xong, spawn **đồng thời**:
- `@reviewer`: final review cross-task consistency
- Bash: chạy **unit tests** (`npm test` hoặc lệnh tương đương)

Sau khi unit tests pass → chạy **integration tests** tùy loại feature:
- Frontend changes → `npx playwright test`
- Backend/API changes → `bash scripts/test-api.sh` hoặc curl suite tương đương
- Full-stack → chạy cả hai

Nếu fail:
- Spawn `@debugger` với issues cụ thể
- Fix → re-verify
- Tối đa 3 vòng. Nếu vẫn fail → báo cáo user, không tiếp tục

## Bước 4 — Báo cáo

PM tổng hợp kết quả từ tất cả sub-agents, trả về user theo format:

```
## Xong: [Feature/Task]

### Đã implement
- [x] Task 1
- [x] Task 2

### Changes
- `file.ts`: [mô tả]
- `file.test.ts`: [tests]

### Test results
- X tests passed

### Cần chú ý
[Nếu có warning hoặc follow-up]
```

## Model Routing

Model của mỗi agent được định nghĩa trong file agent definition (frontmatter `model:`). Bảng dưới là tham khảo — thay đổi model trong file agent nếu cần:

| Agent | Default model | File |
|-------|--------------|------|
| @explorer | Haiku | `.claude/agents/_roles/developer/explorer.md` |
| @coder | Haiku | `.claude/agents/_roles/developer/coder.md` |
| @spec-reviewer | Sonnet | `.claude/agents/_roles/developer/spec-reviewer.md` |
| @reviewer | Sonnet | `.claude/agents/_roles/developer/reviewer.md` |
| @debugger | Opus | `.claude/agents/_roles/developer/debugger.md` |
