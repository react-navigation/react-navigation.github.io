---
id: navigation-prop
title: Navigation prop reference
sidebar_label: Navigation prop reference
---

Each `screen` component in your app is provided with the `navigation` prop automatically. It looks like this:

* `this.props.navigation`
  * `navigate` - link to other screens
  * `goBack` - close active screen and move back
  * `state` - current state/routes
  * `setParams` - make changes to route's params
  * `dispatch` - send an action to router

It's important to highlight the `navigation` prop is _not_ passed in to _all_ components; only `screen` components receive this prop automatically! React Navigation doesn't do anything magic here. For example, if you were to define a `MyBackButton` component and render it as a child of a screen component, you would not be able to access the `navigation` prop on it.

```javascript
import React from 'react';
import { Button } 'react-native';
import { withNavigation } from 'react-navigation';

export default class MyBackButton extends React.Component {
  render() {
    // This will throw an 'undefined is not a function' exception because the navigation
    // prop is undefined.
    return <Button title="Back" onPress={() => { this.props.navigation.goBack() }} />;
  }
}
```

To resolve this exception, you could pass the `navigation` prop in to `MyBackButton` when you render it from a screen, like so: `<MyBackButton navigation={this.props.navigation} />`.

Alternatively, you can use the `withNavigation` function to provide the `navigation` prop automatically (through React context, if you're curious). This function behaves similarly to Redux's `connect` function, except rather than providing the `dispatch` prop to the component it wraps, it provides the `navigation` prop.

```js
import React from 'react';
import { Button } 'react-native';
import { withNavigation } from 'react-navigation';

class MyBackButton extends React.Component {
  render() {
    return <Button title="Back" onPress={() => { this.props.navigation.goBack() }} />;
  }
}

// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop
export default withNavigation(MyBackButton);
```

Using this approach, you can render `MyBackButton` anywhere in your app without passing in a `navigation` prop explicitly and it will work as expected.

## Common API reference

The vast majority of your interactions with the `navigation` prop will involve `navigate`, `goBack`, `state`, and `setParams`.

### `navigate` - Link to other screens

Call this to link to another screen in your app. Takes the following arguments:

`navigate(routeName, params, action)`

* `routeName` - A destination routeName that has been registered somewhere in the app's router
* `params` - Params to merge into the destination route
* `action` - (advanced) The sub-action to run in the child router, if the screen is a navigator. See [Actions Doc](navigation-actions) for a full list of supported actions.

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

Firing the `setParams` action allows a screen to change the params in the route, which is useful for updating the header buttons and title.

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

## Advanced API Reference

The `dispatch` function is much less commonly used, but a good escape hatch if you can't do what you need with `navigate` and `goBack`.`

### `dispatch` - Send an action to the router

Use dispatch to send any navigation action to the router. The other navigation functions use dispatch behind the scenes.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

See [Navigation Actions Docs](navigation-actions) for a full list of available actions.

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
