export type OptionKey = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' | 'ROUNDS';

export type OptionLabel =
  | 'Focus time'
  | 'Short break'
  | 'Long break'
  | 'Sections';

export type OptionDescription = 'min' | 'intervals';

export interface Option {
  value: number;
  defaultValue: number;
  key: OptionKey;
  label: OptionLabel;
  description: OptionDescription;
  listOfOptions: number[];
  changed: boolean;
}

export type SettingsState = Record<string, Option>;

export type StoredSettings = Record<OptionKey, number>;

export type OpenOption = OptionKey | '';
