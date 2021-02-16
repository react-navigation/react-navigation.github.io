---
id: use-linking
title: useLinking
sidebar_label: useLinking
---

The `useLinking` hook lets us handle deep links in our apps. This is used internally by React Navigation to implement deep linking support.

You should use the [`linking` prop on `NavigationContainer`](navigation-container.md#linking) instead of using this hook directly.
This documentation exists for users who were already using this hook before the `linking` prop was added.

Example:

```js
import * as React from 'react';
import { ScrollView } from 'react-native';
import { useLinking , NavigationContainer } from '@react-navigation/native';

export default function App() {
  const ref = React.useRef();

  const { getInitialState } = useLinking(ref, {
    prefixes: ['https://mychat.com', 'mychat://'],
    config: {
      screens: {
        Chat: 'feed/:sort',
      }
    },
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    getInitialState()
      .catch(() => {})
      .then(state => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setIsReady(true);
      });
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer initialState={initialState} ref={ref}>
      {/* content */}
    </NavigationContainer>
  );
}
```

See [deep linking guide](deep-linking.md) for a complete guide on how to configure deep linking.

### Options

#### `prefixes`

URL prefixes to handle. You can provide multiple prefixes to support custom schemes as well as [universal links](https://developer.apple.com/ios/universal-links/).

Only URLs matching these prefixes will be handled. The prefix will be stripped from the URL before parsing.

Example:

```js
useLinking(ref, {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      Chat: 'feed/:sort',
    }
  },
});
```

This is only supported on iOS and Android.

#### `config`

Config to fine-tune how to parse the path. The config object should represent the structure of the navigators in the app.

For example, if we have `Catalog` screen inside `Home` screen and want it to handle the `item/:id` pattern:

```js
{
  screens: {
    Home: {
      screens: {
        Catalog: {
          path: 'item/:id',
          parse: {
            id: Number,
          },
        },
      },
    },
  }
}
```

The options for parsing can be an object or a string:

```js
{
  screens: {
    Catalog: 'item/:id',
  }
}
```

When a string is specified, it's equivalent to providing the `path` option.

The `path` option is a pattern to match against the path. Any segments starting with `:` are recognized as a param with the same name. For example `item/42` will be parsed to `{ name: 'item', params: { id: '42' } }`.

The `initialRouteName` option ensures that the route name passed there will be present in the state for the navigator, e.g. for config:

```js
{
  screens: {
    Home: {
      initialRouteName: 'Feed',
      screens: {
        Catalog: {
          path: 'item/:id',
          parse: {
            id: Number,
          },
        },
        Feed: 'feed',
      },
    },
  }
}
```

and URL : `/item/42`, the state will look like this:

```js
{
  routes: [
    {
      name: 'Home',
      state: {
        index: 1,
        routes: [
          {
            name: 'Feed'
          },
          {
            name: 'Catalog',
            params: { id: 42 },
          },
        ],
      },
    },
  ],
}
```

The `parse` option controls how the params are parsed. Here, you can provide the name of the param to parse as a key, and a function which takes the string value for the param and returns a parsed value:

```js
{
  screens: {
    Catalog: {
      path: 'item/:id',
      parse: {
        id: id => parseInt(id, 10),
      },
    },
  }
}
```

If no custom function is provided for parsing a param, it'll be parsed as a string.

#### `enabled`

Optional boolean to enable or disable the linking integration. Defaults to `true`.

#### `getStateFromPath`

You can optionally override the way React Navigation parses deep links to a state object by providing your own implementation.

Example:

```js
useLinking(ref, {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      Chat: 'feed/:sort',
    }
  },
  getStateFromPath(path, config) {
    // Return a state object here
    // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
  }
});
```

#### `getPathFromState`

You can optionally override the way React Navigation serializes state objects to link by providing your own implementation. This is necessary for proper web support if you have specified `getStateFromPath`.

Example:

```js
useLinking(ref, {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      Chat: 'feed/:sort',
    }
  },
  getPathFromState(state, config) {
    // Return a path string here
    // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
  }
});
```
