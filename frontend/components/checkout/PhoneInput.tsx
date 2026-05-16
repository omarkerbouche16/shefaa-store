'use client';

import { useState, useCallback } from 'react';
import { validateAlgerianPhone, normalizeToLocal, PHONE_ERROR_MESSAGE } from '@/lib/phone';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (local: string, isValid: boolean) => void;
  error?: string;
  className?: string;
}

export default function PhoneInput({ value, onChange, error, className }: PhoneInputProps) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState('');

  const validate = useCallback((raw: string) => {
    if (!raw) {
      setInternalError('');
      onChange('', false);
      return;
    }
    const isValid = validateAlgerianPhone(raw);
    if (isValid) {
      setInternalError('');
      onChange(normalizeToLocal(raw), true);
    } else {
      setInternalError(PHONE_ERROR_MESSAGE);
      onChange(raw, false);
    }
  }, [onChange]);

  const displayError = error || (touched ? internalError : '');

  return (
    <div className={cn('space-y-1', className)}>
      <label className="block font-kufi text-sm font-semibold text-desert-olive">
        رقم الهاتف
        <span className="text-error-red mr-1">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="font-inter text-sm text-charcoal-ink/50 border-l border-border-sand pl-2">
            🇩🇿 +213
          </span>
        </div>
        <input
          type="tel"
          inputMode="numeric"
          dir="ltr"
          placeholder="05XXXXXXXX"
          value={value}
          onChange={(e) => validate(e.target.value)}
          onBlur={() => setTouched(true)}
          className={cn(
            'w-full pr-24 pl-4 py-3 rounded-xl border font-inter text-sm bg-white transition-colors outline-none',
            displayError
              ? 'border-error-red focus:ring-2 focus:ring-error-red/20'
              : 'border-border-sand focus:border-honey-gold focus:ring-2 focus:ring-honey-gold/20'
          )}
          aria-describedby={displayError ? 'phone-error' : undefined}
          aria-invalid={!!displayError}
        />
      </div>
      {displayError && (
        <p id="phone-error" className="font-plex text-xs text-error-red flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  );
}
