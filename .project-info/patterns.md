# Patterns & Learnings

Patterns đã học qua thực tế — đọc trước khi implement để tránh lặp lại sai lầm.

---

## Từ gstack (Garry Tan / YC) — 2026-04-09

Nguồn: Đọc trực tiếp `gstack/ETHOS.md`, `gstack/AGENTS.md`, `gstack/ARCHITECTURE.md`

---

### PATTERN-001: Boil the Lake — Làm phiên bản hoàn chỉnh

**Nguyên tắc:** Khi chi phí AI đã làm cho completeness gần như miễn phí, luôn chọn phiên bản đầy đủ thay vì shortcut.

**Bảng compression ratio (human team vs AI-assisted):**
| Task | Human team | AI-assisted | Compression |
|------|-----------|-------------|-------------|
| Boilerplate | 2 days | 15 min | ~100x |
| Test writing | 1 day | 15 min | ~50x |
| Feature | 1 week | 30 min | ~30x |
| Bug + regression | 4 hours | 15 min | ~20x |
| Architecture | 2 days | 4 hours | ~5x |

**Anti-patterns cần tránh:**
- "Chọn B vì ít code hơn dù A đầy đủ hơn" → nếu A chỉ 70 dòng thêm, chọn A
- "Để tests cho PR sau" → tests là lake dễ boil nhất
- "Cái này sẽ mất 2 tuần" → nên nói "2 tuần human / ~1 giờ AI-assisted"

**Lake vs Ocean:** Lake = boilable (100% test coverage, full feature, all edge cases). Ocean = không boilable (rewrite toàn bộ system, migration nhiều quý). Boil lakes, flag oceans.

---

### PATTERN-002: Search Before Building — 3 tầng kiến thức

**Nguyên tắc:** Trước khi build bất cứ thứ gì liên quan đến unfamiliar patterns — search trước.

**Ba tầng:**
1. **Layer 1 — Tried & True:** Patterns chuẩn, battle-tested. Rủi ro: assume luôn đúng mà không verify.
2. **Layer 2 — New & Popular:** Blog posts, trends. Scrutinize — crowd có thể sai lầm.
3. **Layer 3 — First Principles:** Reasoning từ gốc. Giá trị nhất. Khi Layer 3 mâu thuẫn với Layer 1/2 → đó là "Eureka Moment".

**Eureka Moment:** Tìm được lý do tại sao conventional approach sai → đặt tên cho nó, celebrate, build on it.

---

### PATTERN-003: User Sovereignty — AI recommend, user decide

**Nguyên tắc:** AI models chỉ recommend. User luôn có final say, dù 2 models đồng ý.

**Generation-verification loop:**
```
AI generates → User verifies → User decides → AI executes
```
AI **không bao giờ** skip verification step dù confident.

**Tại sao:** User có context mà models thiếu: domain knowledge, timing, taste, future plans chưa share.

**Anti-patterns:**
- "Cả 2 models đồng ý → chắc đúng → làm luôn" → SAI, vẫn phải hỏi
- "Làm xong rồi báo user" → SAI, phải hỏi trước

---

### PATTERN-004: Persistent Daemon > Per-call Startup

**Nguyên tắc:** Với external systems (browser, DB, APIs), long-lived daemon beats per-call startup.

**gstack browser architecture:**
- First call: ~3s (start Chromium)
- Subsequent calls: ~100-200ms (HTTP POST to daemon)
- Daemon auto-shutdown: 30 min idle
- State file (`.gstack/browse.json`) + Bearer token auth

**Áp dụng cho claude-test:** Khi cần browser automation (QA flow), consider daemon pattern thay vì spawn mới mỗi lần.

---

### PATTERN-005: ARIA Refs > CSS Selectors cho Browser Automation

**Nguyên tắc:** Dùng ARIA accessibility tree + sequential refs (@e1, @e2) thay vì CSS selectors.

**Tại sao không dùng CSS selectors:**
- Brittle — thay đổi theo UI
- Không work với Shadow DOM
- Bị chặn bởi CSP (Content Security Policy)
- Framework reconciliation (React/Vue) có thể strip injected attributes

**Ref system:**
```
snapshot -i → ARIA tree → @e1, @e2, @e3...
click @e3 → Locator → Playwright action
```
Refs auto-invalidate khi navigate → fail fast thay vì click sai element.

---

### PATTERN-006: Preamble as Infrastructure

**Nguyên tắc:** Mỗi skill nên có preamble tự động setup context trước khi chạy logic chính.

**gstack preamble làm 5 việc:**
1. Update check — báo nếu có version mới
2. Session tracking — detect parallel windows, ELI16 mode khi 3+ sessions
3. Learnings retrieval — load project-specific failures từ JSONL
4. AskUserQuestion format — chuẩn hóa: context + question + RECOMMENDATION + options
5. Search Before Building reminder — inject triết lý vào mỗi session

**Áp dụng cho claude-test:** SessionStart hook đã làm việc tương tự. Có thể mở rộng với learnings JSONL.

---

### PATTERN-007: ELI16 Mode — Multi-session Awareness

**Nguyên tắc:** Khi 3+ sessions AI đang chạy song song → mọi câu hỏi phải include context.

**Format:**
```
[PROJECT-NAME] [BRANCH] Câu hỏi cụ thể ở đây?

Các lựa chọn:
- A) ...
- B) ...

RECOMMENDATION: Chọn A vì ___
```

**Tại sao:** User đang juggle nhiều windows, dễ nhầm lẫn "window này đang làm gì".

---

### PATTERN-008: SKILL.md Template + Codegen

**Nguyên tắc:** Docs không được hand-maintain — generate từ source code để không bao giờ stale.

**Flow:**
```
SKILL.md.tmpl (human prose + {{PLACEHOLDERS}})
    ↓
gen-skill-docs.ts (read source → fill placeholders)
    ↓
SKILL.md (committed, auto-generated sections)
    ↓
CI validate: --dry-run + git diff --exit-code
```

**Áp dụng cho claude-test (phase 2):** Tạo `.tmpl` cho các SKILL.md, gen script, CI validation.

---

### PATTERN-009: Operational Learnings — Self-improvement Loop

**Nguyên tắc:** Mỗi skill session tự động log failures → next session load learnings liên quan.

**gstack implementation:**
```bash
# End of skill: log failures
gstack-learnings-log '{"skill":"review","failure":"X","solution":"Y","project":"slug"}'
# → ~/.gstack/projects/{slug}/learnings.jsonl

# Next session preamble: load top 3 relevant
```

**Áp dụng cho claude-test (phase 1):** Tạo `ct-learnings-log` bin, thay thế flat `patterns.md` bằng JSONL searchable.

---

### PATTERN-010: Error Messages for AI Agents

**Nguyên tắc:** Errors phải actionable cho AI agent, không phải chỉ human-readable.

**gstack approach:**
- Thay "Element not found" → "Element not found. Run `snapshot -i` to see available elements."
- Thay "Selector matched multiple" → "Use @refs from `snapshot` instead."
- Timeout → "Navigation timed out after 30s. Page may be slow or URL wrong."

**Áp dụng cho claude-test:** Khi viết error messages trong scripts/hooks, luôn thêm next action suggestion.

---

### PATTERN-011: Skill Routing — Explicit Rules

**Nguyên tắc:** CLAUDE.md nên có routing rules rõ ràng — khi nào invoke skill nào.

**gstack AGENTS.md pattern:**
```
| Skill | What it does |
|-------|-------------|
| /office-hours | Start here. Reframes your product idea before you write code. |
| /debug | Systematic root-cause debugging. No fixes without investigation. |
```

**gstack rule:** "No fixes without investigation" — trước khi fix bug phải qua `/investigate`.

**Áp dụng cho claude-test:** Đã có bảng Agents trong CLAUDE.md. Cần thêm rule tương tự cho `/debugger`.

---

### PATTERN-012: Forcing Questions — Structured Brainstorming

**Nguyên tắc:** Thay vì free-form brainstorm, dùng 6 câu hỏi buộc để clarify thực sự.

**gstack /office-hours 6 questions:**
1. What is the demand? (reality, not hypothesis — cite specific person/example)
2. What's the status quo? (what are they doing today?)
3. Desperate specificity (walk me through a real example, step by step)
4. Narrowest wedge (smallest thing that would help them tomorrow?)
5. What observation did you make? (that nobody else seems to have noticed?)
6. Future-fit (in 12 months, if wildly successful, what changed?)

**Áp dụng cho claude-test:** Bổ sung vào UC-15 PRD flow — thêm forcing questions trước khi generate PRD.

---

## Từ gstack — Cấp 2: Core Skills — 2026-04-09

Nguồn: Đọc trực tiếp `investigate/SKILL.md`, `office-hours/SKILL.md`, `review/SKILL.md`, `retro/SKILL.md`

---

### PATTERN-013: Iron Law — No Fix Without Root Cause

**Nguyên tắc:** Tuyệt đối không được fix bug trước khi xác định root cause.

**gstack investigate flow (5 phases):**
1. **Collect symptoms** — đọc error, stack trace, reproduction steps
2. **Pattern Analysis** — match với 6 known patterns: race condition, nil propagation, state corruption, integration failure, config drift, stale cache
3. **Hypothesis Testing** — verify hypothesis với temp log/assertion trước khi fix
4. **Implementation** — fix root cause, không phải symptom; minimal diff
5. **Verification** — reproduce original bug + confirm fixed + run full test suite

**3-Strike Rule:** 3 hypotheses fail → STOP, escalate với AskUserQuestion.

**Áp dụng cho claude-test:** @debugger agent phải follow iron law — không được propose fix cho đến khi có root cause hypothesis.

---

### PATTERN-014: Scope Lock — Freeze Edits During Debug

**Nguyên tắc:** Sau khi identify root cause, lock edits vào narrowest directory để tránh scope creep.

**gstack freeze mechanism:**
```bash
echo "src/auth/" > ~/.gstack/freeze-dir.txt
# → PreToolUse hook blocks edits outside src/auth/
# → /unfreeze để remove restriction
```

**Tại sao:** Debug sessions hay "drift" — fix một bug thấy bug khác fix luôn. Freeze enforces focus.

**Áp dụng cho claude-test:** Cân nhắc thêm freeze hook vào settings.json khi spawn @debugger.

---

### PATTERN-015: Fix-First Review — AUTO-FIX vs ASK

**Nguyên tắc:** Mọi review finding phải có action — không phải chỉ report.

**gstack /review classification:**
- **AUTO-FIX:** Mechanical issues (unused imports, format, obvious patterns) → apply directly
- **ASK:** Security, logic, architecture changes → batch 3-5 items trong 1 AskUserQuestion

**Output format:**
```
[AUTO-FIXED] app/models/user.rb:42 — SQL injection via string interpolation → parameterized
[P1] (confidence: 9/10) auth.ts:47 — token check returns undefined when session expires
```

**Confidence scoring:** 1-10, suppress findings ≤ 4. Multi-specialist confirmation → boost +1.

**Áp dụng cho claude-test:** @reviewer nên adopt fix-first vs read-only reporting.

---

### PATTERN-016: Specialist Army — Parallel Review Subagents

**Nguyên tắc:** Thay vì 1 agent review tất cả, dispatch specialized parallel subagents.

**gstack review specialists (7 + red team):**
| Specialist | Trigger |
|-----------|---------|
| Testing | Always (50+ lines) |
| Maintainability | Always (50+ lines) |
| Security | Auth scope OR backend > 100 lines |
| Performance | Backend or frontend scope |
| Data Migration | Migrations detected |
| API Contract | API scope |
| Design | Frontend scope |
| Red Team | > 200 lines OR critical finding found |

**Adaptive gating:** Skip specialist với 0 findings in 10+ runs. NEVER skip Security + Data Migration.

**Áp dụng cho claude-test:** @spec-reviewer + @reviewer có thể chia theo specialist domains.

---

### PATTERN-017: Scope Drift Detection — Did They Build What Was Asked?

**Nguyên tắc:** Trước khi review code quality, check: did implementation match stated intent?

**gstack Scope Check output:**
```
Scope Check: DRIFT DETECTED
Intent: add OAuth2 login
Delivered: OAuth2 + refactored entire auth module + added rate limiting
Out-of-scope: 3 files changed unrelated to OAuth
```

**Hai chiều:** SCOPE CREEP (làm thêm không được ask) + MISSING REQUIREMENTS (thiếu item được ask).

**Áp dụng cho claude-test:** @spec-reviewer nên check scope drift trước khi check code quality.

---

### PATTERN-018: Session Detection — 45-Minute Gap Threshold

**Nguyên tắc:** Detect coding sessions từ commit timestamps — gap > 45 phút = new session.

**gstack retro session types:**
- **Deep session** (50+ min): focused work
- **Medium session** (20-50 min): normal work
- **Micro session** (< 20 min): fire-and-forget

**Metrics từ sessions:** Total active coding time, LOC/session-hour, focus score.

**Áp dụng cho claude-test:** /retro skill có thể adapt pattern này cho team analytics.

---

### PATTERN-019: Anti-Sycophancy Rules — Office Hours Mode

**Nguyên tắc:** AI không được agree, hedge, hoặc give generic praise. Phải take a position.

**gstack forbidden phrases:**
- "That's an interesting approach" → SAI
- "There are many ways to think about this" → SAI
- "You might want to consider..." → SAI
- "That could work" → SAI

**Đúng:** Take a position + state what evidence would change your mind.

**gstack 2 modes:**
- **Startup mode:** 6 forcing questions, push for specificity, anti-sycophancy strict
- **Builder mode:** enthusiastic collaborator, generative questions, "what's the coolest version?"

**Áp dụng cho claude-test:** PM (là Claude mặc định) nên adopt anti-sycophancy khi làm office hours với business user.

---

### PATTERN-020: Tweetable Summary — Single-Line Retro Card

**Nguyên tắc:** Mọi retro phải có 1-line shareable summary.

**gstack format:**
```
Week of Mar 1: 47 commits (3 contributors), 3.2k LOC, 38% tests, 12 PRs, peak: 10pm | Streak: 47d
```

**Áp dụng cho claude-test:** /handoff skill output nên include similar tweetable summary của session.

---

## Từ gstack — Cấp 3: Kỹ thuật nâng cao — 2026-04-09

Nguồn: Đọc `BROWSER.md`, `test/helpers/touchfiles.ts`, `DESIGN.md`

---

### PATTERN-021: CLI > MCP cho Browser Automation

**Nguyên tắc:** Compiled CLI binary gọi persistent daemon beats MCP protocol cho local automation.

**Tại sao CLI wins:**
| | MCP (Chrome/Playwright) | gstack browse CLI |
|-|------------------------|-------------------|
| First call | ~5s | ~3s |
| Subsequent | ~2-5s | ~100-200ms |
| Context overhead | 1500-2000 tokens/call | 0 tokens (plain text stdout) |
| In 20-command session | 30-40k tokens wasted | 0 tokens wasted |

**Architecture:**
```
Compiled binary (~1ms startup)
    → HTTP POST (Bearer token)
    → Bun HTTP server (persistent)
    → Playwright API
    → Headless Chromium
```

**State file:** `.gstack/browse.json` (per-project, per-workspace isolation)
**Auto-shutdown:** 30 min idle — transparent restart on next call.

**Áp dụng cho claude-test:** Nếu cần browser automation trong QA flow, dùng daemon pattern thay vì MCP tools.

---

### PATTERN-022: ARIA Refs với Fail-Fast Staleness Detection

**Nguyên tắc:** Accessibility tree refs (@e1, @e2) là stable hơn CSS selectors — nhưng cần active staleness check.

**Ref system flow:**
```
snapshot -i → ariaSnapshot() → assign @e1,@e2,@e3 → store Locator map
click @e3 → resolveRef() → count() check → if 0: fail immediately "re-run snapshot"
```

**Key insight:** SPA (React router, tab switches) mutate DOM mà không navigate. `count()` check takes ~5ms vs Playwright 30s timeout if stale.

**Extended snapshot:**
- `--diff (-D)`: before/after comparison → verify action actually worked
- `--annotate (-a)`: overlay divs showing ref labels → screenshot for debugging
- `--cursor-interactive (-C)`: catch non-ARIA interactables (divs với `cursor:pointer`)

**Batch endpoint:** 50 commands trong 1 HTTP request → 20 pages in ~2-3s vs ~40-100s serial.

**Áp dụng cho claude-test:** Khi build QA automation cho business UI flow.

---

### PATTERN-023: User Handoff — CAPTCHA / MFA Escape Hatch

**Nguyên tắc:** Headless browser gặp CAPTCHA/MFA → chuyển sang headed Chrome preserving ALL state.

**gstack handoff flow:**
```bash
$B handoff "Stuck on CAPTCHA"   # opens visible Chrome, same cookies/tabs
# User solves manually...
$B resume                        # returns to headless with fresh snapshot
```

**Auto-suggest:** Browser tự gợi ý `handoff` sau 3 consecutive failures.
**State preservation:** Cookies, localStorage, tabs — user không cần re-login.

**Áp dụng cho claude-test:** Pattern tốt cho bất kỳ automation nào có auth gate.

---

### PATTERN-024: Diff-Based Test Selection

**Nguyên tắc:** Mỗi test declare files nó phụ thuộc vào. Chỉ chạy tests bị affect bởi git diff.

**gstack touchfiles system:**
```typescript
// Each test declares its dependencies
'review-sql-injection': ['review/**', 'test/fixtures/review-eval-vuln.rb']
'qa-quick': ['qa/**', 'browse/src/**', 'browse/test/test-server.ts']

// Algorithm:
// 1. git diff → changed files
// 2. For each test: any changed file matches patterns? → include
// 3. Global touchfiles (session-runner, eval-store) → trigger ALL tests
```

**Two tiers:**
- **`gate`** — blocks PRs: security guardrails, functional core, deterministic tests
- **`periodic`** — weekly/manual: LLM quality, multi-agent, non-deterministic, Opus-only

**Cost control:** Max ~$3.85/run (E2E) + ~$0.15/run (LLM-judge) — diff selection makes typical runs much cheaper.

**Áp dụng cho claude-test (phase 3):** Implement touchfiles system cho skill validation. Expensive tests chỉ chạy khi relevant files changed.

---

### PATTERN-025: Three-Tier Testing — Skills as Code

