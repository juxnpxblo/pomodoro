import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import * as I from './settings.interface';

const initialState: I.SettingsState = {
  focusTime: {
    key: 'FOCUS',
    label: 'Focus time',
    description: 'min',
    defaultValue: 25,
    value: 25,
    listOfOptions: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 60],
    changed: false,
  },
  shortBreakTime: {
    key: 'SHORT_BREAK',
    label: 'Short break',
    description: 'min',
    defaultValue: 5,
    value: 5,
    listOfOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    changed: false,
  },
  longBreakTime: {
    key: 'LONG_BREAK',
    label: 'Long break',
    description: 'min',
    defaultValue: 15,
    value: 15,
    listOfOptions: [5, 10, 15, 20, 25, 30, 35],
    changed: false,
  },
  totalRounds: {
    key: 'ROUNDS',
    label: 'Sections',
    description: 'intervals',
    defaultValue: 4,
    value: 4,
    listOfOptions: [2, 3, 4, 5, 6, 7, 8],
    changed: false,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changedFocusTime: (state, action: PayloadAction<number>) => {
      state.focusTime.value = action.payload;
      state.focusTime.changed = true;
    },
    changedShortBreakTime: (state, action: PayloadAction<number>) => {
      state.shortBreakTime.value = action.payload;
      state.shortBreakTime.changed = true;
    },
    changedLongBreakTime: (state, action: PayloadAction<number>) => {
      state.longBreakTime.value = action.payload;
      state.longBreakTime.changed = true;
    },
    changedTotalRounds: (state, action: PayloadAction<number>) => {
      state.totalRounds.value = action.payload;
    },
    resetDefaults: (state) => {
      state.focusTime.value = state.focusTime.defaultValue;
      state.focusTime.changed = true;

      state.shortBreakTime.value = state.shortBreakTime.defaultValue;
      state.shortBreakTime.changed = true;

      state.longBreakTime.value = state.longBreakTime.defaultValue;
      state.longBreakTime.changed = true;

      state.totalRounds.value = state.totalRounds.defaultValue;
    },
    restoredSettings: (state, action: PayloadAction<I.StoredSettings>) => {
      state.focusTime.value = action.payload['FOCUS'];
      state.shortBreakTime.value = action.payload['SHORT_BREAK'];
      state.longBreakTime.value = action.payload['LONG_BREAK'];
      state.totalRounds.value = action.payload['ROUNDS'];
    },
    gotSettingsChange: (state) => {
      state.focusTime.changed = false;
      state.shortBreakTime.changed = false;
      state.longBreakTime.changed = false;
      state.totalRounds.changed = false;
    },
  },
});

export const {
  changedFocusTime,
  changedShortBreakTime,
  changedLongBreakTime,
  changedTotalRounds,
  resetDefaults,
  restoredSettings,
  gotSettingsChange,
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
