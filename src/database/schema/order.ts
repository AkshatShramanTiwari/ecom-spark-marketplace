
import { z } from 'zod';

// Order status
export const OrderStatus = z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
export type OrderStatus = z.infer<typeof OrderStatus>;

// Order item schema
export const orderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1),
  subtotal: z.number(),
});

// Order schema validation with Zod
export const orderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: OrderStatus,
  total: z.number(),
  items: z.array(orderItemSchema),
  shippingAddress: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

// TypeScript types derived from the schemas
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;

// Database table definitions (for future ORM or query builder)
export const orderTable = {
  name: 'orders',
  columns: {
    id: 'text primary key',
    customerId: 'text not null references users(id)',
    status: 'text not null',
    total: 'numeric not null',
    shippingAddress: 'text not null',
    createdAt: 'timestamp not null default now()',
    updatedAt: 'timestamp',
  },
  relations: {
    customer: {
      table: 'users',
      column: 'customerId',
      foreignColumn: 'id',
    },
    items: {
      table: 'order_items',
      column: 'id',
      foreignColumn: 'orderId',
    },
  },
};

export const orderItemTable = {
  name: 'order_items',
  columns: {
    id: 'text primary key',
    orderId: 'text not null references orders(id)',
    productId: 'text not null references products(id)',
    productName: 'text not null',
    price: 'numeric not null',
    quantity: 'integer not null',
    subtotal: 'numeric not null',
  },
  relations: {
    order: {
      table: 'orders',
      column: 'orderId',
      foreignColumn: 'id',
    },
    product: {
      table: 'products',
      column: 'productId',
      foreignColumn: 'id',
    },
  },
};
