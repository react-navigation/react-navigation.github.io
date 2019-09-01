---
id: listen-lifecycle-events
title: Know when a screen is focused and blurred
sidebar_label: Know when a screen is focused and blurred
---

Screens can add listeners on the `navigation` prop. By default, `focus` and `blur` events are fired when focused screen changes. Navigators can also emit custom events. For example, the stack navigator emits `transitionStart` and `transitionEnd` event, tab navigator emits `tabPress` event etc.

Example:

```js
function Profile({ navigation }) {
  React.useEffect(() =>
    navigation.addListener('focus', () => {
      // do something
    })
  );

  return <ProfileContent />;
}
```

The `navigation.addListener` method returns a function to remove the listener which can be returned as the cleanup function in an effect.

Each event listener receives an event object as it's argument. The event object contains following properties:

- `data` - Additional data regarding the event passed by the navigator. This can be `undefined` if no data was passed.
- `preventDefault` - Calling this method prevents the default action performed by the action (such as switching tabs on `tabPress`). Support depends on the navigator.
