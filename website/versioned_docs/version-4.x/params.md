---
id: params
title: Passing parameters to routes
sidebar_label: Passing parameters to routes
---

Remember when I said "more on that later when we talk about `params`!"? Well, the time has come.

Now that we know how to [create a stack navigator with some routes](hello-react-navigation.md) and [navigate between those routes](navigating.md), let's look at how we can pass data to routes when we navigate to them.

There are two pieces to this:

1. Pass params to a route by putting them in an object as a second parameter to the `navigation.navigate` function: `this.props.navigation.navigate('RouteName', { /* params go here */ })`

2. Read the params in your screen component: `this.props.navigation.getParam(paramName, defaultValue)`.

> We recommend that the params you pass are JSON-serializable. That way, you'll be able to use [state persistence](state-persistence.md) and your screen components will have the right contract for implementing [deep linking](deep-linking.md).

<samp id="passing-params" />

```js
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => {
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
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>
          itemId: {JSON.stringify(navigation.getParam('itemId', 'NO-ID'))}
        </Text>
        <Text>
          otherParam:
          {JSON.stringify(navigation.getParam('otherParam', 'default value'))}
        </Text>
        <Button
          title="Go to Details... again"
          onPress={() =>
            navigation.push('Details', {
              itemId: Math.floor(Math.random() * 100),
            })
          }
        />
      </View>
    );
  }
}
```

> You can also directly access the params object with `this.props.navigation.state.params`. This may be `null` if no params were supplied, and so it's usually easier to just use `getParam` so you don't have to deal with that case.

> If you want to access the params directly through props (eg. `this.props.itemId`) rather than `this.props.navigation.getParam`, you may use a community-developed [react-navigation-props-mapper](https://github.com/vonovak/react-navigation-props-mapper) package.

## Summary

- `navigate` and `push` accept an optional second argument to let you pass parameters to the route you are navigating to. For example: `this.props.navigation.navigate('RouteName', {paramName: 'value'})`.
- You can read the params through `this.props.navigation.getParam`
- As an alternative to `getParam`, you may use `this.props.navigation.state.params`. It is `null` if no parameters are specified.
- [Full source of what we have built so far](#example/passing-params).
