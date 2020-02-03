---
id: version-5.x-use-route
title: useRoute
sidebar_label: useRoute
original_id: use-route
---

`useRoute` is a hook which gives access to `route` object. It's useful when you cannot pass the `route` prop into the component directly, or don't want to pass it in case of a deeply nested child.

`useRoute()` returns the `route` prop of the screen it's inside.

## Example

<samp id="use-route-example">

```js
import * as React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

function MyText() {
  const route = useRoute();

  return <Text>{route.params.caption}</Text>;
}
```

See the documentation for the [`route` prop](route-prop.html) for more info.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class MyText extends React.Component {
  render() {
    // Get it from props
    const { route } = this.props;
  }
}

// Wrap and export
export default function(props) {
  const route = useRoute();

  return <MyText {...props} route={route} />;
}
```
