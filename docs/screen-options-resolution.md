---
id: screen-options-resolution
title: Screen options resolution
sidebar_label: Screen options resolution
---

Each screen can configure various aspects about how it gets presented in the navigator that renders it. In the [Configuring the header bar](headers.html) section of the fundamentals documentation we explain the basics of how this works.

In this document we'll explain how this works when there are multiple navigators. It's important to understand this so that you put your `options` in the correct place and can properly configure your navigators. If you put them in the wrong place, at best nothing will happen and at worst something confusing and unexpected will happen.

**You can only modify navigation options for a navigator from one of its screen components. This applies equally to navigators that are nested as screens.**

Let's take for example a tab navigator that contains a stack in each tab. What happens if we set the `options` on a screen inside of the stack?

```js
const Tab = createTabNavigator();
const HomeStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="A" component={A} options={{ tabBarLabel: 'Home!' }} />
    </Tab.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="B"
        component={B}
        options={{ tabBarLabel: 'Settings!' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
```

As we mentioned earlier, you can only modify navigation options for a navigator from one of its screen components. `A` and `B` above are screen components in `HomeStack` and `SettingsStack` respectively, not in the tab navigator. So the result will be that the `tabBarLabel` property is not applied to the tab navigator. We can fix this though!

```js
export default function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ tabBarLabel: 'Home!' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: 'Settings!' }}
      />
    </Tab.Navigator>
  );
}
```

When we set the `options` directly on `Screen` components containing the `HomeStack` and `SettingsStack` component, it allows us to control the options for its parent navigator when its used as a screen component. In this case, the options on our stack components configure the label in the tab navigator that renders the stacks.

## A stack contains a tab navigator and you want to set the title on the stack header

```js
import React from 'react'
import { View, Text, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/core'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Enroll = ({ navigation }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enroll Screen</Text>
      <Button title="Dismiss" onPress={() => navigation.goBack()} />
    </View>
)

const Settings = ({ navigation }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
)

const TabHome = ({ navigation }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'purple' }}>
      <Text>Tab Home</Text>
      <Button title="Enroll" onPress={() => navigation.navigate('Enroll')} />
    </View>
)

const TabProfile = ({ navigation }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'yellow' }}>
      <Text>Tab Profile</Text>
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      <Button title="Enroll" onPress={() => navigation.navigate('Enroll')} />
    </View>
)

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const TabHomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={TabHome} />
  </Stack.Navigator>
)

const TabProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={TabProfile} />
    <Stack.Screen name="Settings" component={Settings} />
  </Stack.Navigator>
)

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={TabHomeStack} />
    <Tab.Screen name="Profile" component={TabProfileStack} />
  </Tab.Navigator>
)

export default () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="Enroll" component={Enroll} />
    </Stack.Navigator>
  </NavigationContainer>
)
```

## A tab navigator contains a stack and you want to hide the tab bar on specific screens

> TODO: We haven't written this guide yet. Please check back later.

## A drawer has a stack inside of it and you want to lock the drawer on certain screens

> TODO: We haven't written this guide yet. Please check back later.
