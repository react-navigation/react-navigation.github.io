---
id: stack-actions
title: StackActions reference
sidebar_label: StackActions
---

`StackActions` is an object containing methods for generating actions specific to stack-based navigators. Its methods expand upon the actions available in [NavigationActions](navigation-actions.html).

The following actions are supported:
* [Reset](#reset) - Replace current state with a new state
* [Replace](#replace) - Replace a route at a given key with another route
* [Push](#push) - Add a route on the top of the stack, and navigate forward to it
* [Pop](#pop) - Navigate back to previous routes
* [PopToTop](#poptotop) - Navigate to the top route of the stack, dismissing all other routes

### Reset

The `Reset` action wipes the whole navigation state and replaces it with the result of several actions.

* `index` - _number_ - required - Index of the active route on `routes` array in navigation `state`.
* `actions` - _array_ - required - Array of Navigation Actions that will replace the navigation state.
* `key` - _string or null_ - optional - If set, the navigator with the given key will reset. If null, the root navigator will reset.

```js
import { StackActions, NavigationActions } from 'react-navigation';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Profile' })],
});
this.props.navigation.dispatch(resetAction);
```

#### How to use the `index` parameter

The `index` param is used to specify the current active route.

eg: given a basic stack navigation with two routes `Profile` and `Settings`.
To reset the state to a point where the active screen was `Settings` but have it stacked on top of a `Profile` screen, you would do the following:

```js
import { StackActions, NavigationActions } from 'react-navigation';

const resetAction = StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Profile' }),
    NavigationActions.navigate({ routeName: 'Settings' }),
  ],
});
this.props.navigation.dispatch(resetAction);
```

### Replace

The `Replace` action replaces the route at the given key with another route.

* `key` - _string_ - required - Key of the route to replace.
* `newKey` - _string_ - Key to use for the replacement route. Generated automatically if not provided.
* `routeName` - _string_ - `routeName` to use for replacement route.
* `params` - _object_ - Parameters to pass in to the replacement route.
* `action` - _object_ - Optional sub-action.
* `immediate`* - _boolean_ - *Currently has no effect*, this is a placeholder for when stack navigator supports animated replace (it currently does not).
