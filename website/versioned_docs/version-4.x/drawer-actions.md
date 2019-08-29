---
id: version-4.x-drawer-actions
title: DrawerActions reference
sidebar_label: DrawerActions
original_id: drawer-actions
---

`DrawerActions` is an object containing methods for generating actions specific to drawer-based navigators. Its methods expand upon the actions available in [NavigationActions](navigation-actions.html).

The following actions are supported:

- [openDrawer](#openDrawer) - open the drawer
- [closeDrawer](#closeDrawer) - close the drawer
- [toggleDrawer](#toggleDrawer) - toggle the state, ie. switches from closed to open and vice versa

### Usage

```js
import { DrawerActions } from 'react-navigation-drawer';

this.props.navigation.dispatch(DrawerActions.toggleDrawer());
```
