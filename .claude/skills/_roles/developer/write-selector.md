---
description: Viết selectors — derive/transform state từ store, memoized để tránh re-render thừa
---

# Skill: Write Selector

## Nguyên tắc

- Selector **derive data** từ store — không fetch, không mutate
- Tên theo pattern `selectX` (function) hoặc `useXSelector` (hook với subscription)
- **Memoize** khi computation tốn kém hoặc return object/array mới
- Selector đơn giản không cần memoize

## Phân loại

| Loại | Khi nào dùng | Pattern |
|------|-------------|---------|
| Simple selector | Lấy 1 field từ store | `const selectUserId = (s) => s.userId` |
| Derived selector | Tính toán từ state | `selectFilteredOrders` |
| Combined selector | Kết hợp nhiều stores | `selectOrderWithUser` |
| Hook selector | Component subscribe realtime | `useOrdersSelector` |

## Simple selector

```typescript
// selectors/orders.selectors.ts
import { useOrdersStore } from '../stores/orders.store';

// Lấy trực tiếp — không cần memoize
export const selectOrders = (state: OrdersState) => state.orders;
export const selectSelectedId = (state: OrdersState) => state.selectedId;
export const selectFilter = (state: OrdersState) => state.filter;
```

## Derived selector (memoized)

```typescript
import { useMemo } from 'react';
import { useOrdersStore } from '../stores/orders.store';

// Hook selector với derived data
export function useFilteredOrdersSelector() {
  const orders = useOrdersStore((s) => s.orders);
  const filter = useOrdersStore((s) => s.filter);

  // useMemo để tránh recompute mỗi render
  return useMemo(
    () => orders.filter((o) => filter.status === 'all' || o.status === filter.status),
    [orders, filter]
  );
}

// Selector đơn giản cho 1 item
export function useOrderByIdSelector(id: string) {
  return useOrdersStore((s) => s.orders.find((o) => o.id === id));
}
```

## Combined selector (nhiều stores)

```typescript
export function useOrderWithUserSelector(orderId: string) {
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === orderId));
  const user = useUsersStore((s) => s.users.find((u) => u.id === order?.userId));

  return useMemo(() => (order ? { ...order, user } : null), [order, user]);
}
```

## Selector không nên làm

```typescript
// ❌ Side effects trong selector
export function useBadSelector() {
  const orders = useOrdersStore((s) => s.orders);
  fetchMoreOrders(); // WRONG
  return orders;
}

// ❌ Mutate state trong selector
export const badSelector = (state) => {
  state.orders.push({}); // WRONG
  return state.orders;
};
```

## Checklist trước khi xong

- [ ] Tên đúng pattern: `selectX` hoặc `useXSelector`
- [ ] Không có side effects
- [ ] Không mutate state
- [ ] Derived data được memoize với `useMemo`
- [ ] Selector đơn giản (1 field) không cần memoize — tránh over-engineer

## Project Convention

> Đọc `.project-info/conventions/selectors.md` nếu tồn tại trước khi viết selector.
> File này chứa: memoization library, selector pattern cụ thể của project.
