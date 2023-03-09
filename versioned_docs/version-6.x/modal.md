---
id: modal
title: Opening a modal
sidebar_label: Opening a modal
---

A modal displays content that temporarily blocks interactions with the main view.

A modal is like a popup &mdash; it's not part of your primary navigation flow &mdash; it usually has a different transition, a different way to dismiss it, and is intended to focus on one particular piece of content or interaction.

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

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop style={{ maxWidth: '280px' }}>
    <source src="/assets/modal/modal.mp4" />
  </video>
</div>

Here, we are creating 2 groups of screens using the `RootStack.Group` component. The first group is for our regular screens, and the second group is for our modal screens. For the modal group, we have specified `presentation: 'modal'` in `screenOptions`. This will apply this option to all the screens inside the group. This option will change the animation for the screens to animate from bottom-to-top rather than right to left. The `presentation` option for stack navigator can be either `card` (default) or `modal`. The `modal` behavior slides the screen in from the bottom and allows the user to swipe down from the top to dismiss it on iOS.

Instead of specifying this option for a group, it's also possible to specify it for a single screen using the `options` prop on `RootStack.Screen`.

## Summary

- To change the type of transition on a stack navigator you can use the `presentation` option. When set to `modal`, all modal screens animate-in from bottom to top rather than right to left by default. This applies to that entire group, so to use non-modal transitions on other screens, we add another group with the default configuration.
