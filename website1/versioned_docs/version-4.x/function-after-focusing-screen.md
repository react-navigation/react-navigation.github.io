---
id: version-4.x-function-after-focusing-screen
title: Call a function when focused screen changes
sidebar_label: Call a function when focused screen changes
original_id: function-after-focusing-screen
---

In this guide we will call a function on screen focusing. This is useful for making additional API calls when a user revisits a particular screen in a Tab Navigator, or to track user events as they tap around our app.

There are two approaches available to us:

1. Using the `withNavigationFocus` higher order component provided by react-navigation.
2. Listening to the `'didFocus'` event with an event listener.

## Triggering an action with the `withNavigationFocus` higher order component

react-navigation provides a [higher order component](https://reactjs.org/docs/higher-order-components.html) that passes an `isFocused` prop to our component, along with the `navigation` object we'd normally get with `withNavigation`.

When the `isFocused` prop is passed to our component, it will pass `true` when the screen is focused and `false` when our component is no longer focused. This enables us to call actions on a user entering or leaving a screen. This is particularly handy when we are trying to stop something when the page is unfocused, like stopping a video or audio file from playing, or stopping the tracking of a user's location.

Since `withNavigationFocus` passes a prop on every focus change, it will cause our component to re-render when we focus and unfocus a screen. Using this higher order component may introduce unnecessary component re-renders as a screen comes in and out of focus. This could cause issues depending on the type of action we're calling on focusing.

For instance, if we are attempting to make an API call on focus to fetch some data, we only want to fetch data when the component is focused and not when the component becomes unfocused. To prevent extra component re-renders, we could write some logic in `shouldComponentUpdate` to control when the component renders itself, however we may be better off using the event listener method detailed below. The event listener will only call an action and render the component when the screen is focused and will do nothing when a screen becomes unfocused.

### Example

```js
import React, { Component } from 'react';
import { View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';

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

This example is also documented in the <a href="/docs/en/with-navigation-focus.html">`withNavigationFocus` API documentation</a>.

## Triggering an action with a `'didFocus'` event listener

We can also listen to the `'didFocus'` event with an event listener. After setting up an event listener, we must also stop listening to the event when the screen is unmounted.

With this approach, we will only be able to call an action when the screen focuses. This is great for fetching data with an API call when a screen becomes focused, or any other action that needs to happen once the screen comes into view.

### Example

```js
import React, { Component } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';

class TabScreen extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
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
