'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Input, Spinner, toast } from '@heroui/react';
import { useCheckoutStore } from '@/store/checkout-store';
import { useCartStore } from '@/store/cart-store';
import { validateAlgerianPhone, normalizeToLocal, normalizeToE164, PHONE_ERROR_MESSAGE } from '@/lib/phone';
import { generateEventId } from '@/lib/tracking';
import { getUTMForOrder } from '@/lib/utm';
import { createOrder } from '@/lib/api';
import { getProductById } from '@/config/products';
import OrderSummary from './OrderSummary';
import UpsellModal from './UpsellModal';
import { TruckIcon, ShieldCheckIcon, CheckCircleIcon, StarIcon } from '@/components/common/Icons';

const schema = z.object({
  customerName: z.string().min(2, 'يرجى إدخال اسمك الكامل'),
  phone: z.string().refine(validateAlgerianPhone, PHONE_ERROR_MESSAGE),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutModal() {
  const router = useRouter();
  const {
    isOpen, step, closeCheckout, setCustomerInfo, setStep, setUpsellProduct,
    setOrderId, setEventIds, orderId, customerName, phoneLocal,
  } = useCheckoutStore();

  const { items, getTotalDa, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Lock scroll
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Navigate after done
  useEffect(() => {
    if (step === 'done' && orderId) {
      const params = new URLSearchParams({ orderId, name: customerName, phone: phoneLocal });
      clearCart();
      closeCheckout();
      router.push(`/thank-you?${params.toString()}`);
    }
  }, [step, orderId, customerName, phoneLocal, clearCart, closeCheckout, router]);

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const phoneLocalNorm = normalizeToLocal(data.phone);
      const phoneE164 = normalizeToE164(data.phone);

      setCustomerInfo(data.customerName, phoneLocalNorm, phoneE164);

      const initiateCheckoutEventId = generateEventId();
      const purchaseEventId = generateEventId();
      setEventIds({ initiateCheckout: initiateCheckoutEventId, purchase: purchaseEventId });

      const subtotalDa = getTotalDa();

      const firstProduct = items[0] ? getProductById(items[0].productId) : null;
      const upsellProductData = firstProduct ? getProductById(firstProduct.upsell.slug) ?? null : null;

      if (upsellProductData) setUpsellProduct(upsellProductData);

      const payload = {
        customerName: data.customerName,
        phoneLocal: phoneLocalNorm,
        phoneE164,
        items,
        subtotalDa,
        utm: getUTMForOrder(),
        landingPage: typeof window !== 'undefined' ? window.location.href : '',
        eventIds: { initiateCheckout: initiateCheckoutEventId, purchase: purchaseEventId },
      };

      const result = await createOrder(payload);
      setOrderId(result.orderId);

      if (upsellProductData) {
        setStep('upsell');
      } else {
        setStep('done');
      }
    } catch (err) {
      const errorMsg = 'حدث خطأ أثناء تأكيد الطلب. يرجى المحاولة مجدداً.';
      setSubmitError(errorMsg);
      toast.danger(errorMsg);
      console.error('Order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const [portalRoot, setPortalRoot] = useState<Element | null>(null);
  useEffect(() => { setPortalRoot(document.body); }, []);

  const content = (
    <>
      <AnimatePresence>
        {isOpen && step === 'checkout' && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal-ink/60 backdrop-blur-sm"
              style={{ zIndex: 60000 }}
              onClick={closeCheckout}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
              style={{ zIndex: 60000 }}
            >
              <div
                className="w-full sm:max-w-[420px] bg-white rounded-t-[1.75rem] sm:rounded-3xl shadow-warm-lg overflow-hidden max-h-[min(92vh,640px)] flex flex-col border border-border-sand/30"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative shrink-0 px-5 pt-4 pb-3 border-b border-border-sand/40 bg-white">
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={closeCheckout}
                    className="absolute left-3 top-3 rounded-full hover:bg-warm-sand/80"
                    aria-label="إغلاق"
                  >
                    <svg className="w-5 h-5 text-charcoal-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                  <h2 className="font-kufi font-bold text-lg text-center text-charcoal-ink pt-1 pr-8 pl-8">
                    إتمام الطلب
                  </h2>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                  {/* Urgency strip */}
                  <div className="rounded-2xl bg-rose-50/90 border border-rose-100 px-3 py-2.5 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-plex text-xs text-rose-900/90 text-center font-medium leading-snug">
                      آخر 48 ساعة على عرض الشحن المجاني
                    </p>
                  </div>

                  {/* Social proof */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon key={i} className="w-4 h-4 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-inter text-sm font-bold text-charcoal-ink">4.9</span>
                    <span className="text-charcoal-ink/30 hidden sm:inline">|</span>
                    <p className="font-plex text-xs text-charcoal-ink/65 text-center">
                      +3,200 زبونة جزائرية طلبن هذا الأسبوع
                    </p>
                  </div>

                  <OrderSummary items={items} totalDa={getTotalDa()} />

                  {/* Form */}
                  <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name field */}
                    <div className="space-y-1.5">
                      <label className="block font-kufi text-sm font-semibold text-charcoal-ink">
                        الاسم الكامل <span className="text-error-red">*</span>
                      </label>
                      <Input
                        {...register('customerName')}
                        type="text"
                        placeholder="مثال: فاطمة بن علي"
                        fullWidth
                        className={
                          errors.customerName
                            ? 'border-error-red! focus-visible:ring-error-red/20!'
                            : ''
                        }
                        aria-invalid={!!errors.customerName}
                      />
                      {errors.customerName && (
                        <p className="font-plex text-xs text-error-red">{errors.customerName.message}</p>
                      )}
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1.5">
                      <label className="block font-kufi text-sm font-semibold text-charcoal-ink">
                        رقم الهاتف الجزائري <span className="text-error-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
                          <span className="font-inter text-sm text-charcoal-ink/50 border-l border-border-sand pl-2">
                            🇩🇿 +213
                          </span>
                        </div>
                        <Input
                          {...register('phone')}
                          type="tel"
                          inputMode="numeric"
                          dir="ltr"
                          placeholder="05XXXXXXXX"
                          fullWidth
                          className={[
                            'pl-4! pr-24!',
                            errors.phone ? 'border-error-red!' : '',
                          ].join(' ')}
                          aria-invalid={!!errors.phone}
                        />
                      </div>
                      {errors.phone ? (
                        <p className="font-plex text-xs text-error-red">{errors.phone.message}</p>
                      ) : (
                        <p className="font-plex text-[11px] text-charcoal-ink/45">
                          يرجى إدخال رقم هاتف جزائري صحيح لتأكيد التوصيل
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <div className="p-3 bg-error-red/10 rounded-2xl border border-error-red/20">
                        <p className="font-plex text-xs text-error-red text-center">{submitError}</p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Footer CTA */}
                <div className="px-5 pb-5 pt-3 shrink-0 space-y-3 bg-white border-t border-border-sand/40">
                  <Button
                    type="submit"
                    form="checkout-form"
                    isDisabled={isSubmitting || items.length === 0}
                    isPending={isSubmitting}
                    fullWidth
                    className="min-h-[52px] bg-honey-gold hover:bg-desert-olive text-white font-kufi font-bold text-lg rounded-2xl shadow-lg gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" style={{ '--spinner-color': '#ffffff' } as React.CSSProperties} />
                        جاري تأكيد طلبك...
                      </>
                    ) : (
                      <>
                        <TruckIcon className="w-6 h-6" />
                        أكّدي الطلب — الدفع عند الاستلام
                      </>
                    )}
                  </Button>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: <ShieldCheckIcon className="w-5 h-5 text-desert-olive" />, text: 'بياناتك محمية' },
                      { icon: <CheckCircleIcon className="w-5 h-5 text-success-green" />, text: 'دفع عند الباب' },
                      { icon: <StarIcon className="w-5 h-5 text-honey-gold" />, text: 'ضمان 30 يوم' },
                    ].map((item) => (
                      <div key={item.text} className="flex flex-col items-center gap-1 text-center">
                        {item.icon}
                        <span className="font-plex text-[10px] text-charcoal-ink/50 leading-tight">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <UpsellModal />
    </>
  );

  if (!portalRoot) return null;
  return createPortal(content, portalRoot);
}
