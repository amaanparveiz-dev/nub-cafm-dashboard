import logo from '../../assets/logo.png';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="topbar">
      <button className="menu" type="button" aria-label="Open menu" onClick={onMenuClick}>☰</button>
      <img className="tblogo" src={logo} alt="NUB CAFM" />
      <span>Operations</span>
      <span>/</span>
      <b>Overview</b>
      <span className="sp" />
      <div className="sbox">⌕ Search pages...<kbd>⌘ K</kbd></div>
      <span className="ico" aria-label="Notifications">🔔</span>
    </div>
  );
}
