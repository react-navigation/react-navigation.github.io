---
id: configuring-links
title: Configuring links
sidebar_label: Configuring links
---

import LinkingTester from '@site/src/components/LinkingTester'

In this guide, we will configure React Navigation to handle external links. This is necessary if you want to:

1. Handle deep links in React Native apps on Android and iOS
2. Enable URL integration in browser when using on web
3. Use [`<Link />`](link.md) or [`useLinkTo`](use-link-to.md) to navigate using paths.

To handle a link, you need to translate it to a valid navigation state and vice versa. For example, the path `/rooms/chat?user=jane` may be translated to a state object like this:

```js
{
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
}
```

The `NavigationContainer` accepts a `linking` prop that makes it easier to handle incoming links:

```js
import { NavigationContainer } from '@react-navigation/native';

function App() {
  const linking = {
    prefixes: ['https://mychat.com', 'mychat://'],
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {/* content */}
    </NavigationContainer>
  );
}
```

The `prefixes` option is needed to match the incoming deep links and strip the prefix before React Navigation parses them. It's not needed for web integration.

The `fallback` prop controls what's displayed when React Navigation is trying to resolve the initial deep link URL.

> Note: Deep link integration uses React Native's `Linking.getInitialUrl()` under the hood. Currently there seems to be bug ([facebook/react-native#25675](https://github.com/facebook/react-native/issues/25675)) which results in it never resolving on Android. you add a timeout to avoid getting stuck forever, but it means that the link might not be handled in some cases.

## Mapping path to route names

By default, React Navigation will use the path segments as the route name when parsing the URL. But directly translating path segments to route names may not be the expected behavior, and your.

For example, you might want to parse the path `/feed/latest` to something like:

