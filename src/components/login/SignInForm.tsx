import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AUTH_CONFIG, STORAGE_KEYS } from '../../constants/config';
import { MESSAGES } from '../../constants/messages';
import { AuthError, authenticate, DEMO_ACCOUNT } from '../../services/authService';
import useLockout from '../../hooks/useLockout';
import type { BannerState, User } from '../../types';
import { localStore } from '../../utils/storage';
import { validateEmail } from '../../utils/validation';
import Icon from '../common/Icon';
import Banner from './Banner';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

const SUCCESS_DELAY_MS = 700;
type Status = 'idle' | 'busy' | 'done';

interface FieldErrors {
  email?: string | null;
  password?: string | null;
}

interface SignInFormProps {
  notice: BannerState | null;
  onForgotPassword: (email: string) => void;
  onAuthenticated: (user: User, remember: boolean) => void;
}

const SUBMIT_LABELS: Record<Status, string> = { idle: 'Sign in', busy: 'Signing in…', done: 'Signed in' };

export default function SignInForm({ notice, onForgotPassword, onAuthenticated }: SignInFormProps) {
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

  const setFieldError = (field: keyof FieldErrors, message: string | null) => setErrors((prev) => ({ ...prev, [field]: message }));
  const showError = (message: string) => setBanner({ type: 'error', message });
  const activeBanner: BannerState | null = lockout.isLocked
    ? { type: 'error', message: MESSAGES.locked(lockout.secondsLeft) }
    : banner;

  function handleFailure(error: unknown) {
    if (!(error instanceof AuthError) || error.code !== 'bad_credentials') {
      showError(MESSAGES.network);
      return;
    }
    const { locked, attemptsLeft } = lockout.recordFailure();
    if (locked) {
      setPassword('');
      return;
    }
    showError(attemptsLeft <= 2 ? MESSAGES.badCredsLeft(attemptsLeft) : MESSAGES.badCreds);
    passwordRef.current?.select();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== 'idle' || lockout.isLocked) return;
    setBanner(null);

    const trimmedEmail = email.trim();
    const nextErrors = {
      email: validateEmail(trimmedEmail),
      password: password ? null : MESSAGES.passwordRequired,
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
      lockout.reset();
      if (remember) localStore.set(STORAGE_KEYS.lastEmail, trimmedEmail);
      else localStore.remove(STORAGE_KEYS.lastEmail);
      setStatus('done');
      setBanner({ type: 'success', message: MESSAGES.success });
      redirectTimer.current = setTimeout(() => onAuthenticated(user, remember), SUCCESS_DELAY_MS);
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

  return (
    <section aria-labelledby="signin-title">
      <h1 id="signin-title" ref={titleRef} tabIndex={-1}>Sign in</h1>
      <p className="lg-sub">Use your work email to open your workspace.</p>
      <Banner banner={activeBanner} />

      <form onSubmit={handleSubmit} noValidate>
        <EmailField
          id="email"
          value={email}
          error={errors.email}
          inputRef={emailRef}
          autoComplete="username"
          onChange={(value) => { setEmail(value); setFieldError('email', null); }}
          onBlur={() => email.trim() && setFieldError('email', validateEmail(email.trim()))}
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
            <span>Remember me on this device</span>
          </label>
          <button type="button" className="link" onClick={() => onForgotPassword(email.trim())}>Forgot password?</button>
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
          <span>{SUBMIT_LABELS[status]}</span>
        </button>

        <div className="or" aria-hidden="true"><span>or</span></div>
        <button className="btn ghost" type="button" onClick={() => setBanner({ type: 'info', message: MESSAGES.ssoOff })}>
          Continue with single sign-on
        </button>
      </form>

      {AUTH_CONFIG.showDemo && (
        <aside className="demo">
          <span>
            <b>Demo workspace.</b> <span>Sign in with {DEMO_ACCOUNT.email} and {DEMO_ACCOUNT.password}.</span>
          </span>
          <button type="button" className="link" onClick={fillDemoAccount}>Fill demo account</button>
        </aside>
      )}
    </section>
  );
}
