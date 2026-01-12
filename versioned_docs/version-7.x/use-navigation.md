---
id: use-navigation
title: useNavigation
sidebar_label: useNavigation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`useNavigation` is a hook that gives access to `navigation` object. It's useful when you cannot pass the `navigation` object as a prop to the component directly, or don't want to pass it in case of a deeply nested child.

The `useNavigation` hook returns the `navigation` object of the screen where it's used:

```js name="useNavigation hook" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// codeblock-focus-start
import { useNavigation } from '@react-navigation/native';

function MyBackButton() {
  // highlight-next-line
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        navigation.goBack();
      }}
    >
      Back
    </Button>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the home screen of the app</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <MyBackButton />
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  return <Navigation />;
}

export default App;
```

Check how to setup `useNavigation` with TypeScript [here](typescript.md#annotating-usenavigation).

See the documentation for the [`navigation` object](navigation-object.md) for more info.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class MyBackButton extends React.Component {
  render() {
    // Get it from props
    const { navigation } = this.props;
  }
}

// Wrap and export
export default function (props) {
  const navigation = useNavigation();

  return <MyBackButton {...props} navigation={navigation} />;
}
```
