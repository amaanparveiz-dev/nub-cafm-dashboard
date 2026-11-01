import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatPanel from '../components/dashboard/ChatPanel';
import Icon from '../components/common/Icon';
import OverviewGrid from '../components/dashboard/OverviewGrid';
import Sidebar from '../components/dashboard/Sidebar';
import StatsBar from '../components/dashboard/StatsBar';
import Topbar from '../components/dashboard/Topbar';
import { useRequiredUser } from '../context/AuthContext';
import { STATS } from '../data/dashboardData';
import useCardLayout from '../hooks/useCardLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import type { LoginLocationState } from '../types';
import { getGreeting } from '../utils/format';
import '../styles/dashboard.css';

export default function DashboardPage() {
  useDocumentTitle('NUB CAFM - Overview');
  const { user, signOut } = useRequiredUser();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const cardLayout = useCardLayout();

  // The stylesheet slides the sidebar in on small screens via a body class.
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
              <h1>Overview</h1>
              <p className="lead">
                {getGreeting()}, {user.name}
                {user.nameAr && <> / <span className="ar" lang="ar">{user.nameAr}</span></>}. Here’s where to focus today.
              </p>
            </div>
            <button className="rzreset" type="button" onClick={cardLayout.resetAll}>
              <Icon name="reset" size={14} strokeWidth={2} /> Reset layout
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
