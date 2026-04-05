import type { Product } from './product';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: string;
  items: OrderItem[];
  custom_design: Record<string, unknown> | null;
  design_summary: string | null;
  status: string;
  whatsapp_sent: boolean;
  created_at: Date;
  notes: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
