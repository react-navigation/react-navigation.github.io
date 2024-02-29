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

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="useScrollToTop hook" snack version=7
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// codeblock-focus-start
import { View, ScrollView, Image } from 'react-native';
import {
  createStaticNavigation,
  useScrollToTop,
} from '@react-navigation/native';

function Albums() {
  const ref = React.useRef(null);

  // highlight-next-line
  useScrollToTop(ref);

  return (
    <ScrollView ref={ref}>
      {/*content*/}
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

const Tab = createBottomTabNavigator({
  Home: HomeScreen,
  Albums: Albums,
});

const Navigation = createStaticNavigation(Tab);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="useScrollToTop hook" snack version=7
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// codeblock-focus-start
import { View, ScrollView, Image } from 'react-native';
import { NavigationContainer, useScrollToTop } from '@react-navigation/native';

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

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Albums" component={Albums} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

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

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="useScrollToTop hook - providing scroll offset" snack version=7
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// codeblock-focus-start
import { View, ScrollView, Image } from 'react-native';
import {
  createStaticNavigation,
  useScrollToTop,
} from '@react-navigation/native';

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

const Tab = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Albums: Albums,
  },
});

const Navigation = createStaticNavigation(Tab);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="useScrollToTop hook - providing scroll offset" snack version=7
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// codeblock-focus-start
import { View, ScrollView, Image } from 'react-native';
import { NavigationContainer, useScrollToTop } from '@react-navigation/native';

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

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Albums" component={Albums} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>
