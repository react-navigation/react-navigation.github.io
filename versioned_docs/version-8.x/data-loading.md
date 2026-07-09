---
id: data-loading
title: Data loading
sidebar_label: Data loading
---

:::warning

Data loading is an experimental feature. The API is intentionally minimal and will evolve based on user feedback. Please provide feedback in the [RFC on GitHub discussions](https://github.com/react-navigation/react-navigation/discussions/13177) to help us improve it.

:::

Loaders let you define functions that get called when you navigate to a screen. This is useful for triggering data fetching before the screen finishes rendering. They are intended to work with data fetching libraries rather than replace them.

## How loaders work

Loaders are available only with [static configuration](static-configuration.md).

Each screen can define a loader with the [`UNSTABLE_loader`](screen.md#loader) property. On navigation to a screen, the loader is automatically called. When navigating to a screen in a nested navigator, loaders for all intermediate screens are also called in parallel.

Loaders are not called on the initial render or for actions that update the current route instead of navigating to a different screen, such as updating params. The screen should handle loading data in these cases if needed.

This is useful to implement "render-as-you-fetch" patterns, where the screen can suspend while reading data that the loader started fetching. If the screen is lazy loaded, the loader and the lazy loading of the screen run in parallel.

This pattern is designed to work with React's Suspense and error boundaries. You can provide a Suspense fallback and an error boundary for your screens using [`screenLayout`](navigator.md#screen-layout) or [`layout`](screen.md#layout) to show a loading UI while the screen is waiting for data or an error UI if the screen throws an error.

## Adding a loader to a screen

To define a loader, add an `UNSTABLE_loader` function to the screen configuration:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      UNSTABLE_loader: async ({ params }) => {
        await queryClient.ensureQueryData(profileQuery(params.id));
      },
    }),
  },
});
```

The loader receives an object with:

- `name` - the name of the screen being loaded.
- `params` - the params for the route.

The loader should use a data fetching library to prefetch data for the screen. The screen can then read the same data from the data fetching library's cache.

## Using with data fetching libraries

This setup can work with any data fetching library that lets you start a request outside a component and read it from a cache in the screen. Common examples include [TanStack Query](https://tanstack.com/query/latest/docs), [SWR](https://swr.vercel.app/docs/prefetching), [Apollo Client](https://www.apollographql.com/docs/react/api/react/preloading), [Relay](https://relay.dev/docs/api-reference/load-query/), [RTK Query](https://redux-toolkit.js.org/rtk-query/usage/prefetching), [urql](https://nearform.com/open-source/urql/docs/basics/react-preact/) etc.

### Using with TanStack Query

With [TanStack Query](https://tanstack.com/query/latest/docs), the loader can call [`queryClient.ensureQueryData`](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientensurequerydata) to prefetch the data, and the screen can then read it with [`useSuspenseQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery):

```js
import * as React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Profile', { id: '42' })}>
        Go to Profile
      </Button>
    </View>
  );
}

const profileQuery = (id) =>
  queryOptions({
    queryKey: ['profile', id],
    async queryFn() {
      const response = await fetch(`https://api.example.com/users/${id}`);

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      return response.json();
    },
  });

// codeblock-focus-start
function ProfileScreen({ route }) {
  // highlight-next-line
  const { data } = useSuspenseQuery(profileQuery(route.params.id));

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{data.name}</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  // highlight-start
  screenLayout: ({ children }) => (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      {children}
    </React.Suspense>
  ),
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      linking: 'profile/:id',
      // highlight-start
      UNSTABLE_loader: async ({ params }) => {
        await queryClient.ensureQueryData(profileQuery(params.id));
      },
      // highlight-end
    }),
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
}
```

With this setup, React Navigation calls the loader for the `Profile` screen when navigating to it. The loader starts the query, and the screen suspends while reading the data from the cache, so React Navigation shows the Suspense fallback specified in `screenLayout` until the data is ready.

## Running loaders manually

Use `UNSTABLE_getLoaderForState` to get the loader for a screen, for example when preloading data before the initial render, or when [server rendering](server-rendering.md):

```js
import { UNSTABLE_getLoaderForState } from '@react-navigation/native';

const loader = UNSTABLE_getLoaderForState(RootStack, {
  index: 0,
  routes: [
    {
      name: 'Profile',
      params: { id: '42' },
    },
  ],
});

await loader?.();
```

`UNSTABLE_getLoaderForState` takes the static navigation config and the navigation state, and returns a function that returns a promise resolving once all loaders for the focused route path have resolved. It returns `undefined` if no loader is found.

To call loaders for a given deep link, you can use [`getStateFromPath`](navigation-container.md#linkinggetstatefrompath) to parse the URL and get the navigation state, and then call `UNSTABLE_getLoaderForState` with that state. You can also combine this with [`createPathConfigForStaticNavigation`](static-configuration.md#createpathconfigforstaticnavigation) to get the automatically generated path config for the static navigation config.
