---
id: navigating-without-navigation-prop
title: Navigating without the navigation prop
sidebar_label: Navigating without the navigation prop
---

Calling functions such as `navigate` or `popToTop` on the `navigation` prop is not the only way to navigate around your app. As an alternative, you can dispatch navigation actions on your top-level navigator, provided you aren't passing your own `navigation` prop as you would with a redux integration. The presented approach is useful in situations when you want to trigger a navigation action from places where you do not have access to the `navigation` prop, or if you're looking for an alternative to using the `navigation` prop.

You can get access to a navigator through a `ref` and pass it to the `NavigationService` which we will later use to navigate. Use this only with the top-level (root) navigator of your app.

```javascript
// App.js

import { createStackNavigator, createAppContainer } from 'react-navigation';
import NavigationService from './NavigationService';

const TopLevelNavigator = createStackNavigator({
  /* ... */
});

const AppContainer = createAppContainer(TopLevelNavigator);

export default class App extends React.Component {
  // ...

  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
```

In the next step, we define `NavigationService` which is a simple module with functions that dispatch user-defined navigation actions.

```javascript
// NavigationService.js

import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
};
```

Then, in any of your javascript modules, just import the `NavigationService` and call functions which you exported from it. You may use this approach outside of your React components and, in fact, it works just as well when used from within them.

```javascript
// any js module
import NavigationService from 'path-to-NavigationService.js';

// ...

NavigationService.navigate('ChatScreen', { userName: 'Lucy' });
```

In `NavigationService`, you can create your own navigation actions, or compose multiple navigation actions into one, and then easily reuse them throughout your application. When writing tests, you may mock the navigation functions, and make assertions on whether the correct functions are called, with the correct parameters.
