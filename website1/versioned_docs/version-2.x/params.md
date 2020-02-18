---
id: version-2.x-params
title: Passing parameters to routes
sidebar_label: Passing parameters to routes
original_id: params
---

Remember when I said "more on that later when we talk about `params`!"? Well, the time has come.

Now that we know how to [create a stack navigator with some routes](hello-react-navigation.html) and [navigate between those routes](navigating.html), let's look at how we can pass data to routes when we navigate to them.

There are two pieces to this:

1. Pass params to a route by putting them in an object as a second parameter to the `navigation.navigate` function: `this.props.navigation.navigate('RouteName', { /* params go here */ })`

2. Read the params in your screen component: `this.props.navigation.getParam(paramName, defaultValue)`.

> We recommend that the params you pass are JSON-serializable. That way, you'll be able to use [state persistence](state-persistence.html) and your screen components will have the right contract for implementing [deep linking](deep-linking.html).

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
    /* 2. Get the param, provide a fallback value if not available */
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', 'NO-ID');
    const otherParam = navigation.getParam('otherParam', 'some default value');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>itemId: {JSON.stringify(itemId)}</Text>
        <Text>otherParam: {JSON.stringify(otherParam)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() =>
            this.props.navigation.push('Details', {
              itemId: Math.floor(Math.random() * 100),
            })}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
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

<a href="https://snack.expo.io/@react-navigation/navigate-with-params-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

> You can also directly access the params object with `this.props.navigation.state.params`. This may be `null` if no params were supplied, and so it's usually easier to just use `getParam` so you don't have to deal with that case.

> If you want to access the params directly through props (eg. `this.props.itemId`) rather than `this.props.navigation.getParam`, you may use a community-developed [react-navigation-props-mapper](https://github.com/vonovak/react-navigation-props-mapper) package.

## Summary

- `navigate` and `push` accept an optional second argument to let you pass parameters to the route you are navigating to. For example: `this.props.navigation.navigate('RouteName', {paramName: 'value'})`.
- You can read the params through `this.props.navigation.getParam`
- As an alternative to `getParam`, you may use `this.props.navigation.state.params`. It is `null` if no parameters are specified.
- [Full source of what we have built so far](https://snack.expo.io/@react-navigation/navigate-with-params-v2).
