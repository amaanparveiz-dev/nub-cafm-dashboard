import { useRef } from 'react';
import useElementHeight from '../../hooks/useElementHeight';
import type { Visit } from '../../types';
import Icon from '../common/Icon';

const ROW_HEIGHT = 62;
const HEADER_HEIGHT = 34;

/** Shows as many visit rows as fit in the card; taller cards reveal more. */
export default function UpcomingVisits({ visits }: { visits: Visit[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const height = useElementHeight(listRef);

  const available = Math.max(0, height - HEADER_HEIGHT);
  const fitCount = Math.floor(available / ROW_HEIGHT);
  const count = height ? Math.max(1, Math.min(visits.length, fitCount)) : 0;
  const hasSpareRoom = count === visits.length && available - count * ROW_HEIGHT >= ROW_HEIGHT * 0.6;
  const rowClass = hasSpareRoom ? 'tr' : 'tr st';
  const summary = `Showing ${count}${count < visits.length ? ` of ${visits.length}` : ''} upcoming visit${count === 1 ? '' : 's'}`;

  return (
    <>
      <h3>Upcoming visits</h3>
      <div className="sub">Scheduled visitor arrivals</div>
      <div className="tbl vtbl" ref={listRef}>
        <div className="tin">
          <div className="th">
            <span>Visitor</span>
            <span>Company / purpose</span>
            <span style={{ textAlign: 'right' }}>Arrival</span>
          </div>
          {visits.slice(0, count).map((visit) => (
            <div className={rowClass} key={visit.name}>
              <div className="v"><div className="av2">{visit.initials}</div>{visit.name}</div>
              <div>{visit.company}<br /><span style={{ color: '#aaa' }}>{visit.purpose}</span></div>
              <span className="t"><b>{visit.time}</b><small>{visit.date}</small></span>
            </div>
          ))}
          {hasSpareRoom && (
            <div className="empty">
              <div className="eico"><Icon name="calendar" className="ic" /></div>
              <b>All caught up</b>
              <span>No more visitors expected</span>
            </div>
          )}
        </div>
      </div>
      <div className="foot">
        {summary}
        <b>View all visits <Icon name="arrowRight" className="ic" /></b>
      </div>
    </>
  );
}
