import Link from 'next/link';
import Logo from './Logo';
import { BRAND } from '@/config/brand';
import FooterColumn from './FooterColumn';

export default function Footer() {
  return (
    <footer className="bg-deep-date text-warm-sand">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-4 md:col-span-2">
            <Logo size="md" />
            <p className="font-plex text-sm text-warm-sand/70 leading-relaxed max-w-sm">
              الشفاء متجر جزائري متخصص في المنتجات الطبيعية المختارة، مستوحاة من حكمة الأجداد وعطاء الصحراء.
            </p>
            <div className="flex gap-3">
              <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-warm-sand/10 hover:bg-honey-gold/20 transition-colors text-sm">
                f
              </a>
              <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-warm-sand/10 hover:bg-honey-gold/20 transition-colors text-sm">
                ig
              </a>
              <a href={BRAND.social.tiktok} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-warm-sand/10 hover:bg-honey-gold/20 transition-colors text-sm">
                tt
              </a>
            </div>
          </div>

          {/* Navigation */}
          <FooterColumn title="روابط سريعة">
            <ul className="space-y-3 md:space-y-2">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/products', label: 'كل المنتجات' },
                { href: '/about', label: 'من نحن' },
                { href: '/contact', label: 'تواصل معنا' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-plex text-sm text-warm-sand/70 hover:text-honey-gold transition-colors block py-1 md:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Legal & Policies */}
          <FooterColumn title="قانوني">
            <ul className="space-y-3 md:space-y-2">
              {[
                { href: '/policies/shipping', label: 'سياسة الشحن والتوصيل' },
                { href: '/policies/refund', label: 'سياسة الاستبدال والاسترجاع' },
                { href: '/policies/terms', label: 'الشروط والأحكام' },
                { href: '/policies/privacy', label: 'سياسة الخصوصية' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-plex text-sm text-warm-sand/70 hover:text-honey-gold transition-colors block py-1 md:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-warm-sand/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-center text-xs font-plex text-warm-sand/40 text-center">
            <p>© {new Date().getFullYear()} {BRAND.nameArabic} — {BRAND.domain}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
