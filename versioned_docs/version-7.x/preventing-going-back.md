---
id: preventing-going-back
title: Preventing going back
sidebar_label: Preventing going back
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Sometimes you may want to prevent the user from leaving a screen, for example, if there are unsaved changes, you might want to show a confirmation dialog. You can achieve it by using the `beforeRemove` event.

The event listener receives the `action` that triggered it. You can dispatch this action again after confirmation, or check the action object to determine what to do.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Prevent going back" snack version=7
import * as React from 'react';
import { Button, Alert, View, TextInput, StyleSheet } from 'react-native';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// codeblock-focus-start
const EditTextScreen = () => {
  const [text, setText] = React.useState('');
  const navigation = useNavigation();

  const hasUnsavedChanges = Boolean(text);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        const action = e.data.action;
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [hasUnsavedChanges, navigation]
  );

  return (
    <View style={styles.content}>
      <TextInput
        autoFocus
        style={styles.input}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
    </View>
  );
};
// codeblock-focus-end

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.buttons}>
      <Button
        title={'Push EditText'}
        onPress={() => navigation.push('EditText')}
        style={styles.button}
      />
    </View>
  );
};

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    EditText: EditTextScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'white',
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Prevent going back" snack version=7
import * as React from 'react';
import { Button, Alert, View, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// codeblock-focus-start
const EditTextScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = React.useState('');

  const hasUnsavedChanges = Boolean(text);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        const action = e.data.action;
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [hasUnsavedChanges, navigation]
  );

  return (
    <View style={styles.content}>
      <TextInput
        autoFocus
        style={styles.input}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
    </View>
  );
};
// codeblock-focus-end

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.buttons}>
      <Button
        title={'Push EditText'}
        onPress={() => navigation.push('EditText')}
        style={styles.button}
      />
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditText" component={EditTextScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'white',
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
```

</TabItem>
</Tabs>

Previously, the way to do this was to:

- Override back button in header
- Disable back swipe gesture
- Override system back button/gesture on Android

However, this approach has many important differences in addition to being less code:

- It's not coupled to any specific buttons, going back from custom buttons will trigger it as well
- It's not coupled to any specific actions, any action that removes the route from state will trigger it
- It works across nested navigators, e.g. if the screen is being removed due to an action in parent navigator
- User can still swipe back in the stack navigator, however, the swipe will be cancelled if the event was prevented
- It's possible to continue the same action that triggered the event

## Limitations

There are couple of limitations to be aware of when using the `beforeRemove` event. The event is **only** triggered whenever a screen is being removed due to a navigation state change. For example:

- The user pressed back button on a screen in a stack.
- The user performed a swipe back gesture.
- Some action such as `pop` or `reset` was dispatched which removes the screen from the state.

This event is **not** triggered when a screen is being unfocused but not removed. For example:

- The user pushed a new screen on top of the screen with the listener in a stack.
- The user navigated from one tab/drawer screen to another tab/drawer screen.

The event is also **not** triggered when the user is exiting the screen due to actions not controlled by the navigation state:

- The user closes the app (e.g. by pressing the back button on the home screen, closing the tab in the browser, closing it from app switcher etc.). You can additionally use [`hardwareBackPress`](https://reactnative.dev/docs/backhandler) event on Android, [`beforeunload`](https://developer.mozilla.org/en-US/docs/web/api/window/beforeunload_event) event on Web etc. to handle some of these cases.
- A screen gets unmounted due to conditional rendering, or due to a parent component being unmounted.
- A screen gets unmounted due to usage of `unmountOnBlur` options with [`@react-navigation/bottom-tabs`](bottom-tab-navigator.md), [`@react-navigation/drawer`](drawer-navigator.md) etc.

In addition to the above scenarios, this feature also doesn't work properly with [`@react-navigation/native-stack`](native-stack-navigator.md). To make this work, you need to:

- Disable the swipe gesture for the screen (`gestureEnabled: false`).
- Override the native back button in the header with a custom back button (`headerLeft: (props) => <CustomBackButton {...props} />`).
