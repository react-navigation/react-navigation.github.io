---
id: use-link-builder
title: useLinkBuilder
sidebar_label: useLinkBuilder
---

The `useLinkBuilder` hook let's us build a path to use for links based on a `navigate` action. It returns a function that takes `name` and `params` for the screen to navigate to and returns path based on the [`linking` options](navigation-container.md#linking).

```js
import { Link, useLinkBuilder } from '@react-navigation/native';

// ...

function DrawerContent({ state, navigation, descriptors }) {
  const buildLink = useLinkBuilder();

  return state.routes((route) => (
    <Link
      to={buildLink(route.name, route.params)}
      action={navigation.navigate(route.name)}
    >
      {descriptors[route.key].options.title}
    </Link>
  ));
}
```

This hook is intended to be used in navigators to show links to various pages in it, such as drawer and tab navigators. If you're building a custom navigator, custom drawer content, custom tab bar etc. then you might want to use this hook.

It's important to note that `useLinkBuilder` doesn't consider bubbling of the `navigate` action when building the link. So the screen to navigate to must be present in the navigator it's used in. For example, in the above case, the navigator containing `Home` should also contain the `Profile` screen.