**Nguyên tắc:** SKILL.md files là code — phải có automated tests như code.

**gstack 3 tiers:**
1. **Tier 1 — Static validation (free, <1s):**
   - Validate YAML frontmatter (name, version, description required)
   - Check preamble present, Voice section present
   - Structural integrity — không phải correctness

2. **Tier 2 — E2E via `claude -p` (~$3.85/run max, diff-based):**
   - Chạy skill thật với test scenario (planted bugs, fixtures)
   - Check output: did agent use right tool? find the issue? produce correct format?
   - Gate: security guardrails, functional core
   - Periodic: quality benchmarks, non-deterministic tests

3. **Tier 3 — LLM-as-judge (~$0.15/run):**
   - Score output against rubric (1-10)
   - Compare với baseline JSON → fail if score drops
   - Catches degradation in tone, completeness, format

**Generated SKILL.md:** `.tmpl` → `gen-skill-docs.ts` → `SKILL.md` (committed). CI validates: `--dry-run` + `git diff --exit-code`.

**Áp dụng cho claude-test:** Static validation (Tier 1) là dễ nhất để adopt — validate YAML frontmatter và required sections trong SKILL.md files.

---

### PATTERN-026: Design System as Code (DESIGN.md)

**Nguyên tắc:** Design decisions phải được documented trong code — không chỉ trong Figma hay người designer nhớ.

**gstack DESIGN.md structure:**
- Product context (who is it for, what space)
- Aesthetic direction (industrial/utilitarian, decoration level, mood, references)
- Typography (font choices, scale, loading strategy)
- Color (approach, palette với hex codes, dark/light mode)
- Spacing (base unit, density, scale)
- Motion (approach, easing, duration, animated elements)
- Decisions log (date + decision + rationale)

**Key principle:** "The decisions log" — WHY each design decision was made, not just WHAT.

**Áp dụng cho claude-test:** Business role nên maintain `DESIGN.md` trong `business` branch — design decisions persist across sessions.

---

## Từ gstack — Cấp 4: Architecture & Vision — 2026-04-09

Nguồn: `docs/designs/SELF_LEARNING_V0.md`, `docs/designs/SESSION_INTELLIGENCE.md`, `ship/SKILL.md`

---

### PATTERN-027: 4 Persistence Layers — Tách biệt rõ ràng

**Nguyên tắc:** Mỗi loại "memory" phục vụ mục đích khác nhau. Đừng trộn lẫn.

**gstack 4 layers:**
| Layer | File | Câu hỏi trả lời |
|-------|------|----------------|
| **Learnings** | `learnings.jsonl` | Tôi biết gì về codebase này? |
| **Timeline** | `timeline.jsonl` | Chuyện gì đã xảy ra trong project? |
| **Checkpoints** | `checkpoints/*.md` | Tôi đang ở đâu trong công việc? |
| **Health** | `health-history.jsonl` | Code quality tốt đến mức nào? |

**Learnings schema:**
```json
{
  "ts": "2026-03-28T12:00:00Z",
  "skill": "review",
  "type": "pitfall",
  "key": "n-plus-one-activerecord",
  "insight": "Always check includes() for has_many in list endpoints",
  "confidence": 8,
  "source": "observed",
  "files": ["app/models/user.rb"]
}
```

**Confidence decay:** Observed/inferred learnings mất 1pt/30 ngày → tự expire khi stale.

**Áp dụng cho claude-test:** `.project-manager/knowledge/` đang làm role tương tự nhưng với Markdown thay vì JSONL. JSONL searchable và machine-readable hơn.

---

### PATTERN-028: "Missing Piece Is Awareness, Not Storage"

**Nguyên tắc:** Context window là ephemeral. Artifacts on disk là persistent. Vấn đề là agent không biết artifacts tồn tại — không phải là thiếu storage.

**gstack Session Intelligence 5 layers:**
1. **Context Recovery** — preamble list artifacts → read most recent → recover decisions
2. **Session Timeline** — mỗi skill auto-log `{skill, event, branch, outcome}` → JSONL
3. **Cross-Session Injection** — "Last session: implemented JWT auth, 3/5 tasks done" → trước khi đọc bất kỳ file nào
4. **Checkpoint** — manual snapshot: decisions made, files being edited, remaining work
5. **Health** — code quality score (0-10), trend qua thời gian, gate cho /ship

**Compounding effect theo session:**
```
Session 1: /plan produces plan → saved to disk
Session 2: preamble reads plan → agent không hỏi lại quyết định cũ
Session 3: compaction fires mid-refactor → agent reads checkpoint → continues
Session 4: /retro shows timeline: 12 skill runs, health 6→8/10
```

**Áp dụng cho claude-test:** SessionStart hook đã làm Layer 3 cơ bản. Cần thêm Checkpoints (`.project-manager/sessions/`) và Timeline.

---

### PATTERN-029: /autoship — North Star của AI Development

**Nguyên tắc:** Mục tiêu cuối cùng: "Describe a feature. Approve the plan. Everything else is automatic."

**gstack /autoship state machine:**
```
office-hours → autoplan (1 approval gate)
    → BUILD (auto-checkpoint)
    → health check (gate: score >= 7.0)
    → review (ASK items → back to BUILD)
    → QA (bugs found → back to BUILD)
    → ship
    → checkpoint archive (preserve, don't destroy)
```

**Key insight:** /autoship là **resumable state machine**, không phải linear pipeline. Compaction có thể interrupt bất kỳ phase nào — checkpoint recovery sẽ resume tại last completed phase.

**Depends on:** R1 (Learnings) + R2 (Review Army) + R3 (Session Intelligence) + R4 (Adaptive Ceremony). Không thể ship /autoship trước khi có infrastructure.

**Áp dụng cho claude-test:** Demo flow (business → developer) là simplified version của autoship. Learnings từ roadmap này: build infrastructure trước, pipeline sau.

---

### PATTERN-030: Review Readiness Dashboard

**Nguyên tắc:** Trước khi ship, hiển thị rõ status của tất cả reviews — không phải check từng cái một.

**gstack ship dashboard:**
```
+====================================================================+
|                    REVIEW READINESS DASHBOARD                       |
+====================================================================+
| Review          | Runs | Last Run            | Status    | Required |
|-----------------|------|---------------------|-----------|----------|
| Eng Review      |  1   | 2026-03-16 15:00    | CLEAR     | YES      |
| CEO Review      |  0   | —                   | —         | no       |
| Design Review   |  0   | —                   | —         | no       |
+--------------------------------------------------------------------+
| VERDICT: CLEARED                                                    |
+====================================================================+
```

**Tiered requirements:**
- **Eng Review:** Required, gates shipping
- **CEO/Design Review:** Optional, informational
- **Adversarial:** Always-on, automatic (không cần config)
- **Outside Voice:** Optional, never gates

**Re-run idempotency:** Verifications chạy mỗi lần. Actions (version bump, push, PR create) là idempotent — skip nếu đã làm.

**Never stop for:** uncommitted changes, version bump choice, CHANGELOG content, commit messages, multi-file changesets.

**Áp dụng cho claude-test:** `/commit` skill nên có pre-flight checklist tương tự trước khi commit vào `business` branch.

---

## Cấp 5 — Skills hệ thống, Security, Multi-AI (2026-04-09)

Nguồn: gstack skills tiếp theo (learn, checkpoint, health, careful/freeze/guard, canary, qa, autoplan, cso, codex, review/checklist, docs/skills.md, ML_PROMPT_INJECTION_KILLER.md, openclaw/)

---

### PATTERN-031: Hooks System — PreToolUse Intercept

**Nguyên tắc:** Skills có thể đăng ký hooks để intercept tool calls trước khi chúng chạy. Đây là cách gstack implement safety guardrails mà không cần user làm gì.

**3 safety skills dùng hooks:**
- `/careful` — hook vào `Bash`: check destructive patterns (rm -rf, DROP TABLE, force-push, git reset --hard, kubectl delete)
- `/freeze` — hook vào `Edit` + `Write`: block files ngoài freeze directory
- `/guard` — cả hai: `/careful` + `/freeze` kết hợp

**Cấu trúc SKILL.md:**
```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "bash ${CLAUDE_SKILL_DIR}/bin/check-careful.sh"
          statusMessage: "Checking for destructive commands..."
```

**Safe exceptions (careful):** `rm -rf node_modules`, `.next`, `dist`, `__pycache__`, `.cache`, `build`, `.turbo`, `coverage` — không warn về cleanup artifacts.

**Freeze state file:** `/~/.gstack/freeze-dir.txt` — hook reads này on every Edit/Write. `/unfreeze` = delete file. Session-scoped.

**Áp dụng cho claude-test:** Có thể thêm hook kiểm tra không commit trực tiếp vào `main` (enforce qua git workflow rule).

---

### PATTERN-032: Learnings JSONL per-project

**Nguyên tắc:** mọi insight từ session được lưu vào `~/.gstack/projects/$SLUG/learnings.jsonl` — append-only, dedup by latest timestamp.

**Cấu trúc:**
```json
{"skill":"review","type":"pitfall","key":"n-plus-one-billing","insight":"Billing page loads user associations in loop — must add includes(:subscription)","confidence":9,"source":"observed","files":["app/billing.ts"]}
```

**Types:** pattern / pitfall / preference / architecture / tool / operational

**Tự động inject vào skills:** Mỗi skill tìm kiếm learnings liên quan trước khi recommend. Hiển thị: `"Prior learning applied: [key] (confidence N/10, from [date])"` — makes compounding visible.

**Cross-project learnings:** `gstack-config set cross_project_learnings true` — search learnings từ tất cả projects trên machine (useful cho solo developer, skip cho multi-client).

**Commands:** `/learn` (show 20 recent), `/learn search <query>`, `/learn prune` (stale file check + conflict detection), `/learn export` (markdown for CLAUDE.md), `/learn stats`, `/learn add`.

**Áp dụng cho claude-test:** `.project-info/patterns.md` là equivalent — nên có search capability. Consider moving to JSONL format cho machine-readable.

---

### PATTERN-033: Checkpoint Save/Resume

**Nguyên tắc:** Capture full working state (git state + decisions + remaining work) vào file để resume across sessions, context compaction, hoặc branch handoff.

**Checkpoint file format:**
```markdown
---
status: in-progress
branch: feat/auth
timestamp: 2026-03-31T14:30:00-07:00
session_duration_s: 3600
files_modified:
  - src/auth/login.ts
---
## Working on: auth refactor
### Summary
### Decisions Made
### Remaining Work
### Notes (gotchas, blocked items, open questions)
```

**Lưu tại:** `~/.gstack/projects/$SLUG/checkpoints/{TIMESTAMP}-{title-slug}.md` — append-only, không overwrite.

**Cross-branch resume:** Checkpoint ghi branch name trong frontmatter → resume từ bất kỳ branch nào (critical cho Conductor workspace handoffs).

**Proactive suggestion:** `/checkpoint` tự suggest khi session ending, switching context, hoặc trước long break.

**Áp dụng cho claude-test:** `.project-manager/sessions/latest.md` là equivalent. Nên thêm frontmatter với branch + timestamp.

---

### PATTERN-034: Health Dashboard — Weighted Composite Score

**Nguyên tắc:** Code quality không phải 1 metric — là composite của nhiều tools. Track trend over time, không chỉ snapshot.

**Scoring (0-10):**
```
Composite = typecheck(25%) + lint(20%) + test(30%) + deadcode(15%) + shell(10%)
```

**Status labels:** 10=CLEAN, 7-9=WARNING, 4-6=NEEDS WORK, 0-3=CRITICAL

**Trend analysis:** Nếu score drop → identify which categories declined → correlate với tool output → show specific regressions.

**Recommendations by impact:** `weight * (10 - score)` descending — prioritize by actual impact, không phải by severity.

**Read-only:** `/health` KHÔNG fix issues. Chỉ produce dashboard + recommendations. User quyết định action.

**Persist to history:** `~/.gstack/projects/$SLUG/health-history.jsonl` — track trends across PRs.

---

### PATTERN-035: SPAWNED_SESSION Auto-mode

**Nguyên tắc:** Khi Claude Code session được spawn bởi AI orchestrator (OpenClaw), detect via `OPENCLAW_SESSION` env var và adjust behavior.

**Spawned session rules:**
- Do NOT use `AskUserQuestion` for interactive prompts → auto-choose recommended option
- Skip upgrade checks, telemetry prompts, routing injection, lake intro
- Focus on completing task và prose reporting
- End với completion report: "what shipped, decisions made, anything uncertain"

**Detection:** `[ -n "$OPENCLAW_SESSION" ] && echo "SPAWNED_SESSION: true" || true` trong preamble của tất cả skills.

**Pattern áp dụng rộng hơn:** Bất kỳ skill nào được invoke từ automation pipeline nên support "headless mode" — no interactive questions, auto-decide, report-only.

---

### PATTERN-036: OpenClaw Dispatch Routing — 5 Tiers

**Nguyên tắc:** AI orchestrator (OpenClaw) spawn Claude Code sessions với context khác nhau tùy complexity của task.

**5 tiers:**
| Tier | When | Context injected |
|------|------|-----------------|
| **Simple** | <10 lines, single-file | Nothing |
| **Medium** | Multi-file, obvious approach | gstack-lite (5 rules, ~15 lines) |
| **Heavy** | Specific skill needed | "Load gstack. Run /X" |
| **Full** | Feature/objective | gstack-full (autoplan→implement→ship) |
| **Plan** | Design before coding | gstack-plan (office-hours→autoplan→save) |

**gstack-lite (A/B tested: 2x time, meaningfully better output):**
1. Read every file before modifying
2. Before code: state plan (what, why, files, test case, risk)
3. Prefer: completeness, existing patterns, reversible, safe defaults
4. Self-review before reporting done
5. Report: what shipped, decisions, anything uncertain

**Key rule:** "Always spawn, never redirect" — never tell user to open Claude Code.

---

### PATTERN-037: Autoplan — 6 Principles + 3 Decision Types

**Nguyên tắc:** Thay vì làm phiền user 15-30 questions, /autoplan tự quyết dùng 6 principles, chỉ surface "taste decisions" ở final gate.

**6 Decision Principles:**
1. Choose completeness — ship the whole thing
2. Boil lakes — fix everything in blast radius if <1 day CC effort (<5 files, no new infra)
3. Pragmatic — pick the cleaner of two equivalent options (5 seconds choosing, not 5 minutes)
4. DRY — reuse existing, reject duplicates
5. Explicit over clever — 10-line obvious > 200-line abstraction
6. Bias toward action — merge > review cycles > stale deliberation

**3 Decision Types:**
- **Mechanical** — one clearly right answer → auto-decide silently
- **Taste** — reasonable people disagree → auto-decide + surface at final gate
- **User Challenge** — both models recommend user should change direction → NEVER auto-decided

**User Challenge format:** What user said / What both models recommend / Why / What we might be missing / Cost if wrong. User's original direction is the default.

**Sequential MANDATORY:** CEO → Design → Eng → DX. NEVER parallel (each builds on previous).

---

### PATTERN-038: QA Diff-Aware Mode + Auto Regression Tests

**Nguyên tắc:** Trên feature branch, `/qa` không cần URL — tự đọc git diff, identify affected pages, test specifically.

**4 QA modes:**
- **Diff-aware** (auto on feature branches) — reads git diff, tests affected pages
- **Full** — systematic exploration, 5-15 min, 5-10 evidenced issues
- **Quick** (`--quick`) — 30s smoke test, homepage + top 5 nav
- **Regression** (`--regression baseline.json`) — diff against previous baseline

**Auto regression tests:** Khi fix bug + verify, tự generate regression test cho exact scenario. Tests include attribution tracing to QA report.

**Clean tree requirement:** Trước khi QA, check `git status --porcelain`. Nếu dirty → STOP, ask: commit / stash / abort. Lý do: mỗi bug fix cần atomic commit.

**CDP mode:** Nếu browse server connected to real browser → skip cookie prompts (already has auth), skip headless workarounds.

**diff-scoped focus:** `/qa` có thể focus: "test only the billing page" — scoped testing, không phải toàn app.

---

### PATTERN-039: CSO — Infrastructure-First Security Audit

**Nguyên tắc:** Attack surface thật sự không phải là code của bạn — là dependencies, CI/CD, git history, staging servers, webhooks. Start there.

**14 phases (Phase 0-13):**
- **Phase 0:** Architecture mental model (reasoning, not checklist)
- **Phase 1:** Attack surface census (code + infrastructure map)
- **Phase 2:** Secrets archaeology — git history, .env files, CI configs
- **Phase 3:** Dependency supply chain (beyond npm audit)

**Secrets patterns (git history):**
- `AKIA` = AWS keys, `sk-` = OpenAI keys, `ghp_` = GitHub tokens, `xoxb-` = Slack tokens
- `.env` files tracked by git (không gitignored)
- CI config inline secrets (không dùng `${{ secrets.X }}`)

**2 modes:**
- **Daily** (default): 8/10 confidence gate — zero noise
- **Comprehensive** (`--comprehensive`): 2/10 bar — surfaces more, monthly

**Soft gate:** Stack detection → PRIORITY, không phải SCOPE. Luôn có catch-all pass sau targeted scan.

---

### PATTERN-040: Cross-Model Analysis — "Two Doctors, Same Patient"

**Nguyên tắc:** Khi cả Claude (via /review) VÀ Codex (via /codex) đều review cùng branch → cross-model comparison với 3 categories.

**3 categories:**
- **OVERLAP** — cả hai đều catch → high confidence, definitely real
- **UNIQUE TO CODEX** — different perspective, different blind spots
- **UNIQUE TO CLAUDE** — catch những gì Codex miss

**3 Codex modes:**
- **Review** — independent diff review, PASS/FAIL verdict (P1 = FAIL)
- **Challenge** — adversarial, tries to break code, xhigh reasoning effort
- **Consult** — conversation with session continuity, follow-ups reuse context

**Greptile integration:** Auto-triage PR bot comments vào 3 buckets: VALID (fix it), ALREADY-FIXED (auto-reply), FALSE POSITIVE (pushback). History → skip known FPs in future runs.

---

### PATTERN-041: LLM Output Trust Boundary — New Security Category

**Nguyên tắc:** LLM-generated values cần validation trước khi persist vào DB hoặc send qua services. LLM outputs là untrusted input.

