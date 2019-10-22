---
id: drawer-based-navigation
title: Drawer navigation
sidebar_label: Drawer navigation
---

Common pattern in navigation is to use drawer from left (sometimes right) site for navigating between screens.

Before continuing, first install [`@react-navigation/drawer`](https://github.com/react-navigation/navigation-ex/tree/master/packages/drawer) following the guide on [Drawer Navigator's page](drawer-navigator.html).

## Minimal example of drawer-based navigation

To use this drawer navigator, import it from `@react-navigation/drawer`:

```js
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationNativeContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

function MyHomeScreen({ navigation }) {
  return (
    <Button
      onPress={() => navigation.navigate('Notifications')}
      title="Go to notifications"
    />
  );
}

function MyNotificationsScreen({ navigation }) {
  return <Button onPress={() => navigation.goBack()} title="Go back home" />;
}

export default function App() {
  return (
    <NavigationNativeContainer>
      <Drawer.Navigator initialRouteName="Feed">
        <Drawer.Screen name="Home" component={MyHomeScreen} />
        <Drawer.Screen name="Notifications" component={MyNotificationsScreen} />
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
