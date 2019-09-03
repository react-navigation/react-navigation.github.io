---
id: drawer-actions
title: DrawerActions reference
sidebar_label: DrawerActions
---

`DrawerActions` is an object containing methods for generating actions specific to drawer-based navigators. Its methods expand upon the actions available in [CommonActions](navigation-actions.html).

The following actions are supported:

- [openDrawer](#openDrawer) - open the drawer
- [closeDrawer](#closeDrawer) - close the drawer
- [toggleDrawer](#toggleDrawer) - toggle the state, ie. switche from closed to open and vice versa

### toggleDrawer

```js
import { DrawerActions } from '@react-navigation/routers';

navigation.dispatch(DrawerActions.toggleDrawer());
```

### closeDrawer

```js
import { DrawerActions } from '@react-navigation/routers';

navigation.dispatch(DrawerActions.closeDrawer());
```

### openDrawer

```js
import { DrawerActions } from '@react-navigation/routers';

navigation.dispatch(DrawerActions.openDrawer());
```
