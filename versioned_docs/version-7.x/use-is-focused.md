---
id: use-is-focused
title: useIsFocused
sidebar_label: useIsFocused
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

We might want to render different content based on the current focus state of the screen. The library exports a `useIsFocused` hook to make this easier:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="useIsFocused hook" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// codeblock-focus-start
import { useIsFocused } from '@react-navigation/native';

function ProfileScreen() {
  // This hook returns `true` if the screen is focused, `false` otherwise
  // highlight-next-line
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const Tab = createMaterialTopTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(Tab);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="useIsFocused hook" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// codeblock-focus-start
import { useIsFocused } from '@react-navigation/native';

function ProfileScreen() {
  // This hook returns `true` if the screen is focused, `false` otherwise
  // highlight-next-line
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
    </View>
  );
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Note that using this hook triggers a re-render for the component when the screen it's in changes focus. This might cause lags during the animation if your component is heavy. You might want to extract the expensive parts to separate components and use [`React.memo`](https://react.dev/reference/react/memo) or [`React.PureComponent`](https://react.dev/reference/react/PureComponent) to minimize re-renders for them.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class Profile extends React.Component {
  render() {
    // Get it from props
    const { isFocused } = this.props;
  }
}

// Wrap and export
export default function (props) {
  const isFocused = useIsFocused();

  return <Profile {...props} isFocused={isFocused} />;
}
```
