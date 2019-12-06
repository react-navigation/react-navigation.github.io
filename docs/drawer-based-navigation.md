---
id: drawer-based-navigation
title: Drawer navigation
sidebar_label: Drawer navigation
---

![Using drawer navigator](/docs/assets/navigators/drawer/drawer-demo.gif)

Common pattern in navigation is to use drawer from left (sometimes right) side for navigating between screens.

Before continuing, first install [`@react-navigation/drawer`](https://github.com/react-navigation/navigation-ex/tree/master/packages/drawer) following the guide on [Drawer Navigator's page](drawer-navigator.html).

## Minimal example of drawer-based navigation

To use this drawer navigator, import it from `@react-navigation/drawer`:  
(swipe right to open)
<samp id="drawer-based-navigation" />

```js
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationNativeContainer } from '@react-navigation/native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationNativeContainer>
  );
}
```

## Opening and closing drawer

To open and close drawer, use the following helpers to open and close the drawer:

```js
navigation.openDrawer();
navigation.closeDrawer();
```

If you would like to toggle the drawer you call the following:

```js
navigation.toggleDrawer();
```

Each of these functions, behind the scenes, are simply dispatching actions:

```js
navigation.dispatch(DrawerActions.openDrawer());
navigation.dispatch(DrawerActions.closeDrawer());
navigation.dispatch(DrawerActions.toggleDrawer());
```

If you would like to determine if drawer is open or closed, you can do the following:

```js
const parent = navigation.dangerouslyGetParent();
const isDrawerOpen =
  parent &&
  parent.dangerouslyGetState() &&
  parent.dangerouslyGetState().isDrawerOpen;
```
