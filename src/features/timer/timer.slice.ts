import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import * as I from './timer.interface';

const initialState: I.timerState = {
  status: 'UNSET',
  timestamp: 0,
  section: { current: 'FOCUS', changed: false },
  round: 1,
  ring: false,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    played: (
      state,
      action: PayloadAction<{ minutes: number; seconds: number }>
    ) => {
      const now = new Date();

      now.setMinutes(now.getMinutes() + +action.payload.minutes);
      now.setSeconds(now.getSeconds() + +action.payload.seconds);

      state.timestamp = +now;
      state.status = 'TICKING';
    },
    paused: (state) => {
      state.status = 'PAUSED';
    },
    wentToNextSection: (
      state,
      action: PayloadAction<{ totalRounds: number }>
    ) => {
      state.status = 'PAUSED';

      if (state.section.current === 'FOCUS') {
        if (state.round < action.payload.totalRounds) {
          state.section.current = 'SHORT_BREAK';
        } else {
          state.section.current = 'LONG_BREAK';
        }
      } else {
        state.section.current = 'FOCUS';

        if (state.round === action.payload.totalRounds) state.round = 1;
        else state.round++;
      }

      state.section.changed = true;
    },
    wentToPreviousSection: (
      state,
      action: PayloadAction<I.WentToPreviousSectionPayload>
    ) => {
      state.status = 'PAUSED';

      const { remainingMinutes, focusTime, shortBreakTime, longBreakTime } =
        action.payload;

      const inFocusTime = state.section.current === 'FOCUS';
      const inShortBreak = state.section.current === 'SHORT_BREAK';
      const inLongBreak = state.section.current === 'LONG_BREAK';

      if (inFocusTime) {
        if (remainingMinutes === focusTime) {
          if (state.round !== 1) {
            state.round--;
            state.section.current = 'SHORT_BREAK';
          }
        } else {
          state.section.current = 'FOCUS';
        }
      } else if (inShortBreak) {
        if (remainingMinutes === shortBreakTime) {
          state.section.current = 'FOCUS';
        } else {
          state.section.current = 'SHORT_BREAK';
        }
      } else if (inLongBreak) {
        if (remainingMinutes === longBreakTime) {
          state.section.current = 'FOCUS';
        } else {
          state.section.current = 'LONG_BREAK';
        }
      }

      state.section.changed = true;
    },
    gotSectionChange: (state) => {
      state.section.changed = false;
    },
    reset: (state) => {
      state.status = 'PAUSED';
      state.section.current = 'FOCUS';
      state.round = 1;
    },
    restoredSession: (state, action: PayloadAction<I.StoredSession>) => {
      state.section.current = action.payload.SECTION;
      state.round = action.payload.ROUND;
      state.ring = action.payload.RING;
    },
    switchedRinging: (state) => {
      state.ring = !state.ring;
    },
  },
});

export const {
  played,
  paused,
  wentToNextSection,
  wentToPreviousSection,
  gotSectionChange,
  reset,
  restoredSession,
  switchedRinging,
} = timerSlice.actions;

export const selectStatus = ({ timer: { status } }: RootState) => status;
export const selectSection = ({ timer: { section } }: RootState) => section;
export const selectTimestamp = ({ timer: { timestamp } }: RootState) =>
  timestamp;
export const selectRound = ({ timer: { round } }: RootState) => round;
export const selectRing = ({ timer: { ring } }: RootState) => ring;

export default timerSlice.reducer;
