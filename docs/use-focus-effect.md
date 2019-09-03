---
id: use-focus-effect
title: useFocusEffect
sidebar_label: useFocusEffect
---

Sometimes we want to run side-effects when a screen is focused. A side effect may involve things like adding an event listener, fetching data, updating document title, etc. While this can be achieved using `focus` and `blur` events, it's not very ergonomic.

To make this easier, the library exports a `useFocusEffect` hook:

```js
import { useFocusEffect } from '@react-navigation/core';

function Profile({ userId }) {
  const [user, setUser] = React.useState(null);

  const watchUser = React.useCallback(() => {
    const unsubscribe = API.subscribe(userId, user => setUser(data));

    return () => unsubscribe();
  }, [userId]);

  useFocusEffect(watchUser);

  return <ProfileContent user={user} />;
}
```

The `useFocusEffect` is analogous to React's `useEffect` hook. The only difference is that it runs on focus instead of render.

**NOTE:** To avoid the running the effect too often, it's important to wrap the callback in `useCallback` before passing it to `useFocusEffect` as shown in the example.

## How is `useFocusEffect` different from adding a listener for `focus` event?

The `focus` event fires when a screen comes into focus. Since it's an event, your listener won't be called if the screen was already focused when you subscribed to the event. This also doesn't provide a way to perform a cleanup function when the screen becomes unfocused. You can subscribe to the `blur` event and handle it manually, but it can get messy. You will usually need to handle `componentDidMount` and `componentWillUnmount` as well in addition to these events, which complicates it even more.

The `useFocusEffect` allows you to run an effect on focus and clean it up when the screen becomes unfocused. It also handles cleanup on unmount. It re-runs the effect when dependencies change, so you don't need to worry about stale values in your listener.
