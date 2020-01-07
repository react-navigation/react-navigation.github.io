import * as React from 'react';
import { Button, View, Text, TouchableOpacity } from 'react-native';
import {
  NavigationNativeContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

function SettingsScreen({ route, navigation }) {
  const { user } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Text>userParam: {JSON.stringify(user)}</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function MyButton() {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <MyButton />
      <Button
        title="Go to Settings"
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();

  return (
    <AppearanceProvider>
      <NavigationNativeContainer
        theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Drawer.Navigator initialRouteName="Root">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Root" component={Root} />
        </Drawer.Navigator>
      </NavigationNativeContainer>
    </AppearanceProvider>
  );
}
