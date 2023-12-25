---
id: navigation-context
title: NavigationContext
sidebar_label: NavigationContext
---

`NavigationContext` provides the `navigation` object (same object as the [navigation](navigation-object.md) prop). In fact, [useNavigation](use-navigation.md) uses this context to get the `navigation` prop.

Most of the time, you won't use `NavigationContext` directly, as the provided `useNavigation` covers most use cases. But just in case you have something else in mind, `NavigationContext` is available for you to use.

Example:

<samp id="navigation-context" />

```js
import { NavigationContext } from '@react-navigation/native';

function SomeComponent() {
  // We can access navigation object via context
  const navigation = React.useContext(NavigationContext);
}
```
