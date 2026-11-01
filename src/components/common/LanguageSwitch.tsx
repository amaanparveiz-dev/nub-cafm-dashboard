import { useLocale } from '../../context/LocaleContext';

export default function LanguageSwitch({ className = 'lang' }: { className?: string }) {
  const { locale, toggleLocale, t } = useLocale();
  return (
    <button type="button" className={className} onClick={toggleLocale} aria-label={t('lang.aria')}>
      {locale === 'en' ? t('lang.switchToAr') : t('lang.switchToEn')}
    </button>
  );
}
