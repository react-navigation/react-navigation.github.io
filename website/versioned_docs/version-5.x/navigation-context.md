---
id: version-5.x-navigation-context
title: NavigationContext
sidebar_label: NavigationContext
original_id: navigation-context
---

`NavigationContext` provides the `navigation` object (same object as the [navigation](navigation-prop.html) prop). In fact, [useNavigation](use-navigation.html) uses this context to get the `navigation` prop.

Most of the time, you won't use `NavigationContext` directly, as the provided `useNavigation` covers most use cases. But just in case you have something else in mind, `NavigationContext` is available for you to use.

Example:

<samp id="navigation-context">

```js
import { NavigationContext } from '@react-navigation/native';

class SomeComponent extends React.Component {
  static contextType = NavigationContext;

  render() {
    // We can access navigation object via context
    const navigation = this.context;
  }
}
```
