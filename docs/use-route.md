---
id: use-route
title: useRoute
sidebar_label: useRoute
---

`useRoute` is a hook which gives access to `route` object. It's useful when you cannot pass the `route` prop into the component directly, or don't want to pass it in case of a deeply nested child.

`useRoute()` returns the `route` prop of the screen it's inside.

## Example

```js
import * as React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/core';

export default function MyText() {
  const route = useRoute();

  return <Text>{route.params.caption}</Text>;
}
```
