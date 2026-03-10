import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ServersScreen from '../screens/ServersScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import LoginScreen from '../screens/LoginScreen';
import { useVpnStore } from '../store/vpnStore';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Servers: undefined;
  Subscription: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token } = useVpnStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Servers" component={ServersScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
