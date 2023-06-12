# Animating elements between screens

This guide covers how to animate elements between screens. This feature is known as a [Shared Element Transition](https://docs.swmansion.com/react-native-reanimated/docs/api/sharedElementTransitions) and it's implemented in the native stack with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/).

Before continuing, make sure to install and configure [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

> Note: Shared Element Transitions require React Native Reanimated v3.0.0 or higher and as of writing this guide it's considered an experimental feature not recommended for production use.

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/shared-element-transitions/shared-element-transitions.mp4" />
  </video>
</div>

## Minimal example

To create a shared transition, simply assign the same `sharedTransitionTag` to elements on different screens in a native stack. This prop is a string that uniquely identifies an element between screens. Similarly to the [`key`](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) property, which tells React which element in the list is which, `sharedElementTag` allows Reanimated to identify and animate elements. Components that you'd like to animate have to be `Animated` versions imported from `react-native-reanimated`. The animation will start automatically when you navigate between screens.

```jsx
import * as React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Animated from 'react-native-reanimated';

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

## Customizing the transition

By default, the transition animates the `width`, `height`, `originX`, `originY` and `transform` properties using `withTiming` with a 500 ms duration. You can easily customize `width`, `height`, `originX`, and `originY` props. Customizing `transform` is also possible but it's far beyond the scope of this guide.

> Note: Custom SharedTransition API is not finalized and might change in a future release.

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

You can find a full Shared Element Transitions reference in the [React Native Reanimated documentation](https://docs.swmansion.com/react-native-reanimated/docs/api/sharedElementTransitions).

## Alternatives

Alternatively, you can use [`react-native-shared-element`](https://github.com/IjzerenHein/react-native-shared-element) library with a [React Navigation binding](https://github.com/IjzerenHein/react-navigation-shared-element) which implements Shared Element Transitions in a JS-based Stack navigator. This solution, however, isn't actively maintained.

The [`react-native-navigation`](https://github.com/wix/react-native-navigation) also comes with support for Shared Element Transitions. You can read more about it [here](https://wix.github.io/react-native-navigation/docs/style-animations#shared-element-transitions).
