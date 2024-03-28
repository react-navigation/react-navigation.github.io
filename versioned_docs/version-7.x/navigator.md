---
id: navigator
title: Navigator
sidebar_label: Navigator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A navigator is responsible for managing and rendering a set of screens. It can be created using the `createXNavigator` functions, e.g. [`createStackNavigator`](stack-navigator.md), [`createNativeStackNavigator`](native-stack-navigator.md), [`createBottomTabNavigator`](bottom-tab-navigator.md), [`createMaterialTopTabNavigator`](material-top-tab-navigator.md), [`createDrawerNavigator`](drawer-navigator.md) etc.:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

In addition to the built-in navigators, it's also possible to build your custom navigators or use third-party navigators. See [custom navigators](custom-navigators.md) for more details.

## Configuration

Different navigators accept different configuration options. You can find the list of options for each navigator in their respective documentation.

There is a set of common configurations that are shared across all navigators:

### ID

Optional unique ID for the navigator. This can be used with [`navigation.getParent`](navigation-object.md#getparent) to refer to this navigator in a child navigator.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  id: 'RootStack',
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator id="RootStack">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

### Initial route name

The name of the route to render on the first load of the navigator.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

### Screen options

Default options to use for all the screens in the navigator. It accepts either an object or a function returning an object:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

See [Options for screens](screen-options.md) for more details and examples.
