---
id: configuring-links
title: Configuring links
sidebar_label: Configuring links
---

In this guide, we will configure React Navigation to handle external links. This is necessary if we want to:

1. Handle deep links in React Native app
2. Enable URL integration in browser when using on Web
3. Use [`<Link />`](link.md) or [`useLinkTo`](use-link-to.md) to navigate using links.

To handle a link, we need to translate it to a valid navigation state and vice versa. For example, the path `/rooms/chat?user=jane` may be translated to a state object like this:

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

> Note: Deep link integration uses React Native's `Linking.getInitialUrl()` under the hood. Currently there seems to be bug ([facebook/react-native#25675](https://github.com/facebook/react-native/issues/25675)) which results in it never resolving on Android. We add a timeout to avoid getting stuck forever, but it means that the link might not be handled in some cases.

Often, directly translating path segments to route names may not be the expected behavior. For example, you might want to parse the path `/feed/latest` to something like:

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
  },
};
```

Here `Chat` is the name of the screen that handles this URL. The navigator will need to have a `Chat` screen which handles a `sort` param for the route:

You can also customize how params are parsed, for example, if you parse the path `/item/42` as `item/:id`, the param `id` will be parsed as string by default. But you can customize it by passing a function:

```js
{
  Catalog: {
    path: 'item/:id',
    parse: {
      id: Number,
    },
  },
}
```

This will result in something like:

```js
const state = {
  routes: [
    {
      name: 'Catalog',
      params: { id: 42 },
    },
  ],
};
```

It's important to note that the state object must match the hierarchy of nested navigators. Otherwise the state will be discarded.

Sometimes we'll have the target navigator nested in other navigators which aren't part of the deep link. For example, let's say our navigation structure looks like this:

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

Here we have a stack navigator in the root, and inside the `Home` screen of the root stack, we have a tab navigator with various screens. With this structure, let's say we want the path `/users/:id` to go to the `Profile` screen. We can express the nested config like so:

```js
{
  Home: {
    screens: {
      Profile: 'users/:id',
    },
  },
}
```

In this config, we specify that the `Profile` screen should be resolved for the `users/:id` pattern and it's nested inside the `Home` screen. Then parsing `users/jane` will result in the following state object:

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

Sometimes we want to ensure that a certain screen will always be present for the navigator in the state object. We can achieve it by specifying the `initialRouteName` property for that navigator in the config. For the above example, if we want the `Notifications` screen to be the initial route in `Home` tab navigator, we should specify such config (`Notifications` screen needn't be mentioned in `screens` property):

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
          {
            name: 'Notifications',
          },
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

Notice that we can't pass any params to the `Notifications` screen if it isn't explicitly mentioned in the URL string, so the screen should implement handling lack of these params with e.g. providing default ones.

For some advanced cases, specifying the mapping may not be sufficient. You can implement your custom parser to address these cases using the `getStateFromPath` option:

```js
const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    Chat: 'feed/:sort',
  },
  getStateFromPath: (path, options) => {
    // Implement your custom parser and return the navigation state here
  },
};
```

## Example App

### Overview

In the example app, we will use the Expo managed workflow. The guide will focus on creating the deep linking configuration and not on creating the components themselves, but you can always check the full implementation in the [github repo](https://github.com/WoLewicki/DeepLinkingExample).

### Getting Started

In the beginning, we need to create a structure for our application. To keep it simple, the main navigator will be bottom-tabs navigator with two screens. Its first screen will be a simple stack navigator, called `HomeStack`, with two screens: `Home` and `Profile`, and the second tabs screen will be just a simple one without any nested navigators, called `Settings`. After creating the app's structure, we can prepare a deep linking config object, which will statically recreate the structure with a URL path matching every state we would like to achieve. In our example, it would perhaps look like this:

```js
config = {
  HomeStack: 'stack',
  Home: 'home',
  Profile: 'user',
  Settings: 'settings',
};
```

Then, to get to `Home` screen in `HomeStack`, the URL would look like `/stack/home`, and for `Settings` screen, it would be `/settings`.
For such an app, without any parameters added to the routes and a very simple structure, it doesn't make too much sense to explicitly create `config`. If it wasn't present, the routes would be parsed by their names, so the first URL would have to be `/HomeStack/Home` and the second one `/Settings`.

But what if we want to have parameters in the URL, like the name of the person, whose profile we are visiting in the `Profile` screen? Or maybe we would like to define a screen that will be always present in the state for the `HomeStack` navigator? With properly defined `config` it can all be done easily, so let's do this!

### Defining better config

Even for such a simple configuration, we can make some optimization.
With the above config, in order to get to `Home` or `Profile` screen, we need to pass two "elements" to the URL. We can reduce it to only one by introducing nested navigators in our `config`. The syntax looks like that:

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

As we can see, `Home` and `Profile` are now nested in the `screens` property of `HomeStack`. This means that when you pass the `/home` URL, it will be resolved to a `HomeStack`->`Home` state object (similarly for `/user` it would be `HomeStack`->`Profile`). `HomeStack`'s value became an object and if we want to navigate straight to it, we have to provide it with the `path` property. The good thing about such config is that it can go as deep as you want, e.g. if `Home` was a navigator, you could make it an object with `screens` property, and put more screens or navigators inside it, making the URL string much shorter.

What if we wanted a specific screen to be always present in the state object for a navigator? For example, if we had a URL that would open `Home` screen, but we would like to be able to navigate to `Profile` from it by using navigation's `navigation.goBack()` method. It is possible by defining `initialRouteName` for a navigator. It would look like this then:

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

### Passing parameters to screens

A common case in having navigation in the application is passing parameters to the screens while navigating between them. In our example, we want the `Profile` screen to have the `id` param. While in app, we pass that param as a property of an object in the second argument of `navigation.navigate()` function. If we want to pass such param while opening the screen through deep linking, we can achieve it by extending the config for the screen. For `id` in `Profile`, it would be `Profile: 'user/:id'`. `/` is the separator between the path and each of the parameters. Passing URL `user/Wojciech` would resolve to `Profile` screen with a 'Wojciech' as a value of the `id` param in the screen params. It can be extracted from `route.params.id` in the screen component.

Sometimes we want to parse the param in a specific way. By default, all params are parsed to the screen as strings, but we can define a `parse` property, which will handle parsing, and `stringify` property to convert it back to a string. If we wanted to resolve `user/Wojciech/22` to user's age as a number and a modified id, we could make `Profile`'s config look like this:

```js
Profile: {
  path: 'user/:id/:age',
  parse: {
    id: id => `user-${id}`,
    age: Number,
  },
  stringify: {
    id: id => id.replace(/^xxx-/)
  }
}
```

Similarly to web URLs, there is also an option of using query params, which can only be applied to the deepest screen in the URL. To apply it to our config, the URL would look like this: `user?id=Wojciech&age=22` and config would not include params in the `path` property:

```js
Profile: {
  path: 'user',
  parse: {
    id: id => `user-${id}`,
    age: Number,
  },
  stringify: {
    id: id => id.replace(/^xxx-/)
  }
}
```

### Specific configuration

Here we will mention some of the consequences of using nested navigators in the config.

1. Using `initialRouteName` makes the screen always appear in the state of a navigator. It makes it impossible to pass params to that screen through the URL unless the screen is explicitly mentioned in it. It is then reasonable for that screen not to take any params or to provide default ones.

2. Having multiple screens of a nested navigator present in the state object is not possible through a one-part URL string. We also cannot provide a URL like (for the above configuration) `/user/home`, because it would be resolved to `HomeStack->Profile->HomeStack->Home`, If we want to get rid of the second `HomeStack`, we can provide an explicit config for the `Home` screen in the first level of config nesting (remember to provide a different path string for each occurrence of a screen in the config):

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
     Home: 'first',
   };
   ```

   Then `/user/first` will resolve to `HomeStack->Profile->Home`.

   We can also make the config not include nested navigator, which will make the URL even longer, but maybe a bit less confusing.

   ```js
   config = {
     HomeStack: 'stack',
     Home: 'home',
     Profile: 'user',
     Settings: 'settings',
   };
   ```

   Then `/stack/user/home` will resolve to `HomeStack->Profile->Home`.

3. Usage of the nested navigators disables the option of passing any params to the routes in the nested state, except for the last one. It shouldn't be a problem, because only the last part of the nested config should be a screen, while rest being navigators, which don't take any params.

4. There is an option to retrieve the URL path that would lead to the present state of navigation by calling `getPathFromState()`. The function takes the current navigation state as the first argument (it can be retrieved by using `useNavigationState()` hook) and optionally the `config` object as the second argument. The navigation in the application shouldn't typically be this complicated for the user to use this function.
