/** Shared domain types. */

// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  name: string;
  nameAr?: string;
  email: string;
}

export type AuthErrorCode = 'bad_credentials' | 'network';

export type BannerType = 'error' | 'info' | 'success';

export interface BannerState {
  type: BannerType;
  message: string;
}

export interface LockState {
  fails?: number;
  until?: number;
}

export interface LockResult {
  locked: boolean;
  attemptsLeft: number;
}

/** Router state passed from the dashboard to the login page on sign-out. */
export interface LoginLocationState {
  signedOut?: boolean;
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
export type BarTone = 'in' | 'lt' | 'gy';

export interface Bar {
  key: string;
  value: number;
  tone: BarTone;
}

export interface Workspace {
  name: string;
  subtitle: string;
  clientId: string;
}

export interface NavItem {
  id: 'overview' | 'assets' | 'maintenance' | 'softServices' | 'healthSafety' | 'visitors' | 'spaces' | 'property';
  icon: string;
  active?: boolean;
}

export interface Stat {
  id: 'assets' | 'maintenance' | 'visitors' | 'softServices' | 'healthSafety' | 'spaces' | 'property';
  icon: string;
  value: string;
  change: string;
  flat?: boolean;
}

export interface CardHeaderInfo {
  title: string;
  subtitle: string;
  total: string;
  change: string;
}

export interface RequestsCard {
  total: string;
  change: string;
  height: number;
  unitKey: 'unit.requests';
  bars: Bar[];
}

export interface ChartCard {
  id: string;
  titleKey: 'card.visitsByStatus' | 'card.jobOrders' | 'card.plansByStatus' | 'card.incidents';
  subtitleKey: 'card.visitorManagement' | 'card.maintenance' | 'card.softServices' | 'card.healthSafety';
  total: string;
  change: string;
  height: number;
  unitKey: 'unit.visits' | 'unit.jobOrders' | 'unit.plans' | 'unit.incidents';
  bars: Bar[];
  wide?: boolean;
  dense?: boolean;
}

export interface SpaceSegment {
  key: 'space.vacant' | 'space.partial' | 'space.occupied' | 'space.reserved' | 'space.utilities';
  count: number;
  color: string;
}

export interface SpacesCard {
  total: string;
  change: string;
  segments: SpaceSegment[];
}

export interface Property {
  name: string;
  rate: string;
  amount: string;
  negative?: boolean;
}

export interface Visit {
  initials: string;
  name: string;
  company: string;
  purposeKey: 'visits.purpose.demo' | 'visits.purpose.hvac' | 'visits.purpose.access' | 'visits.purpose.contract' | 'visits.purpose.lift' | 'visits.purpose.fire' | 'visits.purpose.space' | 'visits.purpose.pantry';
  time: string;
  date: string;
}

export interface TooltipState {
  label: string;
  value: string;
  x: number;
  y: number;
}

export interface CardSize {
  span?: number;
  height?: number;
}

export type CardLayout = Record<string, CardSize>;

// ─── Chat ───────────────────────────────────────────────────────────────────
export interface LinkedRecord {
  code: string;
  title: string;
}

export interface ChatSource {
  icon: string;
  label: string;
}

export interface UserChatMessage {
  id: number;
  role: 'user';
  text: string;
  record: LinkedRecord | null;
}

export interface AssistantChatMessage {
  id: number;
  role: 'assistant';
  basis: string;
  text: string;
  note: string;
  sources?: ChatSource[];
}

export type ChatMessage = UserChatMessage | AssistantChatMessage;

export interface Attachment {
  id: number;
  name: string;
}
