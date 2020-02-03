---
id: version-5.x-navigating-without-navigation-prop
title: Navigating without the navigation prop
sidebar_label: Navigating without the navigation prop
original_id: navigating-without-navigation-prop
---

Sometimes you need to trigger a navigation action from places where you do not have access to the `navigation` prop, such as a Redux middleware. For such cases, you can dispatch navigation actions from the navigation container.

If you're looking for a way to navigate from inside a component without needing to pass the `navigation` prop down, see [`useNavigation`](use-navigation.html).

You can get access to the root navigation object through a `ref` and pass it to the `RootNavigation` which we will later use to navigate.

```js
// App.js

import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      {/* ... */}
    </NavigationContainer>
  );
}
```

In the next step, we define `RootNavigation`, which is a simple module with functions that dispatch user-defined navigation actions.

```js
// RootNavigation.js

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

// add other navigation functions that you need and export them
```

Then, in any of your javascript modules, just import the `RootNavigation` and call functions which you exported from it. You may use this approach outside of your React components and, in fact, it works just as well when used from within them.

 <samp id="no-nav-prop" />

```js
// any js module
import * as RootNavigation from './path/to/RootNavigation.js';

// ...

RootNavigation.navigate('ChatScreen', { userName: 'Lucy' });
```

Apart from `navigate`, you can add other navigation actions:

```js
import { StackActions } from '@react-navigation/routers';

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}
```

Note that a stack navigators needs to be rendered to handle this action. You may want to check the [docs for nesting](https://reactnavigation.org/docs/nesting-navigators.html#navigating-to-a-screen-in-a-nested-navigator) for more details.

When writing tests, you may mock the navigation functions, and make assertions on whether the correct functions are called with the correct parameters.
