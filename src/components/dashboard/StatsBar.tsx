import type { Stat } from '../../types';

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="card stats">
      {stats.map(({ icon, title, value, change, flat, caption }) => (
        <div className="stat" key={title}>
          <h6>{icon} {title}</h6>
          <div className="n">{value} <span className={`tg${flat ? ' z' : ''}`}>{change}</span></div>
          <p>{caption}</p>
        </div>
      ))}
    </section>
  );
}
