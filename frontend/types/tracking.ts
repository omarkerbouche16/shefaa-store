export interface TrackingEventIds {
  addToCartEventId?: string;
  initiateCheckoutEventId?: string;
  purchaseEventId?: string;
}

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  ttclid: string | null;
  ScCid: string | null;
}

export interface PixelContentItem {
  id: string;
  quantity: number;
  item_price?: number;
}

export interface FBPixelEvent {
  event: string;
  data?: Record<string, unknown>;
}

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      data?: Record<string, unknown>,
      options?: Record<string, unknown>
    ) => void;
    ttq?: {
      track: (event: string, data?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
    };
    snaptr?: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}
