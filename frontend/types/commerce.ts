export type OfferPieces = 1 | 2 | 3;

export interface Offer {
  pieces: OfferPieces;
  priceDa: number;
  label: string;
  badge: string;
  perPieceDa?: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  offer: {
    pieces: OfferPieces;
    priceDa: number;
    label: string;
  };
  quantity: number;
  source: 'product_page' | 'collection' | 'cart_cross_sell' | 'upsell';
}

export type ProductCategory =
  | 'hair'
  | 'skin'
  | 'food'
  | 'beauty'
  | 'herbs';

export interface Product {
  id: string;
  slug: string;
  sku: string;
  arabicName: string;
  category: ProductCategory;
  headline: string;
  subheadline: string;
  defaultOffer: OfferPieces;
  prices: { 1: number; 2: number; 3: number };
  upsell: { slug: string; priceDa: number };
  rating: number;
  reviewCount: number;
  scarcity: string;
  crossSells: string[];
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  disclaimer: string;
}

export interface CreateOrderPayload {
  customerName: string;
  phoneLocal: string;
  phoneE164: string;
  items: CartItem[];
  subtotalDa: number;
  upsell?: {
    productId: string;
    priceDa: 999;
    accepted: boolean;
  };
  utm: Record<string, string | null>;
  landingPage: string;
  eventIds: {
    initiateCheckout?: string;
    purchase: string;
  };
}

export interface OrderResponse {
  orderId: string;
  status: string;
  totalDa?: number;
  message?: string;
}
