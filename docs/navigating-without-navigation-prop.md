---
id: navigating-without-navigation-prop
title: Navigating without the navigation prop
sidebar_label: Navigating without the navigation prop
---

Calling functions such as `navigate` or `popToTop` on the `navigation` prop is not the only way to navigate around your app. As an alternative, you can dispatch navigation actions on the navigation container. The presented approach is useful in situations when you want to trigger a navigation action from places where you do not have access to the `navigation` prop, or if you're looking for an alternative to using the `navigation` prop.

You can get access to the root navigation object through a `ref` and pass it to the `NavigationService` which we will later use to navigate.

```javascript
// App.js

import { NavigationNativeContainer } from '@react-navigation/native';
import { navigationRef } from './NavigationService';

export default function App() {
  return (
    <NavigationNativeContainer ref={navigationRef}>
      {/* ... */}
    </NavigationNativeContainer>
  );
}
```

In the next step, we define `NavigationService` which is a simple module with functions that dispatch user-defined navigation actions.

```javascript
// NavigationService.js

import * as React from 'react';

export const navigationRef = React.createRef;

export function navigate(routeName, params) {
  navigationRef.current && navigationRef.current.navigate(routeName, params);
}

// add other navigation functions that you need and export them
```

Then, in any of your javascript modules, just import the `NavigationService` and call functions which you exported from it. You may use this approach outside of your React components and, in fact, it works just as well when used from within them.

```javascript
// any js module
import * as NavigationService from './path/to/NavigationService.js';

// ...

NavigationService.navigate('ChatScreen', { userName: 'Lucy' });
```

In `NavigationService`, you can create your own navigation actions, or compose multiple navigation actions into one, and then easily reuse them throughout your application. When writing tests, you may mock the navigation functions, and make assertions on whether the correct functions are called, with the correct parameters.
