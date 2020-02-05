---
id: version-5.x-modal
title: Opening a full-screen modal
sidebar_label: Opening a full-screen modal
original_id: modal
---

![Modal shown on screen](/docs/assets/modal/modal-demo.gif)

A modal displays content that temporarily blocks interactions with the main view.

A modal is like a popup &mdash; it's not part of your primary navigation flow &mdash; it usually has a different transition, a different way to dismiss it, and is intended to focus on one particular piece of content or interaction.

<!-- Often these modals don't take up the entire screen (you can read more about that in the [Partial overlays section](partial-overlay.html)), but in this case we'll talk about modals that take up the user's entire screen. -->

The purpose of explaining this as part of the React Navigation fundamentals is not only because this is a common use case, but also because the implementation requires knowledge of [nesting navigators](nesting-navigators.html), which is an important part of React Navigation.

## Creating a modal stack

<samp id="full-screen-modal">modal stack</samp>

```js
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('MyModal')}
        title="Open Modal"
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View>
      <Text>Details</Text>
    </View>
  );
}

function ModalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Details" component={DetailsScreen} />
    </MainStack.Navigator>
  );
}

function RootStackScreen() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Main"
        component={MainStackScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="MyModal" component={ModalScreen} />
    </RootStack.Navigator>
  );
}
```

There are some important things to notice here:

- We are using our `MainStackScreen` component as a screen inside `RootStackScreen`! By doing this, we are nesting a stack navigator inside of another stack navigator. In this case, this is useful for us because we want to use a different transition style for the modal. Since `RootStackScreen` renders a stack navigator and has its own header, we also want to hide the header for this screen. In the future this will be important because for tab navigation, for example, each tab will likely have its own stack! Intuitively, this is what you expect: when you are on tab A and switch to tab B, you would like tab A to maintain its navigation state as you continue to explore tab B. Look at [this diagram](/docs/assets/modal/tree.png) to visualize the structure of navigation in this example.
- The `mode` prop for stack navigator can be either `card` (default) or `modal`. The `modal` behavior slides the screen in from the bottom on iOS and allows the user to swipe down from the top to dismiss it. The `modal` prop has no effect on Android because full-screen modals don't have any different transition behavior on the platform.
- When we call `navigate` we don't have to specify anything except the route that we'd like to navigate to. There is no need to qualify which stack it belongs to (the arbitrarily named 'root' or the 'main' stack) &mdash; React Navigation attempts to find the route on the closest navigator and then performs the action there. To visualize this, look again at [this diagram](/docs/assets/modal/tree.png) and imagine the `navigate` action flowing up from `HomeScreen` to `MainStack`, we know that `MainStack` can't handle the route `MyModal`, so it then flows it up to `RootStack`, which can handle that route and so it does.

## Summary

- To change the type of transition on a stack navigator you can use the `mode` prop. When set to `modal`, all screens animate-in from bottom to top rather than right to left. This applies to that entire stack navigator, so to use right to left transitions on other screens, we add another navigation stack with the default configuration.
- `navigation.navigate` traverses up the navigator tree to find a navigator that can handle the `navigate` action.
