---
id: use-link-builder
title: useLinkBuilder
sidebar_label: useLinkBuilder
---

> Note: This API is experimental and might change in a minor version.

The `useLinkBuilder` hook let's us build a path to use for links for a screen in the current navigator's state. It returns a function that takes `name` and `params` for the screen to focus and returns path based on the [`linking` options](navigation-container.md#linking).

```js
import { Link, CommonActions, useLinkBuilder } from '@react-navigation/native';

// ...

function DrawerContent({ state, descriptors }) {
  const buildLink = useLinkBuilder();

  return state.routes((route) => (
    <Link
      to={buildLink(route.name, route.params)}
      action={CommonActions.navigate(route.name)}
    >
      {descriptors[route.key].options.title}
    </Link>
  ));
}
```

This hook is intended to be used in navigators to show links to various pages in it, such as drawer and tab navigators. If you're building a custom navigator, custom drawer content, custom tab bar etc. then you might want to use this hook.

There are couple of important things to note:

- The destination screen must be present in the current navigator. It cannot be in a parent navigator or a navigator nested in a child.
- It's intended to be only used in custom navigators to keep them reusable in multiple apps. For your regular app code, use paths directly instead of building paths for screens.
