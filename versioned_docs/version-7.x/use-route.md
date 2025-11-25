---
id: use-route
title: useRoute
sidebar_label: useRoute
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`useRoute` is a hook which gives access to `route` object. It's useful when you cannot pass down the `route` object from props to the component, or don't want to pass it in case of a deeply nested child.

`useRoute()` returns the `route` object of the screen it's inside.

## Example

```js name="useRoute hook" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// codeblock-focus-start
import { useRoute } from '@react-navigation/native';

function MyText() {
  // highlight-next-line
  const route = useRoute();

  return <Text>{route.params.caption}</Text>;
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the home screen of the app</Text>
      <Button
        onPress={() => {
          navigation.navigate('Profile', { caption: 'Some caption' });
        }}
      >
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <MyText />
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

Check how to setup `useRoute` with TypeScript [here](typescript.md#annotating-useroute).

See the documentation for the [`route` object](route-object.md) for more info.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class MyText extends React.Component {
  render() {
    // Get it from props
    const { route } = this.props;
  }
}

// Wrap and export
export default function (props) {
  const route = useRoute();

  return <MyText {...props} route={route} />;
}
```
