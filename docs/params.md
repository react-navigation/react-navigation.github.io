---
id: params
title: Passing parameters to routes
sidebar_label: Passing parameters to routes
---

Now that we know how to [create a StackNavigator with a some routes](hello-react-navigation.html) and [navigate between those routes](navigating.html), let's look at how we can pass data to routes when we navigate to them.

There are two pieces to this:

1. Pass params to a route by putting them in an object as a second parameter to the `navigation.navigate` function: `this.props.navigation.navigate('RouteName', { /* params go here */ })`
2. Read the params in your screen component: `this.props.navigation.state.params`.

```js
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate('Details', {
              itemId: 86,
              otherParam: 'anything you want here',
            });
          }}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    /* 2. Read the params from the navigation state */
    const { params } = this.props.navigation.state;
    const itemId = params ? params.itemId : null;
    const otherParam = params ? params.otherParam : null;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>itemId: {JSON.stringify(itemId)}</Text>
        <Text>otherParam: {JSON.stringify(otherParam)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}
```

<a href="https://snack.expo.io/@react-navigation/navigate-with-params" target="blank" class="run-code-button">&rarr; Run this code</a>

## Summary

- `navigate` accepts an optional second argument to let you pass parameters to the route you are navigating to. For example: `this.props.navigation.navigate('RouteName', {paramName: 'value'})` pushes a new route to the `StackNavigator`, where the params are `{paramName: 'value'}`.
- You can read the params from `this.props.navigation.state.params`. It is `null` if no parameters are specified.
- [Full source of what we have built so far](https://snack.expo.io/@react-navigation/navigate-with-params).