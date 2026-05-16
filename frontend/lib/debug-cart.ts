/**
 * Lightweight cart/interaction debug logger.
 * Active in dev automatically; force-enable in production with NEXT_PUBLIC_DEBUG_CART=1.
 */
export function debugCart(scope: string, message: string, data?: unknown): void {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_DEBUG_CART !== '1'
  ) {
    return;
  }
  // intentional debug output — disabled in production
  // biome-ignore lint/suspicious/noConsole: debug utility
  console.debug(`[shefaa:${scope}]`, message, ...(data !== undefined ? [data] : []));
}
