import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface SettingsState {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  totalIntervals: number;
}

const initialState: SettingsState = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  totalIntervals: 4,
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
    changedTotalIntervals: (state, action: PayloadAction<number>) => {
      state.totalIntervals = action.payload;
    },
  },
});

export const {
  changedFocusTime,
  changedShortBreakTime,
  changedLongBreakTime,
  changedTotalIntervals,
} = settingsSlice.actions;

export const selectFocusTime = ({ settings: { focusTime } }: RootState) =>
  focusTime;
export const selectShortBreakTime = ({
  settings: { shortBreakTime },
}: RootState) => shortBreakTime;
export const selectLongBreakTime = ({
  settings: { longBreakTime },
}: RootState) => longBreakTime;
export const selectTotalIntervals = ({
  settings: { totalIntervals },
}: RootState) => totalIntervals;

export default settingsSlice.reducer;
