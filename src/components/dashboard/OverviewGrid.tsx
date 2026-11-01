import {
  BEST_PROPERTIES, CHART_CARDS, REQUESTS_CARD, SPACES_CARD, VISITS, WORST_PROPERTIES,
} from '../../data/dashboardData';
import type { CardLayoutApi } from '../../hooks/useCardLayout';
import Icon from '../common/Icon';
import BarChart from './BarChart';
import CardHeader from './CardHeader';
import PropertyRankings from './PropertyRankings';
import ResizableCard from './ResizableCard';
import SpacesDonut from './SpacesDonut';
import UpcomingVisits from './UpcomingVisits';

export default function OverviewGrid({ layout, update, resetCard }: Pick<CardLayoutApi, 'layout' | 'update' | 'resetCard'>) {
  const cardProps = (id: string, defaultSpan: number) => ({
    id, defaultSpan, size: layout[id], onResize: update, onReset: resetCard,
  });

  return (
    <div className="dash">
      <ResizableCard {...cardProps('upcoming-visits', 6)} className="card pad w">
        <UpcomingVisits visits={VISITS} />
      </ResizableCard>

      <ResizableCard {...cardProps('requests', 6)} className="card pad w">
        <div className="hd">
          <div>
            <h3>Requests by day of week</h3>
            <div className="sub">Work order requests</div>
          </div>
          <span style={{ color: '#777' }}>···</span>
        </div>
        <div className="num l">
          {REQUESTS_CARD.total} <span className="tg">{REQUESTS_CARD.change}</span>
          <small>vs prior period</small>
        </div>
        <BarChart bars={REQUESTS_CARD.bars} height={REQUESTS_CARD.height} unit={REQUESTS_CARD.unit} />
        <div className="bt">
          <span>Sat–Fri cycle</span>
          <Icon name="arrowUpRight" className="ic" />
        </div>
      </ResizableCard>

      {CHART_CARDS.map(({ id, wide, dense, bars, height, unit, ...header }) => (
        <ResizableCard key={id} {...cardProps(id, 4)} className={`card pad${wide ? ' w' : ''}`}>
          <CardHeader {...header} />
          <BarChart bars={bars} height={height} unit={unit} dense={dense} />
        </ResizableCard>
      ))}

      <ResizableCard {...cardProps('spaces', 4)} className="card pad">
        <CardHeader {...SPACES_CARD} />
        <SpacesDonut segments={SPACES_CARD.segments} />
      </ResizableCard>

      <ResizableCard {...cardProps('properties', 4)} className="col3 w">
        <PropertyRankings title="Best-performing Properties" properties={BEST_PROPERTIES} />
        <PropertyRankings title="Worst-performing Properties" properties={WORST_PROPERTIES} variant="worst" />
      </ResizableCard>
    </div>
  );
}
