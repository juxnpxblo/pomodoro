import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import tw from '../../lib/tailwind';
import AppLoading from 'expo-app-loading';
import type { SettingsScreenProps } from '../../app/navigator.types';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import * as slice from './settings.slice';
import * as I from './settings.interface';
import { useFonts } from 'expo-font';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import Icon from '@expo/vector-icons/MaterialIcons';
import BaseLayout from '../../common/components/BaseLayout.component';
import Option from './Option.component';

const Settings = ({ navigation }: SettingsScreenProps) => {
  const dispatch = useAppDispatch();

  const focusTime = useAppSelector(slice.selectFocusTime);
  const shortBreakTime = useAppSelector(slice.selectShortBreakTime);
  const longBreakTime = useAppSelector(slice.selectLongBreakTime);
  const totalRounds = useAppSelector(slice.selectTotalRounds);

  const [openOption, setOpenOption] = useState<I.OpenOption>('');

  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <BaseLayout>
      <View style={tw`flex-row justify-between`}>
        <Pressable onPressIn={() => navigation.goBack()}>
          <Icon name="keyboard-arrow-left" size={32} color="white" />
        </Pressable>
      </View>
      <View style={tw`h-full`}>
        <Text
          style={tw.style('text-3xl text-white self-center mb-4', {
            fontFamily: 'Lato_700Bold',
          })}
        >
          Settings
        </Text>
        {[focusTime, shortBreakTime, longBreakTime, totalRounds].map(
          (option) => {
            return (
              <Option
                option={option}
                open={openOption === option.key}
                setOpenOption={setOpenOption}
                actionCreator={
                  option.key === 'FOCUS'
                    ? slice.changedFocusTime
                    : option.key === 'SHORT_BREAK'
                    ? slice.changedShortBreakTime
                    : option.key === 'LONG_BREAK'
                    ? slice.changedLongBreakTime
                    : slice.changedTotalRounds
                }
                key={option.key}
              />
            );
          }
        )}
        <Pressable
          onPress={() => dispatch(slice.resetDefaults())}
          style={tw`bg-red-3 rounded-full absolute flex-row self-center bottom-10 px-10 py-3`}
        >
          <Text
            style={tw.style('text-xl text-white', {
              fontFamily: 'Lato_400Regular',
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
