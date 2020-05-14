---
id: use-theme
title: useTheme
sidebar_label: useTheme
---

The `useTheme` hook let's us access the currently active theme. You can use it in your own components to have them respond to changes in the theme.

<samp id="system-themes" />

```js
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Black background and white text in light theme, inverted on dark theme
function MyButton() {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}
```

See [theming guide](themes.md) for more details and usage guide around how to configure themes.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class MyButton extends React.Component {
  render() {
    // Get it from props
    const { theme } = this.props;
  }
}

// Wrap and export
export default function(props) {
  const theme = useTheme();

  return <MyButton {...props} theme={theme} />;
}
```
