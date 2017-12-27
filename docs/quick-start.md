# Quick Start Guide

To get started with React Navigation, all you have to do is install the `react-navigation` npm package.

### Install with NPM

```
npm install --save react-navigation
```

### Install with Yarn

```
yarn add react-navigation
```

To start using React Navigation we will create a `StackNavigator`. `StackNavigator` provides a way for your app to transition between screens where each new screen is placed on top of a stack.

## Creating a StackNavigator

StackNavigator's are the most common form of navigator so we'll use it as a basic demonstration. To get started, create a `StackNavigator`.

```javascript
import { StackNavigator } from 'react-navigation';

const RootNavigator = StackNavigator({

});

export default RootNavigator;
```

We can then add screens to this `StackNavigator`. Each key represents a screen.

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

const HomeScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const DetailsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
  </View>
);

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

To move from the home screen to the details screen we'll want to use `navigation.navigate`, like so:

```javascript
...
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
    <Button
      onPress={() => navigation.navigate('Details')}
      title="Go to details"
    />
  </View>
);

...
```

And there you have it! That's the basics of using the [StackNavigator](/docs/navigators/stack), and React Navigation as a whole. Here's the full code from this example:

<div class="snack" data-snack-id="HJlnU0XTb" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>