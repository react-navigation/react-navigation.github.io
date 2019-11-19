---
id: version-4.x-custom-android-back-button-handling
title: Custom Android back button behavior
sidebar_label: Custom Android back button behavior
original_id: custom-android-back-button-handling
---

By default, when user presses the Android hardware back button, react-navigation will pop a screen or exit the app if there are no screens to pop. This is a sensible default behavior, but there are situations when you might want to implement custom handling.

As an example, consider a screen where user is selecting items in a list, and a "selection mode" is active. On a back button press, you would first want the "selection mode" to be deactivated, and the screen should be popped only on the second back button press. The following code snippet demonstrates the situation. We make use of [`BackHandler`](https://facebook.github.io/react-native/docs/backhandler.html) which comes with react-native and add additional check (`navigation.isFocused()`) to make sure that our code only gets executed if the screen is focused.

Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event, and react-navigation's listener will not get called, thus not popping the screen. Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.

```js
import React from 'react';
import { BackHandler } from 'react-native';

class ScreenWithCustomBackBehavior extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonPressAndroid
    );
  }

  handleBackButtonPressAndroid = () => {
    if (!this.props.navigation.isFocused()) {
      // The screen is not focused, so don't do anything
      return false;
    }

    if (this.isSelectionModeEnabled()) {
      this.disableSelectionMode();

      // We have handled the back button
      // Return `true` to prevent react-navigation from handling it
      return true;
    } else {
      return false;
    }
  };

  render() {
    // ...
  }
}
```

The presented approach will work well for screens that are shown in a `StackNavigator`. Custom back button handling in other situations may not be supported at the moment (eg. A known case when this does not work is when you want to handle back button press in an open drawer. PRs for such use cases are welcome!).
