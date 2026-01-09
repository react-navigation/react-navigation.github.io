---
id: navigation-events
title: Navigation events
sidebar_label: Navigation events
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

You can listen to various events emitted by React Navigation to get notified of certain events, and in some cases, override the default action. There are few core events such as `focus`, `blur` etc. (documented below) that work for every navigator, as well as navigator specific events that work only for certain navigators.

Apart from the core events, each navigator can emit their own custom events. For example, stack navigator emits `transitionStart` and `transitionEnd` events, tab navigator emits `tabPress` event etc. You can find details about the events emitted on the individual navigator's documentation.

## Core events

Following are the events available in every navigator:

### `focus`

This event is emitted when the screen comes into focus.

For most cases, the [`useFocusEffect`](use-focus-effect.md) hook might be appropriate than adding the listener manually. See [this guide](function-after-focusing-screen.md) for more details to decide which API you should use.

### `blur`

This event is emitted when the screen goes out of focus.

:::note

In some cases, such as going back from a screen in [native-stack navigator](native-stack-navigator.md), the screen may not receive the `blur` event as the screen is unmounted immediately. For cleaning up resources, it's recommended to use the cleanup function of [`useFocusEffect`](use-focus-effect.md) hook instead that considers both blur and unmounting of the screen.

:::

### `state`

This event is emitted when the navigator's state changes. This event receives the navigator's state in the event data (`event.data.state`).

### `beforeRemove`

This event is emitted when the user is leaving the screen due to a navigation action. It is possible to prevent the user from leaving the screen by calling `e.preventDefault()` in the event listener.

```js
React.useEffect(
  () =>
    navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Prompt the user before leaving the screen
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure to discard them and leave the screen?',
        [
          {
            text: "Don't leave",
            style: 'cancel',
            onPress: () => {
              // Do nothing
            },
          },
          {
            text: 'Discard',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    }),
  [navigation, hasUnsavedChanges]
);
```

:::warning

Preventing the action in this event doesn't work properly with [`@react-navigation/native-stack`](native-stack-navigator.md). We recommend using the [`usePreventRemove` hook](preventing-going-back.md) instead.

:::

## Listening to events

There are multiple ways to listen to events from the navigators. Each callback registered as an event listener receives an event object as its argument. The event object contains few properties:

- `data` - Additional data regarding the event passed by the navigator. This can be `undefined` if no data was passed.
- `target` - The route key for the screen that should receive the event. For some events, this maybe `undefined` if the event wasn't related to a specific screen.
- `preventDefault` - For some events, there may be a `preventDefault` method on the event object. Calling this method will prevent the default action performed by the event (such as switching tabs on `tabPress`). Support for preventing actions are only available for certain events like `tabPress` and won't work for all events.

You can listen to events with the following APIs:

### `navigation.addListener`

Inside a screen, you can add listeners on the `navigation` object with the `addListener` method. The `addListener` method takes 2 arguments: type of the event, and a callback to be called on the event. It returns a function that can be called to unsubscribe from the event.

Example:

```js
const unsubscribe = navigation.addListener('tabPress', (e) => {
  // Prevent default action
  e.preventDefault();
});
```

Normally, you'd add an event listener in `React.useEffect` for function components. For example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="navigation.addListener with focus" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

// codeblock-focus-start
function ProfileScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Screen was unfocused
    });
    return unsubscribe;
  }, [navigation]);

  // Rest of the component
  // codeblock-focus-end
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
  // codeblock-focus-start
}
// codeblock-focus-end

