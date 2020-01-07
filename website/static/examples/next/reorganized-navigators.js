import * as React from 'react';
import { View, Button } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

function FeedScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

function ProfileScreen() {
  return <View />;
}

function SettingsScreen() {
  return <View />;
}

const FeedStack = createStackNavigator();

function FeedStackScreen() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="Feed" component={FeedScreen} />
      {/* other screens */}
    </FeedStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      {/* other screens */}
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

const RootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeTabs} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
      </RootStack.Navigator>
    </NavigationNativeContainer>
  );
}
