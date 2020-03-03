---
id: navigation-events
title: NavigationEvents reference
sidebar_label: NavigationEvents
---

`NavigationEvents` is a React component providing a declarative API to subscribe to navigation events. It will subscribe to navigation events on mount, and unsubscribe on unmount.

### Component props

- `navigation` - navigation props (optional, defaults to reading from React context)
- `onWillFocus` - event listener
- `onDidFocus` - event listener
- `onWillBlur` - event listener
- `onDidBlur` - event listener

The event listener is the same as the imperative [`navigation.addListener(...)`](navigation-prop.html#addlistener-subscribe-to-updates-to-navigation-lifecycle) API.

### Example

```jsx harmony
import React from 'react';
import { View } from 'react-native';
import { NavigationEvents } from 'react-navigation';

const MyScreen = () => (
  <View>
    <NavigationEvents
      onWillFocus={payload => console.log('will focus', payload)}
      onDidFocus={payload => console.log('did focus', payload)}
      onWillBlur={payload => console.log('will blur', payload)}
      onDidBlur={payload => console.log('did blur', payload)}
    />
    {/*
      Your view code
    */}
  </View>
);

export default MyScreen;
```
