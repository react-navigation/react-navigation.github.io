---
id: use-linking
title: useLinking
sidebar_label: useLinking
---

The `useLinking` hook lets us handle deep links in our apps.

Example:

```js
import * as React from 'react';
import { ScrollView } from 'react-native';
import { useLinking } from '@react-navigation/native';

export default function App() {
  const ref = React.useRef < ScrollView > null;

  const { getInitialState } = useLinking(ref, {
    prefixes: ['https://mychat.com', 'mychat://'],
    config: {
      Chat: 'feed/:sort',
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
    <NavigationNativeContainer initialState={initialState} ref={ref}>
      {/* content */}
    </NavigationNativeContainer>
  );
}
```

See [deep linking guide](deep-linking.md) for a complete guide.

### Options

#### `prefixes`

URL prefixes to handle. You can provide multiple prefixes to support custom schemes as well as [universal links](https://developer.apple.com/ios/universal-links/).

Only URLs matching these prefixes will be handled. The prefix will be stripped from the URL before parsing.

#### `config`

Config to fine-tune how to parse the path. The config object should represent the structure of the navigators in the app.

For example, if we have `Catalog` screen inside `Home` screen and want it to handle the `item/:id` pattern:

```js
{
  Home: {
    Catalog: {
      path: 'item/:id',
      parse: {
        id: Number,
      },
    },
  },
}
```

The options for parsing can be an object or a string:

```js
{
  Catalog: 'item/:id',
}
```

When a string is specified, it's equivalent to providing the `path` option.

The `path` option is a pattern to match against the path. Any segments starting with `:` are recognized as a param with the same name. For example `item/42` will be parsed to `{ name: 'item', params: { id: '42' } }`.

The `parse` option controls how the params are parsed. Here, you can provide the name of the param to parse as a key, and a function which takes the string value for the param and returns a parsed value:

```js
{
  Catalog: {
    path: 'item/:id',
    parse: {
      id: id => parseInt(id, 10),
    },
  },
}
```

If no custom function is provided for parsing a param, it'll be parsed as a string.

Different segments of the same path can be handled by different parts of the config. For example, say we have the URL `/rooms/chat/jane`. We can provide the following config to handle it:

```js
{
  Rooms: 'rooms',
  Chat: 'chat/:user'
}
```

This will result in the following navigation state:

```js
{
  routes: [
    {
      name: 'Rooms',
      state: {
        routes: [
          {
            name: 'Chat',
            params: { user: 'jane' },
          },
        ],
      },
    },
  ],
}
```
