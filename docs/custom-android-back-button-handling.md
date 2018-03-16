---
id: custom-android-back-button-handling
title: Custom Android back button behavior
sidebar_label: Custom Android back button behavior
---

By default, when user presses the Android hardware back button, react-navigation will pop a screen or exit the app if there are no screens to pop. This is a sensible default behavior, but there are situations when you might want to implement custom handling.

If you're looking for an easy-to-use solution, you can check out a community-developed package [react-navigation-backhandler](https://github.com/vonovak/react-navigation-backhandler). The following text will show you how the package actually works under the cover.

As an example, consider a screen where user is selecting items in a list, and a "selection mode" is active. On a back button press, you would first want the "selection mode" to be deactivated, and the screen should be popped only on the second back button press. The following code snippet demostrates the situation. We make use of [`BackHandler`](https://facebook.github.io/react-native/docs/backhandler.html) which comes with react-native and we [subscribe to navigation lifecycle updates](navigation-prop.html#addlistener-subscribe-to-updates-to-navigation-lifecycle) to add our custom `hardwareBackPress` listener.

Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event, and react-navigation's listener will not get called, thus not popping the screen. Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.

```
class ScreenWithCustomBackBehavior extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  componentDidMount() {
    this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    if (this.isSelectionModeEnabled()) {
      this.disableSelectionMode();
      return true;
    } else {
      return false;
    }
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    // ...
  }
}
```

The presented approach will work well for screens that are shown in a `StackNavigator`. Custom back button handling in other situations may not be supported at the moment (eg. A known case when this does not work is when you want to handle back button press in an open drawer. PRs for such use cases are welcome!).

### Why not use component lifecycle methods?

At first, you may be inclined to use `componentDidMount` to subscribe for the back press event and `componentWillUnmount` to unsubscribe. Reason why we do not use them is that they are not generally called when entering or leaving a screen.

More specifically, consider a `StackNavigator` with screens `A` and `B`. After navigating to `A`, its `componentDidMount` is called. When pushing `B`, its `componentDidMount` is also called, but `A` remains mounted and its `componentWillUnmount` is therefore not called.

Similarly, when going back from `B` to `A`, `componentWillUnmount` of `B` is called, but `componentDidMount` of `A` is not because `A` remained mounted the whole time.
