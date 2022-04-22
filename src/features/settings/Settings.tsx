import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  changedFocusTime,
  changedShortBreakTime,
  changedLongBreakTime,
  changedTotalRounds,
  selectFocusTime,
  selectShortBreakTime,
  selectLongBreakTime,
  selectTotalRounds,
} from './settingsSlice';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, Pressable } from 'react-native';
import tw from '../../lib/tailwind';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {
  Raleway_400Regular,
  Raleway_600SemiBold,
} from '@expo-google-fonts/raleway';
import Icon from '@expo/vector-icons/MaterialIcons';
import BaseLayout from '../../common/components/BaseLayout';
// @ts-ignore
import Option from '../../common/components/Option';

import { OPTIONS, DEFAULT } from './settings.constants';

type RootStackParamList = {
  Timer: undefined;
  Settings: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Timer'>;

const Settings = ({ navigation }: Props) => {
  const [openOption, setOpenOption] = useState('');

  const dispatch = useAppDispatch();

  const focusTime = useAppSelector(selectFocusTime);
  const shortBreakTime = useAppSelector(selectShortBreakTime);
  const longBreakTime = useAppSelector(selectLongBreakTime);
  const totalRounds = useAppSelector(selectTotalRounds);

  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <BaseLayout>
      <View style={tw`flex-row justify-between`}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="keyboard-arrow-left" size={32} color="white" />
        </Pressable>
      </View>
      <View style={tw`h-full`}>
        <Text
          style={tw.style('text-3xl text-white self-center mb-4', {
            fontFamily: 'Raleway_600SemiBold',
          })}
        >
          Settings
        </Text>
        <Option
          name="Focus time"
          options={OPTIONS['Focus time']}
          currentValue={focusTime}
          open={openOption === 'Focus time'}
          setOpenOption={setOpenOption}
          actionCreator={changedFocusTime}
        />
        <Option
          name="Short break"
          options={OPTIONS['Short break']}
          currentValue={shortBreakTime}
          open={openOption === 'Short break'}
          setOpenOption={setOpenOption}
          actionCreator={changedShortBreakTime}
        />
        <Option
          name="Long break"
          options={OPTIONS['Long break']}
          currentValue={longBreakTime}
          open={openOption === 'Long break'}
          setOpenOption={setOpenOption}
          actionCreator={changedLongBreakTime}
        />
        <Option
          name="Sections"
          options={OPTIONS['Rounds']}
          currentValue={totalRounds}
          label="intervals"
          open={openOption === 'Sections'}
          setOpenOption={setOpenOption}
          actionCreator={changedTotalRounds}
        />
        <Pressable
          onPress={() => {
            dispatch(changedFocusTime(DEFAULT['Focus time']));
            dispatch(changedShortBreakTime(DEFAULT['Short break']));
            dispatch(changedLongBreakTime(DEFAULT['Long break']));
            dispatch(changedTotalRounds(DEFAULT['Rounds']));
          }}
          style={tw`flex-row absolute bottom-10 rounded-full self-center bg-red-3 py-3 px-10`}
        >
          <Text
            style={tw.style('text-xl text-white', {
              fontFamily: 'Raleway_400Regular',
            })}
          >
            Restore defaults
          </Text>
          <Icon
            name="refresh"
            size={24}
            color="white"
            style={tw`pl-1 self-center`}
          />
        </Pressable>
      </View>
    </BaseLayout>
  );
};

export default Settings;
