---
id: navigation-prop
title: Navigation prop reference
sidebar_label: Navigation prop
---

Each `screen` component in your app is provided with the `navigation` prop automatically. The prop contains various convenience functions that dispatch navigation actions on the route's router. It looks like this:

- `navigation`
  - `navigate` - go to another screen, figures out the action it needs to take to do it
  - `replace` - replace the current route with a new one
  - `reset` - wipe the navigator state and replace it with the result of several actions
  - `goBack` - close active screen and move back in the stack
  - `addListener` - subscribe to updates to navigation lifecycle
  - `setParams` - make changes to route's params
  - `dispatch` - send an action to router
  - `dangerouslyGetParent` - function that returns the parent navigator, if any

It's important to highlight the `navigation` prop is _not_ passed in to _all_ components; only `screen` components receive this prop automatically! React Navigation doesn't do anything magic here. For example, if you were to define a `MyBackButton` component and render it as a child of a screen component, you would not be able to access the `navigation` prop on it. If, however, you wish to access the `navigation` prop in any of your components, you may use the [`useNavigation`](use-navigation.md) HOC.

### Navigator-dependent functions

There are several additional functions present on `navigation` prop based on the kind of the current navigator.

If the navigator is a stack navigator, several alternatives to `navigate` and `goBack` are provided and you can use whichever you prefer. The functions are:

- `navigation`
  - `push` - push a new route onto the stack
  - `pop` - go back in the stack
  - `popToTop` - go to the top of the stack

If the navigator is a tab navigator, the following are also available:

- `navigation`
  - `jumpTo` - go to a specific screen in the tab navigator

If the navigator is a drawer navigator, the following are also available:

- `navigation`
  - `jumpTo` - go to a specific screen in the drawer navigator
  - `openDrawer` - open the drawer
  - `closeDrawer` - close the drawer
  - `toggleDrawer` - toggle the state, ie. switch from closed to open and vice versa

## Common API reference

The vast majority of your interactions with the `navigation` prop will involve `navigate`, `goBack`, and `setParams`.

### `navigate` - Link to other screens

Call this to link to another screen in your app. Takes the following arguments:

`navigation.navigate(name, params)`

- `name` - A destination name of the route that has been defined somewhere
- `params` - Params to merge into the destination route

```js
function HomeScreen({ navigation: { navigate } }) {
  return (
    <View>
      <Text>This is the home screen of the app</Text>
      <Button
        onPress={() =>
          navigate('Profile', { names: ['Brent', 'Satya', 'Michaś'] })
        }
        title="Go to Brent's profile"
      />
    </View>
  );
}
```

### `goBack` - Close the active screen and move back

Optionally provide a key, which specifies the route to go back from. By default, `goBack` will close the route that it is called from:

```js
function HomeScreen({ navigation: { goBack } }) {
  return (
    <View>
      <Button onPress={() => goBack()} title="Go back from this HomeScreen" />
    </View>
  );
}
```

#### Going back from a specific screen with `goBack`

Consider the following navigation stack history:

```javascript
navigation.navigate({ name: SCREEN, key: SCREEN_KEY_A });
navigation.navigate({ name: SCREEN, key: SCREEN_KEY_B });
navigation.navigate({ name: SCREEN, key: SCREEN_KEY_C });
navigation.navigate({ name: SCREEN, key: SCREEN_KEY_D });
```

Now you are on _screen D_ and want to go back to _screen A_ (popping D, C, and B).
Then you can use `navigate`:

```js
navigation.navigate({ key: SCREEN_KEY_A }); // will go to screen A FROM screen D
```

Alternatively, as _screen A_ is the top of the stack, you can use `navigation.popToTop()`.

### Replace

Call this to replace the current screen with the given route, with params and sub-action.

```js
navigation.replace(name, params);
```

### Reset

Replace the navigator state to a new state:

```js
navigation.reset({
  index: 0,
  routes: [{ name: 'Profile' }],
});
```

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

Apart from `focus` and `blur`, each navigator can emit their own custom events. For example, stack navigator emits `transitionStart` and `transitionEnd` events. You can find details about the events emitted on the individual navigator's documentation.

See more details in [lifecycle events documentation](listen-lifecycle-events.md).

### `isFocused` - Query the focused state of the screen

Returns `true` if the screen is focused and `false` otherwise.

```js
const isFocused = navigation.isFocused();
```

This method doesn't re-render the screen when the value changes and mainly useful in callbacks. You probably want to use [useIsFocused](use-is-focused.md) instead of using this directly, it will return a boolean a prop to indicating if the screen is focused.

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

## Advanced API Reference

The `dispatch` function is much less commonly used, but a good escape hatch if you can't do what you need with `navigate` and `goBack`.

### `dispatch` - Send an action to the router

Use dispatch to send any navigation action to the router. The other navigation functions use dispatch behind the scenes.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

See [Navigation Actions Docs](navigation-actions.md) for a full list of available actions.

```js
import { CommonActions } from '@react-navigation/core';

navigation.dispatch(
  CommonActions.navigate({
    name: 'Profile',
    params: {},
  })
);
```

### `dangerouslyGetParent` - get parent navigator

If, for example, you have a screen component that can be presented within multiple navigators, you may use this to influence its behavior based on what navigator it is in.

Another good use case for this is to find the index of the active route in the parent's route list. So in the case of a stack if you are at index 0 then you may not want to render a back button, but if you're somewhere else in the list then you would render a back button.

Be sure to always check that the call returns a valid value.

### `dangerouslyGetState` - get state of navigator

Most likely you don't want to get state of navigator. It's used for internal logic and we currently do not predict any use case of it. If you do, make sure you have a good reason.
