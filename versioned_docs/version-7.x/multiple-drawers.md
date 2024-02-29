---
id: multiple-drawers
title: Multiple drawers
sidebar_label: Multiple drawers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Sometimes we want to have multiple drawers on the same screen: one on the left and one on the right. This can be achieved in 2 ways:

1. By using [`react-native-drawer-layout`](drawer-layout.md) directly (Recommended).
2. By [nesting](nesting-navigators.md) 2 [drawer navigators](drawer-navigator.md).

## Using `react-native-drawer-layout`

When we have multiple drawers, only one of them shows the list of screens. The second drawer may often be used to show some additional information such as the list of users etc.

In such cases, we can use [`react-native-drawer-layout`](drawer-layout.md) directly to render the second drawer. The drawer navigator will be used to render the first drawer and can be nested inside the second drawer:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import * as React from 'react';
import { Button, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
    </View>
  );
}

const LeftDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <LeftDrawerScreen />
    </Drawer>
  );
}

const Navigation = createStaticNavigation(RightDrawerScreen);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import * as React from 'react';
import { Button, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
    </View>
  );
}

const LeftDrawer = createDrawerNavigator();

const LeftDrawerScreen = () => {
  return (
    <LeftDrawer.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <LeftDrawer.Screen name="Home" component={HomeScreen} />
    </LeftDrawer.Navigator>
  );
};

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <LeftDrawerScreen />
    </Drawer>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawerScreen />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

But there is one problem. When we call `navigation.openDrawer()` in our `HomeScreen`, it always opens the left drawer. We don't have access to the right drawer via the `navigation` object since it's not a navigator.

To solve this, we need to use context API to pass down a function to control the right drawer:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import * as React from 'react';
import { Button, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';

const RightDrawerContext = React.createContext();

function HomeScreen() {
  const { openRightDrawer } = React.useContext(RightDrawerContext);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.openDrawer()}
        title="Open left drawer"
      />
      <Button onPress={() => openRightDrawer()} title="Open right drawer" />
    </View>
  );
}

const LeftDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  const value = React.useMemo(
    () => ({
      openRightDrawer: () => setRightDrawerOpen(true),
      closeRightDrawer: () => setRightDrawerOpen(false),
    }),
    []
  );

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <RightDrawerContext.Provider value={value}>
        <LeftDrawerScreen />
      </RightDrawerContext.Provider>
    </Drawer>
  );
}

const Navigation = createStaticNavigation(RightDrawerScreen);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import * as React from 'react';
import { Button, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const RightDrawerContext = React.createContext();

function HomeScreen() {
  const navigation = useNavigation();
  const { openRightDrawer } = React.useContext(RightDrawerContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.openDrawer()}
        title="Open left drawer"
      />
      <Button onPress={() => openRightDrawer()} title="Open right drawer" />
    </View>
  );
}

const LeftDrawer = createDrawerNavigator();

const LeftDrawerScreen = () => {
  return (
    <LeftDrawer.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <LeftDrawer.Screen name="Home" component={HomeScreen} />
    </LeftDrawer.Navigator>
  );
};

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  const value = React.useMemo(
    () => ({
      openRightDrawer: () => setRightDrawerOpen(true),
      closeRightDrawer: () => setRightDrawerOpen(false),
    }),
    []
  );

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <RightDrawerContext.Provider value={value}>
        <LeftDrawerScreen />
      </RightDrawerContext.Provider>
    </Drawer>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawerScreen />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Here, we are using the `RightDrawerContext` to pass down the `openRightDrawer` function to the `HomeScreen`. Then we use `openRightDrawer` to open the right drawer.

## Nesting 2 drawer navigators

An alternative approach is to nest 2 [drawer navigators](drawer-navigator.md) inside each other. This is not recommended since it requires creating an additional screen and more nesting - which can make navigating and type checking more verbose. But this can be useful if both navigators include multiple screens.

Here we have 2 drawer navigators nested inside each other, one is positioned on left and the other on the right:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Multiple drawers" snack version=7
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
    </View>
  );
}

const LeftDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

const RightDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'right',
    headerShown: false,
  },
  screens: {
    HomeDrawer: LeftDrawerScreen,
  },
});

const Navigation = createStaticNavigation(RightDrawerScreen);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Multiple drawers" snack version=7
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
    </View>
  );
}

