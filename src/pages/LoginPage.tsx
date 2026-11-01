import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import ForgotPasswordForm from '../components/login/ForgotPasswordForm';
import SignInForm from '../components/login/SignInForm';
import Skyline from '../components/login/Skyline';
import type { BannerState, LoginLocationState } from '../types';
import { MESSAGES } from '../constants/messages';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import '../styles/login.css';

export default function LoginPage() {
  useDocumentTitle('Sign in – NUB CAFM');
  const { signIn } = useAuth();
  const { state } = useLocation() as { state: LoginLocationState | null };
  const [view, setView] = useState<'signin' | 'forgot'>('signin');
  const [lastEmail, setLastEmail] = useState('');
  const notice: BannerState | null = state?.signedOut ? { type: 'info', message: MESSAGES.signedOut } : null;

  return (
    <div id="loginRoot">
      <div className="shell">
        <main className="auth">
          <header className="top">
            <img className="lg-logo" src={logo} alt="NUB CAFM" width={112} height={59} />
          </header>

          <div className="panel">
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

          <footer className="lg-foot">Need access? Ask your workspace administrator.</footer>
        </main>

        <aside className="stage">
          <div className="stage-copy">
            <p className="stage-title">Every floor and every asset, in one view.</p>
            <p className="stage-sub">Manage maintenance, visitors, spaces and safety across all your properties.</p>
          </div>
          <div className="sky-wrap"><Skyline /></div>
          <div className="legend">
            <span><i /><span>Running normally</span></span>
            <span className="x"><i /><span>Needs attention</span></span>
          </div>
        </aside>
      </div>
    </div>
  );
}
