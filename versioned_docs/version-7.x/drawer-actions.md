---
id: drawer-actions
title: DrawerActions reference
sidebar_label: DrawerActions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`DrawerActions` is an object containing methods for generating actions specific to drawer-based navigators. Its methods expand upon the actions available in [CommonActions](navigation-actions.md).

The following actions are supported:

### openDrawer

The `openDrawer` action can be used to open the drawer pane.

```js name="Drawer Actions - openDrawer" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(DrawerActions.openDrawer());
          // codeblock-focus-end
        }}
      >
        Open Drawer
      </Button>
    </View>
  );
}

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
```

### closeDrawer

The `closeDrawer` action can be used to close the drawer pane.

```js name="Drawer Actions - closeDrawer" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open Drawer
      </Button>
    </View>
  );
}

function CustomDrawerContent(props) {
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(DrawerActions.closeDrawer());
          // codeblock-focus-end
        }}
      />
    </DrawerContentScrollView>
  );
}

const MyDrawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
```

### toggleDrawer

The `toggleDrawer` action can be used to toggle the drawer pane.

```js name="Drawer Actions - toggleDrawer" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle Drawer
      </Button>
    </View>
  );
}

function CustomDrawerContent(props) {
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(DrawerActions.toggleDrawer());
          // codeblock-focus-end
        }}
      />
    </DrawerContentScrollView>
  );
}

const MyDrawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
```

### jumpTo

The `jumpTo` action can be used to jump to an existing route in the drawer navigator.

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to pass to the destination route.

```js name="Drawer Actions - jumpTo" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(
            DrawerActions.jumpTo('Profile', { user: 'Satya' })
          );
          // codeblock-focus-end
        }}
      >
        Jump to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route?.params?.user ? route.params.user : 'Noone'}'s profile</Text>
    </View>
  );
}

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
```
