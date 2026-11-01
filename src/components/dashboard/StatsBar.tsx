import { useLocale } from '../../context/LocaleContext';
import type { MessageKey } from '../../i18n/messages';
import type { Stat } from '../../types';

export default function StatsBar({ stats }: { stats: Stat[] }) {
  const { t } = useLocale();
  return (
    <section className="card stats">
      {stats.map(({ id, icon, value, change, flat }) => (
        <div className="stat" key={id}>
          <h6>{icon} {t(`stat.${id}.title` as MessageKey)}</h6>
          <div className="n">{value} <span className={`tg${flat ? ' z' : ''}`}>{change}</span></div>
          <p>{t(`stat.${id}.caption` as MessageKey)}</p>
        </div>
      ))}
    </section>
  );
}
