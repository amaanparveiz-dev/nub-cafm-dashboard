import type { CardHeaderInfo } from '../../types';

export default function CardHeader({ title, subtitle, total, change }: CardHeaderInfo) {
  return (
    <div className="hd">
      <div>
        <h3>{title}</h3>
        <div className="sub">{subtitle}</div>
      </div>
      <div className="rt">
        <div className="num">{total}</div>
        <span className="tg">{change}</span>
      </div>
    </div>
  );
}
