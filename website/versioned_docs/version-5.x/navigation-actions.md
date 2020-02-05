---
id: version-5.x-navigation-actions
title: CommonActions reference
sidebar_label: CommonActions
original_id: navigation-actions
---

A navigation action is an object containing at least a `type` property. The action can be handled by routers with the `getStateForAction` method to return a new state from an existing navigation state.

Each navigation actions can contain at least the following properties:

- `type` (required) - A string which represents the name of the action.
- `payload` (options) - An object containing additional information about the action. For example, it will contain `name` and `params` for `navigate`.
- `source` (optional) - The key of the route which should be considered as the source of the action. This is used by some routers to determine which route to apply the action on. By default, `navigation.dispatch` adds the key of the route that dispatched the action.
- `target` (optional) - The key of the navigation state the action should be applied on.

It's important to highlight that dispatching a navigation action doesn't throw any error when the action is unhandled (similar to when you dispatch an action that isn't handled by a reducer in redux and nothing happens).

## Common actions

The library exports several action creators under the `CommonActions` namespace. You should use these action creators instead of writing action objects manually.

### navigate

The `navigate` action allows to navigate to a specific route. It takes the following arguments:

- `name` - _string_ - A destination name of the route that has been registered somewhere..
- `key` - _string_ - The identifier for the route to navigate to. Navigate back to this route if it already exists..
- `params` - _object_ - Params to merge into the destination route..

The options object passed should at least contain a `key` or `name` property, and optionally `params`. If both `key` and `name` are passed, stack navigator will create a new route with the specified key if no matches were found.

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch(
  CommonActions.navigate({
    name: 'Profile',
    params: {
      user: 'jane',
    },
  })
);
```

### replace

The `replace` action allows to replace a route in the navigation state. It takes the following arguments:

- `name` - _string_ - A destination name of the route that has been registered somewhere.
- `params` - _object_ - Params to merge into the destination route.

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch(
  CommonActions.replace('Profile', {
    user: 'jane',
  })
);
```

If you want to replace a particular route, you can add a `source` property referring to the route key:

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch({
  ...CommonActions.replace('Profile', {
    user: 'jane',
  }),
  source: route.key,
});
```

If the `source` property is explicitly set to `undefined`, it'll replace the focused route.

### reset

The `reset` action allows to reset the navigation state to the given state. It takes the following arguments:

- `state` - _object_ - The new navigation state object to use.

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch(
  CommonActions.reset({
    index: 1,
    routes: [
      { name: 'Home' },
      {
        name: 'Profile',
        params: { user: 'jane' },
      },
    ],
  })
);
```

> Note: Consider the navigator's state object to be internal and subject to change in a minor release. Avoid using properties from the navigation state object except `index` and `routes`, unless you really need it. If there is some functionality you cannot achieve without relying on the structure of the state object, please open an issue.

### goBack

The `goBack` action creator allows to go back to the previous route in history. It doesn't take any arguments.

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch(CommonActions.goBack());
```

If you want to go back from a particular route, you can add a `source` property referring to the route key and a `target` property referring to the `key` of the navigator which contains the route:

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch({
  ...CommonActions.goBack(),
  source: route.key,
  target: state.key,
});
```

By default, the key of the route which dispatched the action is passed as the `source` property and the `target` property is `undefined`.

### setParams

The `setParams` action allows to update params for a certain route. It takes the following arguments:

- `params` - _object_ - required - New params to be merged into existing route params.

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch(CommonActions.setParams({ user: 'Wojtek' }));
```

If you want to set params for a particular route, you can add a `source` property referring to the route key:

<samp id="common-actions">

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch({
  ...CommonActions.setParams({ user: 'Wojtek' }),
  source: route.key,
});
```

If the `source` property is explicitly set to `undefined`, it'll set the params for the focused route.
