import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { requestPasswordReset } from '../../services/authService';
import { useLocale } from '../../context/LocaleContext';
import type { BannerState } from '../../types';
import { validateEmail } from '../../utils/validation';
import Icon from '../common/Icon';
import Banner from './Banner';
import EmailField from './EmailField';

interface ForgotPasswordFormProps {
  initialEmail: string;
  onBack: () => void;
}

type Status = 'idle' | 'busy' | 'sent';

export default function ForgotPasswordForm({ initialEmail, onBack }: ForgotPasswordFormProps) {
  const { t } = useLocale();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [banner, setBanner] = useState<BannerState | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'busy') return;
    const trimmedEmail = email.trim();
    const validationError = validateEmail(trimmedEmail, t);
    setError(validationError);
    if (validationError) {
      emailRef.current?.focus();
      return;
    }

    setStatus('busy');
    try {
      await requestPasswordReset(trimmedEmail);
      setEmail(trimmedEmail);
      setStatus('sent');
    } catch {
      setStatus('idle');
      setBanner({ type: 'error', message: t('error.network') });
    }
  }

  return (
    <section aria-labelledby="forgot-title">
      <h1 id="forgot-title" ref={titleRef} tabIndex={-1}>{t('forgot.heading')}</h1>
      <p className="lg-sub">{t('forgot.sub')}</p>
      <Banner banner={banner} />

      {status === 'sent' ? (
        <div className="sent">
          <div className="lg-note" role="status">
            <Icon name="check" className="lg-ic" />
            <p>{t('info.resetSent', { email })}</p>
          </div>
          <button type="button" className="btn ghost" onClick={onBack}>{t('forgot.back')}</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <EmailField
            id="f-email"
            value={email}
            error={error}
            inputRef={emailRef}
            autoComplete="email"
            onChange={(value) => { setEmail(value); setError(null); }}
          />
          <button className="btn primary" type="submit" aria-busy={status === 'busy'}>
            {status === 'busy' && <span className="spin" aria-hidden="true" />}
            <span>{status === 'busy' ? t('forgot.sending') : t('forgot.send')}</span>
          </button>
          <p className="back">
            <button type="button" className="link" onClick={onBack}>{t('forgot.back')}</button>
          </p>
        </form>
      )}
    </section>
  );
}