**Critical checks (Pass 1 của /review):**
- LLM-generated emails/URLs/names → validate trước khi persist (`EMAIL_REGEXP`, `URI.parse`, `.strip`)
- Structured tool output (arrays, hashes) → type/shape checks trước DB write
- LLM-generated URLs fetched → SSRF risk nếu trỏ vào internal network → cần allowlist
- LLM output vào vector DB → stored prompt injection risk

**Kết hợp với PATTERN-022 (ARIA refs):** Prompt injection trong browser context có thể hijack `$B goto evil.com` — ngay cả browse commands hợp lệ.

**Checklist trước commit (thêm vào security rules):**
- [ ] LLM-generated values được validate tại boundary
- [ ] LLM-generated URLs không fetch trực tiếp — check against allowlist
- [ ] LLM outputs stored ở vector DB đã được sanitize

---

### PATTERN-042: Design Pipeline — shotgun → html

**Nguyên tắc:** Design là iterative pipeline, không phải one-shot generation.

**Pipeline:**
1. `/design-consultation` — tạo DESIGN.md (design system source of truth). Gồm: aesthetic, typography (3+ fonts), color palette (hex values), spacing scale, layout, motion. Proposes "safe choices" AND "risks" — user picks which risks to take.
2. `/design-shotgun` — generate 3 AI design variants, open comparison board in browser, taste memory biases toward preferences across sessions
3. `/design-html` — approved mockup → Pretext-powered HTML (text reflows, heights adjust to content, no static CSS)

**Pretext library** (by Cheng Lou, ex-React core): 15KB, computes text layout without DOM measurement. Text reflows on resize. All sub-millisecond, dynamic.

**Smart API routing trong design-html:** Simple layouts → `prepare()` + `layout()`. Chat UIs → `walkLineRanges()` (tight-fit bubbles). Editorial → `layoutNextLine()`.

**Anti-AI-slop patterns:** "gradient hero, 3-column icon grid, uniform border-radius" = top AI-generated-looking patterns → /design-review sẽ flag.

---

### PATTERN-043: Canary Post-Deploy Monitoring

**Nguyên tắc:** Sau deploy, watch production cho 10 phút. Alert on CHANGES, không phải absolutes. "Don't cry wolf."

**Flow:**
1. `--baseline` trước deploy (capture pre-deploy state)
2. Monitoring loop: every 60s, check pages via browse daemon
3. Alert types: CRITICAL (page load failure), HIGH (new console errors), MEDIUM (2x load time), LOW (new 404s)
4. **2+ consecutive checks** trước khi alert — single transient blip ≠ alert
5. Nếu CRITICAL/HIGH detected → offer: Investigate / Continue / Rollback / Dismiss

**Key principle:** "Alert on changes, not absolutes." Page có 3 console errors từ trước là OK nếu vẫn còn 3. 1 NEW error là alert.

**Baseline update:** Sau healthy deploy → offer update baseline → future deploys compare against new state.

---

### PATTERN-044: Review Checklist — Two-Pass + Specialists Parallel

**Nguyên tắc:** Code review có cấu trúc rõ ràng: Pass 1 (critical), Pass 2 (informational), Specialists (parallel subagents).

**Pass 1 — CRITICAL (chạy trước):**
- SQL & Data Safety (string interpolation, N+1, TOCTOU)
- Race Conditions (read-check-write, find-or-create without unique index)
- LLM Output Trust Boundary (mới — xem PATTERN-041)
- Shell Injection (subprocess với shell=True + f-string)
- Enum & Value Completeness (trace new enum value qua ALL consumers)

**Pass 2 — INFORMATIONAL:**
- Async/Sync mixing, Column/Field Name Safety
- LLM Prompt Issues (0-indexed lists, capability/tool mismatch)
- Completeness Gaps, Time Window Safety, Type Coercion

**Specialists (parallel subagents, KHÔNG phải main checklist):** testing, maintainability, security, performance, data-migration, API contract, red-team.

**Fix-First Heuristic:**
- AUTO-FIX: dead code, N+1 queries, stale comments, magic numbers, version mismatches
- ASK: security, race conditions, design decisions, >20 lines, removing functionality, user-visible behavior

**Suppressions:** "This assertion could be tighter", "Add comment explaining threshold", "Redundant check aids readability" — DO NOT flag these.

---

### PATTERN-045: CEO Review — "Brian Chesky Mode" / 10-Star Product

**Nguyên tắc:** Không implement ticket theo nghĩa đen. Trước tiên hỏi: "What is this product actually for?" — rồi tìm phiên bản tốt hơn 10x.

**Câu hỏi CEO review:**
- "What is the 10-star product hiding inside this request?"
- Ví dụ: "photo upload" → "smart listing creation" (identify product, enrich from web, draft title/description, suggest hero image, detect ugly photos)

**4 modes:**
- **SCOPE EXPANSION** — dream big, propose ambitious version, opt-in per-item
- **SELECTIVE EXPANSION** — hold current scope, surface opportunities neutrally, cherry-pick
- **HOLD SCOPE** — maximum rigor on existing plan, no expansions
- **SCOPE REDUCTION** — minimum viable version, cut the rest

**office-hours kết hợp:** Trước CEO review nên có `/office-hours` — 6 forcing questions để xác định đúng problem trước khi plan.

---

### PATTERN-046: Eng Review — Diagrams Force Hidden Assumptions

**Nguyên tắc:** Forcing LLM vẽ diagrams trước khi code làm lộ ra assumptions mà prose không bao giờ reveal.

**Diagrams cần trong eng review:**
- Architecture diagrams (components, boundaries)
- Sequence diagrams (async flows, API calls)
- State diagrams (status transitions)
- Data-flow diagrams (where input enters, where it exits)
- Test matrices (edge cases table)

**"Make the idea buildable" — không phải make it smaller.** Eng review trả lời:
- Cái gì chạy sync vs async?
- Boundaries giữa app server / storage / external APIs / DB là gì?
- Failure mode: nếu bước X fail, Y có bị corrupt không?
- Retry logic hoạt động thế nào?
- Duplicate jobs được prevent thế nào?

**Plan-to-QA flow:** /plan-eng-review viết test plan artifact → `/qa` pick up tự động — không cần copy-paste.

---

### PATTERN-047: Prompt Injection Defense — 7 Layers

**Nguyên tắc:** Prompt injection CHƯA được giải quyết (academic consensus). Design systems với assumption rằng không filter nào là reliable. Defense-in-depth.

**7 layers (gstack approach):**
| Layer | What | Status |
|-------|------|--------|
| L0 | Default to Opus (harder to manipulate) | Done |
| L1 | XML framing (`<system>` + `<user-message>`, escaped) | Done |
| L2 | DeBERTa WASM classifier (94.8% accuracy, ~50-100ms) | In progress |
| L2b | Regex patterns (decode base64/URL/HTML trước khi check) | In progress |
| L3 | Page content scan (pre-scan snapshot before prompt) | In progress |
| L4 | Bash command allowlist | Done |
| L5 | Canary tokens (random UUID, kill if leaked in output) | In progress |
| L6 | Transparent blocking (show user what was caught) | In progress |

**Key insight — Decode before checking:** Perplexity BrowseSafe bị bypass 36% với encoding tricks (base64, URL encoding). Solution: normalize → decode all encodings FIRST, then classify.

**Perplexity conclusion:** "LLM-based guardrails cannot be the final line of defense. Need at least one deterministic enforcement layer."

**Meta "Rule of Two":** Agent must satisfy max 2 of {untrusted input, sensitive access, state change}. Design pattern, không phải tool.

**Claude Code auto mode:** input probe (scan tool outputs) + transcript classifier (reasoning-blind) = 0.4% FPR, 5.7% FNR. **Reasoning-blind by design** — prevents self-persuasion attacks.

**Áp dụng cho claude-test:** Security rules của chúng ta thiếu LLM output trust boundary. Thêm vào `.claude/rules/security.md`.

---

## Cấp 6 — CEO/Eng Review Depth, OpenClaw Skills, Specialist Reviews (2026-04-09)

Nguồn: plan-eng-review, plan-ceo-review, openclaw/skills, review/specialists, devex-review, document-release

---

### PATTERN-048: Engineering Manager Cognitive Patterns (15 patterns)

**Nguyên tắc:** Eng review không phải code review — là thinking structure kiểm tra plan trước khi code được viết. 15 cognitive patterns từ Larson, Brooks, Fowler, Google SRE.

**15 patterns:**
1. **Scope Challenge (Step 0)** — "What if we removed this requirement?" before adding complexity
2. **Reversibility Check** — Prefer reversible over irreversible decisions (Bezos two-way door)
3. **Blast Radius** — What breaks if this fails? How many users/systems affected?
4. **Failure Mode Analysis** — If step X fails, does Y get corrupted?
5. **Retry Logic Audit** — Does retry create duplicate jobs? Idempotency check
6. **Sync vs Async Boundary** — What must be sync? What can be async?
7. **Data Consistency** — Distributed system? Eventual vs strong consistency?
8. **Diagram Mandate** — Architecture + sequence + state + data-flow diagrams required. "Diagrams force hidden assumptions into the open"
9. **Test Plan First** — artifact passed to `/qa` automatically — no copy-paste
10. **Prerequisite Skill Offer** — If design gap found, offer `/design-consultation` before eng review
11. **Anti-Skip Rule** — NEVER skip cognitive patterns, even for "simple" plans
12. **Priority Hierarchy** — Safety > Correctness > Security > Reliability > Performance > Maintainability
13. **Brooks' Law Awareness** — Adding people to late project makes it later
14. **Fowler's Refactoring** — Preparatory refactoring before feature work
15. **Google SRE Error Budget** — Explicitly plan for failure tolerance

**Plan-to-QA flow:** `/plan-eng-review` viết test plan artifact → `/qa` pick up tự động.

**Áp dụng cho claude-test:** Khi PM nhận complex task, chạy mental eng review trước khi spawn @coder. Đặc biệt: Scope Challenge + Failure Mode Analysis.

---

### PATTERN-049: CEO "Brian Chesky Mode" — 9 Prime Directives + 18 Cognitive Patterns

**Nguyên tắc:** CEO review = product-level reality check trước khi implement. Không phải "make it smaller" mà "make it buildable AND worth building."

**9 Prime Directives:**
1. "What is this product actually for?" — user intent, not feature spec
2. "What is the 10-star product hiding inside this request?"
3. "Does this exist anywhere already?" — Search Before Building
4. "What would we cut if we had to ship tomorrow?"
5. "What's the riskiest assumption here?"
6. "Who is the user and do they actually want this?"
7. "What does success look like in 3 months?"
8. "What's the simplest version that proves the concept?"
9. "Are we solving the stated problem or the real problem?"

**4 Modes:**
- **Expansion** — Request is too narrow; 10-star product requires more scope
- **Selective** — Some parts yes, some parts no; surgical scope decision
- **Hold Scope** — Plan is right-sized; validate and proceed
- **Reduction** — Request overengineered; cut to MVS (Minimum Viable Scope)

**CEO Cognitive Patterns sample:**
- "Is this a vitamin or a painkiller?"
- "What's the distribution strategy, not just the product?"
- "What does the user do right before and after this feature?"
- "What's the viral loop?"

**Step 0 (OpenClaw adaptation):** Premise Challenge → Existing Code Leverage → Dream State → Implementation Alternatives. NEVER decide User Challenge items automatically.

**Áp dụng cho claude-test:** PM nên chạy CEO-mode trước khi nhận feature request từ business. Đặc biệt: "What's the riskiest assumption?" và Mode selection.

---

### PATTERN-050: OpenClaw Office Hours — Anti-Sycophancy Protocol

**Nguyên tắc:** Office Hours = YC-style brutal honesty session. Không phải validation session. Phase 1 (context gathering) luôn đến trước Phase 2 (advice).

**HARD GATE:** No code, no implementation during office hours. Design docs only.

**Anti-sycophancy rules:**
- Không bao giờ validate assumption mà không probe first
- Không bao giờ agree với plan mà không challenge trước
- Nếu founder sounds confident = tăng skepticism, không giảm
- "Strong opinion loosely held" — change position if given evidence, not social pressure

**Pushback patterns:**
- "That sounds plausible, but have you talked to 10 customers who said that?"
- "You're describing a solution. What's the problem?"
- "If this was so obvious, why hasn't anyone done it?"
- "What would make you abandon this idea?"

**Mode mapping:**
- Startup mode (Phase 2A) — idea validation, market fit, first principles
- Builder mode (Phase 2B) — architecture, implementation approach, scale

**Context Recovery section:** Reads recent artifacts at session start for compaction survival. "Proactive suggestion: Prior learning applied: [key]" khi past insight matched.

**Áp dụng cho claude-test:** PM khi nhận business request nên challenge assumption trước khi spawn @solution-architect. Đặc biệt với "this is obviously needed" claims.

---

### PATTERN-051: Red-Team Specialist — Adversarial Review

**Nguyên tắc:** Red-team chạy SAU tất cả specialists khác. Nhiệm vụ: tìm những gì specialists MISSED. Adversarial mindset — không constructive, không balanced.

**Trigger:** diff >200 lines OR security specialist tìm CRITICAL finding.

**5 attack angles:**
1. **Happy Path Attack** — Code chỉ được test với happy path? Find the unhappy paths
2. **Silent Failure Hunt** — Errors swallowed, logged without alerting, wrong HTTP status codes
3. **Trust Assumption Exploit** — What's assumed to be trusted that shouldn't be?
4. **Edge Case Breaking** — Empty arrays, null inputs, max integers, concurrent writes
5. **State Corruption** — Concurrent operations that corrupt shared state

**Red-team output format:**
```json
{"severity":"CRITICAL","confidence":8,"category":"red-team","summary":"...","specialist":"red-team"}
```

**Philosophy:** "I am not here to be fair. I am here to find what breaks before your users do."

**Áp dụng cho claude-test:** Sau @reviewer pass, nếu diff >200 lines, spawn thêm một adversarial review pass trên security + edge cases.

---

### PATTERN-052: Security Specialist Checklist — 7 Categories Beyond Main Pass

**Nguyên tắc:** Main review pass covers SQL injection, race conditions, LLM trust, enum completeness. Security specialist goes deeper — auth/authz patterns, crypto misuse, attack surface expansion.

**Trigger:** SCOPE_AUTH=true OR (SCOPE_BACKEND=true AND diff >100 lines).

**7 categories:**
1. **Input Validation at Trust Boundaries** — controller/handler level, query params, file uploads, webhook signature
2. **Auth & Authorization Bypass** — missing auth middleware, default-allow authz, role escalation, IDOR, session fixation
3. **Injection Beyond SQL** — command injection, template injection (Jinja2/ERB), LDAP, SSRF, path traversal, header injection
4. **Cryptographic Misuse** — MD5/SHA1 for security, Math.random() for tokens, non-constant-time == on secrets, hardcoded IVs, no salt
5. **Secrets Exposure** — API keys in source, secrets in logs, credentials in URLs, PII plaintext
6. **XSS Escape Hatches** — `.html_safe`/`raw()`, `dangerouslySetInnerHTML`, `v-html`, `|safe`/`mark_safe()`, `innerHTML`
7. **Deserialization** — pickle/Marshal/YAML.load/JSON.parse of executable types from untrusted input

**Key insight:** `Math.random()` for tokens = CRITICAL. Non-constant-time comparison on secrets = timing attack vector.

**Áp dụng cho claude-test:** Thêm categories 3-7 vào `.claude/rules/security.md`. Hiện tại chỉ có SQL injection, XSS, path traversal cơ bản.

---

### PATTERN-053: DevEx Review — Live DX Audit, Not Assumptions

**Nguyên tắc:** DevEx review KHÔNG đọc README và assume it works. Dùng browse tool để actually test developer experience — install, run, use từ zero.

**What live DX audit tests:**
- `git clone` → `npm install` → `npm run dev` — does it actually work?
- Error messages when something goes wrong — helpful or cryptic?
- Time-to-first-success for new developer
- CLI command discoverability
- Documentation accuracy (does example code actually run?)

**DX Hall of Fame examples (positive):**
- `npx create-react-app` — zero config, works immediately
- `stripe listen --forward-to localhost:3000/webhook` — one command, full local dev
- Stripe CLI error: "No such customer" with direct link to dashboard

**DX Hall of Shame examples (negative):**
- Setup requiring 7 environment variables with no defaults
- Docs showing curl examples with placeholder URLs that return 404
- Error: "Invalid configuration" with no indication of which config key

**Measures, doesn't guess.** Report actual times, actual commands run, actual errors seen.

**Áp dụng cho claude-test:** Khi review docs/README, thực sự test các commands. Đừng assume "this looks correct."

---

### PATTERN-054: Document-Release — Post-Ship Doc Workflow

**Nguyên tắc:** Documentation update là phần của ship workflow, không optional. Nhưng phân biệt rõ khi nào dừng để hỏi vs khi nào tự động update.

**NEVER stop for:**
- Factual updates (version numbers, API params, return types)
- Uncommitted changes, version bump choice, CHANGELOG content
- Multi-file changesets khi chỉ update facts

**ALWAYS stop for:**
- Narrative/philosophy changes — user voice, product direction
- Security-related documentation — risk of wrong guidance
- Major architectural changes — may need design review first

**CRITICAL rule:** NEVER use `Write` on CHANGELOG.md — always `Edit` with exact old_string matches. Write overwrites; Edit is surgical.

**Post-ship flow:**
1. Detect what changed (git diff)
2. Identify affected docs (README, API docs, CHANGELOG, migration guides)
3. Auto-update factual sections
4. Flag narrative/security/arch changes for user review
5. Commit doc updates separately from code changes

**Áp dụng cho claude-test:** `/handoff` skill nên include doc update step. Đặc biệt cập nhật `.project-manager/knowledge/` sau mỗi major feature.

---

### PATTERN-055: gstack Testing Architecture — Two-Tier Gate System

**Nguyên tắc:** Tests chia thành 2 tiers: `gate` (CI, blocks merge) và `periodic` (weekly/manual). Diff-based selection: chỉ chạy tests liên quan đến changes.

**Classification rules:**
- `gate` — Safety guardrail, deterministic functional test
- `periodic` — Quality benchmark, Opus model test, non-deterministic, external service (Codex, Gemini)

