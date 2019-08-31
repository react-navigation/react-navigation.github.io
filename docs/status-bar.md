---
id: status-bar
title: Different status bar configuration based on route
sidebar_label: Different status bar configuration based on route
---

If you don't have a navigation header, or your navigation header changes color based on the route, you'll want to ensure that the correct color is used for the content.

## Stack

This is a simple task when using a stack. You can render the `StatusBar` component, which is exposed by React Native, and set your config.

```js
function Screen1() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text style={[styles.paragraph, { color: '#fff' }]}>Light Screen</Text>
      <Button
        title="Next screen"
        onPress={() => this.props.navigation.navigate('Screen2')}
        color={isAndroid ? 'blue' : '#fff'}
      />
    </SafeAreaView>
  );
}

function Screen2() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Text style={styles.paragraph}>Dark Screen</Text>
      <Button
        title="Next screen"
        onPress={() => this.props.navigation.navigate('Screen1')}
      />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="screen-1" component={Screen1} />
      <Stack.Screen name="screen-2" component={Screen2} />
    </Stack.Navigator>
  );
}
```

![StackNavigator with different StatusBar configs](/docs/assets/statusbar/statusbar-stack-demo.gif)

## Tabs and Drawer

If you're using a tab or drawer navigator, it's a bit more complex because all of the screens in the navigator might be rendered at once and kept rendered - that means that the last `StatusBar` config you set will be used (likely on the final tab of your tab navigator, not what the user is seeing).

To fix this we'll have to do two things

1. Only use the `StatusBar` component on our initial screen. This allows us to ensure the correct `StatusBar` config is used.
2. Use `useFocusEffect` and `StatusBar`'s implicit API to change the `StatusBar` configuration when a tab becomes active.

First, the new `Screen2.js` will no longer use the `StatusBar` component.

```jsx
function Screen2() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <Text style={styles.paragraph}>Dark Screen</Text>
      <Button
        title="Next screen"
        onPress={() => this.props.navigation.navigate('Screen1')}
      />
    </SafeAreaView>
  );
}
```

Then, in both `Screen1.js` and `Screen2.js` we'll use `useFocusEffect` to change the `StatusBar` configuration when that tab `didFocus`. We'll also make sure to remove the listener when the `TabNavigator` has been unmounted.

```js
import { useFocusEffect } from '@react-navigation/core';

function Screen1() {
  const setStatusBarConfig = React.useCallback(() => {
    StatusBar.setBarStyle('light-content');
    Platform.OS === 'android' && StatusBar.setBackgroundColor('#6a51ae');
  }, []);

  useFocusEffect(setStatusBarConfig);

  // ...
}

function Screen2() {
  const setStatusBarConfig = React.useCallback(() => {
    StatusBar.setBarStyle('dark-content');
    Platform.OS === 'android' && StatusBar.setBackgroundColor('#ecf0f1');
  }, []);

  useFocusEffect(setStatusBarConfig);

  // ...
}
```

![DrawerNavigator with different StatusBar configs](/docs/assets/statusbar/statusbar-drawer-demo.gif)

![TabNavigator with different StatusBar configs](/docs/assets/statusbar/statusbar-tab-demo.gif)
