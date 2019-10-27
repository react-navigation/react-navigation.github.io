---
id: connecting-navigation-prop
title: Access the navigation prop from any component
sidebar_label: Access the navigation prop from any component
---

[`useNavigation`](use-navigation.md) is a hook which gives access to the `navigation` object. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

An ordinary component that is not a screen component will not receive the navigation prop automatically. For example in this `MyBackButton` component:

```js
import * as React from 'react';
import { Button } from 'react-native';

export function MyBackButton({ navigation }) {
  // This will throw an 'undefined is not a function' exception because the navigation prop is undefined.
  return (
    <Button
      title="Back"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}
```

To resolve this exception, you could pass the `navigation` prop in to `MyBackButton` when you render it from a screen, like so: `<MyBackButton navigation={props.navigation} />`.

Alternatively, you can use the `useNavigation` to provide the `navigation` prop automatically (through React context, if you're curious).

```js
import * as React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/core';

export default function MyBackButton() {
  const navigation = useNavigation();

  return (
    <Button
      title="Back"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}
```

Using this approach, you can render `MyBackButton` anywhere in your app without passing in a `navigation` prop explicitly and it will work as expected.
