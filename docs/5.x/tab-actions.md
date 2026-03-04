# TabActions reference

Version: 5.x

Sitemap: [llms-5.x.txt](https://reactnavigation.org/llms-5.x.txt)

`TabActions` is an object containing methods for generating actions specific to tab-based navigators. Its methods expand upon the actions available in [`CommonActions`](navigation-actions.md).

The following actions are supported:

## jumpTo

The `jumpTo` action can be used to jump to an existing route in the tab navigator.

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

<samp id="tab-actions" />

```js

const jumpToAction = TabActions.jumpTo('Profile', { user: 'Satya' });

navigation.dispatch(jumpToAction);
```
