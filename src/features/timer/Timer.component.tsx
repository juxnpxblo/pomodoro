import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import tw from '../../lib/tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import type { TimerScreenProps } from '../../app/navigator.types';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import * as h from './timer.helper';
import * as I from './timer.interface';
import {
  selectStatus,
  selectSection,
  selectRound,
  selectTimestamp,
  selectRing,
  played,
  paused,
  wentToNextSection,
  wentToPreviousSection,
  gotSectionChange,
  reset,
  restoredSession,
  switchedRinging,
} from './timer.slice';
import {
  selectFocusTime,
  selectShortBreakTime,
  selectLongBreakTime,
  selectTotalRounds,
  restoredSettings,
  gotSettingsChange,
} from '../settings/settings.slice';
import { StoredSettings } from '../settings/settings.interface';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import {
  Lato_400Regular,
  Lato_700Bold,
  Lato_900Black,
} from '@expo-google-fonts/lato';
import Icon from '@expo/vector-icons/MaterialIcons';
import BaseLayout from '../../common/components/BaseLayout.component';
import Tomato from './Tomato.component';

const Timer = ({ navigation }: TimerScreenProps) => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectStatus);
  const section = useAppSelector(selectSection);
  const timestamp = useAppSelector(selectTimestamp);
  const round = useAppSelector(selectRound);
  const ring = useAppSelector(selectRing);

  const focusTime = useAppSelector(selectFocusTime);
  const shortBreakTime = useAppSelector(selectShortBreakTime);
  const longBreakTime = useAppSelector(selectLongBreakTime);
  const totalRounds = useAppSelector(selectTotalRounds);

  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const tickingId = useRef<ReturnType<typeof setInterval> | null>(null);
  const bellRef = useRef(new Audio.Sound());

  async function ringBell() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    const { sound: bell } = await Audio.Sound.createAsync(
      require('../../assets/audio/bell.mp3')
    );

    bellRef.current = bell;

    const bellStatus = await bellRef.current.getStatusAsync();

    if (bellStatus.isLoaded) await bellRef.current.playAsync();
    else console.error('error loading mp3');
  }

  useEffect(() => {
    return bellRef
      ? () => {
          bellRef.current.unloadAsync();
        }
      : undefined;
  }, [bellRef]);

  useEffect(() => {
    restoreSettings();
    restoreSession();
    dispatch(paused());

    async function restoreSettings() {
      if (await h.restore('STORED_SETTINGS')) {
        const storedSettings: StoredSettings = {
          FOCUS: parseInt(await h.restore(focusTime.key)),
          SHORT_BREAK: parseInt(await h.restore(shortBreakTime.key)),
          LONG_BREAK: parseInt(await h.restore(longBreakTime.key)),
          ROUNDS: parseInt(await h.restore(totalRounds.key)),
        };

        dispatch(restoredSettings(storedSettings));
      } else {
        [focusTime, shortBreakTime, longBreakTime, totalRounds].forEach(
          async ({ key, defaultValue }) => {
            await AsyncStorage.setItem(key, JSON.stringify(defaultValue));
          }
        );

        await AsyncStorage.setItem('STORED_SETTINGS', JSON.stringify(true));
      }
    }

    async function restoreSession() {
      const storedRemainingTime = JSON.parse(await h.restore('REMAINING_TIME'));

      if (storedRemainingTime) {
        const storedSession: I.StoredSession = {
          SECTION: (await h.restore('SECTION')) as I.Section,
          ROUND: parseInt(await h.restore('ROUND')),
          RING: JSON.parse(await h.restore('RING')),
        };

        dispatch(restoredSession(storedSession));

        setRemainingMinutes(storedRemainingTime.minutes);
        setRemainingSeconds(storedRemainingTime.seconds);
      } else {
        setRemainingMinutes(focusTime.value);
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'TICKING') {
      tickingId.current = setInterval(async () => {
        const { minutes: min, seconds: sec } = h.getRemainingTime(timestamp);

        if (min <= 0 && sec <= 0) {
          if (ring && min === 0 && sec === 0) ringBell();
          clearInterval(tickingId.current!);
          dispatch(wentToNextSection({ totalRounds: totalRounds.value }));
        } else {
          setRemainingMinutes(min);
          setRemainingSeconds(sec);
        }
      }, 1000);
    }
  }, [status]);

  useEffect(() => {
    if (section.changed) {
      if (section.current === 'FOCUS') {
        setRemainingMinutes(focusTime.value);
      } else if (section.current === 'SHORT_BREAK') {
        setRemainingMinutes(shortBreakTime.value);
      } else if (section.current === 'LONG_BREAK') {
        setRemainingMinutes(longBreakTime.value);
      }
      setRemainingSeconds(0);

      dispatch(gotSectionChange());
    }
  }, [section]);

  useEffect(() => {
    if (status !== 'UNSET') {
      storeSession();

      async function storeSession() {
        await AsyncStorage.setItem(
          'REMAINING_TIME',
          JSON.stringify({
            minutes: remainingMinutes,
            seconds: remainingSeconds,
          })
        );
        await AsyncStorage.setItem('SECTION', section.current);
        await AsyncStorage.setItem('ROUND', JSON.stringify(round));
        await AsyncStorage.setItem('RING', JSON.stringify(ring));
      }
    }
  }, [remainingMinutes, remainingSeconds, round, section.current, ring]);

  useEffect(() => {
    const inFocusTime = section.current === 'FOCUS';
    const inShortBreak = section.current === 'SHORT_BREAK';
    const inLongBreak = section.current === 'LONG_BREAK';

    if (
      (inFocusTime && focusTime.changed) ||
      (inShortBreak && shortBreakTime.changed) ||
      (inLongBreak && longBreakTime.changed)
    ) {
      if (status === 'TICKING') {
        dispatch(paused());
        clearInterval(tickingId.current!);
      }

      if (inFocusTime) setRemainingMinutes(focusTime.value);
      if (inShortBreak) setRemainingMinutes(shortBreakTime.value);
      if (inLongBreak) setRemainingMinutes(longBreakTime.value);

      setRemainingSeconds(0);
      dispatch(gotSettingsChange());
    }
  }, [focusTime.value, shortBreakTime.value, longBreakTime.value]);

  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <BaseLayout>
      <View style={tw`flex-row justify-between`}>
        <Icon name="help" size={26} color="white" />
        <Pressable
          style={tw`w-[40px] h-[40px] absolute right-0`}
          onPressIn={() => navigation.navigate('Settings')}
        >
          <Icon
            style={tw`absolute right-0`}
            name="settings"
            size={26}
            color="white"
          />
        </Pressable>
      </View>
      <View style={tw`h-full justify-center`}>
        <View style={tw`mb-4`}>
          <Text
            style={tw.style('text-3xl text-white self-center mb-4', {
              fontFamily: 'Lato_700Bold',
            })}
          >
            Pomodoro timer
          </Text>
          <View style={tw`relative w-full mb-5`}>
            <View style={tw`mt-[100%]`}></View>
            <View
              style={tw`bg-red-3 rounded-full absolute inset-0 items-center justify-center`}
            >
              <View
                style={tw`bg-red-1 rounded-full w-[92%] h-[92%] items-center justify-center`}
              >
                <View style={tw`items-center justify-center`}>
                  <View style={tw`mb-2`}>
                    <Text
                      style={tw.style('text-2xl text-white', {
                        fontFamily: 'Lato_400Regular',
                      })}
                    >
                      {section.current === 'FOCUS'
                        ? 'Time to focus!'
                        : 'Time for a break!'}{' '}
                      #{round}
                    </Text>
                  </View>
                  <Text
                    style={tw.style('text-8xl text-white', {
                      fontFamily: 'Lato_900Black',
                    })}
                  >
                    {`${h.timeToString(remainingMinutes)}:${h.timeToString(
                      remainingSeconds
                    )}`}
                  </Text>
                </View>
                <Pressable
                  style={tw`absolute right-0 top-0`}
                  onPressIn={() => dispatch(switchedRinging())}
                >
                  <Icon
                    name={ring ? 'volume-up' : 'volume-off'}
                    size={26}
                    color="white"
                  />
                </Pressable>
                <Pressable
                  style={tw`absolute right-0 bottom-0`}
                  onPress={() => {
                    clearInterval(tickingId.current!);

                    dispatch(reset());

                    setRemainingMinutes(focusTime.value);
                    setRemainingSeconds(0);
                  }}
                >
                  <Icon name="refresh" size={26} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
          <View style={tw`bg-red-3 w-full h-px`}></View>
        </View>
        <View style={tw`items-center`}>
          <View style={tw`flex-row justify-center mb-2`}>
            <Tomato />
            <Tomato />
            <Tomato />
            <Tomato />
          </View>
          <View style={tw`flex-row items-center`}>
            <Pressable
              onPress={() => {
                clearInterval(tickingId.current!);
                dispatch(
                  wentToPreviousSection({
                    remainingMinutes: remainingMinutes,
                    focusTime: focusTime.value,
                    shortBreakTime: shortBreakTime.value,
                    longBreakTime: longBreakTime.value,
                  })
                );
              }}
            >
              <Icon
                name="skip-previous"
                size={48}
                color="white"
                style={tw`mr-2`}
              />
            </Pressable>
            {status === 'TICKING' ? (
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
                  dispatch(
                    played({
                      minutes: remainingMinutes,
                      seconds: remainingSeconds,
                    })
                  );
                }}
              >
                <Icon name="play-circle-filled" size={96} color="white" />
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                clearInterval(tickingId.current!);
                dispatch(wentToNextSection({ totalRounds: totalRounds.value }));
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
