---
description: Tạo database migration an toàn — schema changes, data migrations, rollback
---

# Skill: Database Migration

Tạo migrations đúng cách — có thể rollback, không gây downtime, an toàn với production data.

## Nguyên tắc

1. **Mỗi migration làm một việc** — không gộp nhiều changes
2. **Luôn có down migration** — phải rollback được
3. **Non-destructive trước** — add trước khi remove
4. **Không assume data** — validate trước khi migrate data
5. **Test trên staging** trước khi chạy production

## Zero-downtime patterns

### Thêm column mới (safe)
```sql
-- Up
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Down
ALTER TABLE users DROP COLUMN phone;
```

### Rename column (NGUY HIỂM — cần 3 bước)
```
Bước 1: Thêm column mới (giữ column cũ)
Bước 2: Deploy code đọc/ghi cả 2 columns
Bước 3: Migration copy data + drop column cũ
```

### Thêm index (dùng CONCURRENTLY để không lock)
```sql
-- Up (PostgreSQL)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Down
DROP INDEX CONCURRENTLY idx_users_email;
```

### Xóa column (NGUY HIỂM — cần 2 bước)
```
Bước 1: Deploy code không còn dùng column đó
Bước 2: Mới drop column
```

## Migration file template

```typescript
// migrations/YYYYMMDDHHMMSS_description.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneToUsers1234567890123 implements MigrationInterface {
  name = 'AddPhoneToUsers1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "phone" VARCHAR(20)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "phone"
    `);
  }
}
```

## Data migration template

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // 1. Validate trước
  const count = await queryRunner.query(
    `SELECT COUNT(*) FROM users WHERE email IS NULL`
  );
  if (count[0].count > 0) {
    throw new Error('Cannot migrate: found users with null email');
  }

  // 2. Migrate theo batch (tránh lock cả bảng)
  const batchSize = 1000;
  let offset = 0;
  while (true) {
    const rows = await queryRunner.query(
      `SELECT id, old_field FROM users LIMIT $1 OFFSET $2`,
      [batchSize, offset]
    );
    if (rows.length === 0) break;

    for (const row of rows) {
      await queryRunner.query(
        `UPDATE users SET new_field = $1 WHERE id = $2`,
        [transform(row.old_field), row.id]
      );
    }
    offset += batchSize;
  }
}
```

## Checklist trước khi chạy production

- [ ] Đã test trên staging với production-like data
- [ ] Down migration đã được test
- [ ] Ước tính thời gian chạy (lớn hơn 1 phút → cần maintenance window)
- [ ] Backup database đã được tạo
- [ ] Không có column/table rename trong 1 step
- [ ] Indexes dùng CONCURRENTLY (PostgreSQL)

## Project Convention

> Đọc `.project-info/conventions/services.md` nếu tồn tại — chứa ORM/query builder và migration tool của project.
