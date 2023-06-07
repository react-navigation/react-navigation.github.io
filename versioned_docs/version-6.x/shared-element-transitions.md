# Animating elements between screens

This guide covers how to animate elements between screens. This feature is known as a [Shared Element Transition](https://docs.swmansion.com/react-native-reanimated/docs/api/sharedElementTransitions) and it's implemented in the native stack with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/).

> Note: Shared Element Transitions require React Native Reanimated v3.0.0 or higher and as of writing this guide it's considered an experimental feature not recommended for production use.

To create a shared transition, simply assign the same `sharedTransitionTag` to elements on different screens in the same native stack. This prop is a string that uniquely identifies an element. Like the [`key`](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) property, that tells React which element in the list is which, `sharedElementTag` allows Reanimated to identify and animate elements between screens.

```jsx
import * as React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';

const uri = 'https://picsum.photos/id/39/200';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Animated.Image
        source={{ uri }}
        style={{ width: 300, height: 300 }}
        sharedTransitionTag="tag2"
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Animated.Image
        source={{ uri }}
        style={{ width: 100, height: 100 }}
        sharedTransitionTag="tag2"
      />
    </View>
  );
}
const Stack = createNativeStackNavigator();

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

Animation will automatically start when you navigate between screens.

Alternatively based on [`react-native-shared-element`](https://github.com/IjzerenHein/react-native-shared-element) which came with a [React Navigation binding](https://github.com/IjzerenHein/react-navigation-shared-element).
