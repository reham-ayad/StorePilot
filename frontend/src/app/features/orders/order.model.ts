
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  product: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  store: string;
  owner: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: OrderPagination;
  };
}

export interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}
