import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/logo.png';
import { useLocale } from '../../context/LocaleContext';
import { NAV_ITEMS, WORKSPACE } from '../../data/dashboardData';
import type { User } from '../../types';
import { onActivateKey } from '../../utils/a11y';
import { displayName, getInitials } from '../../utils/format';
import Icon from '../common/Icon';

interface SidebarProps {
  user: User;
  onNavigate: () => void;
  onSignOut: () => void;
}

const NAV_KEYS = {
  overview: 'nav.overview',
  assets: 'nav.assets',
  maintenance: 'nav.maintenance',
  softServices: 'nav.softServices',
  healthSafety: 'nav.healthSafety',
  visitors: 'nav.visitors',
  spaces: 'nav.spaces',
  property: 'nav.property',
} as const;

export default function Sidebar({ user, onNavigate, onSignOut }: SidebarProps) {
  const { t, locale } = useLocale();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const name = displayName(user, locale);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const toggleWorkspace = () => setWorkspaceOpen((open) => !open);
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <aside className="sidebar">
      <div className="brand"><img src={logo} alt="NUB CAFM" /></div>

      <div className={`wsw${workspaceOpen ? ' open' : ''}`}>
        <div
          className="ws"
          role="button"
          tabIndex={0}
          aria-expanded={workspaceOpen}
          aria-controls="workspace-details"
          onClick={toggleWorkspace}
          onKeyDown={onActivateKey(toggleWorkspace)}
        >
          <div className="i">▥</div>
          <div><b>{WORKSPACE.name}</b><small>{t('workspace.subtitle')}</small></div>
          <span className="ch"><Icon name="chevronDown" size={14} strokeWidth={2.2} /></span>
        </div>
        <div className="wsx" id="workspace-details">
          <div><span>{t('workspace.clientId')}</span><b>{WORKSPACE.clientId}</b></div>
          <div><span>{t('workspace.email')}</span><b>{user.email}</b></div>
        </div>
      </div>

      <div className="lbl">{t('topbar.operations')}</div>
      <nav className="nav">
        {NAV_ITEMS.map(({ id, icon, active }) => (
          <a
            key={id}
            href="#"
            className={active ? 'on' : undefined}
            aria-current={active ? 'page' : undefined}
            onClick={(event) => { event.preventDefault(); onNavigate(); }}
          >
            <span>{icon}</span>{t(NAV_KEYS[id])}
          </a>
        ))}
      </nav>

      <div className={`mew${menuOpen ? ' open' : ''}`} ref={menuRef}>
        <div className="mex" id="account-menu" role="menu" aria-label={t('account.aria')}>
          <div className="mxh"><small>{t('account.signedInAs')}</small><b>{user.email}</b></div>
          <button type="button" className="signout" role="menuitem" onClick={onSignOut}>
            <Icon name="signOut" size={16} strokeWidth={1.9} />
            <span>{t('account.signOut')}</span>
          </button>
        </div>
        <div
          className="me"
          ref={menuButtonRef}
          role="button"
          tabIndex={0}
          aria-expanded={menuOpen}
          aria-controls="account-menu"
          onClick={toggleMenu}
          onKeyDown={onActivateKey(toggleMenu)}
        >
          <div className="av">{getInitials(name)}</div>
          <div><b>{name}</b><small>{t('account.member')}</small></div>
          <span className="ch"><Icon name="chevronDown" size={14} strokeWidth={2.2} /></span>
        </div>
      </div>
    </aside>
  );
}
