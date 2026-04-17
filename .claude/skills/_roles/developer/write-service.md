---
description: Viết service layer — HTTP API, websocket, storage, analytics, third-party integration
---

# Skill: Write Service

## Nguyên tắc

- Service **không biết UI** — không import component, không dùng React hooks
- Service chỉ xử lý **một loại integration** — không gộp HTTP + websocket + storage vào một file
- Return typed data — không trả `any`
- Throw typed errors — để caller biết cách handle

## Phân loại service

| Loại | Trách nhiệm | Ví dụ file |
|------|-------------|------------|
| HTTP | REST API calls | `user.service.ts` |
| Realtime | WebSocket, SSE, polling | `orders.realtime.ts` |
| Storage | localStorage, sessionStorage, IndexedDB | `auth.storage.ts` |
| Analytics | Event tracking | `analytics.service.ts` |
| Integration | Third-party SDK | `stripe.service.ts` |

## Pattern HTTP service

```typescript
// user.service.ts
import { apiClient } from '@/lib/api-client';
import type { User, CreateUserInput } from '../types';

export async function getUser(id: string): Promise<User> {
  const res = await apiClient.get<User>(`/users/${id}`);
  return res.data;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const res = await apiClient.post<User>('/users', input);
  return res.data;
}
```

## Pattern Realtime service

```typescript
// orders.realtime.ts
export function subscribeToOrders(
  onUpdate: (order: Order) => void,
  onError: (err: Error) => void
): () => void {  // trả về cleanup function
  const ws = new WebSocket(WS_URL);

  ws.onmessage = (e) => onUpdate(JSON.parse(e.data));
  ws.onerror = () => onError(new Error('WebSocket error'));

  return () => ws.close(); // cleanup
}
```

## Error handling

```typescript
// Throw typed errors, không nuốt lỗi
export async function getUser(id: string): Promise<User> {
  try {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  } catch (err) {
    if (isApiError(err) && err.status === 404) {
      throw new NotFoundError(`User ${id} not found`);
    }
    throw err; // re-throw unknown errors
  }
}
```

## Checklist trước khi xong

- [ ] Không import React hoặc component
- [ ] Không dùng useState/useEffect
- [ ] Return types rõ ràng (không `any`)
- [ ] Throw typed errors, không return null cho error cases
- [ ] Có cleanup function nếu mở connection (websocket, subscription)
- [ ] Tên file: `[domain].service.ts` hoặc `[domain].realtime.ts`

## Project Convention

> Đọc `.project-info/conventions/services.md` nếu tồn tại trước khi viết service.
> File này chứa: HTTP client đang dùng, auth header pattern, base URL, error handling pattern của project.
