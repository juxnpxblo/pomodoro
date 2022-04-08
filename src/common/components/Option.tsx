import { View, Text } from 'react-native';
import tw from '../../lib/tailwind';
import Icon from '@expo/vector-icons/MaterialIcons';

interface OptionProps {
  name: string;
  currentValue: string;
}

const Option = ({ name, currentValue }: OptionProps) => {
  return (
    <View
      style={tw`flex-row w-min rounded-full bg-red-1 py-3 px-3 mb-4 rounded-[30px] justify-between`}
    >
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
          {currentValue}
        </Text>
        <Icon
          name="keyboard-arrow-right"
          size={25}
          color="white"
          style={tw`self-center`}
        />
      </View>
    </View>
  );
};

export default Option;
