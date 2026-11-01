import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AUTH_CONFIG, STORAGE_KEYS } from '../../constants/config';
import { AuthError, authenticate, authenticateWithAzure, DEMO_ACCOUNT } from '../../services/authService';
import { useLocale } from '../../context/LocaleContext';
import useLockout from '../../hooks/useLockout';
import type { BannerState, User } from '../../types';
import { localStore } from '../../utils/storage';
import { validateEmail } from '../../utils/validation';
import AzureLogo from '../common/AzureLogo';
import Icon from '../common/Icon';
import Banner from './Banner';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

const SUCCESS_DELAY_MS = 700;
type Status = 'idle' | 'busy' | 'azure' | 'done';

interface FieldErrors {
  email?: string | null;
  password?: string | null;
}

interface SignInFormProps {
  notice: BannerState | null;
  onForgotPassword: (email: string) => void;
  onAuthenticated: (user: User, remember: boolean) => void;
}

export default function SignInForm({ notice, onForgotPassword, onAuthenticated }: SignInFormProps) {
  const { t } = useLocale();
  const lockout = useLockout();
  const [email, setEmail] = useState(() => localStore.get(STORAGE_KEYS.lastEmail) ?? '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => Boolean(localStore.get(STORAGE_KEYS.lastEmail)));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [banner, setBanner] = useState<BannerState | null>(notice);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    titleRef.current?.focus();
    return () => clearTimeout(redirectTimer.current);
  }, []);

  useEffect(() => {
    setBanner(notice);
  }, [notice]);

  const setFieldError = (field: keyof FieldErrors, message: string | null) => setErrors((prev) => ({ ...prev, [field]: message }));
  const showError = (message: string) => setBanner({ type: 'error', message });
  const activeBanner: BannerState | null = lockout.isLocked
    ? { type: 'error', message: t('error.locked', { s: lockout.secondsLeft }) }
    : banner;

  const submitLabel = status === 'busy' ? t('login.busy') : status === 'done' ? t('login.done') : t('login.submit');

  function handleFailure(error: unknown) {
    if (!(error instanceof AuthError) || error.code !== 'bad_credentials') {
      showError(t('error.network'));
      return;
    }
    const { locked, attemptsLeft } = lockout.recordFailure();
    if (locked) {
      setPassword('');
      return;
    }
    showError(attemptsLeft <= 2 ? t('error.badCredsLeft', { n: attemptsLeft }) : t('error.badCreds'));
    passwordRef.current?.select();
  }

  function finishSignIn(user: User, rememberedEmail = user.email) {
    lockout.reset();
    if (remember) localStore.set(STORAGE_KEYS.lastEmail, rememberedEmail);
    else localStore.remove(STORAGE_KEYS.lastEmail);
    setStatus('done');
    setBanner({ type: 'success', message: t('info.success') });
    redirectTimer.current = setTimeout(() => onAuthenticated(user, remember), SUCCESS_DELAY_MS);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== 'idle' || lockout.isLocked) return;
    setBanner(null);

    const trimmedEmail = email.trim();
    const nextErrors = {
      email: validateEmail(trimmedEmail, t),
      password: password ? null : t('error.passwordRequired'),
    };
    setErrors(nextErrors);
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    setStatus('busy');
    try {
      const user = await authenticate(trimmedEmail, password);
      finishSignIn(user, trimmedEmail);
    } catch (error) {
      setStatus('idle');
      handleFailure(error);
    }
  }

  async function handleAzure() {
    if (status !== 'idle' || lockout.isLocked) return;
    setBanner(null);
    setStatus('azure');
    try {
      const user = await authenticateWithAzure();
      finishSignIn(user);
    } catch (error) {
      setStatus('idle');
      handleFailure(error);
    }
  }

  function fillDemoAccount() {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setErrors({});
    submitRef.current?.focus();
  }

  const busy = status === 'busy' || status === 'azure';

  return (
    <section aria-labelledby="signin-title">
      <h1 id="signin-title" ref={titleRef} tabIndex={-1}>{t('login.heading')}</h1>
      <p className="lg-sub">{t('login.sub')}</p>
      <Banner banner={activeBanner} />

      <form onSubmit={handleSubmit} noValidate>
        <EmailField
          id="email"
          value={email}
          error={errors.email}
          inputRef={emailRef}
          autoComplete="username"
          onChange={(value) => { setEmail(value); setFieldError('email', null); }}
          onBlur={() => email.trim() && setFieldError('email', validateEmail(email.trim(), t))}
        />
        <PasswordField
          value={password}
          error={errors.password}
          inputRef={passwordRef}
          onChange={(value) => { setPassword(value); setFieldError('password', null); }}
        />

        <div className="lg-row">
          <label className="check" htmlFor="remember">
            <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>{t('login.remember')}</span>
          </label>
          <button type="button" className="link" onClick={() => onForgotPassword(email.trim())}>{t('login.forgot')}</button>
        </div>

        <button
          ref={submitRef}
          className="btn primary"
          type="submit"
          aria-busy={status === 'busy'}
          aria-disabled={lockout.isLocked || undefined}
        >
          {status === 'busy' && <span className="spin" aria-hidden="true" />}
          {status === 'done' && <Icon name="tick" className="lg-ic done" />}
          <span>{submitLabel}</span>
        </button>

        <div className="or" aria-hidden="true"><span>{t('login.or')}</span></div>
        <button
          className="btn ghost azure"
          type="button"
          onClick={handleAzure}
          aria-busy={status === 'azure'}
          disabled={busy || lockout.isLocked}
        >
          {status === 'azure' ? <span className="spin dark" aria-hidden="true" /> : <AzureLogo />}
          <span>{status === 'azure' ? t('login.azureBusy') : t('login.azure')}</span>
        </button>
      </form>

      {AUTH_CONFIG.showDemo && (
        <aside className="demo">
          <span>
            <b>{t('login.demo')}</b> <span>{t('login.demoHint', { email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })}</span>
          </span>
          <button type="button" className="link" onClick={fillDemoAccount}>{t('login.fillDemo')}</button>
        </aside>
      )}
    </section>
  );
}
