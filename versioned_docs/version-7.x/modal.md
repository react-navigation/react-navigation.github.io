---
id: modal
title: Opening a modal
sidebar_label: Opening a modal
---

![Modal shown on screen](/assets/modal/modal-demo.gif)

A modal displays content that temporarily blocks interactions with the main view.

A modal is like a popup &mdash; it usually has a different transition animation, and is intended to focus on one particular interaction or piece of content.

## Creating a stack with modal screens

<samp id="modal" />

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

const RootStack = createStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator>
      <RootStack.Group>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Details" component={DetailsScreen} />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name="MyModal" component={ModalScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
```

Here, we are creating 2 groups of screens using the `RootStack.Group` component. The first group is for our regular screens, and the second group is for our modal screens. For the modal group, we have specified `presentation: 'modal'` in `screenOptions`. This will apply this option to all the screens inside the group. This option will change the animation for the screens to animate from bottom-to-top rather than right to left. The `presentation` option for stack navigator can be either `card` (default) or `modal`. The `modal` behavior slides the screen in from the bottom and allows the user to swipe down from the top to dismiss it on iOS.

Instead of specifying this option for a group, it's also possible to specify it for a single screen using the `options` prop on `RootStack.Screen`.

## Summary

- To change the type of transition on a stack navigator you can use the `presentation` option.
- When `presentation` is set to `modal`, the screens behave like a modal, i.e. they have a bottom to top transition and may show part of the previous screen in the background.
- Setting `presentation: 'modal'` on a group makes all the screens in the group modals, so to use non-modal transitions on other screens, we add another group with the default configuration.

## Best practices

Since modals are intended to be on top of other content, there are a couple of things to keep in mind when using modals:

- Avoid nesting them inside other navigators like tab or drawer. Modal screens should be defined as part of the root stack.
- Modal screens should be the last in the stack - avoid pushing regular screens on top of modals.
- The first screen in a stack appears as a regular screen even if configured as a modal, since there is no screen before it to show behind. So always make sure that modal screens are pushed on top of a regular screen or another modal screen.
