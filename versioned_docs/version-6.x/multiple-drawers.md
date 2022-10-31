---
id: multiple-drawers
title: Multiple drawers
sidebar_label: Multiple drawers
---

Sometimes we want to have multiple drawers on the same screen: one on the left and one on the right. This can be achieved by [nesting](nesting-navigators.md) 2 [drawer navigators](drawer-navigator.md).

## Nesting 2 drawer navigators

Here we have 2 drawers nested inside each other, one is positioned on left and the other on the right:

```js
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

function HomeScreen({ navigation }) {
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

But there is one problem. When we call `navigation.openDrawer()` in our `HomeScreen`, it always opens the left drawer since it's the immediate parent of the screen.

To solve this, we need to use [`navigation.getParent`](navigation-prop.md#getparent) to refer to the right drawer which is the parent of the left drawer. So our code would look like:

```js
<Button onPress={() => navigation.openDrawer()} title="Open left drawer" />
<Button onPress={() => navigation.getParent().openDrawer()} title="Open right drawer" />
```

However, this means that our button needs to know about the parent navigators, which isn't ideal. If our button is further nested inside other navigators, it'd need multiple `getParent()` calls. To address this, we can use the [`id` prop](drawer-navigator.md#id) to identify the parent navigator.

To customize the contents of the drawer, we can use the [`drawerContent` prop](drawer-navigator.md#drawercontent) to pass in a function that renders a custom component.

The final code would look like this:

<samp id="multiple-drawers" />

```js
import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

function HomeScreen({ navigation }) {
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
      screenOptions={{ drawerPosition: 'left' }}>
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
      }}>
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

Here, we are passing `"LeftDrawer"` and `"RightDrawer"` strings (you can use any string here) in the `id` prop of the drawer navigators. Then we use `navigation.getParent('LeftDrawer').openDrawer()` to open the left drawer and `navigation.getParent('RightDrawer').openDrawer()` to open the right drawer.

## Summary

- To have 2 drawers on the screen, you can use the [`drawerPosition`](drawer-navigator.md#drawerposition) option to position them on `"left"` and `"right"`.
- To open the desired drawer, you can use [`navigation.getParent`](navigation-prop.md#getparent) in combination with the [`id` prop](drawer-navigator.md#id).
