export const BRAND = {
  nameArabic: 'الشفاء',
  nameEnglish: 'Shefaa',
  domain: 'shefaa.shop',
  tagline: 'نقاوة الصحراء، حكمة الأجداد',
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://shefaa.shop',
  whatsapp: '+213XXXXXXXXX',
  email: 'support@shefaa.shop',
  social: {
    facebook: 'https://facebook.com/shefaa.shop',
    instagram: 'https://instagram.com/shefaa.shop',
    tiktok: 'https://tiktok.com/@shefaa.shop',
  },
} as const;
