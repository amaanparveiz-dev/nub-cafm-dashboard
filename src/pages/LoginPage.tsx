import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import LanguageSwitch from '../components/common/LanguageSwitch';
import ForgotPasswordForm from '../components/login/ForgotPasswordForm';
import SignInForm from '../components/login/SignInForm';
import Skyline from '../components/login/Skyline';
import type { BannerState, LoginLocationState } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import '../styles/login.css';

export default function LoginPage() {
  const { t } = useLocale();
  useDocumentTitle(t('login.docTitle'));
  const { signIn } = useAuth();
  const { state } = useLocation() as { state: LoginLocationState | null };
  const [view, setView] = useState<'signin' | 'forgot'>('signin');
  const [lastEmail, setLastEmail] = useState('');
  const notice: BannerState | null = state?.signedOut ? { type: 'info', message: t('info.signedOut') } : null;

  return (
    <div id="loginRoot">
      <div className="shell">
        <main className="auth">
          <header className="top">
            <LanguageSwitch />
          </header>

          <div className="panel">
            <div className="panel-logo">
              <img src={logo} alt="NUB CAFM" width={112} height={59} />
            </div>
            {view === 'signin' ? (
              <SignInForm
                notice={notice}
                onForgotPassword={(email) => { setLastEmail(email); setView('forgot'); }}
                onAuthenticated={signIn}
              />
            ) : (
              <ForgotPasswordForm initialEmail={lastEmail} onBack={() => setView('signin')} />
            )}
          </div>

          <footer className="lg-foot">{t('login.footer')}</footer>
        </main>

        <aside className="stage">
          <div className="stage-copy">
            <p className="stage-title">{t('login.stageTitle')}</p>
            <p className="stage-sub">{t('login.stageSub')}</p>
          </div>
          <div className="sky-wrap"><Skyline /></div>
          <div className="legend">
            <span><i /><span>{t('login.running')}</span></span>
            <span className="x"><i /><span>{t('login.attention')}</span></span>
          </div>
        </aside>
      </div>
    </div>
  );
}