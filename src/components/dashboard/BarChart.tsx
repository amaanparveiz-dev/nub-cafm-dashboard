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

/** Column chart. `bars` is `[{ label, value, tone: 'in' | 'lt' | 'gy' }]`; `height` is the value that fills a column. */
export default function BarChart({ bars, height, unit, dense = false }: BarChartProps) {
  const tooltip = useTooltip();

  return (
    <div className={`cw${dense ? ' cw--dense' : ''}`}>
      <div className="chart" style={{ '--mh': `${height}px` } as CSSProperties}>
        {bars.map(({ label, value, tone }) => (
          <div key={label} className="col" tabIndex={0} {...tooltip.bind(label, `${value} ${unit}`, { inner: true })}>
            <div className={tone} style={{ height: `${Math.min(100, (value / height) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="xl">
        {bars.map(({ label }) => <span key={label}>{label}</span>)}
      </div>
      <ChartTooltip tip={tooltip.tip} />
    </div>
  );
}
