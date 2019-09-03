---
id: stack-actions
title: StackActions reference
sidebar_label: StackActions
---

`StackActions` is an object containing methods for generating actions specific to stack-based navigators. Its methods expand upon the actions available in [NavigationActions](navigation-actions.html).

The following actions are supported:

### push

The `push` action adds a route on top of the stack and navigates forward to it. This differs from `navigate` in that `navigate` will pop back to earlier in the stack if a route of the given name is already present there. `push` will always add on top, so a route can be present multiple times.

- `name` - _string_ - Name of the route to push onto the stack.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

```js
import { StackActions } from '@react-navigation/routers';

const pushAction = StackActions.push('Profile', { name: 'Michaś' });

navigation.dispatch(pushAction);
```

### pop

The `pop` action takes you back to a previous screen in the stack. The `count` argument allows you to specify how many screens to pop back by.

```js
import { StackActions } from '@react-navigation/routers';

const popAction = StackActions.pop(1);

navigation.dispatch(popAction);
```

### popToTop

The `popToTop` action takes you back to the first screen in the stack, dismissing all the others. It's functionally identical to `StackActions.pop({n: currentIndex})`.

```js
import { StackActions } from '@react-navigation/routers';

navigation.dispatch(StackActions.popToTop());
```
