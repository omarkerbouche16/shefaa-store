import { v4 as uuidv4 } from 'uuid';
import type { CartItem } from '@/types/commerce';
import type { PixelContentItem } from '@/types/tracking';

export function generateEventId(): string {
  return uuidv4();
}

function cartItemsToPixelContent(items: CartItem[]): PixelContentItem[] {
  return items.map((item) => ({
    id: item.productId,
    quantity: item.offer.pieces * item.quantity,
    item_price: item.offer.priceDa,
  }));
}

function totalValue(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.offer.priceDa * item.quantity, 0);
}

export function trackPageView() {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'PageView');
  window.ttq?.track('ViewContent');
  window.snaptr?.('track', 'PAGE_VIEW');
}

export function trackViewContent(product: { id: string; name: string; price: number }) {
  if (typeof window === 'undefined') return;
  const data = {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'DZD',
  };
  window.fbq?.('track', 'ViewContent', data);
  window.ttq?.track('ViewContent', { content_id: product.id, value: product.price, currency: 'DZD' });
  window.snaptr?.('track', 'VIEW_CONTENT', { item_ids: [product.id] });
}

export function trackAddToCart(
  items: CartItem[],
  eventId: string
) {
  if (typeof window === 'undefined') return;
  const value = totalValue(items);
  const contentIds = items.map((i) => i.productId);
  const content = cartItemsToPixelContent(items);

  window.fbq?.(
    'track',
    'AddToCart',
    {
      content_ids: contentIds,
      contents: content,
      content_type: 'product',
      value,
      currency: 'DZD',
    },
    { eventID: eventId }
  );

  window.ttq?.track('AddToCart', {
    content_id: contentIds[0],
    value,
    currency: 'DZD',
  });

  window.snaptr?.('track', 'ADD_CART', { item_ids: contentIds });
}

export function trackInitiateCheckout(items: CartItem[], eventId: string) {
  if (typeof window === 'undefined') return;
  const value = totalValue(items);
  const contentIds = items.map((i) => i.productId);

  window.fbq?.(
    'track',
    'InitiateCheckout',
    {
      content_ids: contentIds,
      value,
      currency: 'DZD',
      num_items: items.length,
    },
    { eventID: eventId }
  );

  window.ttq?.track('InitiateCheckout', { value, currency: 'DZD' });
  window.snaptr?.('track', 'START_CHECKOUT', { item_ids: contentIds });
}

export function trackPurchase(
  items: CartItem[],
  orderId: string,
  totalDa: number,
  eventId: string
) {
  if (typeof window === 'undefined') return;
  const contentIds = items.map((i) => i.productId);
  const content = cartItemsToPixelContent(items);

  window.fbq?.(
    'track',
    'Purchase',
    {
      content_ids: contentIds,
      contents: content,
      content_type: 'product',
      value: totalDa,
      currency: 'DZD',
      order_id: orderId,
    },
    { eventID: eventId }
  );

  window.ttq?.track('CompletePayment', {
    content_id: contentIds[0],
    value: totalDa,
    currency: 'DZD',
    order_id: orderId,
  });

  window.snaptr?.('track', 'PURCHASE', {
    item_ids: contentIds,
    price: totalDa,
    currency: 'DZD',
    transaction_id: orderId,
  });
}
