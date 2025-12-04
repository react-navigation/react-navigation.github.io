---
id: use-route-path
title: useRoutePath
sidebar_label: useRoutePath
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The `useRoutePath` hook can be used to get the path of a route based on the [`linking` configuration](configuring-links.md). This can be useful if you need to generate a URL for a specific route in your app to share as a deep link.

## Example

```js
import { useRoutePath } from '@react-navigation/native';

function MyComponent() {
  const path = useRoutePath();

  // Construct a URL using the path and app's base URL
  const url = new URL(path, 'https://example.com');

  return <Text>Shareable URL: {url.href}</Text>;
}
```
