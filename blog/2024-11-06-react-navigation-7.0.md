---
title: React Navigation 7.0
author: Satyajit Sahoo
author_url: https://twitter.com/satya164
author_title: Core Team
author_image_url: https://avatars2.githubusercontent.com/u/1174278?s=200&v=4
tags: [announcement]
---

The documentation is now live at [reactnavigation.org](/docs/getting-started), and v6 lives [here](/docs/6.x/getting-started).

React Navigation 7 aims to improve the developer experience with a new static API as well as bring many new features and improvements.

<!--truncate-->

## Highlights

- [**Static API**](/docs/hello-react-navigation?config=static): The new static API is an optional API that simplifies the configuration of navigators and makes it easier to work with TypeScript and deep linking.
- [**Preloading screens**](/docs/navigation-object/#preload): Many navigators now support preloading screens prior to navigating to them. This can be useful to improve the perceived performance of the app by preloading the screens that the user is likely to navigate to next.
- [**Layout props**](/docs/navigator#layout): Navigators and screens now support `layout` props to augment the navigators with additional UI and behavior.
- [**Improved Web integration**](/docs/web-support): The built in navigators now have better web-support such rendering anchor tags for more elements. The `Link` and `useLinkProps` APIs have also been revamped to use screen names instead of paths.
- [**Searchbar support in all navigators with header**](/docs/elements#headersearchbaroptions): All navigators with header now support a searchbar in the header. You can customize the searchbar using the `headerSearchBarOptions` option.
- [**New `useLogger` devtool to replace flipper plugin**](/docs/devtools#uselogger): The `use logger` hook can show navigation actions and state in the console for debugging.
- [**Sidebar support in Bottom Tab Navigator**](/docs/bottom-tab-navigator#tabbarposition): The Bottom Tab Navigator now supports showing tabs on the side by specifying `tabBarPosition` option as `'left'` or `'right'`.
- [**Animation support in Bottom Tab Navigator**](/docs/bottom-tab-navigator#animations): The Bottom Tab Navigator now supports animations when switching between tabs. You can customize the animation using the `animation` option.
- [**`react-native-drawer-layout` package**](/docs/drawer-layout): The drawer implementation used in `@react-navigation/drawer` is now available as a standalone package called `react-native-drawer-layout`.
- Many other improvements and bug fixes.

See our [blog post for the release candidate](/blog/2024-06-27-react-navigation-7.0-rc.md) for a more detailed list of highlights.

To see the full list of changes, check out the [upgrade guide](/docs/upgrading-from-6.x).

## Upgrading

In addition to the new features and improvements, React Navigation 7 also includes a number of breaking changes. We've put together a [detailed upgrade guide](/docs/upgrading-from-6.x) to help you migrate your app to the latest version.

## Special thanks

I'd like to extend a big thank you to all the contributors who helped with this release. Your contributions are what make React Navigation great.

I want to give a special shoutout to [Michał Osadnik](https://x.com/mosdnk) for working through many of the features and improvements in this release as well as providing much-needed motivation.

Many thanks to [Patrycja Kalińska](https://x.com/patkalinska) and [Ania Cichocka](https://github.com/AnCichocka) from [Software Mansion](https://swmansion.com/) for helping with the documentation.

I'd also like to thank [Tymoteusz Boba](https://x.com/tboba_), [Maciej Stosio](https://x.com/maciekstosio) and [Kacper Kafara](https://x.com/kafara_kacper) from the [React Native Screens](https://github.com/software-mansion/react-native-screens). React Navigation wouldn't be where it is today without React Native Screens.

Last but not least, without dedicated time from [Callstack](https://callstack.com/), it would be impossible to maintain and improve React Navigation.

## Sponsor us

If React Navigation helps you to deliver value to your customers, it'd mean a lot if you could sponsor us. Sponsorships will help us to move more quickly towards our goal of building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈
