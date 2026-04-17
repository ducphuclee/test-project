---
description: Viết store (state management) — chỉ chứa state + actions, không có business logic
---

# Skill: Write Store

## Nguyên tắc

- Store chỉ chứa **state + actions** — không có business logic, không gọi API trực tiếp
- Business logic nằm ở **service layer**
- Hook tên `useXStore` để access store từ component
- Tên action rõ ràng theo dạng `setX`, `resetX`, `updateX`

## Phân loại store

| Loại | Dùng khi | Ví dụ |
|------|----------|-------|
| Local state | State của 1 component/feature | `useFormStore` |
| Feature store | State chia sẻ trong 1 feature | `useOrdersStore` |
| Global store | State toàn app | `useAuthStore`, `useAppStore` |

## Pattern chuẩn (Zustand)

```typescript
// stores/orders.store.ts
import { create } from 'zustand';
import type { Order, OrderFilter } from '../types';

interface OrdersState {
  orders: Order[];
  selectedId: string | null;
  filter: OrderFilter;
}

interface OrdersActions {
  setOrders: (orders: Order[]) => void;
  selectOrder: (id: string | null) => void;
  setFilter: (filter: Partial<OrderFilter>) => void;
  reset: () => void;
}

const initialState: OrdersState = {
  orders: [],
  selectedId: null,
  filter: { status: 'all' },
};

export const useOrdersStore = create<OrdersState & OrdersActions>((set) => ({
  ...initialState,

  setOrders: (orders) => set({ orders }),
  selectOrder: (id) => set({ selectedId: id }),
  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter },
  })),
  reset: () => set(initialState),
}));
```

## Store không nên làm

```typescript
// ❌ Business logic trong store
setOrders: async () => {
  const data = await fetchOrders(); // WRONG — gọi API trong store
  set({ orders: data });
}

// ✅ Đúng — service gọi API, sau đó update store
// Trong hook orchestration:
const data = await orderService.getOrders();
useOrdersStore.getState().setOrders(data);
```

## Checklist trước khi xong

- [ ] Store chỉ có state + setter actions
- [ ] Không có API calls trong store
- [ ] Không có business logic trong store
- [ ] `initialState` được define riêng (dễ reset)
- [ ] Hook tên `useXStore` export từ file store
- [ ] Types được define rõ ràng

## Project Convention

> Đọc `.project-info/conventions/stores.md` nếu tồn tại trước khi viết store.
> File này chứa: state management library đang dùng, pattern cụ thể của project.
