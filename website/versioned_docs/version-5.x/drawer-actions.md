---
id: version-5.x-drawer-actions
title: DrawerActions reference
sidebar_label: DrawerActions
original_id: drawer-actions
---

`DrawerActions` is an object containing methods for generating actions specific to drawer-based navigators. Its methods expand upon the actions available in [CommonActions](navigation-actions.html).

The following actions are supported:

### openDrawer

The `openDrawer` action can be used to open the drawer pane.

<samp id="drawer-actions">

```js
import { DrawerActions } from '@react-navigation/routers';

navigation.dispatch(DrawerActions.openDrawer());
```

### closeDrawer

The `closeDrawer` action can be used to close the drawer pane.

<samp id="drawer-actions">

```js
import { DrawerActions } from '@react-navigation/routers';

navigation.dispatch(DrawerActions.closeDrawer());
```

### toggleDrawer

The `toggleDrawer` action can be used to open the drawer pane if closed, or close if open.

<samp id="drawer-actions">

```js
import { DrawerActions } from '@react-navigation/routers';

navigation.dispatch(DrawerActions.toggleDrawer());
```

### jumpTo

The `jumpTo` action can be used to jump to an existing route in the drawer navigator.

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

<samp id="drawer-actions">

```js
import { DrawerActions } from '@react-navigation/routers';

const jumpToAction = DrawerActions.jumpTo('Profile', { name: 'Satya' });

navigation.dispatch(jumpToAction);
```