**Diff-based selection:** `touchfiles.ts` map mỗi test đến set of files. Change to global touchfile (session-runner, eval-store) → trigger ALL tests.

**Cost control:**
- `bun test` — free, <2s (skill validation + browse integration)
- `bun run test:evals` — paid, diff-based, max ~$4/run
- `bun run test:evals:all` — paid, force all, max ~$4/run
- Full E2E suite: 30-45 minutes, 10-15 polling cycles

**Long-running task rule:** NEVER give up during polling. Use `sleep 180 && echo "ready"` + TaskOutput loop every 3 minutes until task finishes.

**E2E fixture rule:** NEVER copy full SKILL.md (1500-2000 lines) into fixtures. Extract only the section the test needs. Context bloat → timeouts + 5-10x slower tests.

**Áp dụng cho claude-test:** Khi setup testing infrastructure, classify tests vào gate/periodic từ đầu. Diff-based selection giúp giảm cost dramatically.

---

### PATTERN-056: SKILL.md.tmpl — Config-Driven Skill Generation

**Nguyên tắc:** SKILL.md files là GENERATED, không edit trực tiếp. Source of truth là `.tmpl` templates + `gen-skill-docs.ts` resolver. Regenerate bằng `bun run gen:skill-docs`.

**Template variables:**
- `{{BASE_BRANCH_DETECT}}` — detect main/master dynamically, không hardcode
- Preamble resolver — injects context recovery, spawned session detection, cross-project learnings
- Design resolver — injects design system context
- Review resolver — injects review checklist

**Merge conflict rule:** NEVER resolve conflicts on generated SKILL.md files by accepting either side. Resolve conflicts on `.tmpl` → run `bun run gen:skill-docs` → stage regenerated files.

**SKILL.md.tmpl writing rules:**
- Use natural language for logic — không dùng shell variables to pass state between blocks
- Each bash block is self-contained — không persist state between blocks
- Express conditionals as English numbered steps, không nested if/elif/else
- Never hardcode branch names

**Analytics tracking:** Mỗi skill bắt đầu với analytics append:
```bash
echo '{"skill":"name","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"..."}' >> ~/.gstack/analytics/skill-usage.jsonl
```

**Áp dụng cho claude-test:** Nếu claude-test build skills system, follow template-first pattern. Generated files = never manually edited.

---

## Cấp 7 — Specialist Checklists, Greptile, DX Standards, Session Intelligence (2026-04-09)

