---
id: custom-android-back-button-handling
title: Custom Android back button behavior
sidebar_label: Custom Android back button behavior
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

By default, when user presses the Android hardware back button, react-navigation will pop a screen or exit the app if there are no screens to pop. This is a sensible default behavior, but there are situations when you might want to implement custom handling.

As an example, consider a screen where user is selecting items in a list, and a "selection mode" is active. On a back button press, you would first want the "selection mode" to be deactivated, and the screen should be popped only on the second back button press. The following code snippet demonstrates the situation. We make use of [`BackHandler`](https://reactnative.dev/docs/backhandler.html) which comes with react-native, along with the `useFocusEffect` hook to add our custom `hardwareBackPress` listener.

Returning `true` from `onBackPress` denotes that we have handled the event, and react-navigation's listener will not get called, thus not popping the screen. Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.

<samp id="custom-android-back-button"/>

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Custom android back button" snack version=7
import * as React from 'react';
import { Text, View, BackHandler, StyleSheet } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlatformPressable, Button } from '@react-navigation/elements';

const listData = [{ key: 'Apple' }, { key: 'Orange' }, { key: 'Carrot' }];

// codeblock-focus-start
function ScreenWithCustomBackBehavior() {
  // codeblock-focus-end
  const [selected, setSelected] = React.useState(listData[0].key);
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] =
    React.useState(false);

  // codeblock-focus-start
  // ...

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled) {
          setIsSelectionModeEnabled(false);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [isSelectionModeEnabled])
  );
  // codeblock-focus-end

  return (
    <View style={styles.container}>
      {listData.map((item) => (
        <>
          {isSelectionModeEnabled ? (
            <PlatformPressable
              onPress={() => {
                setSelected(item.key);
              }}
              style={{
                textDecorationLine: item.key === selected ? 'underline' : '',
              }}
            >
              <Text
                style={{
                  textDecorationLine: item.key === selected ? 'underline' : '',
                  ...styles.text,
                }}
              >
                {item.key}
              </Text>
            </PlatformPressable>
          ) : (
            <Text style={styles.text}>
              {item.key === selected ? 'Selected: ' : ''}
              {item.key}
            </Text>
          )}
        </>
      ))}
      <Button
        onPress={() => setIsSelectionModeEnabled(!isSelectionModeEnabled)}
      >
        Toggle selection mode
      </Button>
      <Text>Selection mode: {isSelectionModeEnabled ? 'ON' : 'OFF'}</Text>
    </View>
  );
  // codeblock-focus-start

  // ...
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  screens: {
    CustomScreen: ScreenWithCustomBackBehavior,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Custom android back button" snack version=7
import * as React from 'react';
import { Text, View, BackHandler, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlatformPressable, Button } from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

const listData = [{ key: 'Apple' }, { key: 'Orange' }, { key: 'Carrot' }];

// codeblock-focus-start
function ScreenWithCustomBackBehavior() {
  // codeblock-focus-end

  const [selected, setSelected] = React.useState(listData[0].key);
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] =
    React.useState(false);
  // codeblock-focus-start
  // ...

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled) {
          setIsSelectionModeEnabled(false);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [isSelectionModeEnabled])
  );
  // codeblock-focus-end

  return (
    <View style={styles.container}>
      {listData.map((item) => (
        <>
          {isSelectionModeEnabled ? (
            <PlatformPressable
              onPress={() => {
                setSelected(item.key);
              }}
              style={{
                textDecorationLine: item.key === selected ? 'underline' : '',
              }}
            >
              <Text
                style={{
                  textDecorationLine: item.key === selected ? 'underline' : '',
                  ...styles.text,
                }}
              >
                {item.key}
              </Text>
            </PlatformPressable>
          ) : (
            <Text style={styles.text}>
              {item.key === selected ? 'Selected: ' : ''}
              {item.key}
            </Text>
          )}
        </>
      ))}
      <Button
        onPress={() => setIsSelectionModeEnabled(!isSelectionModeEnabled)}
      >
        Toggle selection mode
      </Button>
      <Text>Selection mode: {isSelectionModeEnabled ? 'ON' : 'OFF'}</Text>
    </View>
  );
  // codeblock-focus-start

  // ...
}
// codeblock-focus-end

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CustomScreen"
          component={ScreenWithCustomBackBehavior}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
```

</TabItem>
</Tabs>

The presented approach will work well for screens that are shown in a `StackNavigator`. Custom back button handling in other situations may not be supported at the moment (eg. A known case when this does not work is when you want to handle back button press in an open drawer. PRs for such use cases are welcome!).

If instead of overriding system back button, you'd like to prevent going back from the screen, see docs for [preventing going back](preventing-going-back.md).

### Why not use component lifecycle methods

At first, you may be inclined to use `componentDidMount` to subscribe for the back press event and `componentWillUnmount` to unsubscribe, or use `useEffect` to add the listener. This approach will not work - learn more about this in [navigation lifecycle](navigation-lifecycle.md).
