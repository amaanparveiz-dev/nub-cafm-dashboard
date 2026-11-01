import { useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { useLocale } from '../../context/LocaleContext';
import Icon from '../common/Icon';

interface PasswordFieldProps {
  value: string;
  error?: string | null;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
}

export default function PasswordField({ value, error, inputRef, onChange }: PasswordFieldProps) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) => setCapsLockOn(Boolean(event.getModifierState('CapsLock')));
  const toggleVisible = () => {
    setVisible((current) => !current);
    inputRef.current?.focus();
  };

  return (
    <div className="field">
      <label htmlFor="password">{t('login.password')}</label>
      <div className="pw">
        <input
          id="password"
          ref={inputRef}
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          dir="ltr"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={trackCapsLock}
          onKeyUp={trackCapsLock}
          onBlur={() => setCapsLockOn(false)}
          aria-invalid={error ? true : undefined}
          aria-describedby="caps pw-err"
          required
        />
        <button
          type="button"
          className="eye"
          aria-pressed={visible}
          aria-controls="password"
          aria-label={visible ? t('login.hidePassword') : t('login.showPassword')}
          onClick={toggleVisible}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} className="lg-ic" />
        </button>
      </div>
      {capsLockOn && <p className="hint" id="caps">{t('login.capsLock')}</p>}
      {error && <p className="err" id="pw-err">{error}</p>}
    </div>
  );
}
