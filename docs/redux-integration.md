---
id: redux-integration
title: Redux integration
sidebar_label: Redux integration
original_id: redux-integration
---

It is extremely easy to use Redux in an app with React Navigation. It's basically no different than without React Navigation. The following example shows how to do it end to end: https://snack.expo.io/@react-navigation/redux-example. The most important piece from it is the following:

```js
let RootStack = createStackNavigator({
  Counter: CounterContainer,
  StaticCounter: StaticCounterContainer,
});

let Navigation = createAppContainer(RootStack);

// Render the app container component with the provider around it
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
```

Notice that we take the component returned from `createAppContainer` and wrap it in a `Provider`. Ta da! Now feel free to use `connect` throughout your app.

## What about `navigationOptions`?

Alright fair enough, the answer here isn't the most obvious. Let's say that you want to access the Redux store state from the title, what would you do? There are a couple of options. For these examples let's say that you want to put the count from the above example into the title.

### Use a component that is `connect`ed

Create a component, `connect` it to the store, then use that component in the `title`.
#TODO

```js
class Count extends React.Component {
  render() {
    return <Text>Count: {this.props.value}</Text>;
  }
}

let CountContainer = connect(state => ({ value: state.count }))(Count);

class Counter extends React.Component {
  static navigationOptions = {
    title: <CountContainer />,
  };

  /* .. the rest of the code */
}
```

[See a runnable example](https://snack.expo.io/@react-navigation/redux-example-with-dynamic-title).

### Pass the state you care about as a param to the screen

If the value isn't expected to change, you can just pass it from a `connect`ed component to the other screen as a param.

```js
<Button
  title="Go to static count screen"
  onPress={() =>
    this.props.navigation.navigate('StaticCounter', {
      count: this.props.count,
    })
  }
/>
```

#TODO

```js
class StaticCounter extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('count'),
  });

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          {this.props.navigation.getParam('count')}
        </Text>
      </View>
    );
  }
}
```

[See a runnable example](https://snack.expo.io/@react-navigation/redux-example-with-dynamic-title).

### setParams from your screen

Let's modify the `StaticCounter` from the previous example as follows:
#TODO

```js
class StaticCounter extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('count'),
  });

  componentDidMount() {
    this.updateCount();
  }

  componentDidUpdate() {
    this.updateCount();
  }

  updateCount() {
    this.props.navigation.setParams({ count: this.props.count });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          {this.props.navigation.getParam('count')}
        </Text>
      </View>
    );
  }
}
```

Now whenever the store updates we update the `count` param and the title updates accordingly.

## Can I store the navigation state in Redux too?

This is technically possible, but we don't recommend it - it's too easy to shoot yourself in the foot and slow down / break your app. We encourage you to leave it up to React Navigation to manage the navigation state. But if you really want to do this, you can use [react-navigation-redux-helpers](https://github.com/react-navigation/react-navigation-redux-helpers), but this isn't an officially supported workflow.
