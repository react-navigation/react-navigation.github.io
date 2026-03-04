# SwitchActions reference

Version: 4.x

Sitemap: [llms-4.x.txt](https://reactnavigation.org/llms-4.x.txt)

`SwitchActions` is an object containing methods for generating actions specific to switch-based navigators. Its methods expand upon the actions available in [`NavigationActions`](navigation-actions.md).

The following actions are supported:

- [JumpTo](#jumpto) - Jump to a route in the navigator

### jumpTo

The `jumpTo` action can be used to jump to an existing route in the switch navigator.

- `routeName` - _string_ - required - `routeName` of the route to jump to.
- `key` - _string_ - optional - If set, the action will be scoped to the switch-based navigator with the given key.

```js

this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName }));
```
