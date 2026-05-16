const ALGERIAN_MOBILE_REGEX = /^(0[567]\d{8}|(\+?213|00213)[567]\d{8})$/;

export function validateAlgerianPhone(input: string): boolean {
  const cleaned = input.replace(/[\s\-().]/g, '');
  return ALGERIAN_MOBILE_REGEX.test(cleaned);
}

export function normalizeToLocal(input: string): string {
  const cleaned = input.replace(/[\s\-().]/g, '');

  if (/^0[567]\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  if (/^(\+?213|00213)[567]\d{8}$/.test(cleaned)) {
    const withoutPrefix = cleaned.replace(/^(\+?213|00213)/, '');
    return `0${withoutPrefix}`;
  }

  return cleaned;
}

export function normalizeToE164(input: string): string {
  const local = normalizeToLocal(input);
  if (local.startsWith('0')) {
    return `+213${local.slice(1)}`;
  }
  return `+213${local}`;
}

export function normalizeForCAPI(input: string): string {
  const e164 = normalizeToE164(input);
  return e164.replace('+', '');
}

export const PHONE_ERROR_MESSAGE =
  'اكتب رقم هاتف جزائري صحيح يبدأ بـ 05 أو 06 أو 07.';
