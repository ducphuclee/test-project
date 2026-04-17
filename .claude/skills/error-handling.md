---
description: Implement error handling chuẩn — custom errors, boundaries, logging
---

# Skill: Error Handling

Áp dụng pattern error handling nhất quán trong toàn project.

## Custom Error Classes

```typescript
// Base error
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Domain errors
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 422, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}
```

## Error Boundaries

```typescript
// API route handler — catch tất cả errors
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          data: null,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        });
      }

      // Unexpected error — log và trả về 500
      logger.error('Unexpected error', { error, path: req.path });
      return res.status(500).json({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      });
    }
  };
}
```

## Nguyên tắc

1. **Throw sớm, catch muộn** — throw ở domain layer, catch ở boundary (API handler)
2. **Dùng typed errors** — không throw `new Error('string')` chung chung
3. **Log với context** — luôn include relevant IDs, user, path
4. **Không swallow errors** — `catch (e) {}` là anti-pattern
5. **Async errors** — luôn `await` hoặc `.catch()`, không bỏ sót promise rejections

## Logging pattern

```typescript
// Good
logger.error('Failed to process payment', {
  userId,
  orderId,
  amount,
  error: error.message,
  stack: error.stack,
});

// Bad
console.log('error', error);
```

## Checklist

- [ ] Custom error classes cho domain errors
- [ ] Error boundary ở API layer
- [ ] Unexpected errors được log với đủ context
- [ ] Không expose stack trace ra client
- [ ] Tests cover error cases

## Project Convention

> Đọc `.project-info/conventions/services.md` nếu tồn tại — chứa error handling pattern thực tế của project.
