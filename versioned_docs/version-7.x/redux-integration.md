---
id: redux-integration
title: Redux integration
sidebar_label: Redux integration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

It is extremely easy to use Redux in an app with React Navigation. It's basically no different than without React Navigation.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Redux with React Navigation"
import { Provider } from 'react-redux';
import { createStaticNavigation } from '@react-navigation/native';

/* content */

const Navigation = createStaticNavigation(RootStack);

// Render the app container component with the provider around it
export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Redux with React Navigation"
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

// Render the app container component with the provider around it
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>{/* Screen configuration */}</NavigationContainer>
    </Provider>
  );
}
```

</TabItem>
</Tabs>

Notice that we wrap our components in a `Provider` like we'd normally do with `react-redux`. Ta da! Now feel free to use `connect` throughout your app.

### Use a component that is `connect`ed in `options`

Create a component, `connect` it to the store, then use that component in the `title`.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static">

```js name="Counter with Redux and React Navigation" snack version=7
import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// A very simple reducer
function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// A very simple store
let store = createStore(combineReducers({ count: counter }));

// A screen!
function Counter({ count, dispatch }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
      <Button
        title="Increment"
        onPress={() => dispatch({ type: 'INCREMENT' })}
      />
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: 'DECREMENT' })}
      />

      <Button
        title="Go to static count screen"
        onPress={() => navigation.navigate('StaticCounter')}
      />
    </View>
  );
}

// Another screen!
function StaticCounter({ count }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
    </View>
  );
}

// Connect the screens to Redux
let CounterContainer = connect((state) => ({ count: state.count }))(Counter);
let StaticCounterContainer = connect((state) => ({ count: state.count }))(
  StaticCounter
);

// Create our stack navigator
let Root = createNativeStackNavigator({
  screens: {
    Counter: {
      screen: Counter,
      options: {
        title: () => <CounterContainer />,
      },
    },
    StaticCounter: {
      screen: StaticCounter,
      options: {
        title: () => <StaticCounterContainer />,
      },
    },
  },
});

const Navigation = createStaticNavigation(Root);

// Render the app container component with the provider around it
export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Counter with Redux and React Navigation" snack version=7
import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// A very simple reducer
function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// A very simple store
let store = createStore(combineReducers({ count: counter }));

// A screen!
// codeblock-focus-start
function Counter({ count, dispatch, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
      // codeblock-focus-end
      <Button
        title="Increment"
        onPress={() => dispatch({ type: 'INCREMENT' })}
      />
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: 'DECREMENT' })}
      />
      <Button
        title="Go to static count screen"
        onPress={() => navigation.navigate('StaticCounter')}
      />
      // codeblock-focus-start
    </View>
    // codeblock-focus-end
  );
}

// Another screen!
function StaticCounter({ count }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
    </View>
  );
}

// Connect the screens to Redux
// codeblock-focus-start

let CounterContainer = connect((state) => ({ count: state.count }))(Counter);

// codeblock-focus-end
let StaticCounterContainer = connect((state) => ({ count: state.count }))(
  StaticCounter
);

// Create our stack navigator
let RootStack = createNativeStackNavigator();

// Render the app container component with the provider around it
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Counter" component={CounterContainer} />
          <RootStack.Screen
            name="StaticCounter"
            component={StaticCounterContainer}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
```

</TabItem>
</Tabs>

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static">

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>
```js
<Stack.Screen
  name="Test"
  component={TestScreen}
  options={{ title: () => <CounterContainer /> }}
/>
```
</TabItem>
</Tabs>

### Pass the state you care about as a param to the screen

If the value isn't expected to change, you can just pass it from a connected component to the other screen as a param.

```js
<Button
  title="Go to static counter screen"
  onPress={() =>
    props.navigation.navigate('StaticCounter', {
      count,
    })
  }
/>
```

```js
function StaticCounter({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{route.params.count}</Text>
    </View>
  );
}
```

So our component will look like this:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Passing the state as a param" snack version=7
import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// A very simple reducer
function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// A very simple store
let store = createStore(combineReducers({ count: counter }));

// A screen!
function Counter({ count, dispatch }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
      <Button
        title="Increment"
        onPress={() => dispatch({ type: 'INCREMENT' })}
      />
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: 'DECREMENT' })}
      />

      <Button
        title="Go to static count screen"
        onPress={() =>
          navigation.navigate('StaticCounter', {
            count,
          })
        }
      />
    </View>
  );
}

// Another screen!
function StaticCounter({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{route.params.count}</Text>
    </View>
  );
}

// Connect the screens to Redux
let CounterContainer = connect((state) => ({ count: state.count }))(Counter);

// Create our stack navigator
let RootStack = createNativeStackNavigator({
  screens: {
    Counter: {
      screen: Counter,
      options: {
        title: () => <CounterContainer />,
      },
    },
    StaticCounter: {
      screen: StaticCounter,
      options: ({ route }) => ({ title: route.params.count.toString() }),
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

// Render the app container component with the provider around it
export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Passing the state as a param" snack version=7
import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// A very simple reducer
function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// A very simple store
let store = createStore(combineReducers({ count: counter }));

// A screen!
function Counter({ count, dispatch, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
      <Button
        title="Increment"
        onPress={() => dispatch({ type: 'INCREMENT' })}
      />
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: 'DECREMENT' })}
      />

      <Button
        title="Go to static count screen"
        onPress={() =>
          navigation.navigate('StaticCounter', {
            count,
          })
        }
      />
    </View>
  );
}

// Another screen!
function StaticCounter({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{route.params.count}</Text>
    </View>
  );
}

// Connect the screens to Redux
let CounterContainer = connect((state) => ({ count: state.count }))(Counter);

// Create our stack navigator
let RootStack = createNativeStackNavigator();

// Render the app container component with the provider around it
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Counter" component={CounterContainer} />
          // codeblock-focus-start
          <RootStack.Screen
            name="StaticCounter"
            component={StaticCounter}
            options={({ route }) => ({ title: route.params.count.toString() })}
          />
          // codeblock-focus-end
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
```

</TabItem>
</Tabs>

## Can I store the navigation state in Redux too?

This is not possible. We don't support it because it's too easy to shoot yourself in the foot and slow down / break your app.

However it's possible to use [`redux-devtools-extension`](https://github.com/reduxjs/redux-devtools) to inspect the [navigation state](navigation-state.md) and actions, as well as perform time travel debugging by using the [`devtools` package](devtools.md).
