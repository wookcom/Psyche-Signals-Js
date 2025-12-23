
export interface MousePoint {
  x: number;
  y: number;
  t: number;
}

export interface PsycheElement {
  tag: string;
  id?: string;
  className?: string;
  interactive: boolean;
}

export interface ClickPoint {
  x: number;
  y: number;
  t: number;
  element?: PsycheElement;
}

export interface SelectionData {
  text: string;
  length: number;
  t: number;
}

export interface PsycheMetrics {
  velocity: number;      // px/ms
  entropy: number;       // 0-1 (Chaos factor)
  jerk: number;          // Change in acceleration
  scrollSpeed: number;   // px/ms
  interactionRate: number; // events/sec (clicks + keys)
  selectionActivity: number; // selection changes/sec
  pauseDuration: number; // ms the pointer has been idle
  
  // Object Detection
  currentElement: PsycheElement | null;
  predictedElement: PsycheElement | null;
  
  // Contact & Selection Detection
  lastClick: ClickPoint | null;
  currentSelection: SelectionData | null;
}

export enum UserState {
  CALM = 'CALMADO',
  URGENT = 'URGENTE',
  UNDECIDED = 'INDECISO',
  EXPLORING = 'EXPLORANDO',
  STANDBY = 'STANDBY',
  FRUSTRATED = 'FRUSTRADO',
  READING = 'ESCANEANDO'
}

export interface PsycheConfig {
  interval?: number;     // Analysis loop interval in ms
  historySize?: number;  // How many mouse points to keep
  scrollElement?: HTMLElement | Window | null; // Element to track scroll on
  debug?: boolean;
}

export type PsycheEvent = 'metrics' | 'stateChange';

export type PsycheEventListener = (data: any) => void;

export interface NavSection {
  id: string;
  label: string;
  icon: string;
}
