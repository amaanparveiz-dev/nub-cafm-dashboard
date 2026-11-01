import type {
  Bar, BarTone, ChartCard, NavItem, Property, RequestsCard, SpacesCard, Stat, Visit, Workspace,
} from '../types';

const bars = (rows: [string, number, BarTone][]): Bar[] =>
  rows.map(([key, value, tone]) => ({ key, value, tone }));

export const WORKSPACE: Workspace = { name: 'NV TEST', subtitle: 'Organization workspace', clientId: '775' };

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', icon: '▦', active: true },
  { id: 'assets', icon: '❖' },
  { id: 'maintenance', icon: '⚒' },
  { id: 'softServices', icon: '▤' },
  { id: 'healthSafety', icon: '⛉' },
  { id: 'visitors', icon: '☺' },
  { id: 'spaces', icon: '▥' },
  { id: 'property', icon: '◔' },
];

export const STATS: Stat[] = [
  { id: 'assets', icon: '❖', value: '317', change: '+99%' },
  { id: 'maintenance', icon: '⚒', value: '58', change: '+8%' },
  { id: 'visitors', icon: '☺', value: '6', change: '+40%' },
  { id: 'softServices', icon: '▤', value: '37', change: '+86%' },
  { id: 'healthSafety', icon: '⛉', value: '9', change: '+33%' },
  { id: 'spaces', icon: '▥', value: '3', change: '0%', flat: true },
  { id: 'property', icon: '◔', value: '0%', change: '0%', flat: true },
];

export const REQUESTS_CARD: RequestsCard = {
  total: '96',
  change: '+133%',
  height: 98,
  unitKey: 'unit.requests',
  bars: bars([['bar.sat', 24, 'gy'], ['bar.sun', 16, 'gy'], ['bar.mon', 83, 'in'], ['bar.tue', 97, 'in'], ['bar.wed', 48, 'in'], ['bar.thu', 63, 'in'], ['bar.fri', 5, 'gy']]),
};

export const CHART_CARDS: ChartCard[] = [
  { id: 'visits-by-status', titleKey: 'card.visitsByStatus', subtitleKey: 'card.visitorManagement', total: '15', change: '+40%', height: 122, unitKey: 'unit.visits',
    bars: bars([['bar.approved', 76, 'lt'], ['bar.checkedIn', 118, 'in'], ['bar.completed', 51, 'in'], ['bar.cancelled', 20, 'gy']]) },
  { id: 'job-orders', titleKey: 'card.jobOrders', subtitleKey: 'card.maintenance', total: '63', change: '+92%', height: 122, unitKey: 'unit.jobOrders',
    bars: bars([['bar.openJobOrders', 122, 'in'], ['bar.completedJob', 24, 'gy']]) },
  { id: 'plans-by-status', titleKey: 'card.plansByStatus', subtitleKey: 'card.softServices', total: '37', change: '+86%', height: 122, unitKey: 'unit.plans', wide: true, dense: true,
    bars: bars([['bar.pending', 93, 'in'], ['bar.approved', 68, 'lt'], ['bar.paused', 20, 'gy'], ['bar.stopped', 13, 'gy'], ['bar.resume', 34, 'lt'], ['bar.finished', 54, 'in']]) },
  { id: 'incidents', titleKey: 'card.incidents', subtitleKey: 'card.healthSafety', total: '9', change: '+133%', height: 122, unitKey: 'unit.incidents',
    bars: bars([['bar.sat', 24, 'gy'], ['bar.sun', 13, 'gy'], ['bar.mon', 85, 'in'], ['bar.tue', 118, 'in'], ['bar.wed', 64, 'in'], ['bar.thu', 93, 'in'], ['bar.fri', 37, 'gy']]) },
];

export const SPACES_CARD: SpacesCard = {
  total: '3',
  change: '+67%',
  segments: [
    { key: 'space.vacant', count: 1, color: '#4638e0' },
    { key: 'space.partial', count: 2, color: '#9aa7f7' },
    { key: 'space.occupied', count: 0, color: '#c5c4d0' },
    { key: 'space.reserved', count: 0, color: '#dcdce2' },
    { key: 'space.utilities', count: 0, color: '#e9e9ee' },
  ],
};

const NAKHEEL: Property = { name: 'Al Nakheel Tower A', rate: '0.0%', amount: 'SAR 0' };
const MALQA: Property = { name: 'Malqa Heights Block C', rate: '0.0%', amount: 'SAR 0' };
const OLAYA: Property = { name: 'PRJ.01- AL OLAYA TOWER', rate: '0.0%', amount: 'SAR 18,400', negative: true };
export const BEST_PROPERTIES: Property[] = [NAKHEEL, MALQA, OLAYA];
export const WORST_PROPERTIES: Property[] = [OLAYA, MALQA, NAKHEEL];

export const VISITS: Visit[] = [
  { initials: 'LW', name: 'Larue Wisozk', company: 'Batz, Bashirian and Thiel', purposeKey: 'visits.purpose.demo', time: '08:32', date: '2026-11-01' },
  { initials: 'MO', name: 'Mara Okonkwo', company: 'Delta Facilities Group', purposeKey: 'visits.purpose.hvac', time: '10:15', date: '2026-11-01' },
  { initials: 'KH', name: 'Khalid Haddad', company: 'Najd Security Services', purposeKey: 'visits.purpose.access', time: '14:00', date: '2026-11-01' },
  { initials: 'SP', name: 'Sofia Petrov', company: 'Orion Cleaning Co.', purposeKey: 'visits.purpose.contract', time: '09:00', date: '2026-11-02' },
  { initials: 'TA', name: 'Tariq Al-Amin', company: 'Riyadh Elevators Ltd', purposeKey: 'visits.purpose.lift', time: '11:30', date: '2026-11-02' },
  { initials: 'EC', name: 'Elena Cruz', company: 'Harbor Fire Systems', purposeKey: 'visits.purpose.fire', time: '08:45', date: '2026-11-03' },
  { initials: 'JB', name: 'James Brooks', company: 'Brooks & Lane Consulting', purposeKey: 'visits.purpose.space', time: '13:20', date: '2026-11-03' },
  { initials: 'NR', name: 'Noura Rashid', company: 'Al Safa Catering', purposeKey: 'visits.purpose.pantry', time: '15:10', date: '2026-11-03' },
];
