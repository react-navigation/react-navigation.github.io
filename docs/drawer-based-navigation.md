---
id: drawer-based-navigation
title: Drawer navigation
sidebar_label: Drawer navigation
---

Common pattern in navigation is to use drawer from left (sometimes right) site for navigating between screens.

This guide covers [createDrawerNavigator](drawer-navigator.html).

To use this navigator, you need to install `@react-navigation/drawer` and its peer dependencies:

```sh
yarn add react-navigation-drawer react-native-reanimated react-native-gesture-handler
```

## Minimal example of drawer-based navigation

To use this drawer navigator, import it from `@react-navigation/drawer`:

```js
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationNativeContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

function MyHomeScreen({ navigation }) {
  return (
    <Button
      onPress={() => navigation.navigate("Notifications")}
      title="Go to notifications"
    />
  );
}

function MyNotificationsScreen({ navigation }) {
  return (
    <Button
      onPress={() => navigation.goBack()}
      title="Go back home"
    />
  );
}

exprt default function App() {
  return (
    <NavigationNativeContainer>
      <Drawer.Navigator initialRouteName="Feed">
        <Drawer.Screen name="Home" component={MyHomeScreen} />
        <Drawer.Screen name="Notifications" component={MyNotificationsScreen} />
      </Drawer.Navigator>
    </NavigationNativeContainer>
  )
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
