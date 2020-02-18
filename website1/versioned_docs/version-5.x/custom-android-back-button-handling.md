---
id: version-5.x-custom-android-back-button-handling
title: Custom Android back button behavior
sidebar_label: Custom Android back button behavior
original_id: custom-android-back-button-handling
---

By default, when user presses the Android hardware back button, react-navigation will pop a screen or exit the app if there are no screens to pop. This is a sensible default behavior, but there are situations when you might want to implement custom handling.

As an example, consider a screen where user is selecting items in a list, and a "selection mode" is active. On a back button press, you would first want the "selection mode" to be deactivated, and the screen should be popped only on the second back button press. The following code snippet demonstrates the situation. We make use of [`BackHandler`](https://facebook.github.io/react-native/docs/backhandler.html) which comes with react-native along with the `useFocusEffect` hook to add our custom `hardwareBackPress` listener.

Returning `true` from `onBackPress` denotes that we have handled the event, and react-navigation's listener will not get called, thus not popping the screen. Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.

```js
function ScreenWithCustomBackBehavior() {
  // ...

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled()) {
          disableSelectionMode();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isSelectionModeEnabled, disableSelectionMode])
  );

  // ...
}
```

The presented approach will work well for screens that are shown in a `StackNavigator`. Custom back button handling in other situations may not be supported at the moment (eg. A known case when this does not work is when you want to handle back button press in an open drawer. PRs for such use cases are welcome!).

### Why not use component lifecycle methods?

At first, you may be inclined to use `componentDidMount` to subscribe for the back press event and `componentWillUnmount` to unsubscribe, or use `useEffect` to add the listener. This approach will not work - learn more about this in [navigation lifecycle](navigation-lifecycle.html).
