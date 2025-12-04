---
id: use-scroll-to-top
title: useScrollToTop
sidebar_label: useScrollToTop
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The expected native behavior of scrollable components is to respond to events from navigation that will scroll to top when tapping on the active tab as you would expect from native tab bars.

In order to achieve it we export `useScrollToTop` which accept ref to scrollable component (e,g. `ScrollView` or `FlatList`).

Example:

```js name="useScrollToTop hook" snack static2dynamic
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { View, Image } from 'react-native';
// codeblock-focus-start
import { ScrollView } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

function Albums() {
  const ref = React.useRef(null);

  // highlight-next-line
  useScrollToTop(ref);

  return (
    <ScrollView ref={ref}>
      {/* content */}
      // codeblock-focus-end
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="1"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="2"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="3"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="4"
      />
      // codeblock-focus-start
    </ScrollView>
  );
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Albums: Albums,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class Albums extends React.Component {
  render() {
    return <ScrollView ref={this.props.scrollRef}>{/* content */}</ScrollView>;
  }
}

// Wrap and export
export default function (props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <Albums {...props} scrollRef={ref} />;
}
```

## Providing scroll offset

If you require offset to scroll position you can wrap and decorate passed reference:

```js name="useScrollToTop hook - providing scroll offset" snack static2dynamic
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';

// codeblock-focus-start
import { ScrollView } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

function Albums() {
  const ref = React.useRef(null);

  useScrollToTop(
    React.useRef({
      scrollToTop: () => ref.current?.scrollTo({ y: 100 }),
    })
  );

  return (
    <ScrollView ref={ref}>
      {/* content */}
      // codeblock-focus-end
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="1"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="2"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="3"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="4"
      />
      // codeblock-focus-start
    </ScrollView>
  );
}
// codeblock-focus-end

function HomeScreen() {
  return <View />;
}

const MyTab = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Albums: Albums,
  },
});

const Navigation = createStaticNavigation(MyTab);

export default function App() {
  return <Navigation />;
}
```
