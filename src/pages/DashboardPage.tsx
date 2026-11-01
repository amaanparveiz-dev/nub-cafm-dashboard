import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatPanel from '../components/dashboard/ChatPanel';
import Icon from '../components/common/Icon';
import OverviewGrid from '../components/dashboard/OverviewGrid';
import Sidebar from '../components/dashboard/Sidebar';
import StatsBar from '../components/dashboard/StatsBar';
import Topbar from '../components/dashboard/Topbar';
import { useRequiredUser } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { STATS } from '../data/dashboardData';
import useCardLayout from '../hooks/useCardLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import type { LoginLocationState } from '../types';
import { displayName, getGreetingKey } from '../utils/format';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { t, locale } = useLocale();
  useDocumentTitle(t('dashboard.docTitle'));
  const { user, signOut } = useRequiredUser();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const cardLayout = useCardLayout();

  useEffect(() => {
    document.body.classList.toggle('nav-open', isNavOpen);
    return () => document.body.classList.remove('nav-open');
  }, [isNavOpen]);

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true, state: { signedOut: true } satisfies LoginLocationState });
  };

  return (
    <>
      <div className="scrim" onClick={() => setIsNavOpen(false)} />
      <Sidebar user={user} onNavigate={() => setIsNavOpen(false)} onSignOut={handleSignOut} />

      <div className="wrap">
        <Topbar onMenuClick={() => setIsNavOpen((open) => !open)} />
        <main>
          <div className="ovh">
            <div>
              <h1>{t('overview.heading')}</h1>
              <p className="lead">
                {t('overview.hello', { greeting: t(getGreetingKey()), name: displayName(user, locale) })}
              </p>
            </div>
            <button className="rzreset" type="button" onClick={cardLayout.resetAll}>
              <Icon name="reset" size={14} strokeWidth={2} /> {t('overview.resetLayout')}
            </button>
          </div>

          <StatsBar stats={STATS} />
          <OverviewGrid {...cardLayout} />
        </main>
      </div>

      <ChatPanel user={user} />
    </>
  );
}
