---
id: modal
title: Opening a full-screen modal
sidebar_label: Opening a full-screen modal
---

Dictionary.com provides no satisfactory definition of modal as it relates to user interfaces, but semantic UI describes it as follows:

> A modal displays content that temporarily blocks interactions with the main view

This sounds about right. A modal is like a popup &mdash; it's not part of your primary navigation flow &mdash; it usually has a different transition, a different way to dismiss it, and is intended to focus on one particular piece of content or interaction.

The purpose of explaining this as part of the React Navigation fundamentals is not only because this is a common use case, but also because the implementation requires knowledge of _nesting navigators_, which is an important part of React Navigation.

## Creating a modal stack

```js
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerLeft: (
        <Button
          onPress={() => navigation.navigate('MyModal')}
          title="Info"
          color="#fff"
        />
      ),
      /* the rest of this config is unchanged */
    };
  };

  /* render function, etc */
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    /* Same configuration as before */
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
```

<a href="https://snack.expo.io/@react-navigation/full-screen-modal-v3" target="blank" class="run-code-button">&rarr; Run this code</a>

There are some important things to notice here:

- As we know, the stack navigator function returns a React component (remember we render `<RootStack />` in our `App` component). This same component can be used as a screen component! By doing this, we are nesting a stack navigator inside of another stack navigator. In this case, this is useful for us because we want to use a different transition style for the modal, and we want to disable the header across the entire stack. In the future this will be important because for tab navigation, for example, each tab will likely have its own stack! Intuitively, this is what you expect: when you are on tab A and switch to tab B, you would like tab A to maintain its navigation state as you continue to explore tab B. Look at this diagram to visualize the structure of navigation in this example:
  ![tree diagram](/assets/modal/tree.png)
- The `mode` configuration for stack navigator can be either `card` (default) or `modal`. The `modal` behavior slides the screen in from the bottom on iOS and allows the user to swipe down from the top to dismiss it. The `modal` configuration has no effect on Android because full-screen modals don't have any different transition behavior on the platform.
- When we call `navigate` we don't have to specify anything except the route that we'd like to navigate to. There is no need to qualify which stack it belongs to (the arbitrarily named 'root' or the 'main' stack) &mdash; React Navigation attempts to find the route on the closest navigator and then performs the action there. To visualize this, look again at [this diagram](/assets/modal/tree.png) and imagine the `navigate` action flowing up from `HomeScreen` to `MainStack`, we know that `MainStack` can't handle the route `MyModal`, so it then flows it up to `RootStack`, which can handle that route and so it does.

  ## Summary

* To change the type of transition on a stack navigator you can use the `mode` configuration. When set to `modal`, all screens animate-in from bottom to top rather than right to left. This applies to that entire stack navigator, so to use right to left transitions on other screens, we add another navigation stack with the default configuration.
* `this.props.navigation.navigate` traverses up the navigator tree to find a navigator that can handle the `navigate` action.
* [Full source of what we have built so far](https://snack.expo.io/@react-navigation/full-screen-modal-v3)
