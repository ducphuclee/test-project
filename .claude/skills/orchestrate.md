---
name: orchestrate
description: Full pipeline orchestration — plan→explore→code→review→test. Use this skill when user chọn full pipeline (option A) cho feature implementation.
origin: project
---

# Skill: Orchestrate (Full Pipeline)

PM đọc skill này khi user chọn full pipeline. Thực hiện từng bước theo thứ tự.

## Bước 0 — Cập nhật task state

Trước khi bắt đầu pipeline, đảm bảo task đã được ghi vào `.project-manager/tasks/in-progress.md` (PM làm ở bước trước). Nếu chưa có → ghi ngay.

---

## Bước 1 — Explore (song song)

Cập nhật in-progress.md: `Phase: explore`, `Progress: 10%`

Spawn các Agent tool calls **đồng thời**:
- `@explorer`: map codebase liên quan đến task
- Đọc `.project-info/architecture.md` nếu tồn tại
- Đọc `.project-info/patterns.md` nếu tồn tại

## Bước 2 — Per-task loop

Cập nhật in-progress.md: `Phase: code`, `Progress: 30%`

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
FAIL (≤3 lần)               PASS
     │                        ▼
     │         ┌──────────────────────────────┐
     │         │  @reviewer — code quality?   │
     │         │    BLOCKER / MAJOR / MINOR   │
     │         └────┬─────────────────────────┘
     │         FAIL (≤3 lần)         PASS
     │              │                  ▼
     ▼              ▼            task tiếp theo
  @coder fix    @coder fix
```

**Quy tắc:**
- Thứ tự bắt buộc: spec compliance TRƯỚC, quality SAU
- Mỗi loại review tối đa 3 vòng fix. Nếu vẫn fail → dừng, báo cáo PM
- Không chuyển task tiếp theo cho đến khi cả hai review PASS

## Bước 3 — Final verify

Cập nhật in-progress.md: `Phase: test`, `Progress: 80%`

Sau khi tất cả tasks xong, spawn **đồng thời**:
- `@reviewer`: final review cross-task consistency
- Bash: chạy test suite (`npm test` hoặc lệnh tương đương trong package.json)

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

## Smart Model Routing

| Agent | Model | Lý do |
|-------|-------|-------|
| @explorer | Haiku | Chỉ đọc, không cần mạnh |
| @coder | Sonnet | Balance quality/cost |
| @spec-reviewer | Sonnet | So sánh spec vs code |
| @reviewer | Sonnet | Analysis vừa đủ |
| @debugger | Opus | Root cause cần deep reasoning |
