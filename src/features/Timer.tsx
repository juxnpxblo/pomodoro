import tw from '../lib/tailwind';
import AppLoading from 'expo-app-loading';
import { View, Text } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import {
  Raleway_400Regular,
  Raleway_600SemiBold,
} from '@expo-google-fonts/raleway';

const Timer = () => {
  let [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={tw`h-full pt-3`}>
      <View>
        <View style={tw`flex-row justify-between pb-4`}>
          <Icon name="help" size={26} color="white" />
          <Icon name="settings" size={26} color="white" />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={tw.style('text-3xl text-white self-center pb-7', {
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
                    Time to focus! #1
                  </Text>
                </View>
                <Text
                  style={tw.style('text-8xl text-white', {
                    fontFamily: 'Raleway_600SemiBold',
                  })}
                >
                  23:12
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
              <Icon
                name="refresh"
                size={26}
                color="white"
                style={tw`absolute right-0 bottom-0`}
              />
            </View>
          </View>
        </View>
        <View style={tw`h-px w-full bg-red-3`}></View>
      </View>
      <View style={tw`items-center`}>
        <View style={tw`flex-row justify-center pb-2`}>
          <View style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}></View>
          <View style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}></View>
          <View style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}></View>
          <View style={tw`w-[35px] h-[35px] bg-white rounded-full mr-3`}></View>
        </View>
        {/* <Icon name="play-circle-filled" size={95} color="white" /> */}
        <Icon name="pause-circle-filled" size={95} color="white" />
      </View>
    </View>
  );
};

export default Timer;
