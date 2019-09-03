---
id: navigation-actions
title: CommonActions reference
sidebar_label: CommonActions
---

All `CommonActions` return an object that can be sent to the router using `navigation.dispatch()` method.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

It's important to highlight that dispatching a `CommonAction` doesn't throw any error when the action is unhandled (similar to when you dispatch an action that isn't handled by a reducer in redux and nothing happens). However, if the app state changes as a result of a dispatch then the return value of the dispatch is `true` and `false` otherwise.

The following actions are supported:

- [Navigate](#navigate) - Navigate to another route
- [Back](#goback) - Go back to previous state
- [Set Params](#setparams) - Set Params for given route
- [Init](#init) - Used to initialize first state if state is undefined

For actions specific to a StackNavigator, see [StackActions](stack-actions.html).
For actions specific to a switch-based navigators such as TabNavigator, see [SwitchActions](switch-actions.html).

The action creator functions define `toString()` to return the action type, which enables easy usage with third-party Redux libraries, including redux-actions and redux-saga.

### navigate

The `navigate` action will update the current state with the result of a `navigate` action.

- `name` - _String_ - Required - A destination name of the route that has been registered somewhere
- `params` - _Object_ - Optional - Params to merge into the destination route
- `action` - _Object_ - Optional - (advanced) The sub-action to run in the child router, if the screen is a navigator. Any one of the actions described in this doc can be set as a sub-action.
- `key` - _String_ - Optional - The identifier for the route to navigate to. Navigate back to this route if it already exists

```js
import { CommonActions } from '@react-navigation/core';

navigation.dispatch(
  CommonActions.navigate({
    name: 'Profile',
    params: {},
  })
);
```

### goBack

Go back to previous screen and close current screen. `back` action creator takes in one optional parameter:

- `key` - _string or null_ - optional - If set, navigation will go back from the given key. If null, navigation will go back anywhere.

```js
import { CommonActions } from '@react-navigation/core';

navigation.dispatch(
  CommonActions.goBack({
    key: 'Profile',
  })
);
```

### setParams

When dispatching `setParams`, the router will produce a new state that has changed the params of a particular route, as identified by the key

- `params` - _object_ - required - New params to be merged into existing route params
- `key` - _string_ - required - Route key that should get the new params

```js
import { CommonActions } from '@react-navigation/core';

navigation.dispatch(
  CommonActions.setParams({
    params: { title: 'Hello' },
    key: 'screen-123',
  })
);
```
