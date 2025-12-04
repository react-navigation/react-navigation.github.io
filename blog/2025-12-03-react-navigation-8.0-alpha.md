---
title: React Navigation 8.0 Alpha
authors: satya
tags: [announcement]
---

We're excited to announce the first alpha release of React Navigation 8.0.

This release focuses on improved TypeScript types for static configuration, native bottom tabs as the default, and various other improvements and new features. And there are many more improvements planned for the final release.

<!--truncate-->

You can read the full list of changes in the [upgrade guide](/docs/8.x/upgrading-from-7.x). Here are some highlights:

## Highlights

### Native Bottom Tabs by default

The Bottom Tab Navigator now uses native implementations by default on iOS and Android based on [`react-native-screens`](https://github.com/software-mansion/react-native-screens). This lets us to support the new liquid glass effect on iOS 26 and provide a more native feel by default. Making it default also helps with adoption.

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/native-bottom-tabs-android.mp4" />
</video>

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/native-bottom-tabs-ios.mp4" />
</video>

We also include a custom JS based implementation in order to support Web and more customization options. You can switch to the JS implementation by passing the `implementation` prop to the navigator.

See [Bottom Tab Navigator docs](/docs/8.x/bottom-tab-navigator) for more details.

### Ability to get `route`, `navigation`, and state for any parent screen

Hooks such as `useRoute`, `useNavigation`, and `useNavigationState` now accept a screen to get the corresponding `route`, `navigation`, and state respectively for any parent screen The `navigation` object already had a `getParent` method, so this is not a new capability for `useNavigation`, but it was not possible for `useRoute` and `useNavigationState` before.

One of the commonly requested features has been for screens to be able to access the params for parent screens, but this had a few problems:

- Passing down params to child screens may lead to unnecessary re-renders when the parent params change, even when they are not needed by the child screen.
- Since the param types are defined by the screen itself, having additional parent params would not be compatible with the existing type system.

It was necessary to manually setup React Context to pass down parent params, which was cumbersome.

The screen name parameter in `useRoute` solves these problems. Now, you can access the parent route and its params directly by specifying the screen name:

```js
const route = useRoute('Profile');

console.log(route.params); // Params for the 'Profile' screen
```

Similarly, you can get the `navigation` object for any parent screen:

```js
const navigation = useNavigation('Profile');

console.log(navigation); // Navigation object for the 'Profile' screen
```

And you can get the navigation state for any parent screen:

```js
const focusedRoute = useNavigationState(
  'Profile',
  (state) => state.routes[state.index]
);

console.log(focusedRoute); // Focused route for the navigator which contains the 'Profile' screen
```

See [`useRoute`](/docs/8.x/use-route), [`useNavigation`](/docs/8.x/use-navigation), and [`useNavigationState`](/docs/8.x/use-navigation-state) for more details.

### Better TypeScript types for static configuration

In React Navigation 7, we introduced a static API for configuring navigators. However, some TypeScript types required manual annotations. We've reworked the types to solve many of these issues.

Hooks like `useNavigation`, `useRoute`, and `useNavigationState` now automatically infer types based on the provided screen name:

```js
const navigation = useNavigation('Profile');

// navigation is correctly typed as StackNavigationProp<RootStackParamList, 'Profile'>
```

The `navigation` object will now have proper types based on navigator nesting, and will include navigator specific methods such as `openDrawer` for drawer navigators or `push` for stack navigators without requiring manual type annotations.

Similarly, `useRoute` will return the correct route type with properly typed params:

```js
const route = useRoute('Profile');

// route is correctly typed as RouteProp<RootStackParamList, 'Profile'>
```

And `useNavigationState` will infer the correct state type for the specified screen:

```js
const focusedRoute = useNavigationState(
  'Profile',
  (state) => state.routes[state.index]
);

// state is correctly typed as StackNavigationState<RootStackParamList>
```

In addition, previously, the type of `route` object can't be inferred in screen callback, listeners callback etc. This made it difficult to use route params in these callbacks.

The new `createXScreen` helper functions addresses this:

```js
const Stack = createStackNavigator({
  screens: {
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

Here, the type of `route.params` is correctly inferred based on the type annotation of `ProfileScreen`. Each navigator exports its own helper function, e.g. `createNativeStackScreen` for Native Stack Navigator, `createBottomTabScreen` for Bottom Tab Navigator, `createDrawerScreen` for Drawer Navigator etc.

See [TypeScript docs](/docs/8.x/typescript) and [Static configuration docs](/docs/8.x/static-configuration) for more details.

### Pushing history entries without pushing new screens

One of the things React Navigation lacked was to add a new history entry without pushing a new screen. But this is not always desirable, as pushing a new screen adds an entirely new instance of the screen component, and shows transition animations.

This is useful for many scenarios:

- A product listing page with filters, where changing filters should create a new history entry so that users can go back to previous filter states.
- A screen with a custom modal component, where the modal is not a separate screen in the navigator, but its state should be reflected in the URL and history.

Especially on the web, users expect that changing certain UI states should create a new history entry, so that they can use the browser back and forward buttons to navigate through these states.

The new `pushParams` API makes this possible. You can now push an entry to the history stack by adding new params without needing to push a new screen.

See [`pushParams` docs](/docs/8.x/navigation-object#pushparams) for more details.

### Replacing params

Previously, the only way to update screen params was via the `setParams` action, it took an object containing the params and merged them with the existing params. But removing params required setting them to `undefined`, which was not very intuitive.

The new `replaceParams` action replaces params entirely instead of merging them. This makes it easier to use a new set of params without needing to worry about removing old params.

See [`replaceParams` docs](/docs/8.x/navigation-object#replaceparams) for more details.

### Support for `PlatformColor`, `DynamicColorIOS` and CSS custom properties in theme colors

React Navigation has its own theming system to change styling for the built-in components. Previously, it only supported string color values. In this release, we've added support for platform-specific dynamic colors such as `PlatformColor` and `DynamicColorIOS` on native, as well as CSS custom properties on the web.

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

This comes with one limitation: with string colors, React Navigation can automatically adjust colors in some scenarios (e.g. adjust the text color based on background color), which is not possible with dynamic colors. So it will fallback to pre-defined colors according to the theme in these cases.

See [Themes docs](/docs/8.x/themes) for more details.

## Try it out

If you'd like to try it out, add `@alpha` to the package you're installing. For example:

```sh npm2yarn
npm install @react-navigation/native@alpha @react-navigation/bottom-tabs@alpha
```

Your feedback is very important to us to ensure a smooth final release. If you encounter any issues or have any feedback or suggestions, please let us know on [GitHub issues](https://github.com/react-navigation/react-navigation/issues) or our [GitHub Discussions forum](https://github.com/react-navigation/react-navigation/discussions).

## Special thanks

React Navigation 8 would not have been possible without our amazing contributors.

Thanks a lot to [Michał Osadnik](https://x.com/mosdnk), [Kacper Kafara](https://x.com/kafara_kacper), [Krzystof Ligarski](https://github.com/kligarski), [Tomasz Boroń](https://github.com/t0maboro), [Konrad Michalik](https://github.com/kmichalikk), [Oskar Kwaśniewski](https://github.com/okwasniewski) and many others for their contributions to this release.

## Sponsor us

If React Navigation helps you to deliver value to your customers, it'd mean a lot if you could sponsor us. Sponsorships will help us to move more quickly towards our goal of building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈
