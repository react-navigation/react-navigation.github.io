---
id: version-2.x-navigation-prop
title: Navigation prop reference
sidebar_label: Navigation prop
original_id: navigation-prop
---

Each `screen` component in your app is provided with the `navigation` prop automatically. The prop contains various convenience functions that dispatch navigation actions on the route's router. It looks like this:

* `this.props.navigation`
  * `navigate` - go to another screen, figures out the action it needs to take to do it
  * `goBack` - close active screen and move back in the stack
  * `addListener` - subscribe to updates to navigation lifecycle
  * `isFocused` - function that returns `true` if the screen is focused and `false` otherwise.
  * `state` - current state/routes
  * `setParams` - make changes to route's params
  * `getParam` - get a specific param with fallback
  * `dispatch` - send an action to router
  * `dangerouslyGetParent` - function that returns the parent navigator, if any

It's important to highlight the `navigation` prop is _not_ passed in to _all_ components; only `screen` components receive this prop automatically! React Navigation doesn't do anything magic here. For example, if you were to define a `MyBackButton` component and render it as a child of a screen component, you would not be able to access the `navigation` prop on it. If, however, you wish to access the `navigation` prop in any of your components, you may use the [`withNavigation`](with-navigation.html) HOC.

### Navigator-dependent functions

There are several additional functions present on `this.props.navigation` based on the kind of the current navigator.

If the navigator is a stack navigator, several alternatives to `navigate` and `goBack` are provided and you can use whichever you prefer. The functions are:

* `this.props.navigation`
  * `push` - push a new route onto the stack
  * `pop` - go back in the stack
  * `popToTop` - go to the top of the stack
  * `replace` - replace the current route with a new one
  * `reset` - wipe the navigator state and replace it with the result of several actions
  * `dismiss` - dismiss the current stack


If the navigator is a drawer navigator, the following are also available:

* `this.props.navigation`
  * `openDrawer` - open the drawer
  * `closeDrawer` - close the drawer
  * `toggleDrawer` - toggle the state, ie. switch from closed to open and vice versa

## Common API reference

The vast majority of your interactions with the `navigation` prop will involve `navigate`, `goBack`, `state`, and `setParams` / `getParam`.

### `navigate` - Link to other screens

Call this to link to another screen in your app. Takes the following arguments:

`navigation.navigate({ routeName, params, action, key })`

OR

`navigation.navigate(routeName, params, action)`

* `routeName` - A destination routeName that has been registered somewhere in the app's router
* `params` - Params to merge into the destination route
* `action` - (advanced) The sub-action to run in the child router, if the screen is a navigator. See [Actions Doc](navigation-actions.html) for a full list of supported actions.
* `key` - Optional identifier of what route to navigate to. Navigate **back** to this route, if it already exists

```js
class HomeScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Text>This is the home screen of the app</Text>
        <Button
          onPress={() => navigate('Profile', { name: 'Brent' })}
          title="Go to Brent's profile"
        />
      </View>
    );
  }
}
```

### `goBack` - Close the active screen and move back

Optionally provide a key, which specifies the route to go back from. By default, `goBack` will close the route that it is called from. If the goal is to go back _anywhere_, without specifying what is getting closed, call `.goBack(null);` Note that the `null` parameter is useful in the case of nested `StackNavigators` to go back on a parent navigator when the child navigator already has only one item in the stack. Don't be concerned if this is confusing, this API needs some work.

```js
class HomeScreen extends React.Component {
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View>
        <Button onPress={() => goBack()} title="Go back from this HomeScreen" />
        <Button onPress={() => goBack(null)} title="Go back anywhere" />
        <Button
          onPress={() => goBack('screen-123')}
          title="Go back from screen-123"
        />
      </View>
    );
  }
}
```

### Going back from a specific screen with `goBack`

Consider the following navigation stack history:

```javascript
navigation.navigate(SCREEN_KEY_A);
navigation.navigate(SCREEN_KEY_B);
navigation.navigate(SCREEN_KEY_C);
navigation.navigate(SCREEN_KEY_D);
```

Now you are on _screen D_ and want to go back to _screen A_ (popping D, C, and B).
Then you need to supply a key to goBack _FROM_:

```
navigation.goBack(SCREEN_KEY_B) // will go to screen A FROM screen B
```

Alternatively, as _screen A_ is the top of the stack, you can use `navigation.popToTop()`.

### `addListener` - Subscribe to updates to navigation lifecycle

React Navigation emits events to screen components that subscribe to them:

* `willFocus` - the screen will focus
* `didFocus` - the screen focused (if there was a transition, the transition completed)
* `willBlur` - the screen will be unfocused
* `didBlur` - the screen unfocused (if there was a transition, the transition completed)

Example:

```javascript
const didBlurSubscription = this.props.navigation.addListener(
  'didBlur',
  payload => {
    console.debug('didBlur', payload);
  }
);

// Remove the listener when you are done
didBlurSubscription.remove();
```

