---
id: screen-tracking
title: Screen tracking for analytics
sidebar_label: Screen tracking
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

```js name="Screen tracking for analytics" snack
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
<TabItem value="dynamic" label="Dynamic">

```js name="Screen tracking for anylytics" snack
import * as React from 'react';
import { View } from 'react-native';
// codeblock-focus-start
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
// codeblock-focus-end
import { Button } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';

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

        // Replace the line below to add the tracker from a mobile analytics SDK
        await trackScreenView(routeNameRef.current);
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

:::note

If you are building a library that wants to provide screen tracking integration with React Navigation, you can accept a [`ref`](navigation-container.md#ref) to the navigation container and use the [`ready`](navigation-container.md#ready) and [`state`](navigation-container.md#state) events instead of `onReady` and `onStateChange` props to keep your logic self-contained.

:::

## Libraries with built-in integration

Here are some popular telemetry and analytics libraries that have built-in integration with React Navigation for screen tracking:

### PostHog

Open source product analytics platform with self-hosted and cloud-hosted options. [Learn more](https://posthog.com/docs/libraries/react-native).

### Embrace

Observability platform for mobile and web, powered by OpenTelemetry. [Learn more](https://embrace.io/docs/react-native/features/navigation/?packages=react-navigation%2Fnative).

### Vexo

Analytics for web and React Native. [Learn more](https://docs.vexo.co/react-native-guide/integration).

### Datadog

Real User Monitoring and error tracking platform. [Learn more](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/react_native/integrated_libraries/).

### Sentry

Application performance monitoring and error tracking platform. [Learn more](https://docs.sentry.io/platforms/react-native/tracing/instrumentation/react-navigation/).

### Segment

Customer data platform that supports React Native. [Learn more](https://www.twilio.com/docs/segment/connections/sources/catalog/libraries/mobile/react-native#automatic-screen-tracking).

### Luciq

Mobile observability and experience platform. [Learn more](https://docs.luciq.ai/docs/react-native-repro-steps#react-navigation).
