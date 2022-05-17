import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './src/app/navigator.types';
import { StatusBar } from 'expo-status-bar';
import Timer from './src/features/timer/Timer.component';
import Settings from './src/features/settings/Settings.component';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(217, 85, 80)',
    background: 'rgb(217, 85, 80)',
    card: 'rgb(217, 85, 80)',
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          initialRouteName="Timer"
          screenOptions={{
            header: () => null,
          }}
        >
          <Stack.Screen name="Timer" component={Timer} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
