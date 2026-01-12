---
id: header-buttons
title: Header buttons
sidebar_label: Header buttons
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Now that we know how to customize the look of our headers, let's make them interactive!

## Adding a button to the header

The most common way to interact with a header is by tapping a button to the left or right of the title. Let's add a button to the right side of the header:

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

When we define our button this way, you can't access or update the screen component's state in it. This is pretty important because it's common to want the buttons in your header to interact with the screen that the header belongs to. So, we will look how to do this next.

## Header interaction with its screen component

To make header buttons interact with screen state, we can use [`navigation.setOptions`](navigation-object.md#setoptions) inside the screen component:

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

Here we update `headerRight` with a button that has `onPress` handler that can access and update the component's state, since it's defined inside the component.

## Customizing the back button

The back button is rendered automatically in a stack navigator whenever there another screen to go back to.

The native stack navigator provides platform-specific defaults for this back button. On older iOS versions, this may includes a label next to the button showing the previous screen's title when space allows.

You can customize the back button using various options such as:

- `headerBackTitle`: Change the back button label (iOS)
- `headerBackTitleStyle`: Style the back button label
- `headerBackIcon`: Custom back button icon

```js static2dynamic
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

![Header custom back](/assets/headers/header-back-custom.png)

If you want to customize it beyond what the above options allow, you can use `headerLeft` to render your own component instead. The `headerLeft` option accepts a React Component, which you can use to override the onPress behavior or replace the button entirely. See the [API reference](native-stack-navigator.md#headerleft) for details.

## Summary

- Buttons can be added to the header using [`headerLeft`](elements.md#headerleft) and [`headerRight`](elements.md#headerright) in [`options`](screen-options.md)
- The back button can be customized with [`headerBackTitle`](native-stack-navigator.md#headerbacktitle), [`headerBackTitleStyle`](native-stack-navigator.md#headerbacktitlestyle), [`headerBackIcon`](native-stack-navigator.md#headerbackicon), or replaced entirely with `headerLeft`
- To make header buttons interact with screen state, use [`navigation.setOptions`](navigation-object.md#setoptions) inside the screen component
