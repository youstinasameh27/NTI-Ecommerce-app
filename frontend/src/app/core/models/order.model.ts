export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';

export interface OrderItem {
  product: string;
  variantId?: string | null;
  variantKey?: string | null;
  title: string;
  price: number;
  qty: number;
}

export interface OrderTotals {
  itemsTotal: number;
  shipping: number;
  grandTotal: number;
  currency: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totals: OrderTotals;
  paymentMethod: 'Cash'| 'visa'|'instapay';
  shippingAddress: {
    line1?: string;
    city?: string;
    governorate?: string;
    postalCode?: string;
    phone?: string;
  };
  status: OrderStatus;
  statusHistory: { status: OrderStatus; changedAt: string; changedBy?: string; note?: string; }[];
  createdAt: string;
}