Nguồn: review/specialists/*, review/greptile-triage.md, dx-hall-of-fame.md, SELF_LEARNING_V0.md, SESSION_INTELLIGENCE.md, openclaw skills

---

### PATTERN-057: 5 Always-On Review Specialists

**Nguyên tắc:** Mỗi PR qua ít nhất 2 always-on specialists (testing + maintainability). Conditional specialists chạy dựa theo SCOPE flags.

**Testing Specialist (always-on) — 6 categories:**
1. Missing negative-path tests (error branches, auth denial, guard clauses)
2. Missing edge-case coverage (zero, null, max-int, concurrent access)
3. Test isolation violations (shared mutable state, order-dependent, real network calls)
4. Flaky test patterns (timing assertions, unordered result ordering, unseeded random data)
5. Security enforcement tests missing (unauthorized case, rate limit blocks, malicious input)
6. Coverage gaps (new public methods, changed methods with old behavior only)

**Maintainability Specialist (always-on) — 6 categories:**
1. Dead code & unused imports (variables assigned never read, functions never called)
2. Magic numbers & string coupling (bare literals, hardcoded URLs/ports)
3. Stale comments & docstrings (old behavior after change, completed TODOs)
4. DRY violations (3+ similar lines appearing multiple times)
5. Conditional side effects (branch forgets a side effect, log claims action but conditionally skipped)
6. Module boundary violations (reaching into another module's internals, DB queries in controllers)

**Performance Specialist (SCOPE_BACKEND or SCOPE_FRONTEND) — 7 categories:**
- N+1 queries, missing DB indexes, O(n²) patterns, bundle size, rendering performance, missing pagination, blocking async

**Data Migration Specialist (SCOPE_MIGRATIONS) — critical checks:**
- Reversibility (can rollback without data loss?), data loss risk (dropping columns with data), lock duration (ALTER TABLE without CONCURRENTLY), backfill strategy (NOT NULL without DEFAULT), index creation (without CONCURRENTLY on large tables), multi-phase safety

**API Contract Specialist (SCOPE_API) — breaking changes focus:**
- Removed/renamed fields, required params added, HTTP method changes, versioning strategy, error format consistency, mobile backwards compatibility

**Áp dụng cho claude-test:** Khi @reviewer chạy, mentally apply testing + maintainability checklists. Trước khi commit migration, run data-migration mental checklist.

---

### PATTERN-058: Greptile Triage — Bot Comment Management System

**Nguyên tắc:** Greptile là AI code reviewer. gstack fetches, classifies, và replies to Greptile comments với evidence — 2 tiers based on escalation history.

**4 classifications:**
- VALID & ACTIONABLE — real bug, fix it
- VALID BUT ALREADY FIXED — real issue, identify fixing commit SHA
- FALSE POSITIVE — misunderstands code, flag with evidence
- SUPPRESSED — matches prior false positive in project history

**Tier 1 (first response) — friendly + evidence:**
```
**Fixed** in `<commit-sha>`.
- old line → new line
**Why:** 1-sentence explanation
```

**Tier 2 (re-flagged after prior reply) — firm + overwhelming evidence:**
```
**This has been reviewed and confirmed as [intentional/already-fixed/not-a-bug].**
Evidence chain: 1. ... 2. ... 3. ...
**Suggested re-rank:** This is a `style` issue, not a `security` issue.
```

**History tracking:** `~/.gstack/projects/$SLUG/greptile-history.md` — per-project suppressions. `~/.gstack/greptile-history.md` — global aggregate. Format: `<date> | <repo> | <type:fp|fix|already-fixed> | <file-pattern> | <category>`

**Escalation detection:** Check if prior GStack reply exists before composing. If yes AND Greptile re-flagged → Tier 2. Default to Tier 1 on ambiguity.

**Áp dụng cho claude-test:** Pattern này không trực tiếp applicable nhưng triết lý của nó applicable: track false positives over time, suppress known noise, escalate pushback with evidence.

---

### PATTERN-059: DX Hall of Fame — 8 Passes, Gold Standards

**Nguyên tắc:** DX excellence được đo qua 8 specific passes. Mỗi pass có gold standards thực tế (Stripe, Vercel, etc.) và anti-patterns cụ thể.

**Pass 1 — Getting Started:** Stripe (7 lines → charge a card, pre-filled API keys in docs), Vercel (git push = live site), Clerk (3 JSX components = full auth). Anti: email verification before value, credit card before sandbox, multiple paths (decision fatigue).

**Pass 2 — API/CLI/SDK Design:** Stripe prefixed IDs (`ch_`, `cus_`), idempotency keys, expandable objects. GitHub CLI (auto-detects terminal vs pipe). Anti: chatty API (5 calls for 1 action), implicit failure (200 OK with error in body).

**Pass 3 — Error Messages:**
- Tier 1 (Elm): first person, exact location, suggested fix
- Tier 2 (Rust): error code links, annotated source
- Tier 3 (Stripe API): structured JSON, 5 fields, zero ambiguity
- Formula: What happened + Why + How to fix + Where to learn + Actual values

**Pass 4 — Documentation:** "Docs as product" — ships with feature or feature doesn't ship. Stripe: 3-column layout, API keys injected when logged in, docs affect performance reviews.

**Pass 5 — Upgrade & Migration:** `npx @next/codemod upgrade major` — one command. Every breaking change gets a codemod.

**Pass 6 — Dev Environment:** Bun (100x faster npm install). Speed IS DX. 87 interruptions/day average; 25 min to recover each.

**Claude Code Skill DX Checklist (specific to AI skills):**
- AskUserQuestion: one issue per call, re-ground context
- State storage: global vs per-project vs per-session
- Progressive consent: one-time prompts with marker files
- Auto-upgrade: version check with cache + snooze backoff
- Error recovery: resume from failure, checkpoint-safe
- Bounded autonomy: mandatory escalation for destructive actions

**Áp dụng cho claude-test:** Commands nên fail-fast with clear error messages. AskUserQuestion pattern: one question per call with project context.

---

### PATTERN-060: QA Issue Taxonomy — 7 Categories + Per-Page Checklist

**Nguyên tắc:** QA findings được classify vào 7 categories với 4 severity levels. Mỗi page visit theo 8-step checklist chuẩn.

**4 Severity levels:**
- critical — blocks core workflow, data loss, crashes app
- high — major feature broken, no workaround
- medium — noticeable problems, workaround exists (>5s load, mobile layout broken)
- low — cosmetic (typo, 1px alignment, inconsistent hover)

**7 categories:**
1. Visual/UI — layout breaks, broken images, z-index, animation glitches
2. Functional — broken links, dead buttons, form validation, race conditions
3. UX — confusing nav, missing loading indicators, >500ms without feedback, no confirmation before destructive actions
4. Content — typos, placeholders left in, truncated text, wrong labels
5. Performance — >3s page loads, janky scroll, layout shifts, >50 network requests
6. Console/Errors — JS exceptions, 4xx/5xx, CORS, CSP violations
7. Accessibility — missing alt text, unlabeled inputs, keyboard nav broken, color contrast

**Per-Page Checklist (8 steps):** Visual scan → Interactive elements → Forms → Navigation → States (empty/loading/error/overflow) → Console (`console --errors`) → Responsiveness → Auth boundaries

**Áp dụng cho claude-test:** Khi test UI, follow 8-step checklist. Đặc biệt: test empty state, error state, và auth boundaries thường bị bỏ qua.

---

### PATTERN-061: gstack Self-Learning — 4 State Systems + 7-Release Roadmap

**Nguyên tắc:** gstack là hệ thống học có cấu trúc. 4 state systems riêng biệt, không overlap. Roadmap 7 releases hướng đến "/autoship — one command, full feature."

**4 State Systems (mỗi cái trả lời câu hỏi khác nhau):**
| System | File | What it answers |
|--------|------|-----------------|
| Learnings | `learnings.jsonl` | What do I know? |
| Timeline | `timeline.jsonl` | What happened? |
| Checkpoints | `checkpoints/*.md` | Where am I? |
| Health | `health-history.jsonl` | How good is the code? |

**7-Release Roadmap:**
- R1 "GStack Learns" (SHIPPED) — per-project JSONL learnings, confidence decay
- R2 "Review Army" (SHIPPED) — 7 parallel specialist subagents, JSON findings, PR quality score
- R3 "Session Intelligence" (SHIPPED) — timeline, context recovery, cross-session injection, /checkpoint, /health
- R4 "Adaptive Ceremony" (NOT YET) — trust policy engine, ceremony levels (FULL/STANDARD/FAST), scope-aware trust
- R5 "/autoship" (NOT YET) — resumable state machine, /office-hours → /autoplan → BUILD → /health gate → /review → /qa → /ship
- R6 "Execution Studio" (NOT YET) — swarm orchestration, multi-worktree parallel builds
- R7 "Design & Media" (NOT YET) — Figma sync, feature video recording

**Key insight — Trust never fast-tracks:** migrations, auth changes, new API endpoints, infrastructure. These always get FULL ceremony regardless of trust level.

**Áp dụng cho claude-test:** claude-test đang ở R1 level với patterns.md. Next evolution: timeline.jsonl + context recovery system tương tự gstack.

---

### PATTERN-062: Session Intelligence — 5 Layers, Compounding Effect

**Nguyên tắc:** Context window là ephemeral. Skills produce artifacts that survive on disk. The missing piece là awareness — preamble phải biết artifacts exist và đọc chúng sau compaction.

**5 Layers:**
1. **Context Recovery** (preamble) — check `~/.gstack/projects/$SLUG/` sau compaction, list directory, read most recent files
2. **Session Timeline** (preamble, all skills) — mỗi skill append JSONL entry: timestamp, skill name, branch, outcome
3. **Cross-Session Injection** (preamble) — khi session mới start, in "Last session: ..." với checkpoint link
4. **Checkpoint** (opt-in) — manual snapshot: đang làm gì, files nào, decisions made, còn lại gì
5. **Health** (opt-in) — quality dashboard, composite score, trend tracking

**Compounding effect (ví dụ 5 sessions):**
- S1: /plan-ceo-review → plan saved to disk
- S2: Agent reads plan after preamble → no re-asking decisions
- S3: /checkpoint saves progress → timeline shows history
- S4: Compaction fires mid-refactor → agent re-reads checkpoint → recovers key decisions
- S5: /retro rolls up week → health trend visible

**Distinction from claude-mem:** gstack handles structured skill artifacts (plans, reviews, checklists). claude-mem handles cross-session memory via SQLite. Not overlapping — complementary.

**Áp dụng cho claude-test:** `/resume` skill nên đọc `.project-manager/sessions/latest.md` + `.project-manager/tasks/in-progress.md` để recover context sau compaction. Pattern này đã được implement một phần.

---

### PATTERN-063: OpenClaw Investigate — Iron Law + 3-Strike Rule

**Nguyên tắc:** "No fixes without root cause investigation first." Fixing symptoms → whack-a-mole debugging. Mỗi fix không address root cause → next bug harder.

**4 Phases:**
1. **Root Cause Investigation** — collect symptoms, read code, `git log --oneline -20 -- <files>`, reproduce, check memory. Output: "Root cause hypothesis: [specific, testable claim]"
2. **Pattern Analysis** — match to known patterns: race condition, nil propagation, state corruption, integration failure, configuration drift, stale cache
3. **Hypothesis Testing** — confirm hypothesis with temporary log/assertion. If wrong → back to Phase 1. **3-strike rule:** 3 hypotheses failed → STOP, tell user, offer options
4. **Fix** — implement fix for confirmed root cause

**6 bug patterns:**
- Race condition — intermittent, timing-dependent
- Nil/null propagation — NoMethodError, TypeError
- State corruption — inconsistent data, partial updates
- Integration failure — timeout, unexpected response
- Configuration drift — works locally, fails in staging
- Stale cache — shows old data, fixes on clear

**Recurring bugs in same files = architectural smell**, not coincidence.

**External search:** Sanitize FIRST (strip hostnames, IPs, SQL, customer data), then search error category.

**Áp dụng cho claude-test:** @debugger agent nên follow 4-phase flow. Khi thấy recurring bug, escalate to @solution-architect.

---

### PATTERN-064: OpenClaw Retro — Weekly Engineering Metrics

**Nguyên tắc:** Weekly retro = comprehensive git analysis. Team-aware: identifies current user vs teammates, per-person praise AND growth areas.

**Key metrics computed:**
- Commits to main, contributors, PRs merged, total insertions/deletions
- Test/code ratio (test files changed vs total files changed)
- Hotspot files (most frequently changed = highest maintenance burden)
- Per-author contributions, commit timing (work sessions vs interruptions)
- Compare mode: current window vs prior same-length window

**Midnight-aligned windows:** "7 days" = absolute start date at local midnight. Use `--since="2026-03-11T00:00:00"` for reproducibility.

**Áp dụng cho claude-test:** `/handoff` nên include weekly metrics summary. `/learn` skill đã capture patterns — `/retro` equivalent sẽ aggregate chúng.

---

### PATTERN-065: OpenClaw Full vs Plan Pipelines

**Full pipeline** (implement feature end-to-end):
1. Read CLAUDE.md
2. Run /autoplan (CEO + eng + design review)
3. Implement approved plan
4. Run /ship (PR with tests, changelog, version bump)
5. Report: PR URL, what shipped, decisions made, uncertain items
— No human input until PR ready for review

**Plan pipeline** (design only, no implementation):
1. Read CLAUDE.md
2. Run /office-hours (design doc: problem statement, premises, alternatives)
3. Run /autoplan (full review gauntlet)
4. Save plan to `plans/<project-slug>-plan-<date>.md`
5. Report: plan file path, one-paragraph summary, accepted scope expansions, recommended next step
— NEVER implement. Planning only. Orchestrator persists plan link.

**Distinction:** "Full" = autonomous end-to-end. "Plan" = design artifacts only, orchestrator decides next step.

**Áp dụng cho claude-test:** PM role = "Plan mode" — produce design artifacts, không implement trực tiếp. Spawn @coder = "Full mode" cho implementation.

---

## Cấp 8 — Browser Architecture, Design Shotgun, Design System, Infrastructure (2026-04-09)

Nguồn: BROWSER.md, DESIGN_SHOTGUN.md, SIDEBAR_MESSAGE_FLOW.md, DESIGN.md, CHANGELOG.md, CONTRIBUTING.md

---

### PATTERN-066: gstack Browser Architecture — CLI + Persistent Daemon

**Nguyên tắc:** Browser automation là CLI-based, không phải MCP-based. CLI là thin client. Persistent Bun HTTP server quản lý Chromium. Zero context overhead vs MCP.

**Architecture:**
```
Claude Code → $B <command> → browse CLI → HTTP POST (localhost) → Bun server → Playwright → Chromium
```

**Performance vs MCP:**
- Chrome MCP: ~5s first call, 2-5s subsequent, ~2000 tokens/call overhead
- gstack browse: ~3s first call, **100-200ms** subsequent, **0 tokens** overhead
- 20-command session: MCP burns 30,000-40,000 tokens on protocol; gstack burns zero

**Lifecycle:**
1. First call: CLI checks `.gstack/browse.json` for running server. None → spawns server (3s startup)
2. Subsequent calls: read state file → HTTP POST → response (~100-200ms)
3. Idle shutdown: 30 min no commands → auto-shutdown, clean state file
4. Crash recovery: fail fast (no self-healing), CLI detects dead server → fresh start

**Snapshot system (@ref innovation):**
- `ariaSnapshot()` → YAML accessibility tree → assign @e1, @e2... refs
- Build Playwright Locator per ref via `getByRole` + nth-child
- Later: `click @e3` = lookup Locator → `locator.click()`
- Ref staleness detection: `count()` check before use → fail fast at ~5ms instead of 30s timeout

**Multi-workspace isolation:** Each git repo gets own `.gstack/browse.json`, own Chromium process, own random port. No state sharing.

**Why CLI over MCP:** No protocol overhead, no connection management, no schema. Compiled binary + plain text = simplest possible interface.

**Áp dụng cho claude-test:** Khi cần browser automation (UI testing, scraping), dùng CLI approach. Tránh MCP cho local automation.

---

### PATTERN-067: Design Shotgun — Browser-to-Agent Feedback Loop

**Nguyên tắc:** Design feedback không qua text. Browser = feedback mechanism. User chọn trên comparison board → file-based IPC → agent đọc → proceed hoặc regenerate.

**3 IPC files:**
| File | Means | Agent action |
|------|-------|-------------|
| `feedback.json` | User submitted final choice | Read, proceed |
| `feedback-pending.json` | User wants regeneration | Read, delete, generate new variants, reload board |
| `feedback.json` (round 2+) | Final after iteration | Read, proceed |

**State machine:** SERVING → REGENERATING (on regen request) → RELOADING (agent posts new HTML) → SERVING

**12 edge cases documented:**
1. Zombie Form — board stays open after server exits. Fix: disable all inputs post-submit, show "Return to agent"
2. Dead Server — POST fails. Fix: .catch() shows copyable JSON so user can paste to agent
3. Stale Spinner — progress polling hard 5-min timeout (150 polls × 2s)
4. file:// URL block — never use file://, always HTTP serve board
5. Double-click race — low risk, inputs disabled on first response
6. Port Coordination — agent parses stderr `port=XXXXX`, must remember for /api/reload
7. Feedback File Cleanup — stale `feedback-pending.json` confuses next session
8. Sequential Generate Rule — `$D generate` ONE AT A TIME (API rate limits parallel calls)
9. AskUserQuestion Redundancy — NEVER re-ask preference; read `feedback.json` directly
10. CORS — board is self-contained (base64 images, inline CSS/JS), no external dependencies
11. Large Payload — no size limit but fixed-shape JSON (500B-2KB in practice)
12. fs.writeFileSync Error — no try/catch, server crashes silently if disk full

**Key: Why 127.0.0.1 not localhost:** localhost → IPv6 ::1 on some systems; also sends all dev cookies → HTTP 431 (Bun header size limit)

**Áp dụng cho claude-test:** File-based IPC pattern (feedback.json polling) áp dụng được cho bất kỳ browser-to-agent flow nào.

---

### PATTERN-068: Sidebar Message Flow — 4-Component Architecture

**Nguyên tắc:** Chrome extension sidebar = 4 components: sidepanel.js (Chrome panel) → background.js (service worker) → server.ts (Bun HTTP) → sidebar-agent.ts (Bun process). Queue-based với JSONL file.

**Message flow (user types → Claude responds):**
1. sidepanel.js: render optimistic UI → chrome.runtime.sendMessage
2. background.js: get active tab URL → POST /sidebar-command with Bearer token
3. server.ts: validateAuth → syncTab → pickSidebarModel → append to queue JSONL
4. sidebar-agent.ts: poll every 200ms → read queue → spawn `claude -p` → stream events
5. server.ts: processAgentEvent → chat buffer → on agent_done: process next queued message
6. sidepanel.js: pollChat every 300ms → render new entries → on idle: stop fast poll

**Model routing:**
- Sonnet: deterministic tool calls (click, goto, screenshot, "navigate to X")
- Opus: analysis tasks (what does page say, summarize, find bugs)
- Analysis words override action verbs: `what`, `why`, `how`, `summarize`, `analyze`, `read X and Y`

**Per-tab concurrency:** `processingTabs: Set<number>` prevents duplicate spawns. Two messages same tab = queued sequential. Different tabs = concurrent.

**Auth token flow:** Server starts → generates random UUID → GET /health returns token (no auth) → all components refresh on every health poll (fixes stale token on restart)

**6 known failure modes:** stale auth token, tab ID mismatch, agent not running, agent stale token, queue file missing, optimistic UI blown away.

**Áp dụng cho claude-test:** Pattern: JSONL queue file + polling + optimistic UI áp dụng được cho bất kỳ background agent communication nào.

---

### PATTERN-069: gstack Design System — Industrial/Utilitarian

**Nguyên tắc:** Design system được define trong `DESIGN.md`. Mọi design decision có rationale. Anti-pattern: generic SaaS template. Identity: CLI heritage IS the brand.

**Typography (3 fonts, strict roles):**
- Display/Hero: Satoshi (Black 900/Bold 700) — geometric, distinctive letterforms
- Body/UI: DM Sans (Regular 400, Medium 500, Semibold 600)
- Data/Code/Labels: JetBrains Mono — "the personality font", tabular-nums, prominent (not hidden in code blocks)

**Color (restrained amber):**
- Dark mode primary: amber-500 #F59E0B ("reads as terminal cursor")
- Light mode primary: amber-600 #D97706 (amber-500 too washed against white)
- Neutrals: Cool zinc grays (zinc-50 to zinc-800)
- Surfaces: dark mode #141414 on #0C0C0C base; light mode #FFFFFF on #FAFAF9 base

**Spacing:** 4px base unit. Comfort density — not cramped, not spacious.

**Border radius:** Cards: 12px. Buttons/inputs: 8px. Badges/pills: 9999px (full). Skill bars: 4px.

**Grain texture:** SVG feTurbulence, opacity 0.03 dark/0.02 light. "Prevents generic SaaS sameness."

**Decisions Log format:** Required field in DESIGN.md. Every design decision has: Date | Decision | Rationale. Never make design changes without logging them.

**Áp dụng cho claude-test:** Business role nên maintain `DESIGN.md` với decisions log. Industrial aesthetic (developer tool) ≠ generic SaaS purple-gradient.

---

### PATTERN-070: gstack Browser Data Platform — 6 New Commands (v0.16)

**Nguyên tắc:** gstack browser không chỉ "clicks buttons" — đây là data extraction platform. 6 commands mới biến nó thành scraping tool.

**6 new commands:**
1. `media` — discover every image, video, audio on page. Filter: `--images`, `--videos`, `--audio`. Detects HLS/DASH streams
2. `data` — extract structured data: JSON-LD (prices, recipes, events), Open Graph, Twitter Cards, meta tags. "What used to take 50 lines of DOM scraping"
3. `download` — fetch URL or @ref element using browser session cookies. blob URL via in-page base64. Detects HLS/DASH → tells you to use yt-dlp
4. `scrape` — bulk download all media: `media` discovery + `download` loop + URL dedup + `manifest.json`
5. `archive` — save complete page as MHTML via CDP
6. `scroll --times N` — automated repeated scrolling for infinite feed content loading

**Batch endpoint:** `POST /batch` — 50 commands max in one HTTP request. Eliminates per-command latency for remote agents (each HTTP call costs 2-5s). 20 pages at once: 2-3s total vs ~40-100s serial.

**Network capture:** `network --capture` — intercept API response bodies. Filter by URL pattern (`--filter graphql`). Export as JSONL. 50MB size-capped circular buffer.

**Security principle (v0.16):** Paired agents get full access by default. Trust boundary = pairing ceremony, not per-command scope. BUT: browser-wide destructive commands (stop, restart, disconnect) still require `--control` scope.

**Áp dụng cho claude-test:** Nếu cần scraping, batch commands để tránh latency. `data` command tiết kiệm >50 lines DOM scraping code.

---

### PATTERN-071: gstack Team Mode — Distributed Skill Management

**Nguyên tắc:** Không vendor skills vào repo. Dùng global install + team mode cho auto-update. `./setup --team` = auto-update via SessionStart hook.

**Team mode mechanism:**
- `./setup --team` → registers `SessionStart` hook in `~/.claude/settings.json`
- Hook runs `gstack-session-update` in background (zero latency)
- Throttled to once/hour, network-failure-safe, completely silent
- Auto-updates gstack at start of each Claude Code session

**`gstack-team-init`** — 2 flavors for repo bootstrapping:
- `optional`: gentle CLAUDE.md suggestion, one-time offer per developer
- `required`: CLAUDE.md enforcement + PreToolUse hook that BLOCKS work without gstack installed

**Vendoring deprecated:** Never vendor 342 files into repo. Use global install + `./setup --team` instead.

**Dev mode:** `bin/dev-setup` symlinks working tree into `.claude/skills/` → changes live immediately. `bin/dev-teardown` removes symlinks → back to global install.

**Community PR guardrails (3 categories that need user approval):**
1. ETHOS.md changes — Garry's personal builder philosophy, no external edits
2. Removing/softening promotional material — YC references, founder perspective are intentional
3. Changing Garry's voice — tone, humor, directness are not generic

**gstack-settings-hook:** DRY utility for adding/removing hooks in settings.json. Atomic writes (.tmp + rename) prevent corruption.

**Áp dụng cho claude-test:** Auto-update hook pattern (SessionStart, throttled, silent) = cách tốt để maintain shared tools. PreToolUse hook blocking = cách enforce prerequisites.

---

### PATTERN-072: gstack CHANGELOG Style — User-Facing Release Notes

**Nguyên tắc:** CHANGELOG là FOR USERS, not contributors. Lead with what users can NOW DO. Sell the feature. Never mention internal infrastructure.

**Rules:**
- Lead with user action: "You can now..." not "Refactored the..."
- No jargon: "every question tells you project and branch" not "AskUserQuestion standardized via preamble resolver"
- Put internal changes in "For contributors" section at bottom
- NEVER fold new work into existing CHANGELOG entry that landed on main
- After main merge: bump VERSION above main, create new entry on top

**Branch-scoped versioning:** Every feature branch gets own version bump AND CHANGELOG entry. If main is v0.13.8.0 and branch adds features → bump to v0.13.9.0.

**After CHANGELOG edit:** Immediately run `grep "^## \[" CHANGELOG.md` and verify full version sequence is contiguous with no gaps or duplicates.

**Cookie security fix example (v0.16.1.0):** "Cookie picker no longer leaks the browse server auth token... one-time code exchange with HttpOnly session cookie. The token never appears in HTML, URLs, or browser history. (CVSS 7.8)" — user-facing, specific about impact, credits reporter.

**Áp dụng cho claude-test:** git-workflow.md đã có Conventional Commits. Thêm CHANGELOG style rules này: user-facing language, version contiguity check, contributor section separation.

---

## Cấp 9 — Design Binary, Multi-Host, Browser Vision, Infrastructure Patterns (2026-04-09)

Nguồn: DESIGN_TOOLS_V1.md, GSTACK_BROWSER_V0.md, SLATE_HOST.md, CHROME_VS_CHROMIUM.md, ADDING_A_HOST.md, REMOTE_BROWSER_ACCESS.md, SKILL.md, README.md

---

### PATTERN-073: Design Binary — Stateless CLI + Vision Quality Gate

**Nguyên tắc:** Design binary là stateless CLI (không cần daemon). Session state cho multi-turn iteration = JSON file. Output unit = PNG mockup, không phải text description.

**Architecture (shares browse CLI pattern):**
- Stateless CLI binary: API calls → write PNG to disk
- No daemon, no server, no Chromium — just OpenAI API calls
- Session state: `--session /tmp/design-session-{id}.json` containing `previous_response_id`
- `$D generate`, `$D variants`, `$D iterate`, `$D check`, `$D compare`

**DesignBrief interface:**
```typescript
interface DesignBrief {
  goal, audience, style, elements[], constraints?, reference?, screenType
}
```

**Vision Quality Gate (`$D check`):**
- After generating, pass through GPT-4o vision to check: text readability, layout completeness, visual coherence
- Auto-retry once on failure. Present anyway with warning if still fails
- "Default-on" in design skills: generate mockups unless user says "skip"

**Sequential PNG → HTML wireframe workflow (resolved "opaque raster" fatal flaw):**
1. `$D variants` → explore directions as PNG
2. User picks via comparison board
3. Claude generates HTML wireframe from approved direction
- PNG is for human to say "yes, that's right." HTML is for agent to say "I know how to build this."

**Staggered parallel generation:** Start API calls 1 second apart (not simultaneous) → avoids 5-7 RPM rate limit while still faster than serial.

**Output locations:** Exploration variants → `/tmp/gstack-mockups-{session}/` (ephemeral). Approved finals → `docs/designs/` (checked in). Avoids repo bloat.

**Trust boundary:** Brief text → OpenAI. Screenshots from $B are NOT sent. Brief contains only abstract design descriptions (goal, style, elements), never source code.

**Áp dụng cho claude-test:** Design output = visual artifact, không phải text specification. `DESIGN_SKETCH` HTML wireframe pattern là stepping stone before full mockup pipeline.

---

### PATTERN-074: Multi-Host Architecture — Data-Driven, Zero Code Changes

**Nguyên tắc:** Mỗi AI coding agent là một `HostConfig` object. Generator, setup, uninstall, health checks đều đọc từ configs. Thêm host mới = 1 file + re-export. Zero code changes.

**8 hosts:** claude, codex, factory, kiro, opencode, slate, cursor, openclaw.

**HostConfig fields:**
- `frontmatter.mode`: allowlist (keep only listed) vs denylist (strip listed)
- `frontmatter.descriptionLimit`: 1024 for hosts with limits, null for none
- `pathRewrites`: literal replaceAll on content. Order matters
- `toolRewrites`: rename Claude tool names ("use the Bash tool" → "run this command")
- `suppressedResolvers`: resolver functions that return empty for this host
- `learningsMode`: 'basic' vs full learnings injection
- `adapter`: path to adapter module for complex transformations (e.g., openclaw)

**Adding a new host (6 steps):**
1. Create `hosts/myhost.ts` with HostConfig object
2. Register in `hosts/index.ts`
3. Add to `.gitignore`
4. `bun run gen:skill-docs --host myhost` + verify no path leakage
5. `bun test` — parameterized tests auto-include new host
6. Update README.md

**Slate discovery path:** scans `.slate/skills/`, `.claude/skills/`, `.opencode/skills/`, `.agents/skills/`. Slate already works via `.claude/skills/` fallback — first-class support = reliability + immunity to `SLATE_DISABLE_CLAUDE_CODE_SKILLS` flag.

**Host refactor insight (from Codex review):** Before adding 4th, 5th hosts, refactor to data-driven configs. Per-host if/else branches = maintenance nightmare. Config objects = zero-effort future expansion.

**Áp dụng cho claude-test:** Nếu claude-test muốn support multiple AI agents (Claude Code + OpenClaw + Cursor), use HostConfig pattern. Không duplicate per-agent logic.

---

### PATTERN-075: GStack Browser Vision — AI as Primary Citizen

**Nguyên tắc:** gstack Browser inverts traditional "browser with AI bolted on." Starts with Claude Code as runtime, gives it browser viewport. Agent is primary citizen. Browser is canvas.

**5 phases:**
1. Phase 1 (SHIPPED): macOS .app = Playwright Chromium + extension sidebar. 389MB bundle. Launches in ~5s
2. Phase 2: BoomLooper integration — multi-agent, Docker containers, team visibility
3. Phase 3: Browse binary as MCP tool in BoomLooper. Cross-platform (linux-arm64/x64)
4. Phase 4 (trigger-gated): Chromium fork (Brave `chromium_src` pattern, CC-powered 6-week rebases)
5. Phase 5: Native SwiftUI/AppKit shell (may be superseded by Phase 4)

**9 browser capabilities (vision):**
1. See What You See — accessibility tree, not just pixels
2. Act on What It Sees — click, fill, navigate, multi-step flows
3. Write Code While Browsing — see bug + fix code simultaneously
4. Understand the Whole Stack — console, network, performance, cookies, CSS
5. Workspace Model — browser IS the workspace (not a tab in workspace)
6. Skills as Browser Capabilities — /qa, /design-review, /investigate, /benchmark all become browser-native
7. Design Loop — mockup → review in browser → iterate → approve → generate HTML → preview → ship
8. Security Loop — inject XSS payloads, test CSRF, verify CSP in real browser
9. Monitoring Loop — canary with AI judgment ("does page look right" not just "did it return 200")

**Why not real Chrome:** Chrome blocks `--load-extension` when launched by Playwright (security feature). Playwright's bundled Chromium doesn't have this restriction. Cookie import via `$B cookie-import` instead.

**Competitive position:** Doesn't compete with consumer browsers. Competes with workflow of switching between browser and editor. Goal: make that switch invisible.

**Áp dụng cho claude-test:** Browser integration nên theo pattern "agent as primary citizen." Tools serve agent, không phải ngược lại.

---

### PATTERN-076: Remote Browser Pairing — Secure Token Exchange

**Nguyên tắc:** Browser server có thể share với remote AI agents. Setup key (5 min) → session token (24h). Tab ownership. Admin scope opt-in.

**Connection flow:**
1. User runs `$B pair-agent` → server creates one-time setup key (5 min expiry)
2. User copies instruction block to other agent
3. Remote agent POST /connect with setup key → gets session token
4. Remote agent creates own tab via `newtab`
5. Remote agent browses with session token + tabId

**4 scope tiers:**
- `read`: snapshot, text, html, screenshot, url
- `write`: goto, click, fill, scroll, newtab (default)
- `admin`: eval, js, cookies, storage (opt-in via `--admin`)
- `meta`: diff, frame, responsive, watch

**Tab isolation:** Each agent owns tabs it creates. Read = any agent. Write = owner only. Pre-existing tabs = root-only for writes.

**Security:** Root token never appears in instruction blocks. Tokens revokable: `$B tunnel revoke agent-name`. Admin scope denied by default.

**Same-machine shortcut:** `$B pair-agent --local openclaw` → writes to `~/.openclaw/skills/gstack/browse-remote.json`. No tunnel needed.

**Áp dụng cho claude-test:** Pattern này useful khi muốn test UI từ CI agents hoặc remote Claude Code sessions. Setup key → session token = secure credential delegation pattern.

---

### PATTERN-077: gstack SKILL.md Preamble — Full Context Bootstrap

**Nguyên tắc:** Mỗi skill bắt đầu bằng bash preamble setup tất cả context. Variables loaded once, không repeat. Proactive mode, spawned session, learnings, timeline — tất cả từ preamble.

**Preamble components (theo thứ tự):**
1. Auto-update check (`gstack-update-check`)
2. Session tracking (PPID-based session file, count active sessions)
3. Branch detection (`git branch --show-current`)
4. Config reading: PROACTIVE, SKILL_PREFIX, REPO_MODE, LAKE_INTRO, TELEMETRY
5. Analytics logging: append to skill-usage.jsonl (if telemetry on)
6. Learnings: count + search top 3 relevant
7. Timeline: append start event to timeline.jsonl
8. Routing check: HAS_ROUTING, ROUTING_DECLINED
9. Vendoring detection: VENDORED_GSTACK (real directory vs symlink)
10. Spawned session: SPAWNED_SESSION (`$OPENCLAW_SESSION` env var)

**PROACTIVE mode:** If `false` → don't auto-invoke skills. Say "I think /skillname might help — want me to run it?" and wait. User opted out of proactive behavior.

**SPAWNED_SESSION:** Set by OpenClaw orchestrator. Changes skill behavior to headless mode: no AskUserQuestion, auto-choose recommended options, no telemetry prompts.

**Learnings loading:** If >5 learnings, run `gstack-learnings-search --limit 3` to inject relevant past insights into context.

**Analytics:** Append-only JSONL `skill-usage.jsonl`. Only if telemetry != "off". Format: `{"skill":"name","ts":"...","repo":"..."}`.

**Áp dụng cho claude-test:** `/resume` skill hiện tại nên đọc: git branch, in-progress tasks, recent session. Pattern tương tự preamble của gstack. Cân nhắc thêm SPAWNED_SESSION equivalent.

---

### PATTERN-078: gstack Philosophy — Scale Numbers và Builder Ethos

**Nguyên tắc:** AI-assisted development với right tooling: 10,000-20,000 lines/day, 600,000+ lines in 60 days, 35% tests, part-time while running YC.

**Scale evidence (Garry Tan, 1 person):**
- 60 days: 600,000+ lines production code, 35% tests
- 1 week: 140,751 lines added, 362 commits, ~115K net LOC
- 2026: 1,237 GitHub contributions vs 772 in 2013
- Same person. Different era. Difference = tooling.

**gstack = virtual engineering team, 23 specialists:**
| Role | Skill |
|------|-------|
| CEO | /plan-ceo-review, /office-hours |
| Eng Manager | /plan-eng-review, /autoplan |
| Designer | /design-consultation, /design-shotgun |
| Reviewer | /review |
| QA Lead | /qa |
| Security Officer | /cso |
| Release Engineer | /ship, /land-and-deploy |

**Target audience:** Founders + CEOs who still code, first-time Claude Code users (structured roles > blank prompt), tech leads + staff engineers (rigorous review automation).

**Quick start flow:** /office-hours → /plan-ceo-review → /review → /qa → stop. You'll know if this is for you.

**Core philosophy:** "This is my open source software factory. I use it every day. Sharing it because these tools should be available to everyone."

**Áp dụng cho claude-test:** claude-test đang build tương tự gstack nhưng dual-role (business + developer). Metrics tracking (/retro equivalent) sẽ giúp measure actual output.

---

## Cấp 10 — Ship Workflow, Upgrade Patterns, Performance, Deploy (2026-04-09)

Nguồn: ship/SKILL.md, land-and-deploy, setup-deploy, benchmark, gstack-upgrade, design-html, CONTRIBUTING.md testing

---

### PATTERN-079: /ship — Fully Automated, Non-Interactive Ship Workflow

**Nguyên tắc:** `/ship` là FULLY AUTOMATED. User said `/ship` = DO IT. Không hỏi confirmation. Chỉ stop cho critical blockers.

**ONLY stop for:**
- On base branch (abort immediately)
- Merge conflicts can't be auto-resolved
- In-branch test failures
- ASK items cần user judgment
- MINOR or MAJOR version bump needed (ask)
- Greptile comments cần user decision
- Coverage below threshold (hard gate with override)
- Plan items NOT DONE với no override

**NEVER stop for:**
- Uncommitted changes (always include)
- Version bump choice (auto-pick MICRO/PATCH)
- CHANGELOG content (auto-generate from diff)
- Commit message approval (auto-commit)
- Multi-file changesets (auto-bisect)
- Auto-fixable findings (dead code, N+1, stale comments — fix automatically)

**Idempotency:** Re-running `/ship` = "run whole checklist again." Every verification step runs on every invocation. Only ACTIONS are idempotent (skip push if already pushed, update PR body if PR exists).

**Step flow:** Pre-flight → commit → tests → coverage audit → plan completion → pre-landing review → adversarial review → version bump → push → PR create → TODOS update → document-release

**Platform detection (Step 0):** GitHub vs GitLab vs unknown. Uses `gh pr view` → `gh repo view` → git native fallback → default to `main`.

**Áp dụng cho claude-test:** `/commit` + `/pr` skills nên follow similar "never ask, always do" philosophy cho routine actions. Chỉ pause khi có genuine blocker.

---

### PATTERN-080: /land-and-deploy — Release Engineer, Merge + Verify

**Nguyên tắc:** `/land-and-deploy` picks up where `/ship` left off. `/ship` creates PR. This merges it, waits for deploy, verifies production.

**Platform detection (same as /ship):** github.com URL → GitHub. gitlab URL → GitLab. `gh auth status` / `glab auth status` fallback. Git-native last resort.

**GitLab = STOP:** "GitLab support not yet implemented. Run /ship to create the MR, then merge manually via GitLab web UI." No partial GitLab support.

**Release engineer persona:** "Deployed thousands of times. Know two worst feelings: merge that breaks prod, and merge that sits in queue 45 minutes while you stare at screen."

**Post-deploy verification:** After merge, poll production URL until health check returns new version. Timeout with actionable message. Screenshot evidence in PR body.

**Áp dụng cho claude-test:** `/deploy` skill trong business role nên có similar release engineer persona. Hard stop khi không biết làm, không guess.

---

### PATTERN-081: /setup-deploy — One-Time Platform Detection + CLAUDE.md Persistence

**Nguyên tắc:** Detect deploy platform once, persist to CLAUDE.md. Future `/land-and-deploy` reads CLAUDE.md, skips detection entirely. Platform-agnostic.

**Platform detection heuristics:**
- `fly.toml` → Fly.io
- `render.yaml` → Render
- `vercel.json` or `.vercel/` → Vercel
- `netlify.toml` → Netlify
- `Procfile` → Heroku
- `railway.json`/`railway.toml` → Railway
- `.github/workflows/*.yml` with `deploy|release|production` → GitHub Actions

**Idempotency:** If configuration already exists in CLAUDE.md, show it + ask: A) Reconfigure, B) Edit specific fields, C) Done. If C, stop.

**Principle:** CLAUDE.md = project memory. Runtime config that's discovered once shouldn't be re-discovered every run.

**Áp dụng cho claude-test:** Khi bootstrap phát hiện stack/tools, persist vào CLAUDE.md. Đừng re-detect mỗi session.

---

### PATTERN-082: /benchmark — Performance Regression Detection, 7 Phases

**Nguyên tắc:** Benchmark = detect regressions vs baseline. Không absolute thresholds — relative changes. Thresholds: >50% timing increase OR >500ms absolute = REGRESSION.

**7 phases:**
1. Setup
2. Baseline capture (if no baseline exists)
3. Current measurements
4. Comparison (current vs baseline)
5. Report (table format with Baseline/Current/Delta/Status)
6. Slowest resources (top 10 + recommendations)
7. Performance budget check (industry standard budgets)

**Regression thresholds:**
- Timing: >50% increase OR >500ms absolute → REGRESSION
- Timing: >20% increase → WARNING
- Bundle size: >25% increase → REGRESSION
- Bundle size: >10% increase → WARNING
- Request count: >30% increase → WARNING

**Performance budget (industry standards):**
- FCP < 1.8s, LCP < 2.5s
- Total JS < 500KB, Total CSS < 100KB
- Total Transfer < 2MB, HTTP Requests < 50

**Baseline file:** `.gstack/benchmark-reports/baselines/baseline.json`. Includes: TTFB, FCP, LCP, DOM Interactive, DOM Complete, Full Load, Total Requests, Transfer Size, JS Bundle, CSS Bundle, largest resources.

**Áp dụng cho claude-test:** Performance monitoring sau mỗi major feature. Track JS bundle size và LCP — hai metrics dễ bị inflate.

---

### PATTERN-083: Auto-Upgrade Pattern — Snooze Backoff + Progressive Consent

**Nguyên tắc:** Version check hỏi 1 lần per version. Escalating snooze backoff: 24h → 48h → 1 week. Never ask again option. Auto-upgrade mode (silent).

**4 options khi upgrade available:**
1. "Yes, upgrade now" → proceed
2. "Always keep me up to date" → set `auto_upgrade: true` → proceed
3. "Not now" → snooze with backoff (24h → 48h → 1 week), continue current skill
4. "Never ask again" → set `update_check: false`, continue

**Auto-upgrade mode (`GSTACK_AUTO_UPGRADE=1` or `auto_upgrade: true`):**
- Skip AskUserQuestion
- Log "Auto-upgrading v{old} → v{new}..."
- If `./setup` fails: restore from backup (`.bak` directory), warn user

**Snooze state file:** `~/.gstack/update-snoozed`. Format: `<remote_version> <snooze_level> <timestamp>`. Max level 3 (1 week).

**Principle:** Progressive consent + escalating backoff + explicit opt-out = non-annoying update flow.

**Áp dụng cho claude-test:** SessionStart hook nên check version. Snooze pattern = cách user-friendly để handle "I'll update later."

---

### PATTERN-084: /design-html — Pretext + Design Artifacts as User Data

**Nguyên tắc:** Design artifacts = USER data, không phải project files. Save to `~/.gstack/projects/$SLUG/designs/`, NEVER to `docs/designs/`, `/tmp/`, `.context/`.

**CRITICAL PATH RULE:** Design artifacts persist across branches, conversations, workspaces. Must be in user's global storage, not project-local.

**Pretext-native HTML:** "Text actually works correctly. Not CSS approximations." Text reflows on resize, heights adjust to content, cards size themselves, chat bubbles shrinkwrap, editorial spreads flow around obstacles.

**Design binary availability check (run before every design command):**
```bash
_ROOT=$(git rev-parse --show-toplevel)
D=""
[ -x "$_ROOT/.claude/skills/gstack/design/dist/design" ] && D="..." || D=~/.claude/skills/gstack/design/dist/design
[ -x "$D" ] && echo "DESIGN_READY" || echo "DESIGN_NOT_AVAILABLE"
```
If DESIGN_NOT_AVAILABLE: fall back to DESIGN_SKETCH HTML wireframe. Progressive enhancement.

**Áp dụng cho claude-test:** User-generated artifacts (design decisions, approved mockups) nên save vào user-level storage (~/.project-manager/ equivalent), không vào repo.

---

### PATTERN-085: gstack Test Infrastructure — LLM-as-Judge + Eval Observability

**Nguyên tắc:** 3 test tiers. LLM-as-judge scores generated docs (không phải test code correctness). E2E observability với live dashboard.

**3 tiers:**
1. Static (free, <5s): command validation, SKILL.md correctness, snapshot flags, TODOS-format refs
2. E2E via `claude -p` (~$3.85): full skill execution, streams NDJSON, real-time progress
3. LLM-as-judge (~$0.15): Claude Sonnet scores generated SKILL.md on Clarity/Completeness/Actionability (1-5, threshold ≥4)

**E2E observability artifacts:**
- `e2e-live.json` — heartbeat, current test status (updated per tool call)
- `evals/_partial-e2e.json` — completed tests (survives kills)
- `e2e-runs/{runId}/{test}.ndjson` — raw transcript per test
- `e2e-runs/{runId}/{test}-failure.json` — failure diagnostics

**Eval comparison commands:**
- `bun run eval:list` — list all runs with turns/duration/cost
- `bun run eval:compare` — per-test deltas + AI-generated Takeaway commentary
- `bun run eval:summary` — aggregate stats across all runs

**E2E rules:**
- Gated by `EVALS=1` env var
- Auto-skips if running inside Claude Code (can't nest claude -p)
- API connectivity pre-check before burning budget
- Run from plain terminal, not inside Claude Code

**LLM-as-judge regression test:** Generated docs must score ≥ baseline from `origin/main`. Prevents quality regression.

**Áp dụng cho claude-test:** Skill documentation quality cần systematic evaluation. LLM-as-judge pattern: AI evaluates AI output = scalable quality gate.

---

## Cấp 11 — Safety Mode, Health, Routing, OpenClaw, Review & DX Patterns (2026-04-09)

Nguồn: careful/SKILL.md, freeze/SKILL.md, guard/SKILL.md, checkpoint/SKILL.md, health/SKILL.md, learn/SKILL.md, review/checklist.md, devex-review/SKILL.md, ML_PROMPT_INJECTION_KILLER.md, CONDUCTOR_CHROME_SIDEBAR_INTEGRATION.md, docs/OPENCLAW.md, openclaw/gstack-lite-CLAUDE.md, openclaw/agents-gstack-section.md, openclaw/skills/gstack-openclaw-ceo-review/SKILL.md, openclaw/skills/gstack-openclaw-office-hours/SKILL.md

---

### PATTERN-086: Safety Mode Trinity — /careful, /freeze, /guard

**Nguyên tắc:** 3 safety modes theo escalating protection level. Session-scoped via hooks — tự động kết thúc khi session ends.

**/careful:** Warn before destructive commands. Hooks vào `PreToolUse:Bash`. Patterns: `rm -rf`, `DROP TABLE`, `TRUNCATE`, `git push --force`, `git reset --hard`, `kubectl delete`, `docker rm -f`. Returns `permissionDecision: "ask"` với warning. **Safe exceptions (no warning):** `rm -rf node_modules`, `.next`, `dist`, `__pycache__`, `.cache`, `build`.

