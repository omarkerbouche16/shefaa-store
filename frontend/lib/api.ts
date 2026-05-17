import { BRAND } from '@/config/brand';
import { PRODUCTS } from '@/config/products';
import type { CreateOrderPayload, OrderResponse } from '@/types/commerce';

const API_BASE = BRAND.apiUrl;
const IS_DEV = process.env.NODE_ENV === 'development';
const SHEET_URL = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL || '';

/** Simulate a successful order response for local dev when backend is offline. */
function mockOrderResponse(): OrderResponse {
  return {
    orderId: `mock-${Date.now()}`,
    status: 'new',
    totalDa: 0,
    message: 'تم استلام طلبيتك بنجاح! سنتصل بك قريباً لتأكيد الطلب.',
  };
}

/** Format date as DD/MM/YYYY */
function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Generate friendly order ID from any string */
function friendlyId(raw: string): string {
  if (raw.startsWith('mock-')) {
    return 'SHEFA' + raw.replace('mock-', '').slice(-8).toUpperCase();
  }
  return 'SHEFA' + raw.replace(/-/g, '').slice(0, 8).toUpperCase();
}

/** Normalize Algerian phone to local format 0XXXXXXXXX */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('213') && digits.length >= 11) return '0' + digits.slice(3);
  if (digits.startsWith('0') && digits.length >= 9) return digits.slice(0, 10);
  return phone;
}

/**
 * Fire the Google Sheet webhook directly from the browser.
 * Uses text/plain to avoid CORS preflight — Apps Script still receives the body.
 * Never throws; errors are silently logged.
 */
async function fireSheetWebhook(
  payload: CreateOrderPayload,
  response: OrderResponse,
): Promise<void> {
  if (!SHEET_URL) return;

  try {
    const products: string[] = [];
    const skus: string[] = [];
    const quantities: string[] = [];

    for (const item of payload.items) {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      products.push(product?.arabicName ?? item.name);
      skus.push(product?.sku ?? item.productId);
      quantities.push(String(item.offer.pieces * item.quantity));
    }

    const row = {
      'date':       fmtDate(new Date()),
      'order id':   friendlyId(response.orderId),
      'country':    'Algeria',
      'name':       payload.customerName,
      'phone':      normalizePhone(payload.phoneLocal),
      'product':    products.join('/'),
      'sku':        skus.join('/'),
      'quantity':   quantities.join('/'),
      'status':     '',
      'totalprice': String(response.totalDa ?? payload.subtotalDa),
    };

    // Use a Next.js API route as a proxy to avoid CORS restrictions
    await fetch('/api/sheet-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
  } catch (err) {
    console.warn('[sheet] webhook failed:', err);
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  let response: OrderResponse;

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

    response = await res.json() as OrderResponse;
  } catch (err) {
    if (IS_DEV) {
      console.warn(
        '[DEV] Backend unreachable — using mock order response.',
        err,
      );
      response = mockOrderResponse();
    } else {
      throw err;
    }
  }

  // Fire sheet webhook from frontend (works with or without backend)
  fireSheetWebhook(payload, response);

  return response;
}