The JSON payload:

```javascript
{
  action: { type: 'Navigation/COMPLETE_TRANSITION', key: 'StackRouterRoot' },
  context: 'id-1518521010538-2:Navigation/COMPLETE_TRANSITION_Root',
  lastState: undefined,
  state: undefined,
  type: 'didBlur',
};
```

You can also subscribe to navigation events declaratively with the [`<NavigationEvents/>`](navigation-events.html) component.

### `isFocused` - Query the focused state of the screen

Returns `true` if the screen is focused and `false` otherwise.

```js
let isFocused = this.props.navigation.isFocused();
```

You probably want to use [withNavigationFocus](with-navigation-focus.html) instead of using this directly, it will pass in an `isFocused` boolean a prop to your component.

### `state` - The screen's current state/route

A screen has access to its route via `this.props.navigation.state`. Each will return an object with the following:

```js
{
  // the name of the route config in the router
  routeName: 'profile',
  //a unique identifier used to sort routes
  key: 'main0',
  //an optional object of string options for this screen
  params: { hello: 'world' }
}
```

This is most commonly used to access the `params` for the screen, passed in through `navigate` or `setParams`.

```js
class ProfileScreen extends React.Component {
  render() {
    return <Text>Name: {this.props.navigation.state.params.name}</Text>;
  }
}
```

### `setParams` - Make changes to route params

Firing the `setParams` action allows a screen to change the params in the route, which is useful for updating the header buttons and title. `setParams` works like React's `setState` - it merges the provided params object with the current params.

```js
class ProfileScreen extends React.Component {
  render() {
    return (
      <Button
        onPress={() => this.props.navigation.setParams({ name: 'Lucy' })}
        title="Set title name to 'Lucy'"
      />
    );
  }
}
```

### `getParam` - Get a specific param value with a fallback

In the past, you may have encountered the frightful scenario of accessing a `param` when `params` is undefined. Instead of accessing the param directly, you can call `getParam` instead.

Before:

```js
const { name } = this.props.navigation.state.params;
```

if `params` is `undefined`, this fails

After:

```js
const name = this.props.navigation.getParam('name', 'Peter');
```

if `name` or `param` are undefined, set the fallback to `Peter`.

## Stack Actions

The following actions will work within any stack navigator:

### Push

Similar to navigate, push will move you forward to a new route in the stack. This differs from `navigate` in that `navigate` will pop back to earlier in the stack if a route of the given name is already present there. `push` will always add on top, so a route can be present multiple times.

```js
navigation.push(routeName, params, action)
```

* `routeName` - A destination routeName that has been registered somewhere in the app's router.
* `params` - Params to merge into the destination route.
* `action` - (advanced) The sub-action to run in the child router, if the screen is a navigator. See [Actions Doc](navigation-actions.html) for a full list of supported actions.

### Pop

Take you to the previous screen in the stack. If you provide a number, `n`, it will specify how many screens to take you back within the stack.

```js
navigation.pop(n)
```

### PopToTop

Call this to jump back to the top route in the stack, dismissing all other screens.

```js
navigation.popToTop()
```

### Replace

Call this to replace the current screen with the given route, with params and sub-action.

```js
navigation.replace(routeName, params, action)
```

### Reset

Wipe the navigator state and replace it with the result of several actions.

```js
navigation.reset([NavigationActions.navigate({ routeName: 'Profile' })], 0)
```

### Dismiss

Call this if you're in a nested (child) stack and want to dismiss the entire stack, returning to the parent stack.

```js
navigation.dismiss()
```

## Advanced API Reference

The `dispatch` function is much less commonly used, but a good escape hatch if you can't do what you need with `navigate` and `goBack`.

### `dispatch` - Send an action to the router

Use dispatch to send any navigation action to the router. The other navigation functions use dispatch behind the scenes.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

See [Navigation Actions Docs](navigation-actions.html) for a full list of available actions.

```js
import { NavigationActions } from 'react-navigation';

const navigateAction = NavigationActions.navigate({
  routeName: 'Profile',
  params: {},

  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'SubProfileRoute' }),
});
this.props.navigation.dispatch(navigateAction);
```

### `dangerouslyGetParent` - get parent navigator

If, for example, you have a screen component that can be presented within multiple navigators, you may use this to influence its behavior based on what navigator it is in. 

Another good use case for this is to find the index of the active route in the parent's route list. So in the case of a stack if you are at index 0 then you may not want to render a back button, but if you're somewhere else in the list then you would render a back button.

Be sure to always check that the call returns a valid value.

```js
class UserCreateScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const parent = navigation.dangerouslyGetParent();
    const gesturesEnabled =
      parent &&
      parent.state &&
      parent.state.routeName === 'StackWithEnabledGestures';

    return {
      title: 'New User',
      gesturesEnabled
    };
  };
}

```