const LeftDrawer = createDrawerNavigator();

const LeftDrawerScreen = () => {
  return (
    <LeftDrawer.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <LeftDrawer.Screen name="Home" component={HomeScreen} />
    </LeftDrawer.Navigator>
  );
};

const RightDrawer = createDrawerNavigator();

const RightDrawerScreen = () => {
  return (
    <RightDrawer.Navigator
      screenOptions={{ drawerPosition: 'right', headerShown: false }}
    >
      <RightDrawer.Screen name="HomeDrawer" component={LeftDrawerScreen} />
    </RightDrawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawerScreen />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

But there is one problem. When we call `navigation.openDrawer()` in our `HomeScreen`, it always opens the left drawer since it's the immediate parent of the screen.

To solve this, we need to use [`navigation.getParent`](navigation-object.md#getparent) to refer to the right drawer which is the parent of the left drawer. So our code would look like:

```js
<Button onPress={() => navigation.openDrawer()} title="Open left drawer" />
<Button onPress={() => navigation.getParent().openDrawer()} title="Open right drawer" />
```

However, this means that our button needs to know about the parent navigators, which isn't ideal. If our button is further nested inside other navigators, it'd need multiple `getParent()` calls. To address this, we can use the [`id` prop](drawer-navigator.md#id) to identify the parent navigator.

To customize the contents of the drawer, we can use the [`drawerContent` prop](drawer-navigator.md#drawercontent) to pass in a function that renders a custom component.

The final code would look like this:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Multiple drawers navigators" snack version=7
import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.getParent('LeftDrawer').openDrawer()}
        title="Open left drawer"
      />
      <Button
        onPress={() => navigation.getParent('RightDrawer').openDrawer()}
        title="Open right drawer"
      />
    </View>
  );
}

function RightDrawerContent() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the right drawer</Text>
    </View>
  );
}

const LeftDrawerScreen = createDrawerNavigator({
  id: 'LeftDrawer',
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

const RightDrawerScreen = createDrawerNavigator({
  id: 'RightDrawer',
  drawerContent: (props) => <RightDrawerContent {...props} />,
  screenOptions: {
    drawerPosition: 'right',
    headerShown: false,
  },
  screens: {
    HomeDrawer: LeftDrawerScreen,
  },
});

const Navigation = createStaticNavigation(RightDrawerScreen);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Multiple drawers navigators" snack version=7
import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.getParent('LeftDrawer').openDrawer()}
        title="Open left drawer"
      />
      <Button
        onPress={() => navigation.getParent('RightDrawer').openDrawer()}
        title="Open right drawer"
      />
    </View>
  );
}

function RightDrawerContent() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the right drawer</Text>
    </View>
  );
}

const LeftDrawer = createDrawerNavigator();

function LeftDrawerScreen() {
  return (
    <LeftDrawer.Navigator
      id="LeftDrawer"
      screenOptions={{ drawerPosition: 'left' }}
    >
      <LeftDrawer.Screen name="Home" component={HomeScreen} />
    </LeftDrawer.Navigator>
  );
}

const RightDrawer = createDrawerNavigator();

function RightDrawerScreen() {
  return (
    <RightDrawer.Navigator
      id="RightDrawer"
      drawerContent={(props) => <RightDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
      }}
    >
      <RightDrawer.Screen name="HomeDrawer" component={LeftDrawerScreen} />
    </RightDrawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawerScreen />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Here, we are passing `"LeftDrawer"` and `"RightDrawer"` strings (you can use any string here) in the `id` prop of the drawer navigators. Then we use `navigation.getParent('LeftDrawer').openDrawer()` to open the left drawer and `navigation.getParent('RightDrawer').openDrawer()` to open the right drawer.

## Summary

- To have multiple drawers, you can use [`react-native-drawer-layout`](drawer-layout.md) directly in combination with a drawer navigator.
- The [`drawerPosition`](drawer-layout.md#drawerposition) prop can be used to position the drawer on the right.
- The methods to control the drawer can be passed down using context API when using [`react-native-drawer-layout`](drawer-layout.md).
- When nesting multiple navigators, you can use [`navigation.getParent`](navigation-object.md#getparent) in combination with the [`id` prop](drawer-navigator.md#id) to refer to the desired drawer.
