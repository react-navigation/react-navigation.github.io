# TabActions reference

Version: 6.x

Sitemap: [llms-6.x.txt](https://reactnavigation.org/llms-6.x.txt)

`TabActions` is an object containing methods for generating actions specific to tab-based navigators. Its methods expand upon the actions available in [`CommonActions`](navigation-actions.md).

The following actions are supported:

## jumpTo

The `jumpTo` action can be used to jump to an existing route in the tab navigator.

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to pass to the destination route.

<samp id="tab-actions" />

```js

const jumpToAction = TabActions.jumpTo('Profile', { user: 'Satya' });

navigation.dispatch(jumpToAction);
```
