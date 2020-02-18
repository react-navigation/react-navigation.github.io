---
id: version-5.x-connecting-navigation-prop
title: Access the navigation prop from any component
sidebar_label: Access the navigation prop from any component
original_id: connecting-navigation-prop
---

[`useNavigation`](use-navigation.html) is a hook which gives access to the `navigation` object. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

An ordinary component that is not a screen component will not receive the navigation prop automatically. For example in this `GoToButton` component:

```js
import * as React from 'react';
import { Button } from 'react-native';

function GoToButton({ navigation, screenName }) {
  return (
    <Button
      title={`Go to ${screenName}`}
      onPress={() => navigation.navigate(screenName)}
    />
  );
}
```

To resolve this exception, you could pass the `navigation` prop in to `GoToButton` when you render it from a screen, like so: `<GoToButton navigation={props.navigation} />`.

Alternatively, you can use the `useNavigation` to provide the `navigation` prop automatically (through React context, if you're curious).

<samp id="navigation-in-component" >useNavigation in component</samp>

```js
import * as React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function GoToButton({ screenName }) {
  const navigation = useNavigation();

  return (
    <Button
      title={`Go to ${screenName}`}
      onPress={() => navigation.navigate(screenName)}
    />
  );
}
```

Using this approach, you can render `GoToButton` anywhere in your app without passing in a `navigation` prop explicitly and it will work as expected.
