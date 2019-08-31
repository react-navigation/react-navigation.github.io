---
id: use-scroll-to-top
title: useScrollToTop
sidebar_label: useScrollToTop
---

The expected native behavior of scrollable components is to to respond to events from navigation that will scroll to top when tapping on the active tab as you would expect from native tab bars.

In order to achieve it we export `useScrollToTop`  which accept ref to scrollable component (e,g. `ScrollView` or `FlatList`)
Example

```js
import * as React from 'react';
import { ScrollView } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

export default function Albums() {
  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  return (
    <ScrollView ref={ref}>
      { /* content */ }
    </ScrollView>
  );
}

