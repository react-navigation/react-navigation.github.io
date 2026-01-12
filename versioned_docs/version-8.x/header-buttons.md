---
id: header-buttons
title: Header buttons
sidebar_label: Header buttons
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Now that we know how to customize the look of our headers, let's make them sentient! Actually perhaps that's ambitious, let's just make them able to respond to our touches in very well-defined ways.

## Adding a button to the header

The most common way to interact with a header is by tapping on a button either to the left or the right of the title. Let's add a button to the right side of the header (one of the most difficult places to touch on your entire screen, depending on finger and phone size, but also a normal place to put buttons).

```js name="Header button" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const MyStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
      options: {
        // highlight-start
        headerRight: () => (
          <Button onPress={() => alert('This is a button!')}>Info</Button>
        ),
        // highlight-end
      },
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

![Header button](/assets/headers/header-button.png)

When we define our button this way, the `this` variable in `options` is _not_ the `HomeScreen` instance, so you can't call `setState` or any instance methods on it. This is pretty important because it's common to want the buttons in your header to interact with the screen that the header belongs to. So, we will look how to do this next.

:::tip

Note that a community-developed library for rendering buttons in the header with the correct styling is available: [react-navigation-header-buttons](https://github.com/vonovak/react-navigation-header-buttons).

:::

## Header interaction with its screen component

In some cases, components in the header need to interact with the screen component. For this use case, we need to use `navigation.setOptions` to update our options. By using `navigation.setOptions` inside the screen component, we get access to screen's props, state, context etc.

```js name="Header button" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
function HomeScreen() {
  const navigation = useNavigation('Home');
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    // highlight-start
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount((c) => c + 1)}>Update count</Button>
      ),
    });
    // highlight-end
  }, [navigation]);

  return <Text>Count: {count}</Text>;
}

const MyStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
      options: {
        // Add a placeholder button without the `onPress` to avoid flicker
        // highlight-next-line
        headerRight: () => <Button>Update count</Button>,
      },
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop >
  <source src="/assets/headers/header-update-screen.mp4" />
</video>

Here we update the `headerRight` with a button with `onPress` handler that has access to the component's state and can update it.

## Customizing the back button

`createNativeStackNavigator` provides the platform-specific defaults for the back button. On iOS this includes a label next to the button, which shows the title of the previous screen when the title fits in the available space, otherwise it says "Back".

You can change the label behavior with `headerBackTitle` and style it with `headerBackTitleStyle` ([read more](native-stack-navigator.md#headerbacktitle)).

To customize the back button icon, you can use [`headerBackIcon`](native-stack-navigator.md#headerbackicon).

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerBackTitle: 'Custom Back',
        headerBackTitleStyle: { fontSize: 30 },
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen
    name="Details"
    component={DetailsScreen}
    options={{
      headerBackTitle: 'Custom Back',
      headerBackTitleStyle: { fontSize: 30 },
    }}
  />
</Stack.Navigator>
```

</TabItem>
</Tabs>

![Header custom back](/assets/headers/header-back-custom.png)

## Overriding the back button

The back button will be rendered automatically in a stack navigator whenever it is possible for the user to go back from their current screen &mdash; in other words, the back button will be rendered whenever there is more than one screen in the stack.

Generally, this is what you want. But it's possible that in some circumstances that you want to customize the back button more than you can through the options mentioned above, in which case you can set the `headerLeft` option to a React Element that will be rendered, just as we did with `headerRight`. Alternatively, the `headerLeft` option also accepts a React Component, which can be used, for example, for overriding the onPress behavior of the back button. Read more about this in the [api reference](native-stack-navigator.md#headerleft).

## Summary

- You can set buttons in the header through the [`headerLeft`](elements.md#headerleft) and [`headerRight`](elements.md#headerright) properties in [`options`](screen-options.md).
- The back button is fully customizable with `headerLeft`, but if you only want to change the title or image, there are other `options` for that &mdash; [`headerBackTitle`](native-stack-navigator.md#headerbacktitle), [`headerBackTitleStyle`](native-stack-navigator.md#headerbacktitlestyle), and [`headerBackIcon`](native-stack-navigator.md#headerbackicon).
- You can use a callback for the options prop to access [`navigation`](navigation-object.md) and [`route`](route-object.md) objects.
