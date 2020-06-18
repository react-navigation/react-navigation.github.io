---
id: status-bar
title: Different status bar configuration based on route
sidebar_label: Different status bar configuration based on route
---

If you don't have a navigation header, or your navigation header changes color based on the route, you'll want to ensure that the correct color is used for the content.

## Stack and drawer navigators

This is a simple task when using a stack or drawer. You can simply render the `StatusBar` component, which is exposed by React Native, and set your config.

```jsx
class Screen1 extends React.Component {
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
        <Text style={[styles.paragraph, { color: '#fff' }]}>Light Screen</Text>
        <Button
          title="Next screen"
          onPress={() => this.props.navigation.navigate('Screen2')}
          color={isAndroid ? 'blue' : '#fff'}
        />
      </SafeAreaView>
    );
  }
}

class Screen2 extends React.Component {
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
        <Text style={styles.paragraph}>Dark Screen</Text>
        <Button
          title="Next screen"
          onPress={() => this.props.navigation.navigate('Screen1')}
        />
      </SafeAreaView>
    );
  }
}
```

```jsx
export default createStackNavigator(
  {
    Screen1: {
      screen: Screen1,
    },
    Screen2: {
      screen: Screen2,
    },
  },
  {
    headerMode: 'none',
  }
);
```

![StackNavigator with different StatusBar configs](/assets/statusbar/statusbar-stack-demo.gif)

```jsx
export default createDrawerNavigator({
  Screen1: {
    screen: Screen1,
  },
  Screen2: {
    screen: Screen2,
  },
});
```

![DrawerNavigator with different StatusBar configs](/assets/statusbar/statusbar-drawer-demo.gif)

## Tabs and Drawer

If you're using a tab or drawer navigator, it's a bit more complex because all of the screens in the navigator might be rendered at once and kept rendered - that means that the last `StatusBar` config you set will be used (likely on the final tab of your tab navigator, not what the user is seeing).

To fix this, we'll have to do make the status bar component aware of screen focus and render it only when the screen is focused. We can achieve this by using the [`withNavigationFocus` HOC](with-navigation-focus.md) and creating a wrapper component:

```js
import * as React from 'react';
import { StatusBar } from 'react-native';
import { withNavigationFocus } from 'react-navigation';

const FocusAwareStatusBar = withNavigationFocus(({ isFocused, ...rest }) =>
  isFocused ? <StatusBar {...rest} /> : null
);
```

Now, our screens (both `Screen1.js` and `Screen2.js`) will use the `FocusAwareStatusBar` component instead of the `StatusBar` component from React Native:

```jsx
class Screen1 extends React.Component {
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#6a51ae"
        />
        <Text style={[styles.paragraph, { color: '#fff' }]}>Light Screen</Text>
        <Button
          title="Next screen"
          onPress={() => this.props.navigation.navigate('Screen2')}
          color={isAndroid ? 'blue' : '#fff'}
        />
      </SafeAreaView>
    );
  }
}

class Screen2 extends React.Component {
  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
        <FocusAwareStatusBar
          barStyle="dark-content"
          backgroundColor="#ecf0f1"
        />
        <Text style={styles.paragraph}>Dark Screen</Text>
        <Button
          title="Next screen"
          onPress={() => this.props.navigation.navigate('Screen1')}
        />
      </SafeAreaView>
    );
  }
}
```

Although not necessary, you can use the `FocusAwareStatusBar` component in the screens of the stack navigator as well.

![TabNavigator with different StatusBar configs](/assets/statusbar/statusbar-tab-demo.gif)
