---
id: status-bar
title: Different status bar configuration based on route
sidebar_label: Status bar configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you don't have a navigation header, or your navigation header changes color based on the route, you'll want to ensure that the correct color is used for the content.

## Stack

This is a simple task when using a stack. You can render the `StatusBar` component, which is exposed by React Native, and set your config.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Different status bar" snack
import * as React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen1() {
  const navigation = useNavigation('Screen1');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#6a51ae',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      // highlight-start
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      // highlight-end
      <Text style={{ color: '#fff' }}>Light Screen</Text>
      <Button onPress={() => navigation.navigate('Screen2')}>
        Next screen
      </Button>
    </View>
  );
}

function Screen2() {
  const navigation = useNavigation('Screen2');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#ecf0f1',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      // highlight-start
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      // highlight-end
      <Text>Dark Screen</Text>
      <Button onPress={() => navigation.navigate('Screen1')}>
        Next screen
      </Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Screen1: Screen1,
    Screen2: Screen2,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
```

</TabItem>

<TabItem value="dynamic" label="Dynamic">

```js name="Different status bar" snack
import * as React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function Screen1() {
  const navigation = useNavigation('Screen1');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#6a51ae',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      // highlight-start
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      // highlight-end
      <Text style={{ color: '#fff' }}>Light Screen</Text>
      <Button onPress={() => navigation.navigate('Screen2')}>
        Next screen
      </Button>
    </View>
  );
}

function Screen2() {
  const navigation = useNavigation('Screen2');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#ecf0f1',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      // highlight-start
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      // highlight-end
      <Text>Dark Screen</Text>
      <Button onPress={() => navigation.navigate('Screen1')}>
        Next screen
      </Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

</TabItem>
</Tabs>

<video playsInline autoPlay muted loop>
  <source src="/assets/statusbar/status-stack-ios.mp4" />
</video>

<video playsInline autoPlay muted loop>
  <source src="/assets/statusbar/status-stack-android.mp4" />
</video>

## Tabs and Drawer

If you're using a tab or drawer navigator, it's a bit more complex because all of the screens in the navigator might be rendered at once and kept rendered - that means that the last `StatusBar` config you set will be used (likely on the final tab of your tab navigator, not what the user is seeing).

To fix this, we'll have to do make the status bar component aware of screen focus and render it only when the screen is focused. We can achieve this by using the [`useIsFocused` hook](use-is-focused.md) and creating a wrapper component:

```js
import * as React from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}
```

Now, our screens (both `Screen1.js` and `Screen2.js`) will use the `FocusAwareStatusBar` component instead of the `StatusBar` component from React Native:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Different status bar based on tabs" snack
import * as React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

// codeblock-focus-start
function Screen1() {
  const navigation = useNavigation('Screen1');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#6a51ae',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text style={{ color: '#fff' }}>Light Screen</Text>
      <Button onPress={() => navigation.navigate('Screen2')}>
        Next screen
      </Button>
    </View>
  );
}

function Screen2() {
  const navigation = useNavigation('Screen2');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#ecf0f1',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Text>Dark Screen</Text>
      <Button onPress={() => navigation.navigate('Screen1')}>
        Next screen
      </Button>
    </View>
  );
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Screen1: Screen1,
    Screen2: Screen2,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Different status bar based on tabs" snack
import * as React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

// codeblock-focus-start
function Screen1() {
  const navigation = useNavigation('Screen1');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#6a51ae',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text style={{ color: '#fff' }}>Light Screen</Text>
      <Button onPress={() => navigation.navigate('Screen2')}>
        Next screen
      </Button>
    </View>
  );
}

function Screen2() {
  const navigation = useNavigation('Screen2');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#ecf0f1',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Text>Dark Screen</Text>
      <Button onPress={() => navigation.navigate('Screen1')}>
        Next screen
      </Button>
    </View>
  );
}
// codeblock-focus-end

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

</TabItem>
</Tabs>

Although not necessary, you can use the `FocusAwareStatusBar` component in the screens of the native stack navigator as well.

<div>
  <video playsInline autoPlay muted loop>
    <source src="/assets/statusbar/status-drawer-ios.mp4" />
  </video>

  <video playsInline autoPlay muted loop>
    <source src="/assets/statusbar/status-drawer-android.mp4" />
  </video>

  <video playsInline autoPlay muted loop>
    <source src="/assets/statusbar/status-tab-ios.mp4" />
  </video>

  <video playsInline autoPlay muted loop>
    <source src="/assets/statusbar/status-tab-android.mp4" />
  </video>
</div>
