import logo from '../../assets/logo.png';
import { useLocale } from '../../context/LocaleContext';
import LanguageSwitch from '../common/LanguageSwitch';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useLocale();
  return (
    <div className="topbar">
      <button className="menu" type="button" aria-label={t('topbar.menu')} onClick={onMenuClick}>☰</button>
      <img className="tblogo" src={logo} alt="NUB CAFM" />
      <span>{t('topbar.operations')}</span>
      <span>/</span>
      <b>{t('topbar.overview')}</b>
      <span className="sp" />
      <div className="sbox">⌕ {t('topbar.search')}<kbd>⌘ K</kbd></div>
      <LanguageSwitch className="lang" />
      <span className="ico" aria-label={t('topbar.notifications')}>🔔</span>
    </div>
  );
}
