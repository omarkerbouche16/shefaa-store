export interface DailyPoint {
  date: string;
  orders: number;
  revenue: number;
  page_views: number;
}

export interface ProductStat {
  product_id: string;
  name: string;
  count: number;
  revenue: number;
}

export interface UtmStat {
  source: string;
  count: number;
}

export interface StatusStat {
  status: string;
  count: number;
}

export interface DashboardMetrics {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  total_page_views: number;
  unique_sessions: number;
  conversion_rate: number;
  orders_by_status: StatusStat[];
  daily_series: DailyPoint[];
  top_products: ProductStat[];
  utm_sources: UtmStat[];
}

export interface AdminOrderItem {
  order_id: string;
  friendly_id: string;
  created_at: string;
  customer_name: string;
  phone_local: string | null;
  status: string;
  total_da: number | null;
  subtotal_da: number | null;
  items_count: number;
  utm_source: string | null;
  ip_address: string | null;
}

export interface AdminOrderDetail {
  order_id: string;
  friendly_id: string;
  created_at: string;
  customer_name: string;
  phone_local: string | null;
  phone_e164: string | null;
  status: string;
  subtotal_da: number | null;
  shipping_da: number;
  total_da: number | null;
  currency: string;
  items_json: CartItem[] | null;
  upsell_json: Record<string, unknown> | null;
  utm_json: Record<string, string | null> | null;
  landing_page: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_address: string | null;
  sheet_synced_at: string | null;
  tracking_synced_at: string | null;
  event_ids_json: Record<string, string> | null;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  offer: { pieces: number; priceDa: number; label: string };
  quantity: number;
}

export interface OrdersListResponse {
  items: AdminOrderItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TrafficStats {
  total_page_views: number;
  unique_sessions: number;
  valid_algeria: number;
  vpn_blocked: number;
  daily_series: DailyPoint[];
}
