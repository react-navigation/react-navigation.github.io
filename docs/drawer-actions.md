---
id: drawer-actions
title: DrawerActions reference
sidebar_label: DrawerActions
---

`DrawerActions` is an object containing methods for generating actions specific to drawer-based navigators. Its methods expand upon the actions available in [NavigationActions](navigation-actions.html).

The following actions are supported:
* [openDrawer](#openDrawer) - open the drawer
* [closeDrawer](#closeDrawer) - close the drawer
* [toggleDrawer](#toggleDrawer) - toggle the state, ie. switche from closed to open and vice versa

### Usage

```js
import { DrawerActions } from 'react-navigation';

this.props.navigation.dispatch(DrawerActions.toggleDrawer())
```
