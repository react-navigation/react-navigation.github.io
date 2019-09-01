---
id: tab-actions
title: TabActions reference
sidebar_label: TabActions
---

`DrawerActions` is an object containing methods for generating actions specific to drawer-based navigators. Its methods expand upon the actions available in [NavigationActions](navigation-actions.html).

The following actions are supported:

- [jumpTo](#jumpTo) - Jump to a route in the navigator

### toggleDrawer

The `jumpTo` action can be used to jump to an existing route in the tab navigator

- `routeName` - _string_ - `routeName` to push onto the stack.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `this.props.route.params`).

```js
import { TabActions } from '@react-navigation/routers';

const jumpToAction = TabActions.jumpTo('Profile', { name: 'Satya' });

this.props.navigation.dispatch(jumpToAction);
```
