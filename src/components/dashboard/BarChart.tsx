import { useLocale } from '../../context/LocaleContext';
import type { MessageKey } from '../../i18n/messages';
import useTooltip from '../../hooks/useTooltip';
import type { CSSProperties } from 'react';
import type { Bar } from '../../types';
import ChartTooltip from './ChartTooltip';

interface BarChartProps {
  bars: Bar[];
  height: number;
  unit: string;
  dense?: boolean;
}

export default function BarChart({ bars, height, unit, dense = false }: BarChartProps) {
  const { t } = useLocale();
  const tooltip = useTooltip();

  return (
    <div className={`cw${dense ? ' cw--dense' : ''}`}>
      <div className="chart" style={{ '--mh': `${height}px` } as CSSProperties}>
        {bars.map(({ key, value, tone }) => {
          const label = t(key as MessageKey);
          return (
            <div key={key} className="col" tabIndex={0} {...tooltip.bind(label, `${value} ${unit}`, { inner: true })}>
              <div className={tone} style={{ height: `${Math.min(100, (value / height) * 100)}%` }} />
            </div>
          );
        })}
      </div>
      <div className="xl">
        {bars.map(({ key }) => <span key={key}>{t(key as MessageKey)}</span>)}
      </div>
      <ChartTooltip tip={tooltip.tip} />
    </div>
  );
}
