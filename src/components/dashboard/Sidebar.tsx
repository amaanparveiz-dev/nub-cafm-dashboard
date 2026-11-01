import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/logo.png';
import { NAV_ITEMS, WORKSPACE } from '../../data/dashboardData';
import type { User } from '../../types';
import { onActivateKey } from '../../utils/a11y';
import { getInitials } from '../../utils/format';
import Icon from '../common/Icon';

interface SidebarProps {
  user: User;
  onNavigate: () => void;
  onSignOut: () => void;
}

export default function Sidebar({ user, onNavigate, onSignOut }: SidebarProps) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  // Close the account menu on outside click or Escape.
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
          <div><b>{WORKSPACE.name}</b><small>{WORKSPACE.subtitle}</small></div>
          <span className="ch"><Icon name="chevronDown" size={14} strokeWidth={2.2} /></span>
        </div>
        <div className="wsx" id="workspace-details">
          <div><span>Client ID</span><b>{WORKSPACE.clientId}</b></div>
          <div><span>Email</span><b>{user.email}</b></div>
        </div>
      </div>

      <div className="lbl">Operations</div>
      <nav className="nav">
        {NAV_ITEMS.map(({ label, icon, active }) => (
          <a
            key={label}
            href="#"
            className={active ? 'on' : undefined}
            aria-current={active ? 'page' : undefined}
            onClick={(event) => { event.preventDefault(); onNavigate(); }}
          >
            <span>{icon}</span>{label}
          </a>
        ))}
      </nav>

      <div className={`mew${menuOpen ? ' open' : ''}`} ref={menuRef}>
        <div className="mex" id="account-menu" role="menu" aria-label="Account">
          <div className="mxh"><small>Signed in as</small><b>{user.email}</b></div>
          <button type="button" className="signout" role="menuitem" onClick={onSignOut}>
            <Icon name="signOut" size={16} strokeWidth={1.9} />
            <span>Sign out</span>
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
          <div className="av">{getInitials(user.name)}</div>
          <div><b>{user.name}</b><small>Workspace member</small></div>
          <span className="ch"><Icon name="chevronDown" size={14} strokeWidth={2.2} /></span>
        </div>
      </div>
    </aside>
  );
}
