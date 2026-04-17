---
description: Thiết kế REST API endpoints theo chuẩn — URL, method, request/response, error codes
---

# Skill: API Design

Thiết kế API endpoints nhất quán, predictable, và developer-friendly.

## Conventions

### URL Structure
```
GET    /resources              # List (có pagination)
GET    /resources/:id          # Get one
POST   /resources              # Create
PUT    /resources/:id          # Replace (full update)
PATCH  /resources/:id          # Partial update
DELETE /resources/:id          # Delete

# Nested resources
GET    /users/:id/orders       # Orders của một user
POST   /users/:id/orders       # Tạo order cho user

# Actions (khi không fit CRUD)
POST   /orders/:id/cancel      # Cancel order
POST   /auth/refresh           # Refresh token
```

### Naming
- Dùng **noun, plural**: `/users`, `/orders` (không phải `/getUsers`)
- **kebab-case** cho multi-word: `/order-items`
- **camelCase** cho query params: `?sortBy=createdAt&pageSize=20`

### Request / Response

```typescript
// Response envelope chuẩn
{
  "data": { ... },          // hoặc array
  "meta": {                 // cho list responses
    "total": 100,
    "page": 1,
    "pageSize": 20
  },
  "error": null
}

// Error response
{
  "data": null,
  "error": {
    "code": "USER_NOT_FOUND",   // machine-readable
    "message": "User not found", // human-readable
    "details": { ... }           // optional, validation errors
  }
}
```

### HTTP Status Codes

| Status | Khi nào dùng |
|--------|-------------|
| 200 | GET/PATCH/PUT thành công |
| 201 | POST tạo resource thành công |
| 204 | DELETE thành công (no body) |
| 400 | Invalid request data |
| 401 | Chưa authenticate |
| 403 | Không có permission |
| 404 | Resource không tồn tại |
| 409 | Conflict (duplicate, stale data) |
| 422 | Validation failed |
| 429 | Rate limited |
| 500 | Server error |

### Pagination

```
GET /users?page=1&pageSize=20&sortBy=createdAt&order=desc
```

### Filtering

```
GET /orders?status=pending&userId=123&createdAfter=2024-01-01
```

## Output khi dùng skill này

Tạo spec theo format:

```
## POST /api/users

**Description:** Tạo user mới

**Auth:** Required (Bearer token)

**Request body:**
\`\`\`json
{
  "email": "string, required",
  "name": "string, required",
  "role": "admin | user, default: user"
}
\`\`\`

**Response 201:**
\`\`\`json
{ "data": { "id": "...", "email": "...", "name": "..." } }
\`\`\`

**Errors:**
- 400: Missing required fields
- 409: Email already exists
```

## Project Convention

> Đọc `.project-info/conventions/api.md` nếu tồn tại trước khi design API.
> File này chứa: response envelope, auth pattern, versioning, error codes của project.
