import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import tw from './src/lib/tailwind';
import Timer from './src/features/Timer';

export default function App() {
  return (
    // <Provider store={store}>
    <View>
      <StatusBar style="light" />
      <View style={tw`bg-red-2 h-full px-4 pb-3`}>
        <SafeAreaView>
          <Timer />
        </SafeAreaView>
      </View>
    </View>

    // </Provider>
  );
}
