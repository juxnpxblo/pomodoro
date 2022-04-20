import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  set,
  passedOneSec,
  played,
  paused,
  changedRound,
  selectStatus,
  selectCurrentSection,
  selectCurrentRound,
  selectRemainingTime,
} from './timerSlice';
import {
  selectFocusTime,
  selectShortBreakTime,
  selectLongBreakTime,
  selectTotalRounds,
} from '../settings/settingsSlice';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, Pressable } from 'react-native';
import tw from '../../lib/tailwind';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import {
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from '@expo-google-fonts/raleway';
import Icon from '@expo/vector-icons/MaterialIcons';
import BaseLayout from '../../common/components/BaseLayout';

type RootStackParamList = {
  Timer: undefined;
  Settings: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Timer'>;

const Timer = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const focusTime = useAppSelector(selectFocusTime);
  const shortBreakTime = useAppSelector(selectShortBreakTime);
  const longBreakTime = useAppSelector(selectLongBreakTime);
  const totalRounds = useAppSelector(selectTotalRounds);

  const status = useAppSelector(selectStatus);
  const currentSection = useAppSelector(selectCurrentSection);
  const currentRound = useAppSelector(selectCurrentRound);
  const remainingTime = useAppSelector(selectRemainingTime);

  const tickingId = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNextSection = () => {
    if (currentSection === 'focus') {
      if (currentRound < totalRounds) {
        dispatch(set({ section: 'short break', minutes: shortBreakTime }));
      } else {
        dispatch(set({ section: 'long break', minutes: longBreakTime }));
      }
    } else {
      dispatch(set({ section: 'focus', minutes: focusTime }));

      if (currentRound === totalRounds) {
        dispatch(changedRound(1));
      } else {
        dispatch(changedRound(currentRound + 1));
      }
    }
  };

  const goToPreviousSection = () => {
    clearInterval(tickingId.current!);

    if (currentSection === 'focus') {
      if (+remainingTime.minutes === focusTime) {
        if (currentRound !== 1) {
          dispatch(changedRound(currentRound - 1));
          dispatch(set({ section: 'short break', minutes: shortBreakTime }));
        }
      } else {
        dispatch(set({ section: 'focus', minutes: focusTime }));
      }
    } else if (currentSection === 'short break') {
      if (+remainingTime.minutes === shortBreakTime) {
        dispatch(set({ section: 'focus', minutes: focusTime }));
      } else {
        dispatch(set({ section: 'short break', minutes: shortBreakTime }));
      }
    } else if (currentSection === 'long break') {
      if (+remainingTime.minutes === longBreakTime) {
        dispatch(set({ section: 'focus', minutes: focusTime }));
      } else {
        dispatch(set({ section: 'long break', minutes: longBreakTime }));
      }
    }
  };

  const reset = () => {
    dispatch(set({ section: 'focus', minutes: focusTime }));
    dispatch(changedRound(1));
  };

  useEffect(() => {
    if (remainingTime.minutes === '00' && remainingTime.seconds === '00') {
      clearInterval(tickingId.current!);
      goToNextSection();
    }
  }, [remainingTime]);

  useEffect(() => {
    reset();
  }, []);

  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <BaseLayout>
      <View style={tw`flex-row justify-between`}>
        <Icon name="help" size={26} color="white" />
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={26} color="white" />
        </Pressable>
      </View>
      <View style={tw`h-full justify-center`}>
        <View style={tw`mb-4`}>
          <Text
            style={tw.style('text-3xl text-white self-center mb-4', {
              fontFamily: 'Raleway_600SemiBold',
            })}
          >
            Pomodoro timer
          </Text>
          <View style={tw`relative w-full mb-5`}>
            <View style={tw`mt-[100%]`}></View>
            <View
              style={tw`absolute inset-0 bg-red-3 rounded-full items-center justify-center`}
            >
              <View
                style={tw`w-[92%] h-[92%] bg-red-1 rounded-full items-center justify-center`}
              >
                <View style={tw`items-center justify-center`}>
                  <View style={tw`-mb-2`}>
                    <Text
                      style={tw.style('text-2xl text-white', {
                        fontFamily: 'Raleway_400Regular',
                      })}
                    >
                      {currentSection === 'focus'
                        ? 'Time to focus!'
                        : 'Time for a break!'}{' '}
                      #{currentRound}
                    </Text>
                  </View>
                  <Text
                    style={tw.style('text-8xl text-white', {
                      fontFamily: 'Raleway_700Bold',
                    })}
                  >
                    {status !== 'unset'
                      ? `${remainingTime.minutes}:${remainingTime.seconds}`
                      : `00:00`}
                  </Text>
                </View>
                <Icon
                  name="volume-up"
                  size={26}
                  color="white"
                  style={tw`absolute right-0 top-0`}
                />
                {/* <Icon
                name="volume-off"
                size={26}
                color="white"
                style={tw`absolute right-0 top-0`}
              /> */}
                <Pressable
                  style={tw`absolute right-0 bottom-0`}
                  onPress={() => {
                    clearInterval(tickingId.current!);
                    reset();
                  }}
                >
                  <Icon name="refresh" size={26} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
          <View style={tw`h-px w-full bg-red-3`}></View>
        </View>
        <View style={tw`items-center`}>
          <View style={tw`flex-row justify-center mb-2`}>
            <View
              style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}
            ></View>
            <View
              style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}
            ></View>
            <View
              style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}
            ></View>
            <View
              style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}
            ></View>
          </View>
          <View style={tw`flex-row items-center`}>
            <Pressable
              onPress={() => {
                clearInterval(tickingId.current!);
                goToPreviousSection();
              }}
            >
              <Icon
                name="skip-previous"
                size={48}
                color="white"
                style={tw`mr-2`}
              />
            </Pressable>
            {status === 'ticking' ? (
              <Pressable
                onPress={() => {
                  dispatch(paused());
                  clearInterval(tickingId.current!);
                }}
              >
                <Icon name="pause-circle-filled" size={96} color="white" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  dispatch(played());
                  tickingId.current = setInterval(() => {
                    dispatch(passedOneSec());
                  }, 1000);
                }}
              >
                <Icon name="play-circle-filled" size={96} color="white" />
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                clearInterval(tickingId.current!);
                goToNextSection();
              }}
            >
              <Icon name="skip-next" size={48} color="white" style={tw`ml-2`} />
            </Pressable>
          </View>
        </View>
      </View>
    </BaseLayout>
  );
};

export default Timer;
