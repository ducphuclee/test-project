# Security Rules

## Mandatory — Trước mọi commit

- [ ] Không hardcode secrets (API keys, passwords, tokens, connection strings)
- [ ] Tất cả user input đều được validate trước khi dùng
- [ ] SQL queries dùng parameterized queries — không string concatenation
- [ ] HTML output được escape/sanitize — không render raw user content
- [ ] Auth/authorization check đúng chỗ trên protected routes
- [ ] Error messages không leak internal details ra client
- [ ] Không log sensitive data (tokens, passwords, PII)

## Secret Management

- **KHÔNG BAO GIỜ** hardcode secrets vào source code
- Dùng environment variables hoặc secret manager
- Validate secrets có tồn tại lúc startup — fail fast nếu thiếu
- File `.env` phải có trong `.gitignore`
- Nếu secret bị lộ → rotate ngay, không chờ

## Input Validation

Validate tại **system boundaries** — không tin tưởng bất kỳ input nào từ ngoài:
- Request body / query params / headers
- File uploads
- Data từ external APIs
- Data đọc từ database nếu đã đi qua user input

## Lỗi phổ biến cần tránh

| Loại lỗi | Ví dụ sai | Cách đúng |
|----------|-----------|-----------|
| SQL Injection | `` `SELECT * FROM users WHERE id = ${id}` `` | Parameterized: `db.query('...WHERE id = $1', [id])` |
| XSS | `innerHTML = userInput` | `textContent = userInput` hoặc dùng DOMPurify |
| Path traversal | `fs.readFile('./uploads/' + filename)` | Validate + `path.basename(filename)` |
| Insecure direct object ref | `/api/invoice/${id}` không check ownership | Verify `invoice.userId === req.user.id` |

## LLM Output Trust Boundary

Khi project có AI/LLM features — đây là attack class mới, thường bị bỏ qua:

- **LLM-generated values (emails, URLs, names)** → validate format trước khi lưu DB hoặc truyền vào mailer. Dùng `EMAIL_REGEXP`, `URI.parse`, `.strip`.
- **Structured tool output (arrays, objects)** → check type/shape trước khi write DB.
- **LLM-generated URLs** → không fetch trực tiếp. Allowlist hostname, ngăn SSRF (user-controlled URL → internal network).
- **LLM output render** → KHÔNG dùng `dangerouslySetInnerHTML`, `v-html`, `innerHTML` trực tiếp. Treat LLM output như untrusted user input.
- **LLM output stored** → sanitize trước khi lưu vector DB / knowledge base — stored prompt injection risk.
- **User content trong system prompt** → prompt injection vector. User message chỉ được ở user-message position, không interpolate vào system prompt.
- **Unbounded LLM calls** → rate limit để tránh cost amplification attack.

## Khi phát hiện security issue

1. **DỪNG** — không tiếp tục implement feature
2. Báo ngay cho PM với mô tả cụ thể
3. Fix CRITICAL issues trước khi làm gì khác
4. Rotate secrets nếu bị lộ
5. Review codebase xem có pattern tương tự không

## Project-Specific Security Notes

> /bootstrap sẽ thêm vào đây sau khi phân tích stack:
> - Auth library đang dùng
> - Database access patterns
> - Các endpoint cần rate limiting
