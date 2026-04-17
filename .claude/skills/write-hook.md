---
description: Viết React hooks đúng trách nhiệm — orchestration, data fetching, interaction, reusable logic
---

# Skill: Write Hook

## Nguyên tắc

- Hook chỉ làm **một loại việc** — không gộp fetch + interaction + realtime vào một hook
- Không render JSX trong hook
- Tên theo pattern `useCamelCase`
- Return object (không return array) khi có nhiều hơn 2 giá trị — dễ destructure và mở rộng

## Phân loại hook

| Loại | Trách nhiệm | Ví dụ |
|------|-------------|-------|
| Data hook | Fetch, cache, loading/error state | `useUserData` |
| Orchestration hook | Ghép data + config + state → view model | `useOrdersPageModel` |
| Interaction hook | Handle user actions, form, UI state | `useOrderFilter` |
| Realtime hook | Subscribe websocket, polling | `useOrderUpdates` |
| Reusable hook | Logic dùng lại giữa nhiều component | `useDebounce` |

## Orchestration hook — pattern quan trọng nhất

Mỗi màn hình chính nên có một orchestration hook:

```typescript
function useOrdersPageModel() {
  // 1. Lấy data từ selector/service
  const orders = useOrdersSelector();
  const filters = useOrderFilters();

  // 2. Ghép config
  const columns = ORDER_COLUMNS_CONFIG;

  // 3. Ghép state local nếu cần
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 4. Trả về view model — component chỉ cần render
  return {
    orders,
    filters,
    columns,
    selectedId,
    onSelect: setSelectedId,
  };
}
```

Component sử dụng:
```typescript
function OrdersPage() {
  const model = useOrdersPageModel();
  return <OrdersTable {...model} />;
}
```

## Checklist trước khi xong

- [ ] Hook không chứa JSX
- [ ] Tên đúng pattern `useCamelCase`
- [ ] Mỗi hook chỉ làm một loại việc
- [ ] Dependencies của useEffect/useCallback đầy đủ
- [ ] Cleanup trong useEffect nếu có subscription
- [ ] Không tạo object/array mới trong render nếu không cần (gây re-render thừa)

## Project Convention

> Đọc `.project-info/conventions/hooks.md` nếu tồn tại trước khi viết hook.
> File này chứa: patterns đang dùng trong project, state management tool, data fetching pattern.
