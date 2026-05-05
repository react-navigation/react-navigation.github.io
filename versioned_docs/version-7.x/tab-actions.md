---
id: tab-actions
title: TabActions reference
sidebar_label: TabActions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`TabActions` is an object containing methods for generating actions specific to tab-based navigators. Its methods expand upon the actions available in [`CommonActions`](navigation-actions.md).

For screens inside a [Bottom Tab Navigator](bottom-tab-navigator.md) or [Material Top Tab Navigator](material-top-tab-navigator.md), tab actions are available as methods on the `navigation` object.

The following actions are supported:

## jumpTo

The `jumpTo` action can be used to jump to an existing route in the tab navigator.

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to pass to the destination route.

```js name="Tab Actions - jumpTo" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start
function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // highlight-next-line
          navigation.jumpTo('Profile', { user: 'Satya' });
        }}
      >
        Jump to Profile
      </Button>
    </View>
  );
}
// codeblock-focus-end

function ProfileScreen({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>
        {route?.params?.user ? route.params.user : 'No one'}'s profile
      </Text>
    </View>
  );
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

It can also be used with `navigation.dispatch`:

```js
import { TabActions } from '@react-navigation/native';

navigation.dispatch(TabActions.jumpTo('Profile', { user: 'Satya' }));
```
