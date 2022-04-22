import { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import tw from '../../lib/tailwind';
import Icon from '@expo/vector-icons/MaterialIcons';

import { Picker } from '@react-native-picker/picker';
import { useAppDispatch } from '../../app/hooks';

interface OptionProps {
  name: string;
  options: number[];
  currentValue: number;
  label?: string;
  open?: boolean;
  actionCreator: any;
}

const Option = ({
  name,
  options,
  currentValue,
  actionCreator,
  label,
}: OptionProps) => {
  const dispatch = useAppDispatch();

  const pickerRef = useRef<any>(null);

  return (
    <Pressable
      onPress={() => pickerRef.current.focus()}
      style={tw`flex-row rounded-full bg-red-1 py-4 px-3 mb-4 rounded-[30px] justify-between`}
    >
      <Picker
        ref={pickerRef as unknown as undefined}
        style={tw`absolute`}
        prompt={name}
        selectedValue={currentValue}
        onValueChange={(value) => dispatch(actionCreator(value))}
      >
        {options.map((option) => (
          <Picker.Item label={`${option}`} value={option} key={option} />
        ))}
      </Picker>
      <Text
        style={tw.style('text-xl text-white pl-3', {
          fontFamily: 'Raleway_400Regular',
        })}
      >
        {name}
      </Text>
      <View style={tw`flex-row`}>
        <Text
          style={tw.style('text-xl text-white pr-1', {
            fontFamily: 'Raleway_400Regular',
          })}
        >
          {currentValue + ' ' + (label || 'min')}
        </Text>
        <Icon
          name="keyboard-arrow-right"
          size={25}
          color="white"
          style={tw`self-center`}
        />
      </View>
    </Pressable>
  );
};

export default Option;
