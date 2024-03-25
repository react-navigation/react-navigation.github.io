---
id: preventing-going-back
title: Preventing going back
sidebar_label: Preventing going back
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Sometimes you may want to prevent the user from leaving a screen to avoid losing unsaved changes. There are a couple of things you may want to do in this case:

## Prevent the user from leaving the screen

The `usePreventRemove` hook allows you to prevent the user from leaving a screen. See the [`usePreventRemove`](use-prevent-remove.md) docs for more details.

<details>
<summary>Previous approach</summary>

Previously, the way to do this was to:

- Override the back button in the header
- Disable back swipe gesture
- Override system back button/gesture on Android

However, using the hook has many important differences in addition to being less code:

- It's not coupled to any specific buttons, going back from custom buttons will trigger it as well
- It's not coupled to any specific actions, any action that removes the route from the state will trigger it
- It works across nested navigators, e.g. if the screen is being removed due to an action in the parent navigator
- The user can still swipe back in the stack navigator, however, the swipe will be canceled if the event is prevented
- It's possible to continue the same action that triggered the event

</details>

## Prevent the user from leaving the app

To be able to prompt the user before they leave the app on Android, you can use the `BackHandler` API from React Native:

```js
import { Alert, BackHandler } from 'react-native';

// ...

React.useEffect(() => {
  const onBackPress = () => {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            // Do nothing
          },
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );

    return true;
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    onBackPress
  );

  return () => backHandler.remove();
}, []);
```

On the Web, you can use the `beforeunload` event to prompt the user before they leave the browser tab:

```js
React.useEffect(() => {
  const onBeforeUnload = (event) => {
    // Prevent the user from leaving the page
    event.preventDefault();
    event.returnValue = true;
  };

  window.addEventListener('beforeunload', onBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', onBeforeUnload);
  };
}, []);
```

:::warning

The user can still close the app by swiping it away from the app switcher or closing the browser tab. Or the app can be closed by the system due to low memory or other reasons. It's also not possible to prevent leaving the app on iOS. We recommend persisting the data and restoring it when the app is opened again instead of prompting the user before they leave the app.

:::
