import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import timerReducer from '../features/timer/timer.slice';
import settingsReducer from '../features/settings/settings.slice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    settings: settingsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
