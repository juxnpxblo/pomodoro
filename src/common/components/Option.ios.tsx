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
  setOpenOption: React.Dispatch<React.SetStateAction<string>>;
  actionCreator: any;
}

const Option = ({
  name,
  options,
  currentValue,
  actionCreator,
  label,
  open,
  setOpenOption,
}: OptionProps) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Pressable
        onPress={() => {
          setOpenOption(name);
        }}
        style={tw`rounded-full bg-red-1 py-4 px-3 mb-4 rounded-[30px]`}
      >
        <View style={tw.style('flex-row justify-between', open && '-mb-5')}>
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
        </View>
        {open && (
          <Picker
            prompt={name}
            selectedValue={currentValue}
            onValueChange={(value) => dispatch(actionCreator(value))}
          >
            {options.map((option) => (
              <Picker.Item
                label={`${option}`}
                value={option}
                key={option}
                color="#fff"
              />
            ))}
          </Picker>
        )}
      </Pressable>
    </>
  );
};

export default Option;
