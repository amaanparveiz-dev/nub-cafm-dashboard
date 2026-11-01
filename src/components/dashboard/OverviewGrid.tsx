import { useLocale } from '../../context/LocaleContext';
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
  const { t } = useLocale();
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
            <h3>{t('card.requestsTitle')}</h3>
            <div className="sub">{t('card.requestsSub')}</div>
          </div>
          <span style={{ color: '#777' }}>···</span>
        </div>
        <div className="num l">
          {REQUESTS_CARD.total} <span className="tg">{REQUESTS_CARD.change}</span>
          <small>{t('card.vsPrior')}</small>
        </div>
        <BarChart bars={REQUESTS_CARD.bars} height={REQUESTS_CARD.height} unit={t(REQUESTS_CARD.unitKey)} />
        <div className="bt">
          <span>{t('card.weekCycle')}</span>
          <Icon name="arrowUpRight" className="ic" />
        </div>
      </ResizableCard>

      {CHART_CARDS.map(({ id, wide, dense, bars, height, unitKey, titleKey, subtitleKey, total, change }) => (
        <ResizableCard key={id} {...cardProps(id, 4)} className={`card pad${wide ? ' w' : ''}`}>
          <CardHeader title={t(titleKey)} subtitle={t(subtitleKey)} total={total} change={change} />
          <BarChart bars={bars} height={height} unit={t(unitKey)} dense={dense} />
        </ResizableCard>
      ))}

      <ResizableCard {...cardProps('spaces', 4)} className="card pad">
        <CardHeader
          title={t('card.spacesByStatus')}
          subtitle={t('card.spaceManagement')}
          total={SPACES_CARD.total}
          change={SPACES_CARD.change}
        />
        <SpacesDonut segments={SPACES_CARD.segments} />
      </ResizableCard>

      <ResizableCard {...cardProps('properties', 4)} className="col3 w">
        <PropertyRankings title={t('card.bestProperties')} properties={BEST_PROPERTIES} />
        <PropertyRankings title={t('card.worstProperties')} properties={WORST_PROPERTIES} variant="worst" />
      </ResizableCard>
    </div>
  );
}
