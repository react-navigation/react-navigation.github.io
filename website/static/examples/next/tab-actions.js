import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/routers';

function HomeScreen({ navigation }) {
  const jumpToAction = TabActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Jump to Profile"
        onPress={() => navigation.dispatch(jumpToAction)}
      />
    </View>
  );
}

function ProfileScreen({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route?.params?.user ? route.params.user : 'Noone'}'s profile</Text>
    </View>
  );
}

const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <Tabs.Navigator>
        <Tabs.Screen name="Home" component={HomeScreen} />
        <Tabs.Screen name="Profile" component={ProfileScreen} />
      </Tabs.Navigator>
    </NavigationNativeContainer>
  );
}
