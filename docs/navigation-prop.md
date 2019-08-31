---
id: navigation-prop
title: Navigation prop reference
sidebar_label: Navigation prop
---

Each `screen` component in your app is provided with the `navigation` prop automatically. The prop contains various convenience functions that dispatch navigation actions on the route's router. It looks like this:

- `this.props.navigation`
  - `navigate` - go to another screen, figures out the action it needs to take to do it
  - `goBack` - close active screen and move back in the stack
  - `addListener` - subscribe to updates to navigation lifecycle
  - `isFocused` - function that returns `true` if the screen is focused and `false` otherwise.
  - `state` - current state/routes
  - `setParams` - make changes to route's params
  - `dispatch` - send an action to router
  - `dangerouslyGetParent` - function that returns the parent navigator, if any

It's important to highlight the `navigation` prop is _not_ passed in to _all_ components; only `screen` components receive this prop automatically! React Navigation doesn't do anything magic here. For example, if you were to define a `MyBackButton` component and render it as a child of a screen component, you would not be able to access the `navigation` prop on it. If, however, you wish to access the `navigation` prop in any of your components, you may use the [`withNavigation`](with-navigation.html) HOC.

### Navigator-dependent functions

There are several additional functions present on `this.props.navigation` based on the kind of the current navigator.

If the navigator is a stack navigator, several alternatives to `navigate` and `goBack` are provided and you can use whichever you prefer. The functions are:

- `this.props.navigation`
  - `push` - push a new route onto the stack
  - `pop` - go back in the stack
  - `popToTop` - go to the top of the stack
  - `replace` - replace the current route with a new one
  - `reset` - wipe the navigator state and replace it with the result of several actions
  - `dismiss` - dismiss the current stack

If the navigator is a drawer navigator, the following are also available:

- `this.props.navigation`
  - `openDrawer` - open the drawer
  - `closeDrawer` - close the drawer
  - `toggleDrawer` - toggle the state, ie. switch from closed to open and vice versa

## Common API reference

The vast majority of your interactions with the `navigation` prop will involve `navigate`, `goBack`, `state`, and `setParams` / `getParam`.

### `navigate` - Link to other screens

Call this to link to another screen in your app. Takes the following arguments:

`navigation.navigate({ routeName, params, action, key })`

OR

`navigation.navigate(routeName, params, action)`

- `routeName` - A destination routeName that has been registered somewhere in the app's router
- `params` - Params to merge into the destination route
- `action` - (advanced) The sub-action to run in the child router, if the screen is a navigator. See [Actions Doc](navigation-actions.html) for a full list of supported actions.
- `key` - Optional identifier of what route to navigate to. Navigate **back** to this route, if it already exists

```js
function HomeScree({ navigation: { navigate } }) {
return (
  <View>
    <Text>This is the home screen of the app</Text>
    <Button
      onPress={() => navigate("Profile", { names: ["Brent", "Satya", "Michaś"] })}
      title="Go to Brent's profile"
    />
  </View>
);
}
```

### `goBack` - Close the active screen and move back

Optionally provide a key, which specifies the route to go back from. By default, `goBack` will close the route that it is called from. If the goal is to go back _anywhere_, without specifying what is getting closed, call `.goBack(null);` Note that the `null` parameter is useful in the case of nested `StackNavigators` to go back on a parent navigator when the child navigator already has only one item in the stack. Don't be concerned if this is confusing, this API needs some work.

Note -- a key is not the name of the route but the unique identifier you provided when navigating to the route. See [navigation key](navigation-key.html).

```js
function HomeScreen({ navigation: { goBack } }) {
  return (
    <View>
      <Button onPress={() => goBack()} title="Go back from this HomeScreen" />
      <Button onPress={() => goBack(null)} title="Go back anywhere" />
      <Button
        onPress={() => goBack("key-123")}
        title="Go back from key-123"
      />
    </View>
  );
}
```

### Going back from a specific screen with `goBack`

Consider the following navigation stack history:

```javascript
navigation.navigate({ routeName: SCREEN, key: SCREEN_KEY_A });
navigation.navigate({ routeName: SCREEN, key: SCREEN_KEY_B });
navigation.navigate({ routeName: SCREEN, key: SCREEN_KEY_C });
navigation.navigate({ routeName: SCREEN, key: SCREEN_KEY_D });
```

Now you are on _screen D_ and want to go back to _screen A_ (popping D, C, and B).
Then you need to supply a key to goBack _FROM_:

```
navigation.goBack(SCREEN_KEY_B) // will go to screen A FROM screen B
```

