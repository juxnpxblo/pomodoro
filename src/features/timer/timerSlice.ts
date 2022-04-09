import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

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
  pausedOn: {
    minutes: number;
    seconds: number;
  };
}

const initialState: timerState = {
  status: 'unset',
  timestamp: 0,
  currentSection: 'focus',
  currentRound: 1,
  pausedOn: {
    minutes: 0,
    seconds: 0,
  },
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<setPayload>) => {
      state.currentSection = action.payload.section;
      state.status = 'paused';

      state.pausedOn.minutes = action.payload.minutes;
      state.pausedOn.seconds = action.payload.seconds || 0;
    },
    played: (state) => {
      // ver onde esta pausado
      // setar state.timestamp pra ser qtd q ta pausado pro futuro
      state.status = 'ticking';
    },
    paused: (state) => {
      // calcular diferenca de agora pro timestamp, min e sec
      // setar pausedOn nesses min e sec
      state.status = 'paused';
    },
    changedInterval: (state, action: PayloadAction<number>) => {
      state.currentRound = action.payload;
    },
  },
});

export const { set, played, paused, changedInterval } = timerSlice.actions;

export const selectStatus = ({ timer: { status } }: RootState) => status;
export const selectTimestamp = ({ timer: { timestamp } }: RootState) =>
  timestamp;
export const selectCurrentSection = ({
  timer: { currentSection },
}: RootState) => currentSection;
export const selectCurrentRound = ({ timer: { currentRound } }: RootState) =>
  currentRound;
export const selectPausedOn = ({ timer: { pausedOn } }: RootState) => pausedOn;

export default timerSlice.reducer;
