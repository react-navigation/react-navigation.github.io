---
title: React Navigation 7.0 Release Candidate
author: Satyajit Sahoo
author_url: https://twitter.com/satya164
author_title: Core Team
author_image_url: https://avatars2.githubusercontent.com/u/1174278?s=200&v=4
tags: [announcement]
---

We're excited to announce the release candidate of React Navigation 7.0.

This release includes a new static API that simplifies the configuration of navigators and improves TypeScript and deep linking support. As well as various other improvements and new features.

<!--truncate-->

You can read the full list of changes in the [upgrade guide](/docs/upgrading-from-6.x). Here are some highlights:

## Highlights

### Static API

The new static API is an optional API that simplifies the configuration of navigators and makes it easier to work with TypeScript and deep linking.

It follows the same principles as the dynamic API, but instead of defining screens using functions, you define them using a configuration object, similar to React Navigation 4:

```js
const Stack = createStackNavigator({
  screens: {
    Home: {
      screen: Home,
    },
    Profile: {
      screen: Profile,
    },
    Settings: {
      screen: Settings,
    },
  },
});
```

For more details and examples, check out the [introduction to the static API](/blog/2024-03-25-introducing-static-api.md) blog post.

### Preloading screens

Many navigators now support preloading screens prior to navigating to them. This can be useful to improve the perceived performance of the app by preloading the screens that the user is likely to navigate to next. Preloading a screen will render it off-screen and execute its side-effects such as data fetching.

To preload a screen, you can use the `preload` method on the navigation object:

```js
navigation.preload('Details', { id: 42 });
```

### Sidebar support in Bottom Tab Navigator

The Bottom Tab Navigator now supports showing tabs on the side by specifying `tabBarPosition` option as `'left'` or `'right'`. This will make it easier to build responsive UIs for where you want to show tabs on the bottom on smaller screens and switch to a sidebar on larger screens.

![Sidebar support in Bottom Tab Navigator](/assets/blog/7.x/bottom-tabs-sidebar.png)

### Animation support in Bottom Tab Navigator

The Bottom Tab Navigator now supports animations when switching between tabs. You can customize the animation using the `animation` option.

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/bottom-tabs-shift.mp4" />
</video>

### `react-native-drawer-layout` package

The drawer implementation used in `@react-navigation/drawer` is now available as a standalone package called `react-native-drawer-layout`. This makes it easier to use the drawer implementation even if you're not using React Navigation, or if you want to use it without a navigator.

You can install it with:

```bash npm2yarn
npm install react-native-drawer-layout@next
```

See [`react-native-drawer-layout`](/docs/drawer-layout) for usage.

## Try it out

If you'd like to try it out, add `@next` to the package, you're installing. For example:

```sh npm2yarn
npm install @react-navigation/native@next @react-navigation/bottom-tabs@next
```

This is the best time to try it out and provide feedback before the final release. If you encounter any issues or have any feedback or suggestions, please let us know on [GitHub issues](https://github.com/react-navigation/react-navigation/issues) or our [GitHub Discussions forum](https://github.com/react-navigation/react-navigation/discussions).

## Special thanks

I'd like to extend a big thank you to all the contributors who helped with this release. Your contributions are what make React Navigation great.

I want to give a special shoutout to [Michał Osadnik](https://x.com/mosdnk) for working through many of the features and improvements in this release as well as providing much-needed motivation.

Many thanks to [Patrycja Kalińska](https://x.com/patkalinska) from [Software Mansion](https://swmansion.com/) for helping with the documentation.

I'd also like to thank [Tymoteusz Boba](https://x.com/tboba_) and [Kacper Kafara](https://x.com/kafara_kacper) from the [React Native Screens](https://github.com/software-mansion/react-native-screens). React Navigation wouldn't be where it is today without React Native Screens.

Last but not least, without dedicated time from [Callstack](https://callstack.com/), it would be impossible to maintain and improve React Navigation.

## Sponsor us

If React Navigation helps you to deliver value to your customers, it'd mean a lot if you could sponsor us. Sponsorships will help us to move more quickly towards our goal of building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈
