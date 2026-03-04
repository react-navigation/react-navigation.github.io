# DrawerActions reference

Version: 3.x

Sitemap: [llms-3.x.txt](https://reactnavigation.org/llms-3.x.txt)

`DrawerActions` is an object containing methods for generating actions specific to drawer-based navigators. Its methods expand upon the actions available in [`NavigationActions`](navigation-actions.md).

The following actions are supported:

- openDrawer - open the drawer
- closeDrawer - close the drawer
- toggleDrawer - toggle the state, ie. switch from closed to open and vice versa

### Usage

```js

this.props.navigation.dispatch(DrawerActions.toggleDrawer());
```
