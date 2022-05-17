import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Timer: undefined;
  Settings: undefined;
};

export type TimerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Timer'
>;
export type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;
