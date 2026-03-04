# useScrollToTop

Version: 8.x

Sitemap: [llms-8.x.txt](https://reactnavigation.org/llms-8.x.txt)

The expected native behavior of scrollable components is to respond to events from navigation that will scroll to top when tapping on the active tab as you would expect from native tab bars.

In order to achieve it we export `useScrollToTop` which accept ref to scrollable component (e,g. `ScrollView` or `FlatList`).

Example:

**Static:**

```js

// codeblock-focus-start

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

**Dynamic:**

```js
// codeblock-focus-start

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

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Albums" component={Albums} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
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

**Static:**

```js

// codeblock-focus-start

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

**Dynamic:**

```js
// codeblock-focus-start

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

function MyTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Albums" component={Albums} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}
```
