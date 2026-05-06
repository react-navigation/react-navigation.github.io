---
id: navigation-context
title: Navigation context
sidebar_label: Navigation context
---

The `NavigationProvider` provides the [navigation object](navigation-object.md) and [route object](route-object.md) to components rendered outside of a screen.

Most of the time, you don't need to use this directly. Screens and various built-in components such as headers are automatically provided with the navigation and route objects.

## Providing navigation and route

Use `NavigationProvider` when you already have `navigation` and `route` objects and need to make them available to a component that doesn't normally have access to them:

```js
import {
  NavigationProvider,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

function MyComponent({ navigation, route }) {
  return (
    <NavigationProvider navigation={navigation} route={route}>
      <MyButton />
    </NavigationProvider>
  );
}

function MyButton() {
  const navigation = useNavigation();
  const route = useRoute();

  // ...
}
```

This is useful for components rendered in [custom navigators](custom-navigators.md) that are not under a screen.

## Accessing navigation and route

For most cases, you should use the [`useNavigation`](use-navigation.md) and [`useRoute`](use-route.md) hooks to access the navigation and route objects. They work in screens rendered in a navigator, or components wrapped in a `NavigationProvider`.

However, if you need access to the contexts directly for any reason, you can use `NavigationContext` and `NavigationRouteContext` to access the navigation and route objects from the immediate parent screen or `NavigationProvider`:

```js
import * as React from 'react';
import {
  NavigationContext,
  NavigationRouteContext,
} from '@react-navigation/native';

function MyComponent() {
  const navigation = React.useContext(NavigationContext);
  const route = React.useContext(NavigationRouteContext);

  // ...
}
```
