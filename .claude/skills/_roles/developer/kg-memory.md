# Knowledge Graph Memory Protocol

Dùng skill này để quản lý project memory có cấu trúc qua `node scripts/kg.js`.

---

## 1. Memory Retrieval — Đầu mỗi session hoặc task mới

```bash
node scripts/kg.js context "topic của task hiện tại"
```

Nói "Remembering..." rồi inject output vào context trước khi bắt đầu.

Nếu cần tìm kiếm cụ thể hơn:
```bash
node scripts/kg.js search "auth JWT"        # full-text search
node scripts/kg.js related "module:auth"    # traverse graph
node scripts/kg.js list --type decision     # list theo type
```

---

## 2. Khi nào tạo Entity mới — và horizon nào

Mỗi entity có `horizon` xác định tuổi thọ:

| Horizon | Ý nghĩa | Auto-prune |
|---------|---------|-----------|
| `ephemeral` | Task/issue hiện tại, ngắn hạn | Khi phase-close |
| `phase` | Decision/pattern của phase này | Khi superseded hoặc PM quyết định |
| `permanent` | Module, document, core decisions | Không bao giờ auto-prune |

| Tình huống | Type | Horizon mặc định |
|-----------|------|-----------------|
| Task đang làm | `task` | `ephemeral` |
| Bug/issue tạm thời | `issue` | `ephemeral` |
| Quyết định tech phase này | `decision` | `phase` |
| Pattern mới phát hiện | `pattern` | `phase` |
| Module/domain project | `module` | `permanent` |
| Tài liệu/phase doc | `document` | `permanent` |

```bash
# Ephemeral — tự hiểu từ type, không cần chỉ định
node scripts/kg.js add-entity --type task --id "auth-refactor" --name "Refactor auth module"

# Phase — default cho decision/pattern
node scripts/kg.js add-entity --type decision --id "auth-jwt" --name "Dùng JWT stateless thay vì session"

# Permanent — core knowledge
node scripts/kg.js add-entity --type module --id "auth" --name "Auth Module" --horizon permanent
```

**KHÔNG tạo entity cho:** raw user messages, task nhỏ 1-time, thông tin đã có trong git log.

---

## 3. Observation Quality — Thế nào là có ý nghĩa

**Tốt** — có context, lý do, hoặc hệ quả:
```bash
node scripts/kg.js add-obs "decision:auth-jwt" \
  --type fact \
  --text "Chọn JWT vì cần stateless auth cho horizontal scaling; trade-off: không thể revoke token ngay"

node scripts/kg.js add-obs "task:auth-refactor" \
  --type blocker \
  --text "bcrypt version conflict với Node 20 — cần downgrade hoặc switch sang argon2"
```

**Xấu** — raw, không có context:
```
text: "đã implement xong"
text: "user nói không cần sqlite"
text: "Next: xoá đi"
```

**Rule:** Một observation tốt phải trả lời được: *Tại sao điều này quan trọng? Hệ quả là gì?*

---

## 4. Relations — Kết nối entities

```bash
node scripts/kg.js add-rel \
  --from "decision:auth-jwt" \
  --rel "touches" \
  --to "module:auth"

node scripts/kg.js add-rel \
  --from "task:auth-refactor" \
  --rel "implements" \
  --to "decision:auth-jwt"
```

| Relation | Dùng khi |
|----------|---------|
| `touches` | decision/task ảnh hưởng đến module |
| `depends-on` | module/task cần module/task khác |
| `implements` | task hiện thực hóa một decision |
| `related-to` | liên quan nhưng không phụ thuộc |
| `supersedes` | decision mới thay thế decision cũ |
| `caused-by` | issue được gây ra bởi decision/pattern |

---

## 5. Memory Update Triggers

Chủ động ghi KG khi xảy ra:

| Sự kiện | Action |
|---------|--------|
| Quyết định tech/architecture | `add-entity decision:` + `add-obs` với lý do + trade-off |
| Phát hiện pattern code | `add-entity pattern:` + `add-obs` với ví dụ file |
| Task hoàn thành | `add-obs task:` `--type status-change --from in-progress --to done` |
| Blocker phát hiện | `add-obs` `--type blocker` với mô tả cụ thể |
| Module mới xuất hiện | `add-entity module:` + relation đến tasks liên quan |
| Decision cũ bị thay thế | `add-obs decision:old` `--type fact "Superseded by decision:new vì..."` + `add-rel --rel supersedes` |

---

## 6. Kiểm tra sau khi ghi

```bash
node scripts/kg.js get "decision:auth-jwt"   # verify entity + observations
node scripts/kg.js stats                      # overview toàn bộ KG
```
