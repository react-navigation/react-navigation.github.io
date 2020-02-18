---
id: version-5.x-state-persistence
title: State persistence
sidebar_label: State persistence
original_id: state-persistence
---

You might want to save the user's location in the app, so that they are immediately returned to the same location after the app is restarted.

This is especially valuable during development because it allows the developer to stay on the same screen when they refresh the app.

> Note: This feature is currently considered experimental, because of the warnings listed at the end of this page. Use with caution!

## Usage

To be able to persist the navigation state, we can use the `onStateChange` and `initialState` props of the container.

- `onStateChange` - This prop notifies us of any state changes. We can persist the state in this callback.
- `initialState` - This prop allows us to pass an initial state to use for navigation state. We can pass the restored state in this prop.

 <samp id="state-persistance" />

```js
const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString);

        setInitialState(state);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={state =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      {/* ... */}
    </NavigationContainer>
  );
}
```

### Development Mode

This feature is particularly useful in development mode. You can enable it selectively using the following approach:

```js
const [isReady, setIsReady] = React.useState(__DEV__ ? false : true);
```

### Loading View

Because the state is restored asynchronously, the app must render an empty/loading view for a moment before we have the initial state. To handle this, we can return a loading view when `isReady` is `false`:

```js
if (!isReady) {
  return <ActivityIndicator />;
}
```

## Warning: Serializable State

Each param, route, and navigation state must be fully serializable for this feature to work. Typically, you would serialize the state as a JSON string. This means that your routes and params must contain no functions, class instances, or recursive data structures.

You can modify the initial state object before passing it to container, but note that if your `initialState` provides an invalid object (an object from which the navigation state cannot be recovered), React Navigation may not be able to handle the situation gracefully.
