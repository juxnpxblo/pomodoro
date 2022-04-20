import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface SettingsState {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  totalRounds: number;
}

const initialState: SettingsState = {
  focusTime: 1,
  shortBreakTime: 5,
  longBreakTime: 15,
  totalRounds: 4,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changedFocusTime: (state, action: PayloadAction<number>) => {
      state.focusTime = action.payload;
    },
    changedShortBreakTime: (state, action: PayloadAction<number>) => {
      state.shortBreakTime = action.payload;
    },
    changedLongBreakTime: (state, action: PayloadAction<number>) => {
      state.longBreakTime = action.payload;
    },
    changedTotalRounds: (state, action: PayloadAction<number>) => {
      state.totalRounds = action.payload;
    },
  },
});

export const {
  changedFocusTime,
  changedShortBreakTime,
  changedLongBreakTime,
  changedTotalRounds,
} = settingsSlice.actions;

export const selectFocusTime = ({ settings: { focusTime } }: RootState) =>
  focusTime;
export const selectShortBreakTime = ({
  settings: { shortBreakTime },
}: RootState) => shortBreakTime;
export const selectLongBreakTime = ({
  settings: { longBreakTime },
}: RootState) => longBreakTime;
export const selectTotalRounds = ({ settings: { totalRounds } }: RootState) =>
  totalRounds;

export default settingsSlice.reducer;