**/freeze:** Block edits outside a directory. Hooks vào `PreToolUse:Edit` và `PreToolUse:Write`. Saves freeze path to `${CLAUDE_PLUGIN_DATA:-$HOME/.gstack}/freeze-dir.txt`. Returns `permissionDecision: "deny"` nếu path không bắt đầu bằng freeze dir. **Trailing `/` required** để `/src` không match `/src-old`.

**/guard:** `/careful` + `/freeze` combined. References hook scripts từ sibling directories. Both skills must be installed together.

**Unfreeze:** `/unfreeze` removes state file. Hooks still registered but allow everything since no state file exists.

**Áp dụng cho claude-test:** Implement `/guard` pattern khi làm việc với production data. Hook-based safety tốt hơn manual reminder vì không thể bị forget.

---

### PATTERN-087: /checkpoint — Save/Resume Working State

**Nguyên tắc:** Checkpoint captures git state + decisions made + remaining work. Allows exact pickup across sessions, even across Conductor workspace handoffs between branches.

**Triggers:** "checkpoint", "save progress", "where was I", "resume", "pick up where I left off". **Proactively suggest** when session ending, user switching context, or before long break.

**State stored:** Git commit hash, branch, staged/unstaged changes, decisions made, next steps, files actively edited. Stored in `~/.gstack/projects/$SLUG/checkpoints/`.

**/health:** Code quality dashboard. Wraps project tools (type checker, linter, test runner, dead code detector, shell linter) → weighted composite 0-10 score → tracks trends over time. Asks telemetry + proactive + routing rules (one-time each via state files).

**Skill routing rules (auto-injected once):** When `HAS_ROUTING=no` AND `ROUTING_DECLINED=false` AND `PROACTIVE_PROMPTED=yes`, gstack adds routing section to CLAUDE.md with 12 key routes. Commit included automatically. One-time per project.

```markdown
## Từ superpowers (obra/superpowers) — 2026-04-09

Nguồn: Đọc toàn bộ repo github.com/obra/superpowers

### Brainstorming HARD-GATE

Không implement bất cứ thứ gì trước khi user approve design. Áp dụng cho MỌI yêu cầu.
Flow: Explore context → 1 câu hỏi tại 1 thời điểm → 2-3 approaches với tradeoffs → Present design → User approve → Write spec doc → Spec self-review → User review gate → writing-plans.
Visual companion: Offer browser-based mockup tool khi có visual questions — offer RIÊNG 1 message, không gộp với câu hỏi khác.

### Writing Plans — No Placeholder Rule

Mọi step trong plan phải có code thực tế. KHÔNG chấp nhận:
- "TBD", "TODO", "implement later"
- "Add appropriate error handling" (không có code)
- "Similar to Task N" (phải lặp lại code đầy đủ)
- Steps mô tả cần làm gì mà không có code block

Header bắt buộc: Goal, Architecture, Tech Stack. Mỗi task: Files (create/modify/test), TDD steps (write test → verify fail → implement → verify pass → commit).

### Subagent 4 Statuses

Implementer subagent báo cáo 1 trong 4 trạng thái:
- **DONE**: Proceed to spec review
- **DONE_WITH_CONCERNS**: Đọc concerns trước khi review, address nếu ảnh hưởng correctness
- **NEEDS_CONTEXT**: Cung cấp context còn thiếu, re-dispatch
- **BLOCKED**: Assess: context problem → more context + re-dispatch | cần reasoning → upgrade model | task quá lớn → split | plan sai → escalate to user. KHÔNG retry cùng model mà không thay đổi gì.

### Two-Stage Review Order

Spec compliance TRƯỚC, code quality SAU. KHÔNG bao giờ đảo ngược.
Spec reviewer: Verify by reading code, NOT by trusting implementer's report. "Do NOT trust the report."
Code quality reviewer: Critical/Important/Minor severity. Chỉ dispatch sau khi spec review pass.

### Controller provides full task text

Controller (PM) đọc plan 1 lần, extract TẤT CẢ tasks, cung cấp full text cho từng subagent. Subagent KHÔNG đọc file plan — nhận full text từ controller. Lý do: no file reading overhead + controller curates exactly what context is needed.

### Verification Before Completion — Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```
Gate function: Identify command → Run (fresh, complete) → Read output → Verify → THEN claim.
KHÔNG được nói: "should work", "probably works", "seems correct", "I'm confident".
PHẢI run command trong message đó rồi mới claim.

### Systematic Debugging — 4 phases

Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

Phase 1: Root cause (read errors completely, reproduce, check recent changes, gather evidence at each component boundary, trace data flow)
Phase 2: Pattern analysis (find working examples, compare, identify differences)
Phase 3: Hypothesis (1 specific hypothesis, minimal change to test, verify before continuing)
Phase 4: Fix (failing test first, single fix, verify)

**3-fix rule**: Nếu đã thử 3 fix mà không được → DỪNG. Đây là architectural problem, không phải bug. Hỏi user về architecture trước khi thử fix thứ 4.

