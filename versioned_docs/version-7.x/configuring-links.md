---
id: configuring-links
title: Configuring links
sidebar_label: Configuring links
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In this guide, we will configure React Navigation to handle external links. This is necessary if you want to:

1. Handle deep links in React Native apps on Android and iOS
2. Enable URL integration in browser when using on web
3. Use [`<Link />`](link.md) or [`useLinkTo`](use-link-to.md) to navigate using paths.

Make sure that you have [configured deep links](deep-linking.md) in your app before proceeding. If you have an Android or iOS app, remember to specify the [`prefixes`](navigation-container.md#linkingprefixes) option.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

The [`Navigation`](static-configuration.md#createstaticnavigation) component accepts a [`linking`](static-configuration.md#differences-in-the-linking-prop) prop that makes it easier to handle incoming links:

```js
import { createStaticNavigation } from '@react-navigation/native';

// highlight-start
const linking = {
  enabled: 'auto' /* Automatically generate paths for all screens */,
  prefixes: [
    /* your linking prefixes */
  ],
};
// highlight-end

function App() {
  return (
    <Navigation
      // highlight-next-line
      linking={linking}
      fallback={<Text>Loading...</Text>}
    />
  );
}

const Navigation = createStaticNavigation(RootStack);
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

The `NavigationContainer` accepts a [`linking`](navigation-container.md#linking) prop that makes it easier to handle incoming links. The 2 of the most important properties you can specify in the `linking` prop are `prefixes` and `config`:

```js
import { NavigationContainer } from '@react-navigation/native';

// highlight-start
const linking = {
  prefixes: [
    /* your linking prefixes */
  ],
  config: {
    /* configuration for matching screens with paths */
  },
};
// highlight-end

function App() {
  return (
    <NavigationContainer
      // highlight-next-line
      linking={linking}
      fallback={<Text>Loading...</Text>}
    >
      {/* content */}
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

When you specify the `linking` prop, React Navigation will handle incoming links automatically. On Android and iOS, it'll use React Native's [`Linking` module](https://reactnative.dev/docs/linking) to handle incoming links, both when the app was opened with the link, and when new links are received when the app is open. On the Web, it'll use the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to sync the URL with the browser.

:::warning

Currently there seems to be bug ([facebook/react-native#25675](https://github.com/facebook/react-native/issues/25675)) which results in it never resolving on Android. We add a timeout to avoid getting stuck forever, but it means that the link might not be handled in some cases.

:::

You can also pass a [`fallback`](navigation-container.md#fallback) prop that controls what's displayed when React Navigation is trying to resolve the initial deep link URL.

## Prefixes

The `prefixes` option can be used to specify custom schemes (e.g. `mychat://`) as well as host & domain names (e.g. `https://mychat.com`) if you have configured [Universal Links](https://developer.apple.com/ios/universal-links/) or [Android App Links](https://developer.android.com/training/app-links).

For example:

```js
const linking = {
  prefixes: ['mychat://', 'https://mychat.com'],
};
```

Note that the `prefixes` option is not supported on Web. The host & domain names will be automatically determined from the Website URL in the browser. If your app runs only on Web, then you can omit this option from the config.

### Multiple subdomains​

To match all subdomains of an associated domain, you can specify a wildcard by prefixing `*`. before the beginning of a specific domain. Note that an entry for `*.mychat.com` does not match `mychat.com` because of the period after the asterisk. To enable matching for both `*.mychat.com` and `mychat.com`, you need to provide a separate prefix entry for each.

```js
const linking = {
  prefixes: ['mychat://', 'https://mychat.com', 'https://*.mychat.com'],
};
```

## Filtering certain paths

Sometimes we may not want to handle all incoming links. For example, we may want to filter out links meant for authentication (e.g. `expo-auth-session`) or other purposes instead of navigating to a specific screen.

To achieve this, you can use the `filter` option:

```js
const linking = {
  prefixes: ['mychat://', 'https://mychat.com'],
  // highlight-next-line
  filter: (url) => !url.includes('+expo-auth-session'),
};
```

This is not supported on Web as we always need to handle the URL of the page.

## Apps under subpaths

If your app is hosted under a subpath, you can specify the subpath at the top-level of the `config`. For example, if your app is hosted at `https://mychat.com/app`, you can specify the `path` as `app`:

```js
const linking = {
  prefixes: ['mychat://', 'https://mychat.com'],
  config: {
    // highlight-next-line
    path: 'app',

    // ...
  },
};
```

It's not possible to specify params here since this doesn't belong to a screen, e.g. `app/:id` won't work.

## Mapping path to route names

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

If you specify `enabled: 'auto'` in the `linking` prop, React Navigation will automatically generate paths for all screens. For example, if you have a `Profile` screen in the navigator, it'll automatically generate a path for it as `profile`.

If you wish to handle the configuration manually, or want to override the generated path for a specific screen, you can specify `linking` property next to the screen in the navigator to map a path to a screen. For example:

```js
const RootStack = createStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      // highlight-start
      linking: {
        path: 'user',
      },
      // highlight-end
    },
    Chat: {
      screen: ChatScreen,
      // highlight-start
      linking: {
        path: 'feed/:sort',
      },
      // highlight-end
    },
  },
});
```

In this example:

- `Chat` screen that handles the URL `/feed` with the param `sort` (e.g. `/feed/latest` - the `Chat` screen will receive a param `sort` with the value `latest`).
- `Profile` screen that handles the URL `/user`.

Similarly, when you have a nested navigator, you can specify the `linking` property for the screens in the navigator to handle the path for the nested screens:

```js
const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      // highlight-start
      linking: {
        path: 'home',
      },
      // highlight-end
    },
    Settings: {
      screen: SettingsScreen,
      // highlight-start
      linking: {
        path: 'settings',
      },
      // highlight-end
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
    },
    Profile: {
      screen: ProfileScreen,
      // highlight-start
      linking: {
        path: 'user',
      },
      // highlight-end
    },
    Chat: {
      screen: ChatScreen,
      // highlight-start
      linking: {
        path: 'feed/:sort',
      },
      // highlight-end
    },
  },
});
```

In the above example, the following path formats are handled:

- `/home` navigates to the `HomeTabs` -> `Home` screen
- `/settings` navigates to the `HomeTabs` -> `Settings` screen
- `/user` navigates to the `Profile` screen
- `/feed/:sort` navigates to the `Chat` screen with the param `sort`

### How does automatic path generation work?

When using automatic path generation with `enabled: 'auto'`, the following rules are applied:

- Screens with an explicit `linking` property are not used for path generation and will be added as-is.
- Screen names will be converted from `PascalCase` to `kebab-case` to use as the path (e.g. `NewsFeed` -> `news-feed`).
- Unless a screen has explicit empty path (`path: ''`) to use for the homepage, the first leaf screen encountered will be used as the homepage.
- Path generation only handles leaf screens, i.e. no path is generated for screens containing nested navigators. It's still possible to specify a path for them with an explicit `linking` property.

Let's say we have the following navigation structure:

```js
const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
    },
    Profile: {
      screen: ProfileScreen,
    },
    Chat: {
      screen: ChatScreen,
    },
  },
});
```

With automatic path generation, the following paths will be generated:

- `/` navigates to the `HomeTabs` -> `Home` screen
- `/settings` navigates to the `HomeTabs` -> `Settings` screen
- `/profile` navigates to the `Profile` screen
- `/chat` navigates to the `Chat` screen

If the URL contains a query string, it'll be passed as params to the screen. For example, the URL `/profile?user=jane` will pass the `user` param to the `Profile` screen.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

If you specify a `linking` option, by default React Navigation will use the path segments as the route name when parsing the URL. However, directly translating path segments to route names may not be the expected behavior.

You can specify the [`config`](navigation-container.md#linkingconfig) option in `linking` to control how the deep link is parsed to suit your needs. The config should specify the mapping between route names and path patterns:

```js
const config = {
  screens: {
    Chat: 'feed/:sort',
    Profile: 'user',
  },
};
```

In this example:

- `Chat` screen that handles the URL `/feed` with the param `sort` (e.g. `/feed/latest` - the `Chat` screen will receive a param `sort` with the value `latest`).
- `Profile` screen that handles the URL `/user`.

The config option can then be passed in the `linking` prop to the container:

```js
import { NavigationContainer } from '@react-navigation/native';

const config = {
  screens: {
    Chat: 'feed/:sort',
    Profile: 'user',
  },
};

const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config,
};

function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {/* content */}
    </NavigationContainer>
  );
}
```

The config object must match the navigation structure for your app. For example, the above configuration is if you have `Chat` and `Profile` screens in the navigator at the root:

```js
function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

If your `Chat` screen is inside a nested navigator, we'd need to account for that. For example, consider the following structure where your `Profile` screen is at the root, but the `Chat` screen is nested inside `Home`:

```js
function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}
```

For the above structure, our configuration will look like this:

```js
const config = {
  screens: {
    Home: {
      screens: {
        Chat: 'feed/:sort',
      },
    },
    Profile: 'user',
  },
};
```

Similarly, any nesting needs to be reflected in the configuration.
</TabItem>
</Tabs>

<details>
<summary>How it works</summary>

The linking works by translating the URL to a valid [navigation state](navigation-state.md) and vice versa using the configuration provided. For example, the path `/rooms/chat?user=jane` may be translated to a state object like this:

```js
const state = {
  routes: [
    {
      name: 'rooms',
      state: {
        routes: [
          {
            name: 'chat',
            params: { user: 'jane' },
          },
        ],
      },
    },
  ],
};
```

For example, you might want to parse the path `/feed/latest` to something like:

```js
const state = {
  routes: [
    {
      name: 'Chat',
      params: {
        sort: 'latest',
      },
    },
  ];
}
```

See [Navigation State reference](navigation-state.md) for more details on how the state object is structured.

</details>

## Passing params

A common use case is to pass params to a screen to pass some data. For example, you may want the `Profile` screen to have an `id` param to know which user's profile it is. It's possible to pass params to a screen through a URL when handling deep links.

By default, query params are parsed to get the params for a screen. For example, with the above example, the URL `/user?id=jane` will pass the `id` param to the `Profile` screen.

You can also customize how the params are parsed from the URL. Let's say you want the URL to look like `/user/jane` where the `id` param is `jane` instead of having the `id` in query params. You can do this by specifying `user/:id` for the `path`. **When the path segment starts with `:`, it'll be treated as a param**. For example, the URL `/user/jane` would resolve to `Profile` screen with the string `jane` as a value of the `id` param and will be available in `route.params.id` in `Profile` screen.

By default, all params are treated as strings. You can also customize how to parse them by specifying a function in the `parse` property to parse the param, and a function in the `stringify` property to convert it back to a string.

If you wanted to resolve `/user/@jane/settings` to result in the params `{ id: 'jane' section: 'settings' }`, you could make `Profile`'s config to look like this:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      // highlight-start
      linking: {
        path: 'user/:id/:section',
        parse: {
          id: (id) => id.replace(/^@/, ''),
        },
        stringify: {
          id: (id) => `@${id}`,
        },
      },
      // highlight-end
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Profile: {
      // highlight-start
      path: 'user/:id/:section',
      parse: {
        id: (id) => id.replace(/^@/, ''),
      },
      stringify: {
        id: (id) => `@${id}`,
      },
      // highlight-end
    },
  },
};
```

</TabItem>
</Tabs>

<details>
<summary>Result Navigation State</summary>

With this configuration, the path `/user/@jane/settings` will resolve to the following state object:

```js
const state = {
  routes: [
    {
      name: 'Profile',
      params: { id: 'jane', section: 'settings' },
    },
  ],
};
```

</details>

## Marking params as optional

Sometimes a param may or may not be present in the URL depending on certain conditions. For example, in the above scenario, you may not always have the section parameter in the URL, i.e. both `/user/jane/settings` and `/user/jane` should go to the `Profile` screen, but the `section` param (with the value `settings` in this case) may or may not be present.

In this case, you would need to mark the `section` param as optional. You can do it by adding the `?` suffix after the param name:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      linking: {
        // highlight-next-line
        path: 'user/:id/:section?',
        parse: {
          id: (id) => `user-${id}`,
        },
        stringify: {
          id: (id) => id.replace(/^user-/, ''),
        },
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Profile: {
      // highlight-next-line
      path: 'user/:id/:section?',
      parse: {
        id: (id) => `user-${id}`,
      },
      stringify: {
        id: (id) => id.replace(/^user-/, ''),
      },
    },
  },
};
```

</TabItem>
</Tabs>

<details>
<summary>Result Navigation State</summary>

With this configuration, the path `/user/jane` will resolve to the following state object:

```js
const state = {
  routes: [
    {
      name: 'Profile',
      params: { id: 'user-jane' },
    },
  ],
};
```

If the URL contains a `section` param (e.g. `/user/jane/settings`), this will result in the following with the same config:

```js
const state = {
  routes: [
    {
      name: 'Profile',
      params: { id: 'user-jane', section: 'settings
    },
  ],
};
```

</details>

## Handling unmatched routes or 404

If your app is opened with an invalid URL, most of the times you'd want to show an error page with some information. On the web, this is commonly known as 404 - or page not found error.

To handle this, you'll need to define a catch-all route that will be rendered if no other routes match the path. You can do it by specifying `*` for the path matching pattern:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: {
      screen: FeedScreen,
    },
    Profile: {
      screen: HomeScreen,
      linking: {
        path: 'users/:id',
      },
    },
    Settings: {
      screen: SettingsScreen,
      linking: {
        path: 'settings',
      },
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
    },
    NotFound: {
      screen: NotFoundScreen,
      linking: {
        // highlight-next-line
        path: '*',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Home: {
      initialRouteName: 'Feed',
      screens: {
        Profile: 'users/:id',
        Settings: 'settings',
      },
    },
    NotFound: {
      // highlight-start
      path: '*',
    },
  },
};
```

</TabItem>
</Tabs>

Here, we have defined a route named `NotFound` and set it to match `*` aka everything. If the path didn't match `user/:id` or `settings`, it'll be matched by this route.

<details>
<summary>Result Navigation State</summary>

With this configuration, a path like `/library` or `/settings/notification` will resolve to the following state object:

```js
const state = {
  routes: [{ name: 'NotFound' }],
};
```

</details>

You can even go more specific, for example, say if you want to show a different screen for invalid paths under `/settings`, you can specify such a pattern under `Settings`:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const SettingsStack = createStackNavigator({
  screens: {
    UserSettings: {
      screen: UserSettingsScreen,
      linking: {
        path: 'user-settings',
      },
    },
    InvalidSettings: {
      screen: InvalidSettingsScreen,
      linking: {
        // highlight-next-line
        path: '*',
      },
    },
  },
});

const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: {
      screen: FeedScreen,
    },
    Profile: {
      screen: HomeScreen,
      linking: {
        path: 'users/:id',
      },
    },
    Settings: {
      screen: SettingsStack,
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
    },
    NotFound: {
      screen: NotFoundScreen,
      linking: {
        path: '*',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Home: {
      initialRouteName: 'Feed',
      screens: {
        Profile: 'users/:id',
        Settings: {
          path: 'settings',
          screens: {
            InvalidSettings: '*',
          },
        },
      },
    },
    NotFound: '*',
  },
};
```

</TabItem>
</Tabs>

<details>
<summary>Result Navigation State</summary>

With this configuration, the path `/settings/notification` will resolve to the following state object:

```js
const state = {
  routes: [
    {
      name: 'Home',
      state: {
        index: 1,
        routes: [
          { name: 'Feed' },
          {
            name: 'Settings',
            state: {
              routes: [
                { name: 'InvalidSettings', path: '/settings/notification' },
              ],
            },
          },
        ],
      },
    },
  ],
};
```

</details>

The `route` passed to the `NotFound` screen will contain a `path` property which corresponds to the path that opened the page. If you need, you can use this property to customize what's shown in this screen, e.g. load the page in a `WebView`:

```js
function NotFoundScreen({ route }) {
  if (route.path) {
    return <WebView source={{ uri: `https://mywebsite.com/${route.path}` }} />;
  }

  return <Text>This screen doesn't exist!</Text>;
}
```

When doing server rendering, you'd also want to return correct status code for 404 errors. See [server rendering docs](server-rendering.md#handling-404-or-other-status-codes) for a guide on how to handle it.

## Rendering an initial route

Sometimes you want to ensure that a certain screen will always be present as the first screen in the navigator's state. You can use the `initialRouteName` property to specify the screen to use for the initial screen.

In the above example, if you want the `Feed` screen to be the initial route in the navigator under `Home`, your config will look like this:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const HomeTabs = createBottomTabNavigator({
  screens: {
    Feed: {
      screen: FeedScreen,
    },
    Profile: {
      screen: HomeScreen,
      linking: {
        path: 'users/:id',
      },
    },
    Settings: {
      screen: SettingsScreen,
      linking: {
        path: 'settings',
      },
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
      linking: {
        // highlight-next-line
        initialRouteName: 'Feed',
      },
    },
    NotFound: {
      screen: NotFoundScreen,
      linking: {
        path: '*',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Home: {
      // highlight-next-line
      initialRouteName: 'Feed',
      screens: {
        Profile: 'users/:id',
        Settings: 'settings',
      },
    },
  },
};
```

</TabItem>
</Tabs>

<details>
<summary>Result Navigation State</summary>

With this configuration, the path `/users/42` will resolve to the following state object:

```js
const state = {
  routes: [
    {
      name: 'Home',
      state: {
        index: 1,
        routes: [
          { name: 'Feed' },
          {
            name: 'Profile',
            params: { id: '42' },
          },
        ],
      },
    },
  ],
};
```

</details>

:::warning

The `initialRouteName` will add the screen to React Navigation's state only. If your app is running on the Web, the browser's history will not contain this screen as the user has never visited it. So, if the user presses the browser's back button, it'll not go back to this screen.

:::

Another thing to keep in mind is that it's not possible to pass params to the initial screen through the URL. So make sure that your initial route doesn't need any params or specify `initialParams` in the screen configuration to pass the required params.

In this case, any params in the URL are only passed to the `Profile` screen which matches the path pattern `users/:id`, and the `Feed` screen doesn't receive any params. If you want to have the same params in the `Feed` screen, you can specify a [custom `getStateFromPath` function](navigation-container.md#linkinggetstatefrompath) and copy those params.

Similarly, if you want to access params of a parent screen from a child screen, you can use [React Context](https://react.dev/reference/react/useContext) to expose them.

## Matching exact paths

By default, paths defined for each screen are matched against the URL relative to their parent screen's path. Consider the following config:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const ProfileTabs = createBottomTabNavigator({
  screens: {
    Profile: {
      screen: HomeScreen,
      linking: {
        path: 'users/:id',
      },
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: ProfileTabs,
      linking: {
        path: 'feed',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Home: {
      path: 'feed',
      screens: {
        Profile: 'users/:id',
      },
    },
  },
};
```

</TabItem>
</Tabs>

Here, you have a `path` property defined for the `Home` screen, as well as the child `Profile` screen. The profile screen specifies the path `users/:id`, but since it's nested inside a screen with the path `feed`, it'll try to match the pattern `feed/users/:id`.

This will result in the URL `/feed` navigating to `Home` screen, and `/feed/users/cal` navigating to the `Profile` screen.

In this case, it makes more sense to navigate to the `Profile` screen using a URL like `/users/cal`, rather than `/feed/users/cal`. To achieve this, you can override the relative matching behavior to `exact` matching:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const ProfileTabs = createBottomTabNavigator({
  screens: {
    Profile: {
      screen: HomeScreen,
      linking: {
        path: 'users/:id',
        // highlight-next-line
        exact: true,
      },
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: ProfileTabs,
      linking: {
        path: 'feed',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Home: {
      path: 'feed',
      screens: {
        Profile: {
          path: 'users/:id',
          // highlight-next-line
          exact: true,
        },
      },
    },
  },
};
```

</TabItem>
</Tabs>

With `exact` property set to `true`, `Profile` will ignore the parent screen's `path` config and you'll be able to navigate to `Profile` using a URL like `users/cal`.

## Omitting a screen from path

Sometimes, you may not want to have the route name of a screen in the path. For example, let's say you have a `Home` screen and the following config. When the page is opened in the browser you'll get `/home` as the URL:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: ProfileScreen,
      linking: {
        path: 'home',
      },
    },
    Profile: {
      screen: HomeScreen,
      linking: {
        path: 'users/:id',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Home: {
      path: 'home',
    },
    Profile: 'users/:id',
  },
};
```

</TabItem>
</Tabs>

But it'll be nicer if the URL was just `/` when visiting the home screen.

You can specify an empty string as path or not specify a path at all, and React Navigation won't add the screen to the path (think of it like adding empty string to the path, which doesn't change anything):

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: ProfileScreen,
      linking: {
        path: '',
      },
    },
    Profile: {
      screen: HomeScreen,
      linking: {
        path: 'users/:id',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Home: {
      path: '',
    },
    Profile: 'users/:id',
  },
};
```

</TabItem>
</Tabs>

## Serializing and parsing params

Since URLs are strings, any params you have for routes are also converted to strings when constructing the path.

For example, say you have the URL `/chat/1589842744264` with the following config:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createStackNavigator({
  screens: {
    Chat: {
      screen: ChatScreen,
      linking: {
        path: 'chat/:date',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Chat: 'chat/:date',
  },
};
```

</TabItem>
</Tabs>

When handling the URL, your params will look like this:

```yml
{ date: '1589842744264' }
```

Here, the `date` param was parsed as a string because React Navigation doesn't know that it's supposed to be a timestamp, and hence number. You can customize it by providing a custom function to use for parsing:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createStackNavigator({
  screens: {
    Chat: {
      screen: ChatScreen,
      linking: {
        path: 'chat/:date',
        parse: {
          date: Number,
        },
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Chat: {
      path: 'chat/:date',
      parse: {
        date: Number,
      },
    },
  },
};
```

</TabItem>
</Tabs>

You can also provide a your own function to serialize the params. For example, let's say that you want to use a DD-MM-YYYY format in the path instead of a timestamp:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createStackNavigator({
  screens: {
    Chat: {
      screen: ChatScreen,
      linking: {
        path: 'chat/:date',
        parse: {
          date: (date) => new Date(date).getTime(),
        },
        stringify: {
          date: (date) => {
            const d = new Date(date);

            return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
          },
        },
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const config = {
  screens: {
    Chat: {
      path: 'chat/:date',
      parse: {
        date: (date) => new Date(date).getTime(),
      },
      stringify: {
        date: (date) => {
          const d = new Date(date);

          return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        },
      },
    },
  },
};
```

</TabItem>
</Tabs>

Depending on your requirements, you can use this functionality to parse and stringify more complex data.

## Advanced cases

For some advanced cases, specifying the mapping may not be sufficient. To handle such cases, you can specify a custom function to parse the URL into a state object ([`getStateFromPath`](navigation-container.md#linkinggetstatefrompath)), and a custom function to serialize the state object into an URL ([`getPathFromState`](navigation-container.md#linkinggetpathfromstate)).

Example:

```js
const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  getStateFromPath: (path, options) => {
    // Return a state object here
    // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
  },
  getPathFromState(state, config) {
    // Return a path string here
    // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
  },

  // ...
};
```

## Playground

import LinkingTester from '@site/src/components/LinkingTester'

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

Playground is not available for static config.

</TabItem>
<TabItem value="dynamic" label="Dynamic">

You can play around with customizing the config and path below, and see how the path is parsed.

<LinkingTester />

</TabItem>
</Tabs>