const SettingsStack = createNativeStackNavigator({
  screens: {
    Settings: SettingsScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(SettingsStack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="navigation.addListener with focus" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

// codeblock-focus-start
function ProfileScreen({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Screen was unfocused
    });
    return unsubscribe;
  }, [navigation]);

  // Rest of the component
  // codeblock-focus-end
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
  // codeblock-focus-start
}
// codeblock-focus-end

const SettingsStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SettingsStack.Navigator>
        <SettingsStack.Screen name="Settings" component={SettingsScreen} />
        <SettingsStack.Screen name="Profile" component={ProfileScreen} />
      </SettingsStack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

The `unsubscribe` function can be returned as the cleanup function in the effect.

For class components, you can add the event in the `componentDidMount` lifecycle method and unsubscribe in `componentWillUnmount`:

```js
class Profile extends React.Component {
  componentDidMount() {
    this._unsubscribe = navigation.addListener('focus', () => {
      // do something
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    // Content of the component
  }
}
```

Keep in mind that you can only listen to events from the immediate navigator with `addListener`. For example, if you try to add a listener in a screen that's inside a stack that's nested in a tab, it won't get the `tabPress` event. If you need to listen to an event from a parent navigator, you may use [`navigation.getParent`](navigation-object.md#getparent) to get a reference to the parent screen's navigation object and add a listener.

```js
const unsubscribe = navigation
  .getParent('MyTabs')
  .addListener('tabPress', (e) => {
    // Do something
  });
```

Here `'MyTabs'` refers to the value you pass in the `id` prop of the parent `Tab.Navigator` whose event you want to listen to.

:::warning

The component needs to be rendered for the listeners to be added in `useEffect` or `componentDidMount`. Navigators such as [bottom tabs](bottom-tab-navigator.md) and [drawer](drawer-navigator.md) lazily render the screen after navigating to it. So if your listener is not being called, double check that the component is rendered.

:::

### `listeners` prop on `Screen`

Sometimes you might want to add a listener from the component where you defined the navigator rather than inside the screen. You can use the `listeners` prop on the `Screen` component to add listeners. The `listeners` prop takes an object with the event names as keys and the listener callbacks as values.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Tab = createBottomTabNavigatior({
  screens: {
    Chat: {
      screen: Chat,
      listeners: {
        tabPress: (e) => {
          // Prevent default action
          e.preventDefault();
        },
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Tab.Screen
  name="Chat"
  component={Chat}
  listeners={{
    tabPress: (e) => {
      // Prevent default action
      e.preventDefault();
    },
  }}
/>
```

</TabItem>
</Tabs>

You can also pass a callback which returns the object with listeners. It'll receive `navigation` and `route` as the arguments.

Example:
<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Tab = createBottomTabNavigatior({
  screens: {
    Chat: {
      screen: Chat,
      listeners: ({ navigation, route }) => ({
        tabPress: (e) => {
          // Prevent default action
          e.preventDefault();

          // Do something with the `navigation` object
          navigation.navigate('AnotherPlace');
        },
      }),
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Tab.Screen
  name="Chat"
  component={Chat}
  listeners={({ navigation, route }) => ({
    tabPress: (e) => {
      // Prevent default action
      e.preventDefault();

      // Do something with the `navigation` object
      navigation.navigate('AnotherPlace');
    },
  })}
/>
```

</TabItem>
</Tabs>

### `screenListeners` prop on the navigator

You can pass a prop named `screenListeners` to the navigator component, where you can specify listeners for events from all screens for this navigator. This can be useful if you want to listen to specific events regardless of the screen, or want to listen to common events such as `state` which is emitted to all screens.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Stack = createNativeStackNavigator({
  screenListeners: {
    state: (e) => {
      // Do something with the state
      console.log('state changed', e.data);
    },
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Navigator
  screenListeners={{
    state: (e) => {
      // Do something with the state
      console.log('state changed', e.data);
    },
  }}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>
```

</TabItem>
</Tabs>

Similar to `listeners`, you can also pass a function to `screenListeners`. The function will receive the [`navigation` object](navigation-object.md) and the [`route` object](route-object.md) for each screen. This can be useful if you need access to the `navigation` object.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Tab = createBottomTabNavigatior({
  screenListeners: ({ navigation }) => ({
    state: (e) => {
      // Do something with the state
      console.log('state changed', e.data);

      // Do something with the `navigation` object
      if (!navigation.canGoBack()) {
        console.log("we're on the initial screen");
      }
    },
  }),
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Tab.Navigator
  screenListeners={({ navigation }) => ({
    state: (e) => {
      // Do something with the state
      console.log('state changed', e.data);

      // Do something with the `navigation` object
      if (!navigation.canGoBack()) {
        console.log("we're on the initial screen");
      }
    },
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

</TabItem>
</Tabs>
