---
id: custom-modal-dismissal
title: Customizing modal dismissal
sidebar_label: Customizing modal dismissal
---

Modals are an awesome way to present content to users, but what if our content doesn't all fit in one view on the screen? We reach for a scrollable view, such as a [ScrollView](https://facebook.github.io/react-native/docs/scrollview)! Let's look at an example:

```js
const Home = props => (
  <View>
    <Button
      onPress={() => props.navigation.navigate('Modal')}
      title="Press Me"
    />
  </View>
);

class Modal extends Component {
  render() {
    return (
      <ScrollView>
        <Text>{content}</Text>
      </ScrollView>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    Modal: {
      screen: Modal,
      navigationOptions: {
        gestureResponseDistance: {
          vertical: Dimensions.get('window').height,
        },
      },
    },
  },
  {
    mode: 'modal',
  }
);
```

<a href="https://snack.expo.io/@rgilbert/scrollable-modal-without-dismissal" target="blank" class="run-code-button">&rarr; Run this code</a>

This is great, but there's an issue that leads to poor user experience. Modals are usually dismissable with a swipe gesture, and in this case we want our modal to be dismissable by swiping down anywhere on the screen; this is done by expanding the gesture response distance to the full window height. However, this conflicts with our scrollable view &mdash; when a user swipes down on our content, the `ScrollView` unapologetically interprets this as a scroll, but we want the modal to be dismissed!

Luckily, there's an easy way for us to control how gestures on the `ScrollView` are interpreted, and that's by delegating gesture handling to React Navigation's gesture context. To take it one step further, we can control exactly _when_ to delegate handling &mdash; in this case, when the content in the scroll view is at the top of its window.

Phew, say gesture three times fast!

So, what do we need to do? We need to:
1. consume the `StackGestureContext` from `react-navigation-stack`
2. use the [`ScrollView`](https://reactnavigation.org/docs/en/scrollables.html) exported by React Navigation. This wraps the built-in component and gives us a special prop to delegate control to the `StackGestureContext`

```js
class Modal extends Component {
  state = {
    scrolledTop: true,
  };

  render() {
    return (
      <StackGestureContext.Consumer>
        {ref => (
          <ScrollView
            waitFor={this.state.scrolledTop ? ref : undefined}
            onScroll={({ nativeEvent }) => {
              const scrolledTop = nativeEvent.contentOffset.y <= 0;
              this.setState({ scrolledTop });
            }}
            scrollEventThrottle={16}>
            <Text>{content}</Text>
          </ScrollView>
        )}
      </StackGestureContext.Consumer>
    );
  }
}
```

<a href="https://snack.expo.io/@rgilbert/scrollable-modal-with-dismissal" target="blank" class="run-code-button">&rarr; Run this code</a>

Our newly imported `ScrollView` has a prop called [`waitFor`](https://kmagiera.github.io/react-native-gesture-handler/docs/handler-common.html#waitfor) which is what we use to tell the React Navigation gesture context to go ahead and dismiss the modal when appropriate. As mentioned, we only want this gesture context to take over when the content is scrolled to the top, so we keep track of that in our component's state, and use it to conditionally give up control. Since this is a wrapper around the built-in component, we can use `onScroll` to determine if the content is scrolled to the top, and throw in some throttling so we don't get too many events. That's it, now we're displaying scrollable content in a modal that can be swiped away!
