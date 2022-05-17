export type Section = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export type Status = 'UNSET' | 'PAUSED' | 'TICKING';

export interface timerState {
  status: Status;
  section: { current: Section; changed: boolean };
  timestamp: number;
  round: number;
  ring: boolean;
}

export interface StoredSession {
  SECTION: Section;
  ROUND: number;
  RING: boolean;
}

export interface WentToPreviousSectionPayload {
  remainingMinutes: number;
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}
