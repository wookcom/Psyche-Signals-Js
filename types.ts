
export interface MousePoint {
  x: number;
  y: number;
  t: number;
  force?: number; // Touch pressure (0.0 - 1.0)
}

export interface PsycheElement {
  tag: string;
  id?: string;
  className?: string;
  interactive: boolean;
  isSignificant: boolean; // True if matches business logic selectors (e.g. .buy-button)
  isInShadow: boolean;    // True if found inside a Shadow DOM
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

export interface PsycheBaseline {
  avgVelocity: number;
  avgEntropy: number;
  avgJerk: number;
  samples: number;
}

export enum MicroIntention {
  NONE = 'NONE',
  EXIT = 'EXIT_INTENT',      // User is about to leave based on vector trajectory
  HESITATION = 'HESITATION', // User is dwelling on an interactive element (confusion/consideration)
  SCROLL_FATIGUE = 'SCROLL_FATIGUE' // (Reserved for future)
}

export enum InputType {
  MOUSE = 'MOUSE',
  TOUCH = 'TOUCH'
}

export interface PsycheMetrics {
  inputType: InputType;  // Device type
  velocity: number;      // px/ms
  entropy: number;       // 0-1 (Chaos factor)
  jerk: number;          // Change in acceleration
  scrollSpeed: number;   // px/ms
  interactionRate: number; // events/sec (clicks + keys)
  selectionActivity: number; // selection changes/sec
  pauseDuration: number; // ms the pointer has been idle
  
  // Touch Specific
  touchPressure: number; // 0.0 to 1.0 (if available)
  rageTaps: number;      // Count of rapid taps in same area
  
  // Object Detection
  currentElement: PsycheElement | null;
  predictedElement: PsycheElement | null;
  
  // Contact & Selection Detection
  lastClick: ClickPoint | null;
  currentSelection: SelectionData | null;

  // AI / Learning Data
  baseline: PsycheBaseline;
  isLearning: boolean;     // True if still calibrating
  zScoreVelocity: number;  // Standard deviations from user's norm
  zScoreEntropy: number;   // Standard deviations from user's norm

  // Micro-Intentions
  currentIntention: MicroIntention;
  focusTime: number;       // ms spent on current interactive element
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
  useAI?: boolean;       // Enable adaptive learning
  learningSamples?: number; // How many ticks to calibrate (default: 50)
  privacyMode?: boolean; // Enable GDPR/CCPA compliance (Anonymize coordinates)
  significantSelectors?: string[]; // Selectors for business-critical elements
}

export type PsycheEvent = 'metrics' | 'stateChange' | 'intention';

export type PsycheEventListener = (data: any) => void;

export interface NavSection {
  id: string;
  label: string;
  icon: string;
}