Rationalizations thường gặp: "Quick fix for now", "Just try changing X", "I don't fully understand but this might work" → TẤT CẢ đều nghĩa là STOP, return to Phase 1.

### Root Cause Tracing

Trace backwards qua call chain đến original trigger. KHÔNG fix tại symptom point.
Technique: Add instrumentation (console.error với stack trace) tại boundary points, run, analyze.
Sau khi fix tại source: Add defense-in-depth validation tại nhiều layers.

### Dispatching Parallel Agents — Focused Prompts

Mỗi agent: 1 problem domain, scope rõ ràng, all needed context, specific output format, constraints (do NOT change other code).
Kiểm tra trước khi parallel: Failures có truly independent không? Shared state không? Fix 1 cái có thể fix cái khác không?
Sau khi agents return: Review summaries, check for conflicts, run full test suite.

### Finishing a Development Branch — 4 Options

Sau khi implementation complete, present exactly 4 options:
1. Merge locally
2. Push + Create PR
3. Keep branch as-is
4. Discard (yêu cầu type "discard" để confirm)

Verify tests TRƯỚC khi present options. Cleanup worktree chỉ cho options 1 & 4.

### Receiving Code Review — No Performative Agreement

KHÔNG BAO GIỜ: "You're absolutely right!", "Great point!", "Let me implement that now" (before verification).
THAY VÀO ĐÓ: Restate requirement, ask clarifying questions, push back with technical reasoning nếu sai, hoặc just fix it.

Nếu feedback unclear → STOP, clarify ALL items trước khi implement bất cứ cái gì. Items có thể liên quan.
YAGNI check: Grep codebase xem feature có thực sự được dùng không trước khi implement "properly".

### TDD Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```
Viết code trước test → Delete it. Start over. Không có exception.
"Delete means delete" — không giữ làm reference, không "adapt" trong khi viết test.

Watch test FAIL là mandatory — nếu test pass ngay, bạn đang test existing behavior, không phải new behavior.

Rationalizations → tất cả đều sai: "Too simple", "I'll test after", "Already manually tested", "Tests after achieve same goals", "Deleting X hours is wasteful".

### Testing Anti-Patterns

5 anti-patterns cần tránh:
1. **Testing mock behavior** (not real behavior) — test real component instead
2. **Test-only methods in production** — put in test utilities
3. **Mocking without understanding** — understand dependencies first, run with real impl first
4. **Incomplete mocks** — mirror COMPLETE real API structure
5. **Tests as afterthought** — TDD: tests first

Gate: "Am I testing real behavior or mock existence?" → nếu mock existence → STOP.

### Skill CSO (Claude Search Optimization)

description field = "Use when..." + triggering conditions ONLY.
KHÔNG summarize workflow trong description — Claude sẽ follow description thay vì đọc full skill.
Test: "Would Claude follow the description and skip the skill body?" → Nếu yes, description quá detailed.

Skill names: verb-first (condition-based-waiting, not async-test-helpers).
Skill body: Close every loophole explicitly. Build rationalization table. Create red flags list.

### Using Git Worktrees — Priority Order

1. Check `.worktrees/` hoặc `worktrees/` đã tồn tại chưa
2. Check CLAUDE.md có preference không
3. Ask user

Trước khi create project-local worktree: verify `git check-ignore -q .worktrees` → nếu không ignored → add to .gitignore + commit.
Sau khi create: auto-detect setup (npm/cargo/pip/go), run tests để verify clean baseline.

### "your human partner" language

Superpowers dùng "your human partner" thay vì "user" — deliberate, not interchangeable. Emphasizes agent là tool phục vụ human, không phải autonomous actor. Không thay đổi language này trong PRs.

## Skill routing
Key routing rules:
- Bugs, errors → invoke investigate
- Ship, deploy → invoke ship
- QA, test → invoke qa
- Code review → invoke review
- Save progress → invoke checkpoint
- Code quality → invoke health
```

**Áp dụng cho claude-test:** `/resume` skill nên capture git state + decisions từ previous session, không chỉ đọc text notes.

---

### PATTERN-088: /learn Skill — Project Learnings Management

**Nguyên tắc:** `/learn` reviews, searches, prunes, exports what gstack has learned across sessions. Proactively suggest khi user asks "what have we learned", "didn't we fix this before?", "show past patterns".

**Operations:** Review (show recent), search (grep JSONL), prune (remove stale/wrong), export (markdown format). Learnings stored at `~/.gstack/projects/$SLUG/learnings.jsonl`.

**Cross-session injection:** Preamble auto-loads recent learnings (top 3 most relevant via vector search). Count shown: "LEARNINGS: 47 entries loaded". If >5 entries: auto-surface 3 most relevant.

**Vendoring deprecation detection:** If `.claude/skills/gstack/` detected as real directory (not symlink), warn one-time via `~/.gstack/.vendoring-warned-$SLUG` marker file.

**Áp dụng cho claude-test:** `patterns.md` file là equivalent của gstack's `learnings.jsonl`. Nhưng manual. Upgrade path: structured JSONL + search = faster cross-session recall.

---

### PATTERN-089: gstack-lite Planning Discipline

**Nguyên tắc:** 5-step lite discipline injected into spawned sessions. A/B tested: 2x time, meaningfully better output. Tradeoff worth it for multi-file work.

**5 rules:**
1. Read every file you will modify. Understand existing patterns first.
2. Before writing code, state your plan: what, why, which files, test case, risk.
3. When ambiguous: prefer completeness over shortcuts, existing patterns over new ones, reversible choices over irreversible ones, safe defaults over clever ones.
4. Self-review before reporting done. Check: missed files, broken imports, untested paths, style inconsistencies.
5. Report when done: what shipped, what decisions you made, anything uncertain.

**Áp dụng cho claude-test:** Sub-agents nên follow these 5 rules. PM CLAUDE.md instructions của chúng ta đã có một số — nhưng thiếu rule 3 (preference order when ambiguous).

---

### PATTERN-090: OpenClaw Integration — 5-Tier Dispatch Routing

**Nguyên tắc:** gstack integrates với OpenClaw as methodology source, not ported codebase. "The prompt is the bridge. No daemon. No JSON-RPC."

**5 dispatch tiers:**
| Tier | When | Prompt |
|------|------|--------|
| SIMPLE | <10 lines, single file | Just the task |
| MEDIUM | Multi-file, obvious approach | gstack-lite prepended |
| HEAVY | Named skill (/cso, /review, /qa) | "Load gstack. Run /X" |
| FULL | Feature, project, objective | gstack-full pipeline |
| PLAN | Plan without implementing | gstack-plan pipeline |

**Decision heuristic:**
- <10 lines → SIMPLE
- Multi-file but obvious → MEDIUM
- User names specific skill → HEAVY
- "upgrade gstack" → HEAVY with `Run /gstack-upgrade`
- Feature/project/objective → FULL
- User wants to PLAN without implementing → PLAN

**Rules (non-negotiable):**
1. Always spawn, never redirect. Never say "you'll need to open Claude Code"
2. Resolve the repo. Set working directory. If unknown, ask.
3. Autoplan runs end-to-end. User never leaves Telegram/chat.

**CLAUDE.md collision:** APPEND gstack-lite/full as new section. Never replace existing instructions.

**gstack-plan pipeline:** office-hours → autoplan (CEO + eng + design + DX) → save plan file → report back. Persist plan link to memory store. When ready to implement, spawn new FULL session pointing at plan.

**Áp dụng cho claude-test:** CLAUDE.md `/from-handoff` command nên follow same "always spawn, resolve repo, run end-to-end" principles.

---

### PATTERN-091: Pre-Landing Review Checklist — 2-Pass System

**Nguyên tắc:** Two-pass review on `git diff origin/main`. Pass 1 = CRITICAL (block-level), Pass 2 = INFORMATIONAL. Separate specialist categories handled by parallel subagents.

**Pass 1 — CRITICAL (run first):**
- SQL & Data Safety: string interpolation in SQL, TOCTOU races, N+1 queries
- Race Conditions: read-check-write without uniqueness constraint, find-or-create without unique index
- LLM Output Trust Boundary: LLM-generated values written to DB without validation, structured tool output without shape checks, LLM URLs fetched without allowlist (SSRF), stored prompt injection
- Shell Injection: `subprocess.run()` with `shell=True` + f-string interpolation, `eval()`/`exec()` on LLM code
- Enum Completeness: trace new enum value through ALL consumers, check allowlists, check case/if chains

**Pass 2 — INFORMATIONAL:**
- Async/Sync Mixing: sync calls inside `async def`, `time.sleep()` in async
- Column/Field Name Safety: verify column names against actual schema
- LLM Prompt Issues: 0-indexed lists (LLMs return 1-indexed), tools listed but not wired
- Completeness Gaps: partial enum handling, 80% when 100% is achievable in <30min CC time
- Time Window Safety: date-key lookups assuming "today" = 24h
- Type Coercion at Boundaries: numeric vs string crossing JSON boundaries
- Distribution & CI/CD: verify publish workflows, cross-platform matrix

**Fix-First Heuristic:**
- AUTO-FIX: dead code, N+1, stale comments, magic numbers, missing LLM output validation, version mismatches
- ASK: security (auth/XSS/injection), race conditions, design decisions, large fixes (>20 lines), enum completeness, removing functionality

**Suppressions:** harmless redundancy, "add comment to threshold", consistency-only changes, regex edge cases in constrained input, anything already addressed in the diff.

**Áp dụng cho claude-test:** `/review` skill nên use same 2-pass system. Hiện tại chỉ có general review. LLM Output Trust Boundary là pattern mới cần add vào security.md.

---

### PATTERN-092: /devex-review — Live DX Audit

**Nguyên tắc:** DX engineer dogfooding a live product. Not reviewing a plan. Not reading about experience. TESTING it. Use browse tool to navigate docs, try getting started flow, screenshot what developers see.

**8 DX First Principles (laws — every recommendation traces back to one):**
1. Zero friction at T0: first 5 minutes decide everything. Hello world without docs.
2. Incremental steps: never force understanding of whole system before getting value from one part
3. Learn by doing: playgrounds, copy-paste code that works in context
4. Decide for me, let me override: opinionated defaults + escape hatches
5. Fight uncertainty: what to do next, whether it worked, how to fix it. Every error = problem + cause + fix
6. Show code in context: real auth, real error handling, real deployment. Not hello world lies.
7. Speed is a feature: response times, build times, lines of code, concepts to learn
8. Magical moments: Stripe's instant API response. Vercel's push-to-deploy. Find yours.

**7 DX Characteristics (gold standard references):**
| # | Characteristic | Gold Standard |
|---|---------------|---------------|
| 1 | Usable | Stripe: one key, one curl |
| 2 | Credible | TypeScript: gradual adoption, never breaks JS |
| 3 | Findable | React: every question answered on SO |
| 4 | Useful | Tailwind: covers 95% CSS needs |
| 5 | Valuable | Next.js: SSR+routing+bundling+deploy in one |
| 6 | Accessible | VS Code: junior to principal |
| 7 | Desirable | Vercel: devs WANT to use it |

**TTHW Benchmarks:**
- Champion: <2 min → 3-4x higher adoption
- Competitive: 2-5 min → baseline
- Needs Work: 5-10 min → significant drop-off
- Red Flag: >10 min → 50-70% abandon

**10 Cognitive Patterns:**
- Chef-for-chefs: bar is higher because they notice everything
- First five minutes obsession: clock starts when dev arrives
- Error message empathy: every error is pain. problem + cause + fix + link
- Escape hatch awareness: every default needs override
- Journey wholeness: discover → evaluate → install → hello world → integrate → debug → upgrade → scale → migrate
- Context switching cost: every time dev leaves your tool = 10-20 min lost
- Upgrade fear: clear changelogs, migration guides, codemods. Upgrades should be boring.
- SDK completeness: if devs write HTTP wrapper, you failed
- Pit of Success: right thing easy, wrong thing hard
- Progressive disclosure: simple case production-ready, complex case same API

**DX Scoring (0-10):** 9-10=Stripe/Vercel tier, 7-8=good, 5-6=tolerable, 3-4=poor, 1-2=broken, 0=not addressed. The gap method: explain what 10 looks like for THIS product, then fix toward 10.

**Áp dụng cho claude-test:** `/bootstrap` analysis nên score project DX theo 7 characteristics. Skills README nên pass "first 5 minutes test": can user hello-world without reading full docs?

---

### PATTERN-093: ML Prompt Injection Defense — 7-Layer Architecture

**Nguyên tắc:** Prompt injection remains unsolved (academic consensus NDSS 2026). Design systems with this in mind. Single-model defense insufficient — attackers bypass with encoding tricks.

**Key insights từ industry:**
- Claude Code auto mode: reasoning-blind transcript classifier. Strips Claude's own reasoning to prevent self-persuasion attacks. 0.4% FPR, 5.7% FNR.
- Perplexity: "LLM-based guardrails cannot be final line of defense. Need at least one deterministic enforcement layer."
- BrowseSafe bypassed 36% of the time with simple base64/URL encoding tricks.

**7 Defense Layers (gstack sidebar):**
| Layer | What | Status |
|-------|------|--------|
| L0 | Default to Opus | Done |
| L1 | XML prompt framing `<system>` + `<user-message>` with escaping | Done |
| L2 | DeBERTa ONNX classifier (94.8% accuracy, 86M params, ~50-100ms via @huggingface/transformers WASM) | Planned |
| L2b | Regex patterns after encoding normalization | Planned |
| L3 | Pre-scan page snapshot before prompt construction | Planned |
| L4 | Bash command allowlist | Done |
| L5 | Canary tokens (random token per session, check output stream) | Planned |
| L6 | Transparent blocking (show user what was caught and why) | Planned |

**Encoding normalization pipeline:**
1. Decode base64 segments
2. Decode URL-encoded sequences (%XX)
3. Decode HTML entities (&amp;)
4. Flatten Unicode homoglyphs (Cyrillic а → Latin a)
5. Strip zero-width characters
6. Run classifier on DECODED input

**Graceful degradation:** Security module NEVER blocks sidebar from working. DeBERTa loaded → full ML (green). Not downloaded → regex only (yellow). Module crashes → no check (red). Never a hard failure.

**Áp dụding cho claude-test:** Sidebar-like features cần at minimum L1 (XML framing) + L4 (command allowlist). Canary token pattern useful cho any agentic system với external access.

---

### PATTERN-094: Conductor-Chrome Sidebar Integration — SSE Bridge

**Nguyên tắc:** Chrome extension sidebar currently runs separate Claude instance. Fix: make sidebar a *window into* Conductor session, not a separate thing.

**3 needs from Conductor:**
1. **Watch events (SSE stream):** Subscribe to active session's events — "Claude is editing `src/App.tsx`", "Claude is running `npm test`". Sidebar already renders tool calls as badges, text as bubbles. Just needs data pipe.
2. **Send messages into session:** User types in Chrome sidebar → appears in Conductor chat → Claude responds. No window switching.
3. **Create workspace from directory:** Register git worktree as Conductor workspace for file tree visibility.

**Already built (gstack side):** Chrome extension, side panel, streaming event renderer, chat input with message queuing, reconnect logic, session management, agent lifecycle. Only change: swap data source from local `claude -p` subprocess → Conductor session stream. Extension code stays same.

**Magic moment:** User watching Chrome sees something wrong → types correction in sidebar → Claude responds → without switching windows. "One agent, two views."

**Estimated effort:** 2-3 days Conductor engineering, 1 day gstack integration.

**Áp dụng cho claude-test:** Multi-window debugging pattern: one agent, multiple views của same session. Khi implement browser-integrated tools, design SSE stream first — UI is just a view.

---

### PATTERN-095: OpenClaw CEO Review Skill — 4 Modes + 18 Cognitive Patterns

**Nguyên tắc:** CEO review for plans — NOT rubber-stamping. Goal: make plan extraordinary, catch every landmine before it explodes.

**4 modes (user selects):**
- **SCOPE EXPANSION:** Build cathedral. Push scope UP. "What would make this 10x better for 2x effort?" Each expansion is user opt-in/out individually.
- **SELECTIVE EXPANSION:** Hold scope + cherry-pick expansions. Baseline = bulletproof, expansions = opt-in.
- **HOLD SCOPE:** Accepted scope, maximum rigor. Catch every failure mode, edge case, error path. No silent reduction OR expansion.
- **SCOPE REDUCTION:** Surgeon mode. Minimum viable version. Cut everything else.

**Critical rule (ALL modes):** User 100% in control. Every scope change = explicit opt-in. Never silently add or remove scope.

**9 Prime Directives:**
1. Zero silent failures — every failure mode visible
2. Every error has a name — not "handle errors", name the specific exception
3. Data flows have shadow paths — happy path + nil input + empty/zero-length + upstream error
4. Interactions have edge cases — double-click, navigate-away, slow connection, stale state, back button
5. Observability is scope — dashboards, alerts, runbooks are first-class deliverables
6. Diagrams are mandatory — no non-trivial flow goes undiagrammed
7. Everything deferred must be written down
8. Optimize for 6-month future, not just today
9. Permission to say "scrap it and do this instead"

**Step 0 — Nuclear Scope Challenge:**
- Is this the right problem? Different framing = simpler/more impactful?
- What is the actual user/business outcome?
- What would happen if we did nothing?
- Map: CURRENT STATE → THIS PLAN → 12-MONTH IDEAL
- Produce 2-3 distinct implementation alternatives before selecting mode

**Áp dụng cho claude-test:** CEO review perspective = scope challenge first, always. Trước khi implement bất kỳ feature nào, ask: "What would happen if we did nothing?" và "CURRENT STATE → THIS → IDEAL".

---

### PATTERN-096: OpenClaw Office Hours Skill — Startup vs Builder Modes

**Nguyên tắc:** YC office hours partner. Ensure PROBLEM understood before SOLUTIONS proposed. HARD GATE: no code, no implementation, no scaffolding. Output = design document only.

**2 modes (based on user's goal):**
- **Startup/Intrapreneurship → Startup Mode (Phase 2A):** Hard questions, diagnostic. Reality check.
- **Hackathon/Open source/Learning/Having fun → Builder Mode (Phase 2B):** Enthusiastic collaborator.

**Product stage assessment (startup only):** Pre-product (idea, no users), Has users (not paying), Has paying customers.

**6 Operating Principles (Startup Mode):**
1. Specificity is the only currency. "Everyone needs this" = can't find anyone.
2. Interest is not demand. Waitlists/signups don't count. Money/panic counts.
3. User's words beat founder's pitch. Always a gap between what founder says and what users say.
4. Watch, don't demo. Guided walkthroughs teach nothing. Watching someone struggle teaches everything.
5. Status quo is real competitor. Not the other startup — the spreadsheet+Slack workaround.
6. Narrow beats wide, early. Smallest version someone will pay for this week > full platform vision.

**Anti-sycophancy rules:**
- NEVER: "That's interesting", "Many ways to think about this", "You might want to consider", "That could work", "I can see why you'd think that"
- ALWAYS: Take position on every answer. State position AND what evidence would change it.

**Pushback patterns:**
- Vague market → "Name the specific developer who wastes 2+ hours/week on X. Name the person."
- Social proof → "That's pre-validation. Have you sent them a bill? Did they pay?"

**Áp dụng cho claude-test:** `/office-hours` equivalent trong claude-test nên have same HARD GATE (no code during brainstorm). Thêm anti-sycophancy rules vào PM persona: take position, state what evidence would change it.

---

### PATTERN-097: /cso — Chief Security Officer Audit (15 Phases + Confidence Gate)

**Nguyên tắc:** CSO thinks like attacker, reports like defender. Real attack surface isn't code — it's dependencies, CI/CD pipelines, forgotten staging servers với prod DB access, và third-party webhooks that accept anything.

**Modes & Flags:**
- `/cso` — full daily audit (all phases, 8/10 confidence gate)
- `/cso --comprehensive` — monthly deep scan (2/10 bar — surfaces more, flags TENTATIVE)
- `/cso --infra` — infrastructure-only (Phases 0-6, 12-14)
- `/cso --code` — code-only (Phases 0-1, 7, 9-11, 12-14)
- `/cso --skills` — skill supply chain only (Phases 0, 8, 12-14)
- `/cso --diff` — branch changes only (combinable)
- `/cso --owasp` — OWASP Top 10 only

**15 Phases:**

| Phase | Name | Key checks |
|-------|------|-----------|
| 0 | Architecture Mental Model | Stack detection (Node/Python/Ruby/Go/Rust), framework detection, mental model build |
| 1 | Attack Surface Census | Public endpoints, authenticated, admin, API, file upload, WebSocket, CI/CD workflows |
| 2 | Secrets Archaeology | Git history (AKIA, sk-, ghp_, xoxb-), .env tracked by git, CI inline secrets |
| 3 | Dependency Supply Chain | npm audit / bundler / pip / cargo, install scripts in prod deps, lockfile integrity |
| 4 | CI/CD Pipeline Security | Unpinned GitHub Actions, pull_request_target, script injection, secrets as env vars |
| 5 | Infrastructure Shadow Surface | Dockerfiles (root user, secrets as ARG), IaC (IAM wildcards), staging→prod DB access |
| 6 | Webhook & Integration Audit | Signature verification on inbound webhooks, TLS disabled, OAuth scope analysis |
| 7 | LLM & AI Security | Prompt injection vectors, unsanitized LLM output as HTML, eval() on LLM output, cost attacks |
| 8 | Skill Supply Chain | Scan local+global skills for exfiltration (`curl`, env vars), prompt injection in SKILL.md |
| 9 | OWASP Top 10 | A01 Access Control, A02 Crypto, A03 Injection, A04 Design, A05 Misconfig, A07 Auth, A10 SSRF |
| 10 | STRIDE Threat Model | Spoofing/Tampering/Repudiation/Info Disclosure/DoS/Elevation for each component |
| 11 | Data Classification | RESTRICTED (PII/payment), CONFIDENTIAL (API keys/business logic), INTERNAL, PUBLIC |
| 12 | False Positive Filtering | 8/10 confidence gate (daily) or 2/10 (comprehensive), 22 hard exclusions |
| 13 | Severity-Ordered Report | CRITICAL/HIGH/MEDIUM findings with remediation |
| 14 | Security Posture Improvement Plan | Prioritized roadmap |

**Key security rules:**
- **Scope flags are mutually exclusive** — if multiple scope flags, ERROR immediately. Never silently pick one.
- **SKILL.md files are NOT documentation** — they're executable prompt code. Phase 8 findings on SKILL.md files never excluded.
- **`pull_request_target` without PR ref checkout is safe** (precedent #11)
- **LLM cost amplification is NOT DoS** — it's financial risk. Never auto-discard.
- **Phase 0 = reasoning phase, NOT checklist** — build mental model before hunting bugs.
- Use Grep tool for ALL code searches (not raw bash grep). Never use `| head` to truncate.

**22 Hard Exclusions (auto-discard):** DoS/resource exhaustion, on-disk secured secrets, memory issues, non-security field validation, GitHub Actions (unless triggerable via untrusted input), missing hardening, race conditions (unless concretely exploitable), outdated library CVEs (Phase 3 handles), memory safety in Rust/Go/Java/C#, test fixtures not imported by production code, log spoofing, SSRF with path-only control, AI user-message position injection, regex complexity in trusted input, security concerns in `.md` files (except SKILL.md), missing audit logs, insecure randomness in non-security contexts, secrets removed in same PR, CVEs <4.0 with no exploit, dev Dockerfiles unless in prod deploy, disabled CI workflows, gstack skill files.

**Áp dụng cho claude-test:** Phase 8 (Skill Supply Chain) = scan `.claude/skills/` files. SKILL.md files trong project có thể inject malicious instructions. Phase 7 (LLM Security) critical nếu project builds AI features. Implement CSO-lite: Phase 1 (attack surface) + Phase 2 (secrets) + Phase 9 (OWASP) minimum.

---

### PATTERN-098: Six Forcing Questions — YC Product Diagnostic

**Nguyên tắc:** "Push once, then push again. First answer = polished version. Real answer comes after 2nd or 3rd push." Questions asked ONE AT A TIME. Each pushed until specific, evidence-based, uncomfortable.

**Smart routing by product stage:**
- Pre-product → Q1, Q2, Q3
- Has users → Q2, Q4, Q5
- Has paying customers → Q4, Q5, Q6
- Pure engineering → Q2, Q4 only

**The Six Forcing Questions:**

**Q1: Demand Reality**
"What's the strongest evidence someone actually wants this — not 'is interested', not 'signed up for waitlist', but would be genuinely upset if it disappeared tomorrow?"
Push until: specific behavior, someone paying, someone expanding usage, someone building workflow around it.
Red flags: "People say it's interesting." "500 waitlist signups." "VCs excited about the space."

**Q2: Status Quo**
"What are users doing right now to solve this — even badly? What does that workaround cost them?"
Push until: specific workflow, hours spent, dollars wasted, tools duct-taped together.
Red flag: "Nothing... there's no solution." — if nothing exists, problem probably isn't painful enough.

**Q3: Desperate Specificity**
"Name the actual human who needs this most. What's their title? What gets them promoted? What gets them fired? What keeps them up at night?"
Push until: name, role, specific consequence they face.
Red flags: "Healthcare enterprises." "SMBs." "Marketing teams." You can't email a category.

**Q4: Narrowest Wedge**
"What's the smallest possible version someone would pay real money for — this week, not after you build the platform?"
Push until: one feature, one workflow, something shippable in days.

**Q5: Observation**
"Have you watched someone use this? Not demo — sat behind someone while they struggled?"
Push until: specific session, specific struggle, user's own words about it.
Red flag: "We've gotten great feedback from demos." Demos hide problems.

**Q6: Future Fit**
"12 months from now, if this works, what does the world look like? Who does this hurt? What gets commoditized?"
Push until: specific company threatened, specific workflow eliminated, defensible moat.

**Intrapreneurship adaptation:** Q4 → "smallest demo that gets VP/sponsor to greenlight" | Q6 → "does this survive a reorg?"

**Áp dụng cho claude-test:** Business role `/prp-prd` (PRD generator) nên incorporate these 6 questions. Đặc biệt Q1 (demand evidence) và Q3 (desperate specificity) — most PRDs skip these and go straight to solution.

---

### PATTERN-099: Prerequisite Skill Offer Pattern

**Nguyên tắc:** Before running a review on a feature, offer the prerequisite skill if preconditions aren't met. Không force — offer once, honor user's choice, never re-offer.

**Trigger:** `/autoplan` checks if design doc exists for current branch. If no design doc found:
```
"No design doc found for this branch. `/office-hours` produces a structured problem
statement, premise challenge, and explored alternatives — it gives this review much
sharper input to work with. Takes about 10 minutes."
```
Options: A) Run /office-hours now (pick up review after) | B) Skip — proceed with standard review.

If user skips: "No worries — standard review. If you ever want sharper input, try /office-hours first next time." Then proceed normally. Do NOT re-offer later in session.

**Canary (post-deploy monitor):** "Release Reliability Engineer" persona. Watches production after deploy using browse daemon. Takes screenshots, checks console errors, compares against baselines. "You've seen deploys that pass CI but break in production — missing env var, CDN cache serving stale assets, DB migration slower on real data. Your job: catch these in first 10 minutes, not 10 hours."

**Áp dụng cho claude-test:** Skills với prerequisites nên offer them proactively, once, without forcing. Pattern: check → offer → honor choice → proceed. Tương tự: nếu không có tests, offer `/tdd` before implementing.

---

### PATTERN-100: Dropdown/Portal Detection in Browser Snapshots

**Nguyên tắc:** Playwright's `ariaSnapshot()` misses dropdown/autocomplete items vì modern web apps dùng portals. Elements là `<div>`/`<li>` với click handlers nhưng không có semantic ARIA roles.

**Problem:** `snapshot -i` (interactive mode) misses:
1. Elements without ARIA roles
2. Dynamically-created portals/popovers (React portals, Radix Popover, etc.)
3. Elements rendered outside scoped `body` locator's subtree timing

**Solution:**
1. Auto-enable cursor-interactive scan (`-C`) khi `-i` flag passed
2. Portal priority scanning before general cursor:pointer scan

**Floating container detection heuristics:**
- `position: fixed` or `position: absolute` với `z-index >= 10`
- Has `role="listbox"`, `role="menu"`, `role="dialog"`, `[data-radix-popper-content-wrapper]`, `[data-floating-ui-portal]`
- Is visible (`offsetParent !== null` or `position: fixed`)

**For each floating container:** Include child elements matching: `cursor:pointer`, `role="option"`, `[data-value]`, `aria-selected`, `onclick`, `tabindex >= 0`.

**Áp dụng cho claude-test:** Khi build browser-integrated features, cần handle portal/popover detection separately từ main accessibility tree. Nếu dùng Playwright, luôn combine `ariaSnapshot()` với cursor:pointer scan.

---

## Từ ui-ux-pro-max-skill (nextlevelbuilder) — 2026-04-09

### 1. CSV-Based Searchable Design Database

**Pattern:** Dùng CSV thay vì markdown cho design data (colors, typography, styles, UX rules).

**Lý do:**
- Queryable bằng BM25 search engine
- Token-efficient — chỉ return relevant columns, không load toàn bộ
- Machine-readable — scripts tính reasoning, persist, export
- Human-editable — Excel/Google Sheets compatible

**Cấu trúc:**
```
data/
├── styles.csv        # 67 UI styles (name, keywords, best-for, ai-prompt)
├── colors.csv        # 161 color palettes by product type
├── typography.csv    # 57 font pairings (Google Fonts import)
├── ux-guidelines.csv # 99 UX rules với severity
└── stacks/           # Per-framework guidelines
```

**Áp dụng:** Khi frontend-design skill lớn hơn 50 entries → migrate sang CSV + BM25 search.

---

### 2. BM25 + Regex Hybrid Search Engine

**Pattern:** Search design data bằng BM25 ranking kết hợp regex filtering.

**Cách hoạt động:**
1. BM25 rank matches trong `search_cols`
2. Regex filter thêm precision
3. Return chỉ `output_cols` — không phải toàn bộ row
4. Max 3 results mặc định

**Code pattern (Python):**
```python
CSV_CONFIG = {
    "style": {
        "file": "styles.csv",
        "search_cols": ["Style Category", "Keywords", "Best For"],
        "output_cols": ["name", "pattern", "colors", "typography"]
    }
}
```

**Áp dụng:** Khi cần search design patterns/colors/typography thay vì hard-code recommendations.

---

### 3. Product Type → Design Decision Mapping

**Pattern:** Map product type (SaaS, E-commerce, Healthcare...) → recommended pattern + style + colors + anti-patterns.

**Structure (ui-reasoning.csv):**
```
Product Type → Recommended Pattern → Style Priority → Color Mood → Decision Rules → Anti-Patterns → Severity
```

**Ví dụ:**
- SaaS → Hero + Features + CTA → Glassmorphism + Flat → Trust Blue → if data-heavy: add glassmorphism
- E-commerce → Product Grid + Filters → Minimalist → Vibrant accent → if luxury: reduce saturation
- Healthcare → Clean Dashboard → Flat + White space → Calm blue → No dark mode by default

**Áp dụng:** Khi business agent đưa ra yêu cầu UI — PM hỏi product type để chọn đúng design direction.

---

### 4. Three-Layer Token Architecture

**Pattern:** Primitive → Semantic → Component tokens.

```
Primitive: raw values
  --color-blue-500: #4299e1
  --spacing-4: 16px

