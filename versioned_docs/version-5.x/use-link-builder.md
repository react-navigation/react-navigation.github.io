---
id: use-link-builder
title: useLinkBuilder
sidebar_label: useLinkBuilder
---

The `useLinkBuilder` hook let's us build a path to use for links based on a `navigate` action. It returns a function that takes `name` and `params` for the screen to navigate to and returns path based on the [`linking` options](navigation-container.md#linking).

```js
import { useLinkBuilder } from '@react-navigation/native';

// ...

function Home() {
  const buildLink = useLinkBuilder();

  return (
    <a href={buildLink('Profile', { id: 'jane' })}>Go to Jane's profile</a>
  );
}
```

This hook is mostly useful in navigators where the navigator needs to show links to various pages in it, such as drawer and tab navigators.

It's important to note that `useLinkBuilder` doesn't consider bubbling of the `navigate` action when building the link. So the screen to navigate to must be present in the navigator it's used in. For example, in the above case, the navigator containing `Home` should also contain the `Profile` screen.
