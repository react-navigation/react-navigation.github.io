---
id: custom-android-back-button-handling
title: Custom Android back button behavior
sidebar_label: Custom Android back button behavior
---

By default, when user presses the Android hardware back button, react-navigation will pop a screen or exit the app if there are no screens to pop. This is a sensible default behavior, but there are situations when you might want to implement custom handling.

> If you're looking for an easy-to-use solution, you can check out a community-developed package [react-navigation-backhandler](https://github.com/vonovak/react-navigation-backhandler). The following text shows what the package does under the cover.

As an example, consider a screen where user is selecting items in a list, and a "selection mode" is active. On a back button press, you would first want the "selection mode" to be deactivated, and the screen should be popped only on the second back button press. The following code snippet demonstrates the situation. We make use of [`BackHandler`](https://reactnative.dev/docs/backhandler.html) which comes with react-native and we [subscribe to navigation lifecycle updates](navigation-prop.md#addlistener-subscribe-to-updates-to-navigation-lifecycle) to add our custom `hardwareBackPress` listener.

Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event, and react-navigation's listener will not get called, thus not popping the screen. Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.

```
import React from "react";
import { BackHandler } from "react-native";

class ScreenWithCustomBackBehavior extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  componentDidMount() {
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

At first, you may be inclined to use `componentDidMount` to subscribe for the back press event and `componentWillUnmount` to unsubscribe. This approach will not work - learn more about this in [navigation lifecycle](navigation-lifecycle.md).
