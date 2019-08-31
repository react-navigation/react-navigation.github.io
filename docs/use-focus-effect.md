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

  const fetchUser = React.useCallback(() => {
    const request = API.fetchUser(userId).then(
      data => setUser(data),
      error => alert(error.message)
    );

    return () => request.abort();
  }, [userId]);

  useFocusEffect(fetchUser);

  return <ProfileContent user={user} />;
}
```

The `useFocusEffect` is analogous to React's `useEffect` hook. The only difference is that it runs on focus instead of render.

**NOTE:** To avoid the running the effect too often, it's important to wrap the callback in `useCallback` before passing it to `useFocusEffect` as shown in the example.
