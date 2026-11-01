import type { RefObject } from 'react';
import { useLocale } from '../../context/LocaleContext';

interface EmailFieldProps {
  id: string;
  value: string;
  error?: string | null;
  inputRef: RefObject<HTMLInputElement>;
  autoComplete: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export default function EmailField({ id, value, error, inputRef, autoComplete, onChange, onBlur }: EmailFieldProps) {
  const { t } = useLocale();
  return (
    <div className="field">
      <label htmlFor={id}>{t('login.email')}</label>
      <input
        id={id}
        ref={inputRef}
        type="email"
        autoComplete={autoComplete}
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        dir="ltr"
        placeholder={t('login.emailPlaceholder')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-err`}
        required
      />
      {error && <p className="err" id={`${id}-err`}>{error}</p>}
    </div>
  );
}
