import type { UTMParams } from '@/types/tracking';

const UTM_STORAGE_KEY = 'shefaa_utm';

const UTM_PARAMS: (keyof UTMParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'ttclid',
  'ScCid',
];

export function captureUTMFromURL(): UTMParams {
  if (typeof window === 'undefined') {
    return emptyUTM();
  }

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = emptyUTM();

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      (utm as unknown as Record<string, string | null>)[key] = value;
    }
  }

  const hasAnyValue = Object.values(utm).some((v) => v !== null);
  if (hasAnyValue) {
    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    } catch {
      // localStorage unavailable
    }
  }

  return utm;
}

export function getStoredUTM(): UTMParams {
  if (typeof window === 'undefined') return emptyUTM();
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UTMParams;
    }
  } catch {
    // parse error
  }
  return emptyUTM();
}

export function getUTMForOrder(): Record<string, string | null> {
  const utm = getStoredUTM();
  return utm as unknown as Record<string, string | null>;
}

function emptyUTM(): UTMParams {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    fbclid: null,
    ttclid: null,
    ScCid: null,
  };
}
