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
import Option from '../../common/components/Option';

type RootStackParamList = {
  Timer: undefined;
  Settings: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Timer'>;

const Timer = ({ navigation }: Props) => {
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
        <Option name="Focus time" currentValue="25 min" />
        <Option name="Short break" currentValue="5 min" />
        <Option name="Long Break" currentValue="15 min" />
        <Option name="Sections" currentValue="4 intervals" />
        <View
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
        </View>
      </View>
    </BaseLayout>
  );
};

export default Timer;
