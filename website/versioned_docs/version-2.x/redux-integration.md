---
id: version-2.x-redux-integration
title: Redux integration
sidebar_label: Redux integration
original_id: redux-integration
---

**Warning: in the next major version of React Navigation, to be released in Fall 2018, we will no longer provide any information about how to integrate with Redux and it may cease to work**. Issues related to Redux that are posted on the React Navigation issue tracker will be immediately closed. Redux integration may continue to work but it will not be tested against or considered when making any design decisions for the library.

Some folks like to have their navigation state stored in the same place as the rest of their application state. *Think twice before you consider doing this, there is an incredibly good chance that you do not need to do this!*. Storing your React Navigation state in your own Redux store is likely to give you a very difficult time if you don't know what you're doing.

If your only reason for doing this is that you want to be able to perform navigation actions from outside of your components (eg: from a Redux middleware), you can learn more about this in [navigating without the navigation prop](navigating-without-navigation-prop.html).

## Overview

1. To handle your app's navigation state in Redux, you can pass your own [`navigation`](navigation-prop.html) prop to a navigator. `react-navigation-redux-helpers` handles this for you behind the scenes with a "higher-order component" called `reduxifyNavigator`. You pass in your root navigator component to the `reduxifyNavigator` function, and it returns a new component that takes your navigation `state` and `dispatch` function as props.

2. A middleware is needed so that any events that mutate the navigation state properly trigger React Navigation's event listeners.

3. The navigation state inside Redux will need to be kept updated using React Navigation's navigation reducer. You will call this reducer from your Redux master reducer.

## Step-by-step guide

The following steps apply to `react-navigation@^2.3.0` and `react-navigation-redux-helpers@^2.0.0-beta`.

First, you need to add the `react-navigation-redux-helpers` package to your project.

  ```bash
  yarn add react-navigation-redux-helpers
  ```

  or

  ```bash
  npm install --save react-navigation-redux-helpers
  ```

The following is a minimal example of how you might use navigators within a Redux application:

```es6
import {
  createStackNavigator,
} from 'react-navigation';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
import { Provider, connect } from 'react-redux';
import React from 'react';

const AppNavigator = createStackNavigator(AppRouteConfigs);

const navReducer = createNavigationReducer(AppNavigator);
const appReducer = combineReducers({
  nav: navReducer,
  ...
});

// Note: createReactNavigationReduxMiddleware must be run before reduxifyNavigator
const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);

const App = reduxifyNavigator(AppNavigator, "root");
const mapStateToProps = (state) => ({
  state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
  appReducer,
  applyMiddleware(middleware),
);

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
```

Once you do this, your navigation state is stored within your Redux store, at which point you can fire navigation actions using your Redux dispatch function.

Keep in mind that when a navigator is given a `navigation` prop, it relinquishes control of its internal state. That means you are now responsible for persisting its state, handling any deep linking, [Handling the Hardware Back Button in Android](#handling-the-hardware-back-button-in-android), etc.

Navigation state is automatically passed down from one navigator to another when you nest them. Note that in order for a child navigator to receive the state from a parent navigator, it should be defined as a `screen`.

Applying this to the example above, you could instead define `AppNavigator` to contain a nested `TabNavigator` as follows:

```es6
const AppNavigator = createStackNavigator({
  Home: { screen: MyTabNavigator },
});
```

In this case, once you `connect` `AppNavigator` to Redux as is done in `AppWithNavigationState`, `MyTabNavigator` will automatically have access to navigation state as a `navigation` prop.

## Full example

There's a working example app with Redux [here](https://github.com/react-navigation/react-navigation-4/tree/2.x/examples/ReduxExample) if you want to try it out yourself.

## Mocking tests

To make jest tests work with your React Navigation app, you need to change the jest preset in the `package.json`, see [here](https://facebook.github.io/jest/docs/tutorial-react-native.html#transformignorepatterns-customization):


```json
"jest": {
  "preset": "react-native",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|react-navigation|react-navigation-redux-helpers)"
  ]
}
```

## Under the hood

### Creating your own navigation reducer

If you want to replace `createNavigationReducer` reducer creator this is how you would do it yourself:

```es6
const AppNavigator = createStackNavigator(AppRouteConfigs);

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Login'));

const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
```

## Handling the Hardware Back Button in Android

By using the following snippet, your nav component will be aware of the back button press actions and will correctly interact with your stack. This is really useful on Android.

```es6
import React from "react";
import { BackHandler } from "react-native";
import { NavigationActions } from "react-navigation";

/* your other setup code here! this is not a runnable snippet */

class ReduxNavigation extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }

    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    /* more setup code here! this is not a runnable snippet */
    return <AppNavigator navigation={navigation} />;
  }
}
```
