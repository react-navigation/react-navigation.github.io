---
id: getting-started
title: Getting Started with StackNavigator
sidebar_label: Getting Started with StackNavigator
---

To get started using React Navigation we will create a simple `StackNavigator`.

`StackNavigator` provides a way for your app to transition between screens and keep track of navigation history. If your app uses only one `StackNavigator` then it is conceptually similar to how a browser handles your navigation state: when you visit a new page, it gets pushed to the history stack, and when you press back, the most recent item is "popped" off of the stack and the page you were on before it is now active. A key difference is that React Navigation's `StackNavigator` provides the gestures and animations that you would expect on Android and iOS when navigating between routes in the stack.

## Creating a StackNavigator

`StackNavigator` is a function that returns a React component. It takes _a route configuration object_ and, optionally, _an options object_ (we omit this below). Because it returns a React component, we can export it directly from App.js to be used as our App's root component.

```javascript
// In App.js in a new project

import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
});
```

It's often useful to have more control over the component at the root of your app, so let's wrap it in another component instead of exporting it directly.

```js
const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
```

The `<RootStack />` component doesn't accept any props -- all configuration is specified in the _options_ parameter to the `StackNavigator` fuction. To see an example of this, we will add a second screen.

```js
class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);
```

<!-- We can then add screens to this `StackNavigator`. Each key represents a screen.

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Details: {
    screen: DetailsScreen,
  },
});

export default RootNavigator;
```

Now let's add a title to the navigation bar.

```javascript
...

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerTitle: 'Details',
    },
  },
});

export default RootNavigator;
```

Finally, we should be able to navigate from the home screen to the details screen. When you register a component with a navigator that component will then have a `navigation` prop added to it. This `navigation` prop drives how we move between different screens.

To move from the home screen to the details screen we'll want to use `this.props.navigation.navigate`, like so:

```javascript
import { View, Text, Button } from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Details')}
          title="Go to details"
        />
      </View>
    )
  }
}
);
```

And there you have it! That's the basics of using the [StackNavigator](/docs/navigators/stack), and React Navigation as a whole. Here's the full code from this example:

<div class="snack" data-snack-id="HJlnU0XTb" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div> -->
