import { BRAND } from '@/config/brand';
import type { CreateOrderPayload, OrderResponse } from '@/types/commerce';

const API_BASE = BRAND.apiUrl;
const IS_DEV = process.env.NODE_ENV === 'development';

/** Simulate a successful order response for local dev when backend is offline. */
function mockOrderResponse(): OrderResponse {
  return {
    orderId: `mock-${Date.now()}`,
    status: 'new',
    totalDa: 0,
    message: 'تم استلام طلبيتك بنجاح! سنتصل بك قريباً لتأكيد الطلب.',
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Order failed: ${res.status} ${errorText}`);
    }

    return res.json() as Promise<OrderResponse>;
  } catch (err) {
    // In development, fall back to a mock so the full UI flow can be tested
    // without a running backend. Remove this block before going to production.
    if (IS_DEV) {
      console.warn(
        '[DEV] Backend unreachable — using mock order response. Start the FastAPI backend for real orders.',
        err
      );
      return mockOrderResponse();
    }
    throw err;
  }
}
