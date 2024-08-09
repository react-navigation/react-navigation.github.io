---
id: tab-actions
title: TabActions reference
sidebar_label: TabActions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`TabActions` is an object containing methods for generating actions specific to tab-based navigators. Its methods expand upon the actions available in [`CommonActions`](navigation-actions.md).

The following actions are supported:

### jumpTo

The `jumpTo` action can be used to jump to an existing route in the tab navigator.

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to pass to the destination route.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Tab Actions - jumpTo" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  TabActions,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start
function HomeScreen() {
  const navigation = useNavigation();
  // highlight-next-line
  const jumpToAction = TabActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // highlight-next-line
          navigation.dispatch(jumpToAction);
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

const Tab = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Tab);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Tab Actions - jumpTo" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  NavigationContainer,
  TabActions,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// codeblock-focus-start
function HomeScreen() {
  const navigation = useNavigation();
  // highlight-next-line
  const jumpToAction = TabActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // highlight-next-line
          navigation.dispatch(jumpToAction);
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

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>