```js
{
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

You can specify a separate `config` option to control how the deep link is parsed to suit your needs.

```js
const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    Chat: 'feed/:sort',
    Profile: 'user',
  },
};
```

Here `Chat` is the name of the screen that handles the URL `/feed`, and `Profile` handles the URL `/profile`.

## Passing params

A common use case is to pass params to a screen to pass some data. For example, you may want the `Profile` screen to have an `id` param to know which user's profile it is. It's possible to pass params to a screen through a URL when handling deep links.

By default, query params are used to specify params for a screen. For example, with the above example, the URL `/user?id=wojciech` will pass the `id` param to the `Profile` screen.

You can also customize how the params are parsed from the URL. Let's say you want the URL to look like `/user/wojciech` where the `id` param is `wojciech` instead of having the `id` in query params. You can do this by specifying `user/:id` for the `path`. **When the path segment starts with `:`, it'll be treated as a param**. For example, the URL `/user/wojciech` would resolve to `Profile` screen with the string `wojciech` as a value of the `id` param and will be available in `route.params.id` in `Profile` screen.

By default, all params are treated as strings. You can also customize how to parse them by specifying a function in the `parse` property to parse the param, and a function in the `stringify` property to convert it back to a string.

If you wanted to resolve `/user/wojciech/22` to result in the params `{ id: 'user-wojciech' age: 22 }`, you could make `Profile`'s config to look like this:

```js
{
  Profile: {
    path: 'user/:id/:age',
    parse: {
      id: id => `user-${id}`,
      age: Number,
    },
    stringify: {
      id: id => id.replace(/^user-/, '')
    }
  }
}
```

This will result in something like:

```js
const state = {
  routes: [
    {
      name: 'Profile',
      params: { id: 'user-wojciech', age: 22 },
    },
  ],
};
```

## Handling nested navigators

Sometimes you'll have the target navigator nested in other navigators which aren't part of the deep link. For example, let's say your navigation structure looks like this:

```js
function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
```

Here you have a stack navigator in the root, and inside the `Home` screen of the root stack, you have a tab navigator with various screens. With this structure, let's say you want the path `/users/:id` to go to the `Profile` screen. you can express the nested config like so:

```js
{
  Home: {
    screens: {
      Profile: 'users/:id',
    },
  },
}
```

In this config, you specify that the `Profile` screen should be resolved for the `users/:id` pattern and it's nested inside the `Home` screen. Then parsing `users/jane` will result in the following state object:

```js
const state = {
  routes: [
    {
      name: 'Home',
      state: {
        routes: [
          {
            name: 'Profile',
            params: { id: 'jane' },
          },
        ],
      },
    },
  ],
};
```

It's important to note that the state object must match the hierarchy of nested navigators. Otherwise the state will be discarded.

## Rendering an initial route

Sometimes you want to ensure that a certain screen will always be present as the first screen in the navigator's state. you can use the `initialRouteName` property to specify the screen to use for the initial screen.

In the above example, if you want the `Notifications` screen to be the initial route in the navigator under `Home`, your config will look like this:

```js
{
  Home: {
    initialRouteName: 'Notifications',
    screens: {
      Profile: 'users/:id',
      Notifications: 'notify/:user',
    },
  },
};
```

Then, the path `/users/42` will resolve to the following state object:

```js
const state = {
  routes: [
    {
      name: 'Home',
      state: {
        index: 1,
        routes: [
          { name: 'Notifications' },
          {
            name: 'Profile',
            params: { id: 'jane' },
          },
        ],
      },
    },
  ],
};
```

Note that in this case, any params in the URL are only passed to the `Profile` screen which matches the path pattern `users/:id`, and the `Notifications` screen doesn't receive any params. If you want to have the same params in the `Notifications` screen, you can specify a [custom `getStateFromPath` function](use-linking.md#getstatefrompath) and copy those params.

## Omitting a screen from path

Sometimes, you may not want to have the route name of a screen in the path. For example, let's say you have a `Home` screen and our navigation state looks like this:

```js
const state = {
  routes: [{ name: 'Home' }],
};
```

When this state is serialized to a path with the following config, you'll get `/Home`:

```js
{
  Home: {
    screens: {
      Profile: 'users/:id',
    },
  },
}
```

But it'll be nicer if the URL was just `/` when visiting the home screen. You can specify an empty string as path and React Navigation won't add the screen to the path (think of it like adding empty string to the path, which doesn't change anything):

```js
{
  Home: {
    path: '',
    screens: {
      Profile: 'users/:id',
    },
  },
}
```

## Advanced cases

For some advanced cases, specifying the mapping may not be sufficient. To handle such cases, you can specify a custom function to parse the URL into a state object ([`getStateFromPath`](use-linking.md#getstatefrompath)), and a custom function to serialize the state object into an URL ([`getPathFromState`](use-linking.md#getpathfromstate)).

Example:

```js
const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    Chat: 'feed/:sort',
  },
  getStateFromPath: (path, options) => {
    // Return a state object here
    // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
  },
  getPathFromState(state, config) {
    // Return a path string here
    // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
  },
};
```

## Constraints to consider with nesting configs

There are some constraints to consider when using nested navigators in the linking config.

1. **Using `initialRouteName` makes the screen always appear in the state of a navigator.** It's not possible to pass params to the initial screen through the URL by default, unless the URL explicitly maps to the screen. So make sure that your initial route doesn't take any params or specify `initialParams`.

2. **Having multiple screens of a nested navigator present in the state object is not possible through a one-part URL string.** you also cannot provide a URL like (for the above configuration) `/user/home`, because it would be resolved to `HomeStack->Profile->HomeStack->Home`. If you want to get rid of the second `HomeStack`, you can provide an explicit config for the `Home` screen in the first level of config nesting (remember to provide a different path string for each occurrence of a screen in the config):

   ```js
   const config = {
     HomeStack: {
       path: 'stack',
       initialRouteName: 'Profile',
       screens: {
         Home: 'home',
         Profile: 'user',
       },
     },
     Settings: 'settings',
     Home: 'first',
   };
   ```

   Then `/user/first` will resolve to `HomeStack->Profile->Home`.

   you can also make the config not include nested navigator, which will make the URL even longer, but maybe a bit less confusing.

   ```js
   const config = {
     HomeStack: 'stack',
     Home: 'home',
     Profile: 'user',
     Settings: 'settings',
   };
   ```

   Then `/stack/user/home` will resolve to `HomeStack->Profile->Home`.

3. **When nesting navigators, params are only passed to the screen that'll be opened by the URL.** If you want to have the same params in other screens, you can specify a [custom `getStateFromPath` function](use-linking.md#getstatefrompath) and copy those params to the desired route objects.

## Playground

You can play around with customizing the config and path below, and see how the path is parsed.

<LinkingTester />

## Example App

In the example app, you will use the Expo managed workflow. The guide will focus on creating the deep linking configuration and not on creating the components themselves, but you can always check the full implementation in the [github repo](https://github.com/react-navigation/deep-linking-example).

First, you need to decide the navigation structure of your app. To keep it simple, the main navigator will be bottom-tabs navigator with two screens. Its first screen will be a simple stack navigator, called `HomeStack`, with two screens: `Home` and `Profile`, and the second tabs screen will be just a simple one without any nested navigators, called `Settings`:

```sh
BottomTabs
├── Stack (HomeStack)
│   ├── Home
│   └── Profile
└── Settings
```

After creating the navigation structure, you can create a config for deep linking, which will contain mappings for each screen to a path segment. For example:

```js
const config = {
  HomeStack: 'stack',
  Home: 'home',
  Profile: 'user',
  Settings: 'settings',
};
```

Then, to get to `Home` screen in `HomeStack`, the URL would look like `/stack/home`, and for `Settings` screen, it would be `/settings` etc.

But what if you want to have parameters in the URL, like the user id of the person, whose profile you are visiting in the `Profile` screen? Or maybe you would like to define a screen that will be always present in the state for the `HomeStack` navigator? With properly defined `config` it can all be done easily, so let's do this!

### Making the config more flexible

With the above config, in order to get to `Home` or `Profile` screen, you need to have `/stack` in the URL (`/stack/home` and `/stack/user`). But it'll be much better if you could go to the `Home` screen with `/home` and `Profile` screen with `/profile`.

you can achieve the behavior by using nested navigators in your `config`. The syntax looks like that:

```js
config = {
  HomeStack: {
    path: 'stack',
    screens: {
      Home: 'home',
      Profile: 'user',
    },
  },
  Settings: 'settings',
};
```

As you can see, `Home` and `Profile` are now nested in the `screens` property of `HomeStack`. This means that when you pass the `/home` URL, it will be resolved to a `HomeStack`->`Home` state object (similarly for `/user` it would be `HomeStack`->`Profile`).

Here, the `HomeStack` property now contains a config object, and if you want to navigate straight to it, you have to provide it with the `path` property (`/stack` will go to `HomeStack`). The config can go as deep as you want, e.g. if `Home` was a navigator, you could make it an object with `screens` property, and put more screens or navigators inside it, making the URL string much more readable.

What if you wanted a specific screen to used as the initial screen in the navigator? For example, if you had a URL that would open `Home` screen, you would like to be able to navigate to `Profile` from it by using navigation's `navigation.goBack()` method. It is possible by defining `initialRouteName` for a navigator. It would look like this:

```js
config = {
  HomeStack: {
    path: 'stack',
    initialRouteName: 'Profile',
    screens: {
      Home: 'home',
      Profile: 'user',
    },
  },
  Settings: 'settings',
};
```
