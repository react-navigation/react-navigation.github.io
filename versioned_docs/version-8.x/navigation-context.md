---
id: navigation-context
title: NavigationContext
sidebar_label: NavigationContext
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`NavigationContext` provides the `navigation` object (same object as the [navigation](navigation-object.md) prop). In fact, [useNavigation](use-navigation.md) uses this context to get the `navigation` prop.

Most of the time, you won't use `NavigationContext` directly, as the provided `useNavigation` covers most use cases. But just in case you have something else in mind, `NavigationContext` is available for you to use.

Example:

```js name="Navigation context" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { NavigationContext } from '@react-navigation/native';
// codeblock-focus-end
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return <SomeComponent />;
}

// codeblock-focus-start

function SomeComponent() {
  // We can access navigation object via context
  const navigation = React.useContext(NavigationContext);
  // codeblock-focus-end

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Some component inside HomeScreen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
  // codeblock-focus-start
}
// codeblock-focus-end

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}

export default App;
```
