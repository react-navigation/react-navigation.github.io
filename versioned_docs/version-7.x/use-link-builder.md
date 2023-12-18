---
id: use-link-builder
title: useLinkBuilder
sidebar_label: useLinkBuilder
---

The `useLinkBuilder` hook returns helpers to build `href` or action based on the linking options. It returns an object with the following properties:

- [`buildHref`](#buildhref)
- [`buildAction`](#buildaction)

## `buildHref`

The `buildHref` method lets us build a path to use for links for a screen in the current navigator's state. It returns a function that takes `name` and `params` for the screen to focus and returns path based on the [`linking` options](navigation-container.md#linking).

```js
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';

// ...

function DrawerContent({ state, descriptors, navigation }) {
  const { buildHref } = useLinkBuilder();

  return state.routes((route) => (
    <PlatformPressable
      href={buildHref(route.name, route.params)}
      onPress={() => navigation.navigate(route.name, route.params)}
    >
      {descriptors[route.key].options.title}
    </PlatformPressable>
  ));
}
```

This hook is intended to be used in navigators to show links to various pages in the navigator, such as drawer and tab navigators. If you're building a custom navigator, custom drawer content, custom tab bar etc. then you might want to use this hook.

There are couple of important things to note:

- The destination screen must be present in the current navigator. It cannot be in a parent navigator or a navigator nested in a child.
- It's intended to be only used in custom navigators to keep them reusable in multiple apps. For your regular app code, use screen names directly instead of building paths for screens.

## `buildAction`

The `buildAction` method lets us parse a `href` string into an action object that can be used with [`navigation.dispatch`](navigation-prop.md#dispatch) to navigate to the relevant screen.

```js
import { Link, CommonActions, useLinkBuilder } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

// ...

function MyComponent() {
  const { buildAction } = useLinkBuilder();

  return (
    <Button onPress={() => navigation.dispatch(buildAction('/users/jane'))}>
      Go to Jane's profile
    </Button>
  );
}
```

The [`useLinkTo`](use-link-to.md) hook is a convenient wrapper around this hook to navigate to a screen using a `href` string.
