---
id: use-prevent-remove
title: usePreventRemove
sidebar_label: usePreventRemove
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The `usePreventRemove` hook allows you to prevent the user from leaving a screen. For example, if there are unsaved changes, you might want to show a confirmation dialog before the user can navigate away.

The hook takes 2 parameters:

- `preventRemove`: A boolean value indicating whether to prevent the screen from being removed.
- `callback`: A function that will be called when the removal is prevented. This can be used to show a confirmation dialog.

The callback receives a `data` object with the `action` that triggered the removal of the screen. You can dispatch this action again after confirmation, or check the action object to determine what to do.

Example:

```js name="usePreventRemove hook" snack static2dynamic
import * as React from 'react';
import { Alert, View, TextInput, Platform, StyleSheet } from 'react-native';
import {
  useNavigation,
  usePreventRemove,
  createStaticNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
const EditTextScreen = () => {
  const [text, setText] = React.useState('');
  const navigation = useNavigation();

  const hasUnsavedChanges = Boolean(text);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    if (Platform.OS === 'web') {
      const discard = confirm(
        'You have unsaved changes. Discard them and leave the screen?'
      );

      if (discard) {
        navigation.dispatch(data.action);
      }
    } else {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Discard them and leave the screen?',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(data.action),
          },
        ]
      );
    }
  });

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
      <Button onPress={() => navigation.push('EditText')} style={styles.button}>
        Push EditText
      </Button>
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

<video playsInline autoPlay muted loop>
  <source src="/assets/behavior/prevent-closing.mp4" />
</video>

Internally, the hook uses the [`beforeRemove`](navigation-events.md#beforeremove) event to prevent the screen from being removed. This event is triggered whenever a screen is being removed due to a navigation action.

## Limitations

There are a couple of limitations to be aware of when using the `usePreventRemove` hook. It is **only** triggered whenever a screen is being removed due to a navigation state change. For example:

- The user pressed the back button on a screen in a stack.
- The user performed a swipe-back gesture.
- Some action such as `pop` or `reset` was dispatched which removes the screen from the state.

It **does not prevent** a screen from being unfocused if it's not being removed. For example:

- The user pushed a new screen on top of the screen with the listener in a stack.
- The user navigated from one tab/drawer screen to another tab/drawer screen.

It also **does not prevent** a screen from being removed when the user is exiting the screen due to actions not controlled by the navigation state:

- The user closes the app (e.g. by pressing the back button on the home screen, closing the tab in the browser, closing it from the app switcher etc.). You can additionally use [`hardwareBackPress`](https://reactnative.dev/docs/backhandler) event on Android, [`beforeunload`](https://developer.mozilla.org/en-US/docs/web/api/window/beforeunload_event) event on the Web etc. to handle some of these cases. See [Prevent the user from leaving the app](preventing-going-back.md#prevent-the-user-from-leaving-the-app) for more details.
- A screen gets unmounted due to conditional rendering, or due to a parent component being unmounted.

## UX considerations

Generally, we recommend using this hook sparingly. A better approach is to persist the unsaved data into [`AsyncStorage`](https://github.com/react-native-async-storage/async-storage) or similar persistent storage and prompt to restore it when the user returns to the screen.

Doing so has several benefits:

- This approach still works if the app is closed or crashes unexpectedly.
- It's less intrusive to the user as they can still navigate away from the screen to check something and return without losing the data.
```
