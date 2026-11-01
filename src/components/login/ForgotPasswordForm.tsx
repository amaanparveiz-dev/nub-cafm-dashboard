import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { MESSAGES } from '../../constants/messages';
import { requestPasswordReset } from '../../services/authService';
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
    const validationError = validateEmail(trimmedEmail);
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
      setBanner({ type: 'error', message: MESSAGES.network });
    }
  }

  return (
    <section aria-labelledby="forgot-title">
      <h1 id="forgot-title" ref={titleRef} tabIndex={-1}>Reset your password</h1>
      <p className="lg-sub">Enter your work email and we’ll send you a link to choose a new password.</p>
      <Banner banner={banner} />

      {status === 'sent' ? (
        <div className="sent">
          <div className="lg-note" role="status">
            <Icon name="check" className="lg-ic" />
            <p>{MESSAGES.resetSent(email)}</p>
          </div>
          <button type="button" className="btn ghost" onClick={onBack}>Back to sign in</button>
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
            <span>{status === 'busy' ? 'Sending…' : 'Send reset link'}</span>
          </button>
          <p className="back">
            <button type="button" className="link" onClick={onBack}>Back to sign in</button>
          </p>
        </form>
      )}
    </section>
  );
}
