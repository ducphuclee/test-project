---
description: Viết React components đúng chuẩn — folder structure, single responsibility, không làm quá nhiều việc
---

# Skill: Write Component

## Nguyên tắc

- Component chỉ làm **một vai trò** — render + tương tác UI, không fetch data trực tiếp
- Mỗi component phải là **folder**, không phải file đơn
- Tên theo `PascalCase`
- Nhận data qua props hoặc từ orchestration hook — không gọi service trực tiếp

## Cấu trúc bắt buộc

```
ComponentName/
  index.tsx       ← entry point, có JSX
  types.ts        ← (nếu cần) types riêng của component
  hooks.ts        ← (nếu cần) hooks nội bộ
  constants.ts    ← (nếu cần) constants nội bộ
```

**Không tạo `ComponentName.tsx` — luôn dùng `ComponentName/index.tsx`**

Lý do: import path ổn định khi component mở rộng, dễ thêm file con sau.

## Phân loại component

| Vai trò | Trách nhiệm |
|---------|-------------|
| Page shell | Layout tổng thể, kết nối orchestration hook |
| Section shell | Group các components liên quan |
| Row / Cell item | Render một item trong list/table |
| Input wrapper | Wrap input với label, error, validation UI |
| Presenter | Nhận data thuần, render UI, không có logic |
| Dispatcher | Nhận loại entity, render component con phù hợp |

## Pattern chuẩn

```typescript
// OrdersPage/index.tsx — Page shell
import { useOrdersPageModel } from '../hooks/useOrdersPageModel';
import { OrdersTable } from './OrdersTable';
import { OrdersFilter } from './OrdersFilter';

export function OrdersPage() {
  const model = useOrdersPageModel(); // delegate logic cho hook

  return (
    <div>
      <OrdersFilter filters={model.filters} />
      <OrdersTable
        orders={model.orders}
        columns={model.columns}
        onSelect={model.onSelect}
      />
    </div>
  );
}
```

## Component không nên làm

- Gọi `fetch` hoặc service trực tiếp trong component body
- Giữ state phức tạp — delegate cho hook
- Chứa business logic — delegate cho service/utils
- Render quá nhiều thứ cùng lúc — tách nhỏ hơn

## Checklist trước khi xong

- [ ] Component là folder/index.tsx
- [ ] Tên PascalCase
- [ ] Không fetch data trực tiếp — dùng hook hoặc nhận qua props
- [ ] Props được type rõ ràng (không dùng `any`)
- [ ] Component có thể test độc lập với mock props

## Project Convention

> Đọc theo thứ tự trước khi viết bất kỳ UI nào:
>
> 1. `.project-info/conventions/components.md` — structure, naming, single responsibility
> 2. `.project-info/conventions/design.md` — typography tokens, color system, spacing scale, animation
>
> Sau khi nắm design tokens của project, áp dụng tư duy từ `.claude/skills/frontend-design/SKILL.md`:
> - Dùng đúng font/color/spacing tokens đã có trong project
> - Không tự chọn font hay màu ngoài design system
> - Áp dụng motion và spatial composition trong giới hạn design system hiện tại
>
> **Mục tiêu**: Component trông đúng như phần còn lại của app, không cần user chỉnh sửa lại.
