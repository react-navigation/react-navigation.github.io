---
id: version-5.x-status-bar
title: Different status bar configuration based on route
sidebar_label: Different status bar configuration based on route
original_id: status-bar
---

If you don't have a navigation header, or your navigation header changes color based on the route, you'll want to ensure that the correct color is used for the content.

## Stack

This is a simple task when using a stack. You can render the `StatusBar` component, which is exposed by React Native, and set your config.

<samp id="status-bar" />

```js
import * as React from 'react';
import { Text, StatusBar, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';

function Screen1({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text style={{ color: '#fff' }}>Light Screen</Text>
      <Button
        title="Next screen"
        onPress={() => navigation.navigate('Screen2')}
        color="#fff"
      />
    </SafeAreaView>
  );
}

function Screen2({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Text>Dark Screen</Text>
      <Button
        title="Next screen"
        onPress={() => navigation.navigate('Screen1')}
      />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
```

![StackNavigator with different StatusBar configs](/docs/assets/statusbar/statusbar-stack-demo.gif)

## Tabs and Drawer

If you're using a tab or drawer navigator, it's a bit more complex because all of the screens in the navigator might be rendered at once and kept rendered - that means that the last `StatusBar` config you set will be used (likely on the final tab of your tab navigator, not what the user is seeing).

To fix this we'll have to do two things

1. Only use the `StatusBar` component on our initial screen. This allows us to ensure the correct `StatusBar` config is used.
2. Use `useFocusEffect` and `StatusBar`'s implicit API to change the `StatusBar` configuration when a tab becomes active.

First, the new `Screen2.js` will no longer use the `StatusBar` component.

```jsx
function Screen2({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <Text>Dark Screen</Text>
      <Button
        title="Next screen"
        onPress={() => navigation.navigate('Screen1')}
      />
    </SafeAreaView>
  );
}
```

Then, in both `Screen1.js` and `Screen2.js` we'll use `useFocusEffect` to change the `StatusBar` configuration when that tab `didFocus`. We'll also make sure to remove the listener when the `TabNavigator` has been unmounted.

<samp id="status-bar-focus-effect" />

```js
import { useFocusEffect } from '@react-navigation/native';

function Screen1() {
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = API.subscribe(userId, user => setUser(data));

      return () => unsubscribe();
    }, [userId])
  );

  // ...
}

function Screen2() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#ecf0f1');
    }, [])
  );

  // ...
}
```

![DrawerNavigator with different StatusBar configs](/docs/assets/statusbar/statusbar-drawer-demo.gif)

![TabNavigator with different StatusBar configs](/docs/assets/statusbar/statusbar-tab-demo.gif)
