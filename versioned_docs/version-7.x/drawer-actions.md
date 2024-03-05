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

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Drawer Actions - openDrawer" snack version=7
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
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

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
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(jumpToAction)}>
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Drawer Actions - openDrawer" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation();
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

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
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(jumpToAction)}>
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

### closeDrawer

The `closeDrawer` action can be used to close the drawer pane.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Drawer Actions - closeDrawer" snack version=7
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
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(jumpToAction)}>
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

function CustomDrawerContent({ navigation }) {
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
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" >

```js name="Drawer Actions - closeDrawer" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation();
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(jumpToAction)}>
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

function CustomDrawerContent({ navigation }) {
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
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

### toggleDrawer

The `toggleDrawer` action can be used to open the drawer pane if closed, or close if open.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Drawer Actions - toggleDrawer" snack version=7
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
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open Drawer
      </Button>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(DrawerActions.toggleDrawer());
          // codeblock-focus-end
        }}
      >
        Toggle Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(jumpToAction)}>
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Drawer Actions - toggleDrawer" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function HomeScreen({ navigation }) {
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open Drawer
      </Button>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(DrawerActions.toggleDrawer());
          // codeblock-focus-end
        }}
      >
        Toggle Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(jumpToAction)}>
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

### jumpTo

The `jumpTo` action can be used to jump to an existing route in the drawer navigator.

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to pass to the destination route.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Drawer Actions - jumpTo" snack version=7
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
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle Drawer
      </Button>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(jumpToAction);
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Drawer Actions - jumpTo" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  NavigationContainer,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function HomeScreen({ navigation }) {
  const jumpToAction = DrawerActions.jumpTo('Profile', { user: 'Satya' });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        Open Drawer
      </Button>
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        Toggle Drawer
      </Button>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(jumpToAction);
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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>
