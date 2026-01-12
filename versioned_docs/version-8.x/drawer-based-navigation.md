---
id: drawer-based-navigation
title: Drawer navigation
sidebar_label: Drawer navigation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Common pattern in navigation is to use drawer from left (sometimes right) side for navigating between screens.

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/drawer/drawer.mp4" />
</video>

Before continuing, first install and configure [`@react-navigation/drawer`](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer) and its dependencies following the [installation instructions](drawer-navigator.md#installation).

## Minimal example of drawer-based navigation

To use this drawer navigator, import it from `@react-navigation/drawer`:
(swipe right to open)

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Drawer navigation" snack
import * as React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Notifications')}>
        Go to notifications
      </Button>
    </View>
  );
}

function NotificationsScreen() {
  const navigation = useNavigation('Notifications');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back home</Button>
    </View>
  );
}

const Drawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Notifications: NotificationsScreen,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Drawer navigation" snack
import * as React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Notifications')}>
        Go to notifications
      </Button>
    </View>
  );
}

function NotificationsScreen() {
  const navigation = useNavigation('Notifications');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back home</Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

## Opening and closing drawer

To open and close drawer, use the following helpers:
<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Drawer open and close" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function Feed() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
      // codeblock-focus-start
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
      // codeblock-focus-end
      <Button onPress={() => navigation.toggleDrawer()}>Toggle drawer</Button>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

// codeblock-focus-start

/* content */

// codeblock-focus-end

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      // codeblock-focus-start
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      // codeblock-focus-end
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Feed: Feed,
    Notifications: Notifications,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Drawer open and close" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function Feed() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
      // codeblock-focus-start
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
      // codeblock-focus-end
      <Button onPress={() => navigation.toggleDrawer()}>Toggle drawer</Button>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

// codeblock-focus-start

/* content */

// codeblock-focus-end

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      // codeblock-focus-start
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      // codeblock-focus-end
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Notifications" component={Notifications} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

If you would like to toggle the drawer you call the following:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Drawer toggle" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function Feed() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
      // codeblock-focus-start
      <Button onPress={() => navigation.toggleDrawer()}>Toggle drawer</Button>
      // codeblock-focus-end
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Feed: Feed,
    Notifications: Notifications,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Drawer toggle" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function Feed() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
      // codeblock-focus-start
      <Button onPress={() => navigation.toggleDrawer()}>Toggle drawer</Button>
      // codeblock-focus-end
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Notifications" component={Notifications} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Each of these functions, behind the scenes, are simply dispatching actions:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Navigation dispatcher" snack
import * as React from 'react';
import { View, Text } from 'react-native';
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
import { Button } from '@react-navigation/elements';

function Feed() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
      // codeblock-focus-start
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open drawer
      </Button>
      // codeblock-focus-end
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle drawer
      </Button>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

// codeblock-focus-start

/* content */

// codeblock-focus-end

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      // codeblock-focus-start
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
      // codeblock-focus-end
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Feed: Feed,
    Notifications: Notifications,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Navigation dispatcher" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';

function Feed() {
  const navigation = useNavigation('Feed');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
      // codeblock-focus-start
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open drawer
      </Button>
      // codeblock-focus-end
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle drawer
      </Button>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}
// codeblock-focus-start

/* content */

// codeblock-focus-end

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      // codeblock-focus-start
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
      // codeblock-focus-end
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Notifications" component={Notifications} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

If you would like to determine if drawer is open or closed, you can do the following:

```js name="Drawer hook"
import { useDrawerStatus } from '@react-navigation/drawer';

// ...

const isDrawerOpen = useDrawerStatus() === 'open';
```
