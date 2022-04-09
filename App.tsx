import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Timer from './src/features/timer/Timer';
import Settings from './src/features/settings/Settings';

type RootStackParamList = {
  Timer: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Timer"
            component={Timer}
            options={{ header: () => <></> }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ header: () => <></> }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
