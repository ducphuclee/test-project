---
description: Giải thích code, folder, flow, architecture — tìm hiểu qua GitNexus + codebase, tùy chọn lưu vào knowledge base
---

# Skill: Explain

PM dùng skill này khi user hỏi về code, folder, flow, hoặc architecture.
Trigger: "giải thích X", "flow của Y là gì", "folder Z làm gì", "tìm hiểu..."

## Bước 1 — Check knowledge base trước

Đọc `.project-manager/knowledge/context.md` nếu tồn tại:
```
Đã có notes về topic này chưa?
```

- **Có** → trả lời từ knowledge file tương ứng + hỏi "Muốn refresh lại không?"
- **Không có** → tiếp tục Bước 2

## Bước 2 — Explore

Spawn `@explorer` với câu hỏi cụ thể của user. Explorer sử dụng:

**GitNexus (ưu tiên nếu đã index):**
```
gitnexus_query({query: "[topic]"})           → tìm execution flows liên quan
gitnexus_context({name: "[symbol]"})         → callers, callees, flow participation
READ gitnexus://repo/[name]/process/[flow]   → trace full execution flow
```

**Codebase (bổ sung hoặc thay thế nếu chưa index):**
```
Glob + Read các files liên quan
Grep để tìm patterns, usages
```

## Bước 3 — Format và trình bày

PM tổng hợp output từ explorer theo format:

```
## [Topic]: [Tên folder/flow/module]

### Mục đích
[1-2 câu: làm gì, tại sao tồn tại]

### Cấu trúc
[Folder tree hoặc danh sách files quan trọng với mô tả ngắn]

### Flow / Logic chính
[Step-by-step hoặc diagram text]
Ví dụ:
  Request → middleware → handler → service → DB
  1. validateInput()
  2. checkPermission()
  3. processData()
  4. return response

### Files quan trọng
- `path/to/file.ts:line` — [vai trò]
- `path/to/other.ts:line` — [vai trò]

### Liên quan đến
- [Module/flow khác có liên quan]
```

## Bước 4 — Hỏi lưu knowledge

```
Bạn có muốn lưu phần tìm hiểu này lại không?
Lần sau hỏi về "[topic]" sẽ không cần tìm lại.

[A] Lưu vào knowledge base
[B] Không cần
```

Nếu chọn **A**:

1. Tạo file `.project-manager/knowledge/[topic-slug].md` với nội dung explanation ở trên
2. Cập nhật `.project-manager/knowledge/context.md` — thêm dòng:
   ```
   - [topic]: .project-manager/knowledge/[topic-slug].md — [mô tả 1 dòng] (saved: YYYY-MM-DD)
   ```

## Ghi chú

- Knowledge file được lưu có thể outdated nếu code thay đổi sau đó
- Khi dùng lại từ knowledge, nếu user nghi ngờ đã cũ → offer refresh (`@explorer` chạy lại)
- Một topic có thể span nhiều files — lưu đủ context để đọc lại không cần mở codebase