Alternatively, as _screen A_ is the top of the stack, you can use `navigation.popToTop()`.
    
## Navigation events

Screens can add listeners on the `navigation` prop like in React Navigation. By default, `focus` and `blur` events are fired when focused screen changes:

```js
function Profile({ navigation }) {
  React.useEffect(() =>
    navigation.addListener('focus', () => {
      // do something
    })
  );

  return <ProfileContent />;
}
```

The `navigation.addListener` method returns a function to remove the listener which can be returned as the cleanup function in an effect.

Navigators can also emit custom events using the `emit` method in the `navigation` object passed:

```js
navigation.emit({
  type: 'transitionStart',
  data: { blurring: false },
  target: route.key,
});
```

The `data` is available under the `data` property in the `event` object, i.e. `event.data`.

The `target` property determines the screen that will receive the event. If the `target` property is omitted, the event is dispatched to all screens in the navigator.

Screens cannot emit events as there is no `emit` method on a screen's `navigation` prop.

If you don't need to get notified of focus change, but just need to check if the screen is currently focused in a callback, you can use the `navigation.isFocused()` method which returns a boolean. Note that it's not safe to use this in `render`. Only use it in callbacks, event listeners etc.


### `isFocused` - Query the focused state of the screen

Returns `true` if the screen is focused and `false` otherwise.

```js
let isFocused = this.props.navigation.isFocused();
```

You probably want to use [withNavigationFocus](with-navigation-focus.html) instead of using this directly, it will pass in an `isFocused` boolean a prop to your component.

```

### `setParams` - Make changes to route params

Firing the `setParams` action allows a screen to change the params in the route, which is useful for updating the header buttons and title. `setParams` works like React's `setState` - it merges the provided params object with the current params.

```js
function ProfileScreen({ navigation: { setParams } }) {
  render() {
    return (
      <Button
        onPress={() => setParams({ name: "Lucy" })}
        title="Set title name to 'Lucy'"
      />
    );
  }
}
```


## Stack Actions

The following actions will work within any stack navigator:

### Push

Similar to navigate, push will move you forward to a new route in the stack. This differs from `navigate` in that `navigate` will pop back to earlier in the stack if a route of the given name is already present there. `push` will always add on top, so a route can be present multiple times.

```js
navigation.push(routeName, params, action);
```

- `routeName` - A destination routeName that has been registered somewhere in the app's router.
- `params` - Params to merge into the destination route.
- `action` - (advanced) The sub-action to run in the child router, if the screen is a navigator. See [Actions Doc](navigation-actions.html) for a full list of supported actions.

### Pop

Take you to the previous screen in the stack. If you provide a number, `n`, it will specify how many screens to take you back within the stack.

```js
navigation.pop(n);
```

### PopToTop

Call this to jump back to the top route in the stack, dismissing all other screens.

```js
navigation.popToTop();
```

### Replace

Call this to replace the current screen with the given route, with params and sub-action.

```js
navigation.replace(routeName, params, action);
```

### Reset

Wipe the navigator state and replace it with the result of several actions.

```js
navigation.reset([NavigationActions.navigate({ routeName: "Profile" })], 0);
```

### Dismiss

Call this if you're in a nested (child) stack and want to dismiss the entire stack, returning to the parent stack.

```js
navigation.dismiss();
```

## Advanced API Reference

The `dispatch` function is much less commonly used, but a good escape hatch if you can't do what you need with `navigate` and `goBack`.

### `dispatch` - Send an action to the router

Use dispatch to send any navigation action to the router. The other navigation functions use dispatch behind the scenes.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

See [Navigation Actions Docs](navigation-actions.html) for a full list of available actions.

```js
import { NavigationActions } from "react-navigation";

const navigateAction = NavigationActions.navigate({
  routeName: "Profile",
  params: {},

  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ name: "SubProfileRoute" })
});
this.props.navigation.dispatch(navigateAction);
```

### `dangerouslyGetParent` - get parent navigator

If, for example, you have a screen component that can be presented within multiple navigators, you may use this to influence its behavior based on what navigator it is in.

Another good use case for this is to find the index of the active route in the parent's route list. So in the case of a stack if you are at index 0 then you may not want to render a back button, but if you're somewhere else in the list then you would render a back button.

Be sure to always check that the call returns a valid value.

<add example>


### `dangerouslyGetState` - get state of navigator

Most likely you don't want to get state of navigator. It's used for internal logic and we currently do not predict any use case of it. If you do, make sure you have a good reason.

<add example if we find any>
