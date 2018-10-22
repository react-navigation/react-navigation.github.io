---
id: version-1.x-with-navigation-focus
title: withNavigationFocus
sidebar_label: withNavigationFocus
original_id: with-navigation-focus
---

`withNavigationFocus` is a higher order component which passes the `isFocused` prop into a wrapped component. It's useful if you need to use the focus state in the render function of your screen component or another component rendered somewhere inside of a screen.

* `withNavigationFocus(Component)` returns a component.

## Example

```js
import React from 'react';
import { Text } 'react-native';
import { withNavigationFocus } from 'react-navigation';

class FocusStateLabel extends React.Component {
  render() {
    return <Text>{this.props.isFocused ? 'Focused' : 'Not focused'}</Text>;
  }
}

// withNavigationFocus returns a component that wraps FocusStateLabel and passes
// in the navigation prop
export default withNavigationFocus(FocusStateLabel);
```
