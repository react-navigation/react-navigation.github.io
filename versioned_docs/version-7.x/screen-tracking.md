---
id: screen-tracking
title: Screen tracking for analytics
sidebar_label: Screen tracking for analytics
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To track the currently active screen, we need to:

1. Add a callback to get notified of state changes
2. Get the root navigator state and find the active route name

To get notified of state changes, we can use the `onStateChange` prop on `NavigationContainer`. To get the root navigator state, we can use the `getRootState` method on the container's ref. Please note that `onStateChange` is not called on initial render so you have to set your initial screen separately.

## Example

This example shows how the approach can be adapted to any mobile analytics SDK.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Screen tracking for analytics" snack version=7
import * as React from 'react';
import { View } from 'react-native';
// codeblock-focus-start
import {
  createStaticNavigation,
  useNavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
// codeblock-focus-end
import { Button } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Home() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function Settings() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: Home,
    Settings: Settings,
  },
});

const Navigation = createStaticNavigation(RootStack);

// codeblock-focus-start

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  return (
    <Navigation
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        const trackScreenView = () => {
          // Your implementation of analytics goes here!
        };

        if (previousRouteName !== currentRouteName) {
          // Replace the line below to add the tracker from a mobile analytics SDK
          await trackScreenView(currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    />
  );
}
// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Screen tracking for anylytics" snack version=7
import * as React from 'react';
import { View } from 'react-native';
// codeblock-focus-start
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
// codeblock-focus-end
import { Button } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Settings')}>
        Go to Settings
      </Button>
    </View>
  );
}

function Settings({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

const Stack = createStackNavigator();

// codeblock-focus-start

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        const trackScreenView = () => {
          // Your implementation of analytics goes here!
        };

        if (previousRouteName !== currentRouteName) {
          // Replace the line below to add the tracker from a mobile analytics SDK
          await trackScreenView(currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    >
      {/* ... */}
      // codeblock-focus-end
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
      // codeblock-focus-start
    </NavigationContainer>
  );
}
// codeblock-focus-end
```

</TabItem>
</Tabs>
