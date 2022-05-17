import { useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import tw from '../../lib/tailwind';
import { useAppDispatch } from '../../app/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as I from './settings.interface';
import { Picker } from '@react-native-picker/picker';
import Icon from '@expo/vector-icons/MaterialIcons';
import { Action } from '@reduxjs/toolkit';

interface OptionProps {
  option: I.Option;
  open: boolean;
  setOpenOption: React.Dispatch<React.SetStateAction<I.OpenOption>>;
  actionCreator: (payload: number) => Action<any>;
}

const Option = ({
  option: { key, label, description, listOfOptions, value },
  open,
  setOpenOption,
  actionCreator,
}: OptionProps) => {
  const dispatch = useAppDispatch();

  const ON_IOS = useRef(Platform.OS === 'ios');
  const pickerRef = useRef<any>(null);

  useEffect(() => {
    if (open && pickerRef.current) pickerRef.current.focus();
  }, [open]);

  const OptionLabel = () => (
    <Text
      style={tw.style('text-xl text-white pl-3', {
        fontFamily: 'Lato_400Regular',
      })}
    >
      {label}
    </Text>
  );

  const OptionInfo = () => (
    <View style={tw`flex-row`}>
      <Text
        style={tw.style('text-xl text-white pr-1', {
          fontFamily: 'Lato_400Regular',
        })}
      >
        {value + ' ' + description}
      </Text>
      <Icon
        name={open ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
        size={25}
        color="white"
        style={tw`self-center`}
      />
    </View>
  );

  return ON_IOS.current ? (
    <View
      style={tw.style('bg-red-1 rounded-full rounded-[30px] mb-4 px-3 py-4')}
    >
      <Pressable
        style={tw.style('flex-row justify-between z-1', open && '-mb-5')}
        onPressIn={() => {
          if (!open) setOpenOption(key);
          else setOpenOption('');
        }}
      >
        <OptionLabel />
        <OptionInfo />
      </Pressable>
      {open && (
        <Picker selectedValue={value} onValueChange={onPick}>
          {listOfOptions.map(mapListOfOptions)}
        </Picker>
      )}
    </View>
  ) : (
    <Pressable
      style={tw.style(
        'bg-red-1 rounded-full rounded-[30px] mb-4 px-3 py-4 flex-row justify-between'
      )}
      onPressIn={() => {
        setOpenOption(key);
      }}
    >
      <Picker
        ref={pickerRef as unknown as undefined}
        style={tw`absolute`}
        prompt={label}
        selectedValue={value}
        onValueChange={onPick}
        onBlur={() => setOpenOption('')}
      >
        {listOfOptions.map(mapListOfOptions)}
      </Picker>
      <OptionLabel />
      <OptionInfo />
    </Pressable>
  );

  async function onPick(value: number) {
    dispatch(actionCreator(value));
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  function mapListOfOptions(option: number) {
    return (
      <Picker.Item
        label={`${option}`}
        value={option}
        key={option}
        color={ON_IOS.current ? '#fff' : '#000'}
      />
    );
  }
};

export default Option;
