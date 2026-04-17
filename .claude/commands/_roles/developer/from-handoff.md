---
description: Đọc design handoff từ business branch và implement thành code thật
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git *), Bash(ls *), Bash(cat *)
---

# From Handoff — Implement từ Design

Đọc file handoff mới nhất từ business branch và implement các items còn thiếu thành code thật.

**Arguments:** $ARGUMENTS (optional: path tới file handoff cụ thể)

---

## API Docs từ Business

Trước khi đọc handoff, kiểm tra API docs mới từ business:

```bash
ls docs/api/ 2>/dev/null || echo "Không có API docs"
```

Nếu có files → liệt kê cho developer và note: khi implement API calls, refer tới đây.
Nếu handoff có Atlassian links → dùng Playwright MCP navigate đến link đó để đọc spec đầy đủ.

---

## Bước 1 — Tìm handoff file

Nếu không có argument, tìm file mới nhất:

```bash
ls .worktrees/business/.design-handoff/ 2>/dev/null | sort -r | head -5
```

Nếu `.worktrees/business/` chưa có:
```bash
git worktree list
```

Nếu worktree chưa tồn tại → thông báo:
> "Business worktree chưa có. Chạy `/resume` để sync, hoặc kiểm tra branch `business` đã có trên remote chưa."

Nếu có argument là path → đọc file đó trực tiếp.

---

## Bước 2 — Đọc và parse handoff

Đọc file handoff, extract:

1. **Commit message** — hiểu context của thay đổi
2. **Files thay đổi** — biết cần đọc file UI nào
3. **Components đã dùng** — biết component nào đã được tích hợp
4. **Checklist "Cần Developer Implement"** — đây là việc cần làm
5. **Preview URL** — để tham chiếu visual nếu cần

Ví dụ checklist sẽ có dạng:
```
- [ ] [page X] form submit → cần endpoint POST /api/...
- [ ] [component Y] data đang hardcode → cần fetch từ GET /api/...
- [ ] [flow Z] add loading state khi submit
- [ ] [component W] mobile responsive tại breakpoint 768px
```

**Parse Acceptance Criteria:**

Tìm AC trong handoff/PRD dạng Given/When/Then:
```
Given [precondition]
When [action]  
Then [observable result]
```

Mỗi AC = 1 test case cần viết. Nếu AC còn vague ("load nhanh hơn", "UX tốt hơn") → ghi vào danh sách cần clarify với PM trước khi implement.

---

## Bước 3 — Đọc UI files tương ứng

Đọc từng file UI được liệt kê trong handoff để hiểu:
- Structure hiện tại (components, props, layout)
- Mock data đang hardcode ở đâu
- Form handlers còn thiếu
- API calls chưa implement

---

## Bước 4 — Spawn @explorer để map context

Spawn explorer agent để tìm:
- Existing API routes/endpoints liên quan
- Existing services/hooks có thể tái dùng
- Type definitions cho data structures cần fetch
- Pattern naming conventions của project

---

## Bước 4.5 — Kiểm tra Feasibility

Sau khi explorer map xong context, trước khi code, kiểm tra:

**Nếu phát hiện vấn đề về spec:**

| Loại vấn đề | Ví dụ | Action |
|------------|-------|--------|
| Clarification cần | AC không rõ, flow thiếu edge case | Ghi vào danh sách → báo PM, tiếp tục phần khác |
| Technical Blocker | API không tồn tại, approach không feasible | DỪNG task đó → báo PM ngay |
| Scope lớn hơn estimate | Feature cần thêm N services không có trong spec | Flag cho PM → negotiate scope |
| Spec contradiction | Requirement A mâu thuẫn Requirement B | DỪNG → cần business clarify trước |

**Cách báo PM:**
```
Tìm thấy [N] vấn đề cần clarify trước khi implement [feature]:

1. [BLOCKER] API endpoint /xyz chưa có trong spec → cần business PM chạy /dev-feedback
2. [CLARIFICATION] AC "load trong 2s" — 2s tính từ đâu? First byte hay full render?

Tiếp tục implement phần không bị block trước không?
```

Spec issues được resolve qua business PM → `/dev-feedback` command.

---

## Bước 5 — Implement từng item trong checklist

Với mỗi item trong "Cần Developer Implement":

1. **Đọc item** — hiểu rõ yêu cầu
2. **Spawn @coder** — implement với context đầy đủ:
   - File UI cần thay đổi
   - API endpoint cần tạo/gọi
   - Pattern từ explorer
3. **Đánh dấu xong** — cập nhật checklist trong handoff file (thay `- [ ]` bằng `- [x]`)

Xử lý theo thứ tự ưu tiên:
1. API endpoints (backend trước để frontend có thể test)
2. Data fetching (thay mock data bằng real API calls)
3. Form handlers (submit, validation)
4. Loading/error states
5. Responsive/polish

---

## Bước 6 — Verify và báo cáo

Sau khi implement xong:

```
## Implement từ Handoff — Kết quả

Handoff: .design-handoff/YYYY-MM-DD-HH-MM.md

### Đã implement
- [x] [page X] form submit → POST /api/endpoint (src/api/endpoint.ts)
- [x] [component Y] fetch từ GET /api/data (src/hooks/useData.ts)

### Còn lại / Blocked
- [ ] [item Z] — blocked: cần clarify business logic với BA

### Files đã tạo/sửa
- src/api/...
- src/hooks/...
- src/pages/...

Tiếp theo: `/review` để review code trước khi tạo PR, hoặc `/pr` nếu đã sẵn sàng.
```

---

## Lưu ý

- **KHÔNG thay đổi layout/visual** — giữ nguyên UI như business đã design
- Chỉ implement phần logic, API, data fetching còn thiếu
- Nếu phát hiện business design có vấn đề về feasibility → ghi vào handoff notes và báo với PM
- Commit code lên feature branch hiện tại, KHÔNG commit lên `business` branch
