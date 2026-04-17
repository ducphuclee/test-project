---
description: Import API documentation từ Swagger/OpenAPI URL hoặc raw spec vào backlog/docs/api/
allowed-tools: Read, Write, Bash, Glob
---

# API Import

**Arguments:** $ARGUMENTS (URL của Swagger/OpenAPI spec)

---

## Mục tiêu

Fetch OpenAPI spec từ URL công khai → convert sang markdown documentation → lưu vào backlog/docs/api/ để tệu dễ tham chiếu khi implement integration.

---

## Bước 1 — Xác định service name

Nếu service name chưa rõ từ URL, hỏi user:

```
API này của service nào? (ví dụ: "Payment Service", "Auth API")
```

Lưu vào biến `$SERVICE_NAME` để dùng sau.

---

## Bước 2 — Fetch OpenAPI spec via Playwright

Dùng Playwright MCP để mở Swagger UI trong browser → extract spec JSON trực tiếp. Không cần Python, không cần biết URL của JSON endpoint.

### 2a. Mở Swagger UI

```
Dùng Playwright MCP tool: browser_navigate → $ARGUMENTS
Đợi page load xong: browser_wait_for selector="swagger-ui" timeout=15000
```

### 2b. Extract spec JSON từ browser

Swagger UI lưu spec trong JavaScript state. Thử lần lượt:

**Cách 1 — JavaScript API (chuẩn nhất):**
```
browser_evaluate:
  const spec = window.ui?.specSelectors?.specJson?.()?.toJS?.()
             || window.ui?.specSelectors?.specJson?.();
  return spec ? JSON.stringify(spec) : null;
```

**Cách 2 — Tìm URL của spec trong page rồi fetch:**
```
browser_evaluate:
  // Swagger UI thường load spec từ một URL, lấy URL đó
  const configUrl = window.ui?.specSelectors?.url?.()
                 || document.querySelector('[data-spec-url]')?.dataset?.specUrl;
  return configUrl;
```
Nếu có URL → `browser_navigate` tới URL đó → lấy raw JSON text.

**Cách 3 — Fallback: đọc từ network request (intercept):**
```
browser_network_requests → tìm request có response chứa "paths" và ("swagger" hoặc "openapi")
→ lấy response body của request đó
```

### 2c. Lưu spec ra file

```bash
# Spec JSON đã có trong biến từ browser_evaluate
echo '$SPEC_JSON' > /tmp/spec.json
```

### 2d. Đóng browser

```
browser_close (nếu user không cần giữ)
```

### 2b. Validate JSON

```bash
python3 -c "import json,sys; json.load(open('/tmp/spec.json'))" 2>/dev/null && echo "valid" || echo "invalid"
```

Nếu JSON không valid → báo lỗi, hỏi user (xem phần Error Handling dưới).

---

## Bước 3 — Convert sang Markdown

```bash
node scripts/utils/openapi-to-markdown.js /tmp/spec.json "$SERVICE_NAME" "$URL"
```

Capture output vào `/tmp/api-converted.md`.

---

## Bước 4 — Tạo backlog doc

### Option A: Dùng MCP Backlog tool (nếu available)

```javascript
// Pseudocode — thực tế gọi qua Agent tool
await backlog.document_create({
  title: "[Service Name] API",
  path: "api/[service-slug]-api",
  content: <nội dung từ /tmp/api-converted.md>
})
```

### Option B: Fallback — tạo file trực tiếp

```bash
mkdir -p backlog/docs/api
SERVICE_SLUG=$(echo "$SERVICE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')
cp /tmp/api-converted.md "backlog/docs/api/${SERVICE_SLUG}-api.md"
```

---

## Bước 5 — Cleanup

```bash
rm -f /tmp/spec.json /tmp/api-converted.md
```

---

## Bước 6 — Báo cáo kết quả

```
✅ API imported: [Service Name]

Endpoints found: [N]
Location: backlog/docs/api/[service-slug]-api.md

Top endpoints:
- [method] [path] — [summary]
- [method] [path] — [summary]
... (tối đa 5)
```

---

## Error Handling

| Tình huống | Xử lý |
|-----------|-------|
| URL không reach được (timeout hoặc 404) | Báo: "Không tải được spec tự động từ URL [URL]". Hỏi user: "Bạn có thể:<br/>1. Paste raw JSON/YAML vào đây<br/>2. Chạy lệnh này và paste kết quả: `curl -s [URL]/api-docs`<br/>3. Bỏ qua và tạo template trống để fill sau" |
| JSON invalid | Báo: "Spec không phải JSON hợp lệ". Hỏi user paste hoặc fix |
| Spec không có paths/endpoints | Warn: "Spec không có endpoints. Tạo doc với note "No endpoints found."" |
| Duplicate service | Hỏi: "Đã có backlog/docs/api/[service]-api.md. Overwrite hay tạo [service]-v2?" |
| Spec quá lớn (>5MB) | Warn: "Spec rất lớn (5.2MB). Mở URL trong browser để preview trước?" Hỏi confirm trước khi tiếp tục |

---

## Notes

- Script `openapi-to-markdown.js` chỉ dùng Node.js stdlib — không dependencies ngoài
- Converter hỗ trợ OpenAPI v2.0 (Swagger) và v3.x
- Nếu spec có >50 endpoints: detail section chỉ show 20 đầu + note "... and N more"
- Service slug = lowercase, dấu gạch ngang thay dấu cách, bỏ ký tự đặc biệt
