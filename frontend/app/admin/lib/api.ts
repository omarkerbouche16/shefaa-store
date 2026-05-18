import type {
  AdminOrderDetail,
  DashboardMetrics,
  OrdersListResponse,
  TrafficStats,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ── Token storage ────────────────────────────────────────────────────────────

const TOKEN_KEY = "shefaa_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ── Base fetch ───────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function adminLogin(
  username: string,
  password: string
): Promise<{ access_token: string }> {
  const data = await apiFetch<{ access_token: string }>(
    "/api/admin/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }
  );
  setToken(data.access_token);
  return data;
}

// ── Metrics ──────────────────────────────────────────────────────────────────

export async function fetchMetrics(
  fromDate?: string,
  toDate?: string
): Promise<DashboardMetrics> {
  const params = new URLSearchParams();
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);
  const qs = params.toString() ? `?${params}` : "";
  return apiFetch<DashboardMetrics>(`/api/admin/metrics${qs}`);
}

// ── Orders ───────────────────────────────────────────────────────────────────

export async function fetchOrders(opts: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<OrdersListResponse> {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", String(opts.page));
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.status) params.set("status", opts.status);
  if (opts.search) params.set("search", opts.search);
  if (opts.fromDate) params.set("from_date", opts.fromDate);
  if (opts.toDate) params.set("to_date", opts.toDate);
  return apiFetch<OrdersListResponse>(`/api/admin/orders?${params}`);
}

export async function fetchOrder(id: string): Promise<AdminOrderDetail> {
  return apiFetch<AdminOrderDetail>(`/api/admin/orders/${id}`);
}

export async function updateOrderStatus(
  id: string,
  orderStatus: string
): Promise<void> {
  await apiFetch(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: orderStatus }),
  });
}

// ── Traffic ──────────────────────────────────────────────────────────────────

export async function fetchTraffic(
  fromDate?: string,
  toDate?: string
): Promise<TrafficStats> {
  const params = new URLSearchParams();
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);
  const qs = params.toString() ? `?${params}` : "";
  return apiFetch<TrafficStats>(`/api/admin/traffic${qs}`);
}
