import type {
  Bar, BarTone, ChartCard, NavItem, Property, RequestsCard, SpacesCard, Stat, Visit, Workspace,
} from '../types';

const bars = (rows: [string, number, BarTone][]): Bar[] =>
  rows.map(([label, value, tone]) => ({ label, value, tone }));

export const WORKSPACE: Workspace = { name: 'NV TEST', subtitle: 'Organization workspace', clientId: '775' };

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: '▦', active: true },
  { label: 'Assets', icon: '❖' },
  { label: 'Maintenance', icon: '⚒' },
  { label: 'Soft services', icon: '▤' },
  { label: 'Health & safety', icon: '⛉' },
  { label: 'Visitors', icon: '☺' },
  { label: 'Spaces', icon: '▥' },
  { label: 'Property', icon: '◔' },
];

export const STATS: Stat[] = [
  { icon: '❖', title: 'Assets', value: '317', change: '+99%', caption: 'Active assets · Disposed assets' },
  { icon: '⚒', title: 'Maintenance', value: '58', change: '+8%', caption: 'Open job orders · Completed job orders' },
  { icon: '☺', title: 'Visitors', value: '6', change: '+40%', caption: 'On site now · Total visits' },
  { icon: '▤', title: 'Soft services', value: '37', change: '+86%', caption: 'Active services · Services by status' },
  { icon: '⛉', title: 'Health & safety', value: '9', change: '+33%', caption: 'Incidents · Incidents by day of week' },
  { icon: '▥', title: 'Spaces', value: '3', change: '0%', flat: true, caption: 'Total spaces · Spaces by status' },
  { icon: '◔', title: 'Property', value: '0%', change: '0%', flat: true, caption: 'Occupancy rate · Collection rate' },
];

export const REQUESTS_CARD: RequestsCard = {
  total: '96',
  change: '+133%',
  height: 98,
  unit: 'requests',
  bars: bars([['Sat', 24, 'gy'], ['Sun', 16, 'gy'], ['Mon', 83, 'in'], ['Tue', 97, 'in'], ['Wed', 48, 'in'], ['Thu', 63, 'in'], ['Fri', 5, 'gy']]),
};

export const CHART_CARDS: ChartCard[] = [
  { id: 'visits-by-status', title: 'Visits by Status', subtitle: 'Visitor Management', total: '15', change: '+40%', height: 122, unit: 'visits',
    bars: bars([['Approved', 76, 'lt'], ['Checked In', 118, 'in'], ['Completed', 51, 'in'], ['Cancelled', 20, 'gy']]) },
  { id: 'job-orders', title: 'Job Orders', subtitle: 'Maintenance', total: '63', change: '+92%', height: 122, unit: 'job orders',
    bars: bars([['Open Job Orders', 122, 'in'], ['Completed Job', 24, 'gy']]) },
  { id: 'plans-by-status', title: 'Plans by Status', subtitle: 'Soft Services', total: '37', change: '+86%', height: 122, unit: 'plans', wide: true, dense: true,
    bars: bars([['Pending', 93, 'in'], ['Approved', 68, 'lt'], ['Paused', 20, 'gy'], ['Stopped', 13, 'gy'], ['Resume', 34, 'lt'], ['Finished', 54, 'in']]) },
  { id: 'incidents', title: 'Incidents by Day of Week', subtitle: 'Health & Safety', total: '9', change: '+133%', height: 122, unit: 'incidents',
    bars: bars([['Sat', 24, 'gy'], ['Sun', 13, 'gy'], ['Mon', 85, 'in'], ['Tue', 118, 'in'], ['Wed', 64, 'in'], ['Thu', 93, 'in'], ['Fri', 37, 'gy']]) },
];

export const SPACES_CARD: SpacesCard = {
  title: 'Spaces by status',
  subtitle: 'Space Management',
  total: '3',
  change: '+67%',
  segments: [
    { label: 'Vacant', count: 1, color: '#4638e0' },
    { label: 'Partially occupied', count: 2, color: '#9aa7f7' },
    { label: 'Occupied', count: 0, color: '#c5c4d0' },
    { label: 'Reserved', count: 0, color: '#dcdce2' },
    { label: 'General utilities', count: 0, color: '#e9e9ee' },
  ],
};

const NAKHEEL: Property = { name: 'Al Nakheel Tower A', detail: 'Occupancy Rate 0.0% · SAR 0' };
const MALQA: Property = { name: 'Malqa Heights Block C', detail: 'Occupancy Rate 0.0% · SAR 0' };
const OLAYA: Property = { name: 'PRJ.01- AL OLAYA TOWER', detail: 'Occupancy Rate 0.0% · -SAR 18,400', negative: true };
export const BEST_PROPERTIES: Property[] = [NAKHEEL, MALQA, OLAYA];
export const WORST_PROPERTIES: Property[] = [OLAYA, MALQA, NAKHEEL];

export const VISITS: Visit[] = [
  { initials: 'LW', name: 'Larue Wisozk', company: 'Batz, Bashirian and Thiel', purpose: 'Product Demonstration & Em...', time: '08:32', date: 'Sun, 1 Nov' },
  { initials: 'MO', name: 'Mara Okonkwo', company: 'Delta Facilities Group', purpose: 'Quarterly HVAC inspection', time: '10:15', date: 'Sun, 1 Nov' },
  { initials: 'KH', name: 'Khalid Haddad', company: 'Najd Security Services', purpose: 'Access card audit', time: '14:00', date: 'Sun, 1 Nov' },
  { initials: 'SP', name: 'Sofia Petrov', company: 'Orion Cleaning Co.', purpose: 'Contract walkthrough', time: '09:00', date: 'Mon, 2 Nov' },
  { initials: 'TA', name: 'Tariq Al-Amin', company: 'Riyadh Elevators Ltd', purpose: 'Lift maintenance visit', time: '11:30', date: 'Mon, 2 Nov' },
  { initials: 'EC', name: 'Elena Cruz', company: 'Harbor Fire Systems', purpose: 'Fire alarm test', time: '08:45', date: 'Tue, 3 Nov' },
  { initials: 'JB', name: 'James Brooks', company: 'Brooks & Lane Consulting', purpose: 'Space planning review', time: '13:20', date: 'Tue, 3 Nov' },
  { initials: 'NR', name: 'Noura Rashid', company: 'Al Safa Catering', purpose: 'Pantry service onboarding', time: '15:10', date: 'Tue, 3 Nov' },
];
