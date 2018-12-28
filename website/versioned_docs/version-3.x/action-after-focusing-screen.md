---
id: version-3.x-action-after-focusing-screen
title: Call an Action After Focusing Screen
sidebar_label: Action After Focusing Screen
original_id: action-after-focusing-screen
---

In this guide, we will call an action on screen focusing. This is useful for making additional API calls when a user visits a particular screen in a Tab Navigator, or to track user events as they tap around our app.

There are two approaches to calling an action on screen focusing:

1. Using the `withNavigationFocus` higher order component provided by react-navigation.
2. Listening to the `'didFocus'` event with an event listener.

## Triggering an action with a higher order component

react-navigation provides a [higher order component](https://reactjs.org/docs/higher-order-components.html) that passes a `isFocused` to our component, along with the `navigation` object we'd normally get with `withNavigation`.

When the prop `isFocused` is passed to our component, it will pass `true` when the screen is focused and `false` when our component is no longer focused. This enables us to call functions on a user entering or leaving a screen.

### Example

```js
import React, { Component } from "react";
import { View } from "react-native";
import { withNavigationFocus } from "react-navigation";

class TabScreen extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      // Use the `this.props.isFocused` boolean
      // Call any action
    }
  }

  render() {
    return <View />;
  }
}

// withNavigationFocus returns a component that wraps TabScreen and passes
// in the navigation prop
export default withNavigationFocus(TabScreen);
```

This example is also documented in the `withNavigationFocus` API documentation.

## Triggering an action with an event listener

We can also listen to the `'didFocus'` event with an event listener. After setting up an event listener, we must also stop listening to the event when the screen is unmounted.

With this approach, we will only be able to call an action when the screen focuses.

### Example

```js
import React, { Component } from "react";
import { View } from "react-native";
import { withNavigation } from "react-navigation";

class TabScreen extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  render() {
    return <View />;
  }
}

export default withNavigation(TabScreen);
```
