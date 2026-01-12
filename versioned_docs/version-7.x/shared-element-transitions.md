---
id: shared-element-transitions
title: Animating elements between screens
sidebar_label: Shared element transitions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide covers how to animate elements between screens. This feature is known as a [Shared Element Transition](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/) and it's implemented in the [`@react-navigation/native-stack`](native-stack-navigator.md) with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/).

:::warning

Shared Element Transitions are an experimental feature not recommended for production use yet.

**Architecture support:**

- **Reanimated 3** supports Shared Element Transitions on the **Old Architecture** (Paper).
- **Reanimated 4** supports them on the **New Architecture** (Fabric) since **4.2.0**, but the feature is behind a feature flag. You need to [enable the `ENABLE_SHARED_ELEMENT_TRANSITIONS` feature flag](https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags#enable_shared_element_transitions) to use it.

Check [the Reanimated documentation](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/) for details and [send feedback to the Reanimated team](https://github.com/software-mansion/react-native-reanimated)

:::

<video playsInline autoPlay muted loop>
  <source src="/assets/shared-element-transitions/shared-element-transitions.mp4" />
</video>

## Pre-requisites

Before continuing this guide make sure your app meets these criteria:

- You are using [`@react-navigation/native-stack`](native-stack-navigator.md). JS-based [`@react-navigation/stack`](stack-navigator.md) or other navigators are not supported.
- You have [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) **v3.0.0 or higher** installed and configured.
- If you are using **Reanimated 4** (New Architecture), you must [enable the `ENABLE_SHARED_ELEMENT_TRANSITIONS` feature flag](https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags#enable_shared_element_transitions).

## Minimal example

To create a shared transition:

1. Use `Animated` components imported from `react-native-reanimated`.
2. Assign the same `sharedTransitionTag` to elements on different screens.
3. Navigate between screens. The transition will start automatically.

```js static2dynamic name="Shared transition"
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

import Animated from 'react-native-reanimated';

// codeblock-focus-start
function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
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
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/200' }}
        style={{ width: 100, height: 100 }}
        // highlight-next-line
        sharedTransitionTag="tag"
      />
    </View>
  );
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

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

`sharedTransitionTag` is a string that has to be unique in the context of a single screen, but has to match elements between screens. This prop allows Reanimated to identify and animate the elements, similarly to the [`key`](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) property, which tells React which element in the list is which.

## Customizing the transition

You can customize the transition by passing a custom `SharedTransition` configuration via the `sharedTransitionStyle` prop. Apply the same `sharedTransitionStyle` to the matching element on the target screen.

Custom transition configuration is not fully finalized and might change in a future release.

<Tabs groupId="architecture" queryString="architecture">
<TabItem value="new" label="New Architecture (Reanimated 4)">

On the New Architecture, the default transition animates `width`, `height`, `originX`, `originY`, `transform`, `backgroundColor`, and `opacity` using `withTiming` with a 500 ms duration.

Currently customization is more limited due to ongoing development. You can't define fully custom animation functions. Instead, use the `SharedTransition` builder class to configure duration and spring-based animations:

```jsx
import { SharedTransition } from 'react-native-reanimated';

// Customize duration and use spring animation
// highlight-next-line
const customTransition = SharedTransition.duration(550).springify();

function HomeScreen() {
  return (
    <Animated.Image
      style={{ width: 300, height: 300 }}
      sharedTransitionTag="tag"
      // highlight-next-line
      sharedTransitionStyle={customTransition}
    />
  );
}
```

</TabItem>
<TabItem value="old" label="Old Architecture (Reanimated 3)" default>

By default, the transition animates `width`, `height`, `originX`, `originY`, and `transform` using `withTiming` with a 500 ms duration. You can customize the transition using `SharedTransition.custom()`:

```jsx
import { SharedTransition, withSpring } from 'react-native-reanimated';

// highlight-start
const customTransition = SharedTransition.custom((values) => {
  'worklet';

  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});
// highlight-end

function HomeScreen() {
  return (
    <Animated.Image
      style={{ width: 300, height: 300 }}
      sharedTransitionTag="tag"
      // highlight-next-line
      sharedTransitionStyle={customTransition}
    />
  );
}
```

</TabItem>
</Tabs>

## Reference

You can find a full Shared Element Transitions reference in the [React Native Reanimated documentation](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/).

## Limitations

Shared Element Transitions currently have several limitations to be aware of:

- Only the [native stack navigator](native-stack-navigator.md) is supported
- Other navigators such as JS stack, drawer, and bottom tabs are not supported
- Transitions with native modals don't work properly on iOS

### New Architecture specific limitations (Reanimated 4)

The following limitations apply specifically when using Reanimated 4 on the New Architecture:

- The feature must be enabled via the `ENABLE_SHARED_ELEMENT_TRANSITIONS` feature flag
- Custom animation functions are not supported; you can only customize duration and use spring-based animations
- Some properties (e.g., `backgroundColor`) are not supported in progress-based transitions (iOS back gesture)
- There are performance bottlenecks with transforms being recalculated too eagerly
- On iOS, you may encounter issues with vertical positioning due to header height information propagation

The limitations will be addressed in future Reanimated releases.
