---
id: navigation-context
title: NavigationContext
sidebar_label: NavigationContext
---

`NavigationContext` provides the `navigation` object (similar to the [navigation](navigation-prop.md) prop). In fact, [withNavigation](with-navigation.md) uses this context to inject the `navigation` prop to your wrapped component. The [hook counterpart](https://github.com/react-navigation/react-navigation-hooks#usenavigation) is essentially an `useContext` with this context as well.

Most of the time, you won't use `NavigationContext` directly, as the provided `withNavigation` and [hooks](https://github.com/react-navigation/react-navigation-hooks) already cover most use cases. But just in case you have something else in mind, `NavigationContext` is available for you to use.

## Example with hooks

```js
import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '@react-navigation/core';

export function useFocusState() {
  const navigation = useContext(NavigationContext);
  const isFocused = navigation.isFocused();
  const [focusState, setFocusState] = useState(getInitialFocusState(isFocused));
  function handleEvt(e) {
    const newState = focusStateOfEvent(e.type);
    newState && setFocusState(newState);
  }
  useEffect(
    () => {
      const subsA = navigation.addListener('action', handleEvt);
      const subsWF = navigation.addListener('willFocus', handleEvt);
      const subsDF = navigation.addListener('didFocus', handleEvt);
      const subsWB = navigation.addListener('willBlur', handleEvt);
      const subsDB = navigation.addListener('didBlur', handleEvt);
      return () => {
        subsA.remove();
        subsWF.remove();
        subsDF.remove();
        subsWB.remove();
        subsDB.remove();
      };
    },
  );
  return focusState;
}
```
