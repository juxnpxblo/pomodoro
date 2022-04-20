import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  getRemainingTime,
  timeToString,
} from '../../common/helpers/timer.helper';

export type Sections = 'focus' | 'short break' | 'long break';

export interface setPayload {
  section: Sections;
  minutes: number;
  seconds?: number;
}

export interface timerState {
  status: 'unset' | 'paused' | 'ticking';
  currentSection: Sections;
  timestamp: number;
  currentRound: number;
  remainingTime: {
    minutes: string;
    seconds: string;
  };
}

const initialState: timerState = {
  status: 'unset',
  timestamp: 0,
  currentSection: 'focus',
  currentRound: 0,
  remainingTime: {
    minutes: '00',
    seconds: '00',
  },
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<setPayload>) => {
      state.currentSection = action.payload.section;
      state.status = 'paused';

      state.remainingTime.minutes = timeToString(action.payload.minutes);
      state.remainingTime.seconds = timeToString(action.payload.seconds || 0);
    },
    passedOneSec: (state) => {
      const remainingTime = getRemainingTime(state.timestamp);

      state.remainingTime.minutes = remainingTime.minutes;
      state.remainingTime.seconds = remainingTime.seconds;
    },
    played: (state) => {
      const timestamp = new Date();
      timestamp.setMinutes(
        timestamp.getMinutes() + +state.remainingTime.minutes
      );
      timestamp.setSeconds(
        timestamp.getSeconds() + +state.remainingTime.seconds
      );

      state.timestamp = +timestamp;
      state.status = 'ticking';
    },
    paused: (state) => {
      state.status = 'paused';
    },
    changedRound: (state, action: PayloadAction<number>) => {
      state.currentRound = action.payload;
    },
  },
});

export const { set, passedOneSec, played, paused, changedRound } =
  timerSlice.actions;

export const selectStatus = ({ timer: { status } }: RootState) => status;
export const selectTimestamp = ({ timer: { timestamp } }: RootState) =>
  timestamp;
export const selectCurrentSection = ({
  timer: { currentSection },
}: RootState) => currentSection;
export const selectCurrentRound = ({ timer: { currentRound } }: RootState) =>
  currentRound;
export const selectRemainingTime = ({ timer: { remainingTime } }: RootState) =>
  remainingTime;

export default timerSlice.reducer;
