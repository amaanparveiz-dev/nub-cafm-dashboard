import { useRef } from 'react';
import { useLocale } from '../../context/LocaleContext';
import useElementHeight from '../../hooks/useElementHeight';
import type { Visit } from '../../types';
import { formatVisitDate } from '../../utils/format';
import Icon from '../common/Icon';

const ROW_HEIGHT = 62;
const HEADER_HEIGHT = 34;

export default function UpcomingVisits({ visits }: { visits: Visit[] }) {
  const { t, locale } = useLocale();
  const listRef = useRef<HTMLDivElement>(null);
  const height = useElementHeight(listRef);

  const available = Math.max(0, height - HEADER_HEIGHT);
  const fitCount = Math.floor(available / ROW_HEIGHT);
  const count = height ? Math.max(1, Math.min(visits.length, fitCount)) : 0;
  const hasSpareRoom = count === visits.length && available - count * ROW_HEIGHT >= ROW_HEIGHT * 0.6;
  const rowClass = hasSpareRoom ? 'tr' : 'tr st';
  const summary = count < visits.length
    ? t('visits.showingOf', { count, total: visits.length })
    : count === 1
      ? t('visits.showingOne', { count })
      : t('visits.showing', { count });

  return (
    <>
      <h3>{t('visits.title')}</h3>
      <div className="sub">{t('visits.sub')}</div>
      <div className="tbl vtbl" ref={listRef}>
        <div className="tin">
          <div className="th">
            <span>{t('visits.visitor')}</span>
            <span>{t('visits.company')}</span>
            <span style={{ textAlign: 'end' }}>{t('visits.arrival')}</span>
          </div>
          {visits.slice(0, count).map((visit) => (
            <div className={rowClass} key={visit.name}>
              <div className="v"><div className="av2">{visit.initials}</div>{visit.name}</div>
              <div>{visit.company}<br /><span style={{ color: '#aaa' }}>{t(visit.purposeKey)}</span></div>
              <span className="t"><b>{visit.time}</b><small>{formatVisitDate(visit.date, locale)}</small></span>
            </div>
          ))}
          {hasSpareRoom && (
            <div className="empty">
              <div className="eico"><Icon name="calendar" className="ic" /></div>
              <b>{t('visits.caughtUp')}</b>
              <span>{t('visits.noMore')}</span>
            </div>
          )}
        </div>
      </div>
      <div className="foot">
        {summary}
        <b>{t('visits.viewAll')} <Icon name="arrowRight" className="ic" /></b>
      </div>
    </>
  );
}
