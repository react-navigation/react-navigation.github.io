---
id: version-2.x-custom-navigators
title: Custom navigators
sidebar_label: Custom navigators
original_id: custom-navigators
---

A navigator is any React component that has a [router](https://github.com/react-navigation/react-navigation-4/blob/master/src/routers/StackRouter.js) on it, to define the navigation behavior. Each navigator is given a `navigation` prop, which allows the parent to control the navigation state.

## Extending Navigators

It is possible to take an existing Navigator and extend its behavior, using the following approach:

```js
const MyStack = createStackNavigator({ ... });

class CustomNavigator extends React.Component {
  static router = MyStack.router;
  render() {
    const { navigation } = this.props;

    return <MyStack navigation={navigation} />;
  }
}
```

Now it is possible to render additional things, observe the navigation prop, and override behavior of the router:

```js
const MyStack = createStackNavigator({ ... });

class CustomNavigator extends React.Component {
  static router = {
    ...MyStack.router,
    getStateForAction: (action, lastState) => {
      // check for custom actions and return a different navigation state.
      return MyStack.router.getStateForAction(action, lastState);
    },
  };
  componentDidUpdate(lastProps) {
    // Navigation state has changed from lastProps.navigation.state to this.props.navigation.state
  }
  render() {
    const { navigation } = this.props;

    return (
      <View>
        <MyStack navigation={navigation} />
        {...}
      </View>
    );
  }
}
```


## Navigator Navigation Prop

The navigation prop passed down to a navigator only includes `state`, `dispatch`, and `addListener`. This is the current state of the navigator, and an event channel to send action requests.

All navigators are controlled components: they always display what is coming in through `props.navigation.state`, and their only way to change the state is to send actions into `props.navigation.dispatch`.

Navigators can specify custom behavior to parent navigators by [customizing their router](custom-routers.html). For example, a navigator is able to specify when actions should be blocked by returning null from `router.getStateForAction`. Or a navigator can specify custom URI handling by overriding `router.getActionForPathAndParams` to output a relevant navigation action, and handling that action in `router.getStateForAction`.

### Navigation State

The navigation state that is passed into a navigator's `props.navigation.state` has the following structure:

```
{
  index: 1, // identifies which route in the routes array is active
  routes: [
    {
      // Each route needs a name, which routers will use to associate each route
      // with a react component
      routeName: 'MyRouteName',

      // A unique id for this route, used to keep order in the routes array:
      key: 'myroute-123',

      // Routes can have any additional data. The included routers have `params`
      ...customRouteData,
    },
    ...moreRoutes,
  ]
}
```

### Navigation Dispatchers

A navigator can dispatch navigation actions, such as 'Go to a URI', 'Go back'.

The dispatcher will return `true` if the action was successfully handled, otherwise `false`.

## API for building custom navigators

To help developers implement custom navigators, the following utilities are provided with React Navigation:

### `createNavigator`

> Note: The `createNavigator` API has changed in version 2. The old doc for v1 can be accessed here: https://v1.reactnavigation.org/docs/custom-navigators.html

This utility combines a [router](routers.html) and a [navigation view](navigation-views.html) together in a standard way:

```js
import {createNavigator} from 'react-navigation';

const AppNavigator = createNavigator(NavigationView, router, navigationConfig);
```

The new `AppNavigator` can be rendered as such:

```js
<AppNavigator
  navigation={{ state, dispatch, addListener }}
  screenProps={...}
/>
```

Then the view will be rendered in the following way:

```js
<NavigationView
  screenProps={screenProps}
  navigation={navigation}
  navigationConfig={navigationConfig}
  descriptors={descriptors}
/>
```

The `navigation` prop is the same navigation prop that was passed into the navigator.

Both `navigationConfig` and `screenProps` are simply passed through, as defined above.

Most information about child screens comes through the `descriptors` prop. The descriptors is an object map of route keys to scene descriptors. There is one descriptor for each child route.

### Scene Descriptors

A scene descriptor has the following properties:

- `getComponent`, a function that returns the component for the screen
- `options`, the flattened navigationOptions for the route
- `navigation`, the child navigation prop, including actions and the route `state`
- `state`, the navigation state for the child screen (a shortcut for `navigation.state`)
- `key`, the key of the route (a shortcut for `navigation.state.key`)


### `createNavigationContainer`

If you want your navigator to be usable as a top-level component, (without a navigation prop being passed in), you can use `createNavigationContainer`. This utility will make your navigator act like a top-level navigator when the navigation prop is missing. It will manage the app state, and integrate with app-level nav features, like handling incoming and outgoing links, and Android back button behavior.
