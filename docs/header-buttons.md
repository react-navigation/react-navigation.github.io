---
id: header-buttons
title: Header buttons
sidebar_label: Header buttons
---

Now that we know how to customize the look of our headers, let's make them sentient! Actually perhaps that's ambitious, let's just make them able to respond to our touches in very well defined ways.

## Adding a button to the header

The most common way to interact with a header is by tapping on a button either to the left or the right of the title. Let's add a button to the right side of the header (one of the most difficult places to touch on your entire screen, depending on finger and phone size, but also a normal place to put buttons).
#TODO

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    ),
  };
}
```

The binding of `this` in `navigationOptions` is _not_ the `HomeScreen` instance, so you can't call `setState` or any instance methods on it. This is pretty important because it's extremely common to want the buttons in your header to interact with the screen that the header belongs to. So, we will look how to do this next.

> Please note that a community-developed library for rendering buttons in the header with the correct styling is available: [react-navigation-header-buttons](https://github.com/vonovak/react-navigation-header-buttons).

## Header interaction with its screen component

The most commonly used pattern for giving a header button access to a function on the component instance is to use `params`. We'll demonstrate this with a classic example, the counter.
#TODO

```js
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      headerRight: (
        <Button
          onPress={navigation.getParam('increaseCount')}
          title="+1"
          color="#fff"
        />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ increaseCount: this._increaseCount });
  }

  state = {
    count: 0,
  };

  _increaseCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  /* later in the render function we display the count */
}
```

> React Navigation doesn't guarantee that your screen component will be mounted before the header. Because the `increaseCount` param is set in `componentDidMount`, we may not have it available to us in `navigationOptions`. This usually will not be a problem because `onPress` for `Button` and `Touchable` components will do nothing if the callback is null. If you have your own custom component here, you should make sure it behaves as expected with `null` for its press handler prop.

> As an alternative to `setParams`, you could use a state management library (such as Redux or MobX) and communicate between the header and the screen in the same way you would with two distinct components.

## Customizing the back button

`createStackNavigator` provides the platform-specific defaults for the back button. On iOS this includes a label next to the button, which shows the title of the previous screen when the title fits in the available space, otherwise it says "Back".

You can change the label behavior with `headerBackTitle` and `headerTruncatedBackTitle` ([read more](stack-navigator.html#headerbacktitle)).

To customize the back button image, you can use [headerBackImage](stack-navigator.html#headerbackimage).

## Overriding the back button

The back button will be rendered automatically in a stack navigator whenever it is possible for the user to go back from their current screen &mdash; in other words, the back button will be rendered whenever there is more than one screen in the stack.

Generally, this is what you want. But it's possible that in some circumstances that you want to customize the back button more than you can through the options mentioned above, in which case you can set the `headerLeft` option to a React Element that will be rendered, just as we did with `headerRight`. Alternatively, the `headerLeft` option also accepts a React Component, which can be used, for example, for overriding the onPress behavior of the back button. Read more about this in the [api reference](stack-navigator.html#headerleft).

## Summary

- You can set buttons in the header through the `headerLeft` and `headerRight` properties in `navigationOptions`.
- The back button is fully customizable with `headerLeft`, but if you just want to change the title or image, there are other `navigationOptions` for that &mdash; `headerBackTitle`, `headerTruncatedBackTitle`, and `headerBackImage`.
