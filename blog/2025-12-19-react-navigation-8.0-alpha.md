---
title: React Navigation 8.0 Alpha
authors: satya
tags: [announcement]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

We're excited to announce the first alpha release of React Navigation 8.0.

For this release, we tried to minimize large breaking changes when possible, and focused on improvements such as better TypeScript types, native bottom tabs as the default, and various other new features. There are many more improvements planned for the final release.

<!--truncate-->

You can read the full list of changes in the [upgrade guide](/docs/8.x/upgrading-from-7.x). Here are some highlights:

## Highlights

### Native Bottom Tabs by default

The Bottom Tab Navigator now uses native primitives by default on iOS and Android based on [`react-native-screens`](https://github.com/software-mansion/react-native-screens).

This lets us provide a native look by default, such as the new liquid glass effect on iOS 26.

<video playsInline autoPlay muted loop style={{ width: '500px', aspectRatio: 3 / 1 }}>

  <source src="/assets/blog/8.x/native-bottom-tabs-ios.mp4" />
</video>

<video playsInline autoPlay muted loop style={{ width: '500px', aspectRatio: 3 / 1 }}>

  <source src="/assets/blog/8.x/native-bottom-tabs-android.mp4" />
</video>

We made the native implementation the default because we believe that the default experience should be as close to platform conventions as possible.

However, we still include a custom JS-based implementation to avoid breaking existing apps and support other platforms such as Web. You can switch to the JS implementation by passing the [`implementation`](/docs/8.x/bottom-tab-navigator#implementation) prop as `custom` to the navigator.

See [Bottom Tab Navigator docs](/docs/8.x/bottom-tab-navigator) for more details.

### Access to `route`, `navigation`, and state for any parent screen

One of the commonly requested features has been for screens to be able to access the params for parent screens, but this had a few problems:

- Passing down params to child screens may lead to unnecessary re-renders when the parent params change, even when they are not needed by the child screen.
- Since the param types are defined by the screen itself, having additional parent params would not be compatible with the existing type system.

It was necessary to manually set up React Context to pass down parent params, which was cumbersome.

The new screen name parameter in `useRoute` solves these problems. Now, you can access the parent route and its params directly by specifying the screen name:

```js
const route = useRoute('Profile');

// Params for the 'Profile' screen
console.log(route.params);
```

Similarly, you can get the `navigation` object for any parent screen by specifying the screen name in `useNavigation`:

```js
const navigation = useNavigation('Profile');

// Navigation object for the 'Profile' screen
console.log(navigation);
```

And you can get the navigation state for any parent screen by specifying the screen name in `useNavigationState`:

```js
const focusedRoute = useNavigationState(
  'Profile',
  (state) => state.routes[state.index]
);

// Focused route for the navigator that contains the 'Profile' screen
console.log(focusedRoute);
```

See [`useRoute`](/docs/8.x/use-route), [`useNavigation`](/docs/8.x/use-navigation), and [`useNavigationState`](/docs/8.x/use-navigation-state) for more details.

### Better TypeScript types for static configuration

One of the goals of React Navigation has always been to work well with TypeScript. React Navigation 5 was built from the ground up with TypeScript support, even though it required a lot of boilerplate, the basic blocks were there. In React Navigation 7, we introduced a static API to reduce boilerplate with automatic type inference. However, it still required manual type annotations in some cases and didn't express React Navigation's full capabilities. So we had more work to do to get to a point that we're happy with.

In this release, we've built upon the static API and reworked the type inference to solve many of these issues.

Hooks like `useNavigation`, `useRoute`, and `useNavigationState` now automatically infer types based on the provided screen name:

```js
const navigation = useNavigation('Profile');

// navigation is correctly typed as StackNavigationProp<RootStackParamList, 'Profile'>
```

The `navigation` object will now have proper types based on navigator nesting, and will include navigator-specific methods such as `openDrawer` for drawer navigators or `push` for stack navigators without requiring manual type annotations.

<video playsInline autoPlay muted loop data-landscape>
  <source src="/assets/blog/8.x/use-navigation.mp4" />
</video>

The `useRoute` hook now returns a union of all route types in the project when no screen name is provided, so it can be used in reusable components while still providing type safety.

It will return the appropriate route type when a screen name is specified:

```js
const route = useRoute('Profile');

// route is correctly typed as RouteProp<RootStackParamList, 'Profile'>
```

<video playsInline autoPlay muted loop data-landscape>
  <source src="/assets/blog/8.x/use-route.mp4" />
</video>

Similarly, the `useNavigationState` hook will infer the correct state type for the navigator that contains the specified screen:

```js
const focusedRoute = useNavigationState(
  'Profile',
  (state) => state.routes[state.index]
);

// state is correctly typed as StackNavigationState<RootStackParamList>
```

In addition, previously, the type of the `route` object couldn't be inferred in screen callbacks, listener callbacks, etc. This made it difficult to use route params in these callbacks.

The new `createXScreen` helper functions address this:

```js
const Stack = createStackNavigator({
  screens: {
    // highlight-next-line
    Profile: createStackScreen({
      screen: ProfileScreen,
      options: ({ route }) => {
        const userId = route.params.userId;

        return {
          title: `${userId}'s profile`
        };
      },
    });
  }
});
```

Here, the type of `route.params` is correctly inferred based on the type annotation of `ProfileScreen`.

Not only that, but it also infers types based on the path pattern in the `linking` configuration specified for the screen:

```js
const Stack = createStackNavigator({
  screens: {
    Profile: createStackScreen({
      screen: ProfileScreen,
      // highlight-start
      linking: {
        path: 'profile/:userId',
        parse: {
          userId: (userId) => Number(userId),
        },
      },
      // highlight-end
    });
  }
});
```

In this case, React Navigation can automatically infer that `userId` is a param of type `number` based on `:userId` in the path pattern and the return type of `userId` in the `parse` config. This is inspired by how [TanStack Router infers types based on the URL pattern](https://tanstack.com/router/latest/docs/framework/solid/decisions-on-dx#declaring-the-router-instance-for-type-inference).

<video playsInline autoPlay muted loop data-landscape>
  <source src="/assets/blog/8.x/params-types.mp4" />
</video>

Each navigator exports its own helper function, e.g. `createNativeStackScreen` for Native Stack Navigator, `createBottomTabScreen` for Bottom Tab Navigator, `createDrawerScreen` for Drawer Navigator etc.

With all of these improvements, it's technically possible to write an app without any manual type annotations for React Navigation, since we can infer the route type from path pattern and param parsing logic, and return the correct type for `navigation` object, `route` object, and navigation state based on the screen name and navigation structure automatically.

See [TypeScript docs](/docs/8.x/typescript) and [Static configuration docs](/docs/8.x/static-configuration) for more details.

### Push history entries without pushing new screens

Traditionally, the only way to add a new entry to the history stack was by pushing a new screen. But it's not always desirable, as it adds an entirely new instance of the screen component and shows transition animations.

For many scenarios, we may want to add a new history entry without pushing a new screen. Such as:

- A product listing page with filters, where changing filters should create a new history entry so that users can go back to previous filter states.
- A screen with a custom modal component, where the modal is not a separate screen in the navigator, but its state should be reflected in the URL and history.

The new `pushParams` API makes this possible. You can now push an entry to the history stack by adding new params without needing to push a new screen. Then the back button will update the screen to the previous params instead of going back a screen.

<video playsInline autoPlay muted loop data-landscape style={{ '--ifm-global-radius': '10px' }}>

  <source src="/assets/blog/8.x/push-params.mp4" />
</video>

This is especially important on the Web, where users expect that changing certain UI states should create a new history entry, so that they can use the browser back and forward buttons to navigate through these states.

See [`pushParams` docs](/docs/8.x/navigation-object#pushparams) for more details.

### `PlatformColor`, `DynamicColorIOS` and CSS custom properties in theme

Previously, React Navigation's theming system only supported string color values. In this release, we've added support for platform-specific dynamic colors such as `PlatformColor` and `DynamicColorIOS` on native, as well as CSS custom properties on the Web.

This makes it easier to use system colors as well as share colors across native components and React Navigation components.

```js
const MyTheme = {
  ...DefaultTheme,
  colors: Platform.select({
    ios: () => ({
      primary: PlatformColor('systemRed'),
      background: PlatformColor('systemGroupedBackground'),
      // ...
    }),
    android: () => ({
      primary: PlatformColor('@android:color/system_primary_light'),
      // ...
    }),
    default: () => DefaultTheme.colors,
  })(),
};
```

However, there's one limitation: with string colors, React Navigation can automatically adjust colors in some scenarios (e.g. adjust the text color based on background color), which is not possible with dynamic colors. So it will fallback to pre-defined colors according to the theme in these cases.

See [Themes docs](/docs/8.x/themes) for more details.

### Deep link to screens behind conditional rendering

Conditionally defining screens is a common pattern for [handling authentication flows](/docs/8.x/auth-flow). But if a user opened a deep link to a screen that's behind a condition like auth, previously it would just get ignored.

It wasn't ideal, and [working around this limitation](https://www.callstack.com/blog/deep-links-with-authentication-in-react-navigation) was not straightforward either. We tried to solve this in React Navigation 7, but the approach we had in mind was problematic, so we decided to revisit it later.

Now we have a better approach in React Navigation 8 which is also straightforward to use:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createStackNavigator({
  // highlight-next-line
  routeNamesChangeBehavior: 'lastUnhandled',
  screens: {
    // ...
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
function MyStack() {
  return (
    <Stack.Navigator
      // highlight-next-line
      routeNamesChangeBehavior="lastUnhandled"
    >
      {/* ... */}
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

<video playsInline autoPlay muted loop style={{ width: '500px', aspectRatio: 1 / 1 }}>

  <source src="/assets/blog/8.x/deep-link-auth.mp4" />
</video>

The navigator will remember the last unhandled action (such as an unhandled deep link) if `routeNamesChangeBehavior: 'lastUnhandled'` is specified. When the list of route names changes (e.g. new screens become available), it will try to handle the action again. See [`routeNamesChangeBehavior` docs](/docs/8.x/navigator#route-names-change-behavior) for more details.

We also backported this feature to React Navigation 7 with an `UNSTABLE_` prefix as [`UNSTABLE_routeNamesChangeBehavior`](/docs/auth-flow#handling-deep-links-after-auth), so you can try it out in your existing apps without needing to upgrade.

### Persistor for state persistence

One of the very nice features is persisting navigation state across app restarts. It can be used to improve UX by making sure the user doesn't lose their place in the app.

What I really like is to use it during development. Fast Refresh is great, but full reload's can't always be avoided. Being put back to where I was before is really nice to continue working - even more so if my work involved multiple screens in a flow.

While it was possible to implement this using `onStateChange` and `initialState`, it required some boilerplate code and handling additional cases, e.g. don't restore state if there is a deep link.

To make this simpler, we've added a `persistor` prop which takes care of these details:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
function App() {
  return (
    <Navigation
      // highlight-start
      persistor={{
        async persist(state) {
          await AsyncStorage.setItem(
            'NAVIGATION_STATE_V1',
            JSON.stringify(state)
          );
        },
        async restore() {
          const state = await AsyncStorage.getItem('NAVIGATION_STATE_V1');

          return state ? JSON.parse(state) : undefined;
        },
      }}
      // highlight-end
    />
  );
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
function App() {
  return (
    <NavigationContainer
      // highlight-start
      persistor={{
        async persist(state) {
          await AsyncStorage.setItem(
            'NAVIGATION_STATE_V1',
            JSON.stringify(state)
          );
        },
        async restore() {
          const state = await AsyncStorage.getItem('NAVIGATION_STATE_V1');

          return state ? JSON.parse(state) : undefined;
        },
      }}
      // highlight-end
    >
      {/* ... */}
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

See [State persistence docs](/docs/8.x/state-persistence) for more details.

## Plans for the final release

This is just the first alpha release of React Navigation 8.0. Some of the plans for the final release include:

- API to handle insets for navigation elements such as headers and tab bars
- Show Navigation events in React Navigation Devtools
- Improve accessibility on Web by utilizing [`inert`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert)
- Integrate [`Activity`](https://react.dev/reference/react/Activity) for inactive screens

## Try it out

If you'd like to try it out, add `@next` to the package you're installing. For example:

```sh npm2yarn
npm install @react-navigation/native@next @react-navigation/bottom-tabs@next
```

Your feedback is very important to us to ensure a smooth final release. If you encounter any issues or have any feedback or suggestions, please let us know on [GitHub issues](https://github.com/react-navigation/react-navigation/issues) or our [GitHub Discussions forum](https://github.com/react-navigation/react-navigation/discussions).

## Special thanks

React Navigation 8 would not have been possible without our amazing contributors.

Thanks a lot to [Kacper Kafara](https://x.com/kafara_kacper), [Krzysztof Ligarski](https://github.com/kligarski), [Tomasz Boroń](https://github.com/t0maboro), [Konrad Michalik](https://github.com/kmichalikk) from the [React Native Screens](https://github.com/software-mansion/react-native-screens) team at [Software Mansion](https://swmansion.com/), as well as [Michał Osadnik](https://x.com/mosdnk), [Oskar Kwaśniewski](https://github.com/okwasniewski) and many others for their contributions to this release.

And a big thanks to [Callstack](https://callstack.com/) for funding the development of many of these features!

## Sponsor us

If React Navigation helps you to deliver value to your customers, it'd mean a lot if you could sponsor us. Sponsorships will help us to move more quickly towards our goal of building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈
