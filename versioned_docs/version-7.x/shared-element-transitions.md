---
id: shared-element-transitions
title: Animating elements between screens
sidebar_label: Animating elements between screens
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide covers how to animate elements between screens. This feature is known as a [Shared Element Transition](https://docs.swmansion.com/react-native-reanimated/docs/api/sharedElementTransitions) and it's implemented in the [`@react-navigation/native-stack`](native-stack-navigator.md) with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/).

:::warning

As of writing this guide, Shared Element Transitions are considered an experimental feature not recommended for production use.

:::

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/shared-element-transitions/shared-element-transitions.mp4" />
  </video>
</div>

## Pre-requisites

Before continuing this guide make sure your app meets these criteria:

- You are using [`@react-navigation/native-stack`](native-stack-navigator.md). The Shared Element Transitions feature isn't supported in JS-based [`@react-navigation/stack`](stack-navigator.md).
- You have [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) **v3.0.0 or higher** installed and configured.

## Minimal example

To create a shared transition:

1. Use `Animated` components imported from `react-native-reanimated`.
2. Assign the same `sharedTransitionTag` to elements on different screens.
3. Navigate between screens. The transition will start automatically.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Shared transition"
import * as React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Animated from 'react-native-reanimated';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/200' }}
        style={{ width: 300, height: 300 }}
        // highlight-next-line
        sharedTransitionTag="tag"
      />
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/200' }}
        style={{ width: 100, height: 100 }}
        // highlight-next-line
        sharedTransitionTag="tag"
      />
    </View>
  );
}

// highlight-start
const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});
// highlight-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Shared transition"
import * as React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Animated from 'react-native-reanimated';

// highlight-next-line
const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/200' }}
        style={{ width: 300, height: 300 }}
        // highlight-next-line
        sharedTransitionTag="tag"
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/200' }}
        style={{ width: 100, height: 100 }}
        // highlight-next-line
        sharedTransitionTag="tag"
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
```

</TabItem>
</Tabs>

`sharedTransitionTag` is a string that has to be unique in the context of a single screen, but has to match elements between screens. This prop allows Reanimated to identify and animate the elements, similarly to the [`key`](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) property, which tells React which element in the list is which.

## Customizing the transition

By default, the transition animates the `width`, `height`, `originX`, `originY` and `transform` properties using `withTiming` with a 500 ms duration. You can easily customize `width`, `height`, `originX`, and `originY` props. Customizing `transform` is also possible but it's far beyond the scope of this guide.

:::warning

Custom SharedTransition API is not finalized and might change in a future release.

:::

To customize the transition you need to pass all the properties besides `transform`.

```jsx
import { SharedTransition } from 'react-native-reanimated';

const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});

function HomeScreen() {
  return (
    <Animated.Image
      style={{ width: 300, height: 300 }}
      sharedTransitionTag="tag"
      // highlight-next-line
      sharedTransitionStyle={customTransition} // add this to both elements on both screens
    />
  );
}
```

## Reference

You can find a full Shared Element Transitions reference in the [React Native Reanimated documentation](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/).

## Alternatives

Alternatively, you can use [`react-native-shared-element`](https://github.com/IjzerenHein/react-native-shared-element) library with a [React Navigation binding](https://github.com/IjzerenHein/react-navigation-shared-element) which implements Shared Element Transitions in a JS-based `@react-navigation/stack` navigator. This solution, however, isn't actively maintained.

The [`react-native-navigation`](https://github.com/wix/react-native-navigation) also comes with support for Shared Element Transitions. You can read more about it [here](https://wix.github.io/react-native-navigation/docs/style-animations#shared-element-transitions).