Semantic: purpose aliases
  --color-action-primary: var(--color-blue-500)
  --spacing-content: var(--spacing-4)

Component: specifics
  --button-bg: var(--color-action-primary)
  --button-padding: var(--spacing-content)
```

**Lợi ích:** Theme switching, dark mode, per-component customization đều hoạt động qua semantic layer.

**Áp dụng:** Khi project setup design system — dùng 3-layer thay vì flat CSS variables.

---

### 5. Design System Persistence: Master + Page Overrides

**Pattern:** Global source of truth + page-specific overrides, hierarchical retrieval.

```
design-system/
├── MASTER.md          # Global: spacing, colors, typography, style
└── pages/
    ├── landing.md     # Override: hero gradient, larger headings
    ├── dashboard.md   # Override: dense data layout, smaller font
    └── checkout.md    # Override: trust signals, form-heavy
```

**Retrieval rule:** Load MASTER.md first → check pages/{page}.md → page rules override master.

**Áp dụng:** Khi business agent viết design handoff — luôn có MASTER + page-specific sections.

---

### 6. Accessibility-First Framework (Priority 1 = CRITICAL)

**Pattern:** Accessibility không phải afterthought — là Priority 1 trước cả visual design.

**13 critical rules:**
- Color contrast ≥ 4.5:1 (normal text), 3:1 (large text)
- Focus rings: không bao giờ `outline: none` mà không có alternative
- Icon-only buttons: bắt buộc có `aria-label`
- Touch targets: ≥ 44×44px (iOS), ≥ 48×48dp (Android)
- Hover-only states: phải có keyboard equivalent
- State changes: không instant 0ms — dùng transition để screen reader nhận được

**Anti-patterns bị cấm:**
```css
/* CẤM */
button:focus { outline: none; }
/* ĐÚNG */
button:focus-visible { outline: 2px solid var(--color-action-primary); }
```

**Áp dụng:** Thêm accessibility audit bắt buộc vào @spec-reviewer checklist khi review UI.

---

### 7. UX Guideline Categories + Severity Levels

**Pattern:** 99 UX rules tổ chức theo 10 categories, mỗi rule có severity.

**Categories:**
1. Navigation (CRITICAL) — back button, breadcrumbs, menu
2. Touch & Interaction (CRITICAL) — targets, gestures, feedback
3. Animation (HIGH) — duration, easing, reduced-motion
4. Layout (HIGH) — responsive, safe areas, overflow
5. Forms (HIGH) — labels, errors, submission
6. Accessibility (CRITICAL) — contrast, ARIA, keyboard
7. Performance (HIGH) — images, fonts, lazy load
8. Typography (MEDIUM) — hierarchy, readability, scale
9. Color (MEDIUM) — consistency, meaning, dark mode
10. Charts & Data (MEDIUM) — chart type selection, labels

**Severity system:**
- CRITICAL: block release
- HIGH: must fix before launch
- MEDIUM: fix in next sprint
- LOW: nice to have

**Áp dụng:** Khi review UI — cross-check với category list, không chỉ visual impression.

---

### 8. Platform-Adaptive Design Patterns

**Pattern:** Design rules khác nhau theo platform — không dùng web rules cho mobile.

| Platform | Navigation | Touch Target | Back Gesture |
|----------|-----------|--------------|--------------|
| iOS | Tab bar bottom | 44×44pt | Swipe-back (edge) |
| Android | Top app bar | 48×48dp | Predictive back |
| Web | Top nav / sidebar | 44×44px | Browser back |
| React Native | Bottom tabs | 44×44dp | Platform native |

**Áp dụng:** Khi business request mobile UI — hỏi platform (iOS/Android/RN) trước khi spec.

---

### 9. Canvas Design Philosophy: Visual > Text

**Pattern:** Design communication nên 90% visual, 10% text.

**Nguyên tắc:**
- Space communicates hierarchy (không cần borders nếu đủ spacing)
- Color communicates meaning (không cần labels nếu palette đúng)
- Typography communicates tone (serif vs sans-serif = warm vs cold)
- Minimal text: chỉ dùng text khi visual không đủ

**Apply for handoffs:** Business handoff nên describe visual relationships, không chỉ list features.

---

### 10. Pre-Delivery UI Checklist (Must-Pass Before Ship)

**Pattern:** Checklist chia theo priority — không pass CRITICAL thì không ship.

```
CRITICAL (block release):
  [ ] Color contrast ≥ 4.5:1
  [ ] Focus visible trên tất cả interactive elements
  [ ] Touch targets ≥ 44px
  [ ] Alt text cho images
  [ ] ARIA labels cho icon-only buttons

HIGH (fix before launch):
  [ ] Responsive: mobile 375px, tablet 768px, desktop 1280px
  [ ] Loading states cho tất cả async actions
  [ ] Error states có message rõ ràng
  [ ] Empty states không blank

MEDIUM (next sprint):
  [ ] Animation có prefers-reduced-motion fallback
  [ ] Dark mode tested (nếu supported)
  [ ] Keyboard nav tested end-to-end
```

**Áp dụng:** @spec-reviewer dùng checklist này khi review UI tasks.



