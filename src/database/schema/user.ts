
import { z } from 'zod';

// User roles
export const UserRole = z.enum(['customer', 'seller', 'admin']);
export type UserRole = z.infer<typeof UserRole>;

// User schema validation with Zod
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  role: UserRole,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  avatar: z.string().optional(),
});

// TypeScript type derived from the schema
export type UserSchema = z.infer<typeof userSchema>;

// Database table definition (for future ORM or query builder)
export const userTable = {
  name: 'users',
  columns: {
    id: 'text primary key',
    email: 'text not null unique',
    name: 'text not null',
    role: 'text not null',
    password: 'text not null', // Password hash, not included in the schema
    createdAt: 'timestamp not null default now()',
    updatedAt: 'timestamp',
    avatar: 'text',
  },
};
