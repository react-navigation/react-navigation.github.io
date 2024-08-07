---
title: On the way to React Navigation 6.0
author: Satyajit Sahoo
author_url: https://twitter.com/satya164
author_title: Core Team
author_image_url: https://avatars2.githubusercontent.com/u/1174278?s=200&v=4
tags: [release, announcement]
---

We're excited to announce that we finally have a prerelease version of React Navigation 6. We released React Navigation 5 more than half a year ago, and it brought a lot of new possibilities with the new dynamic API, and was met with overwhelmingly positive reaction. Since then, we've been working on incremental improvements and refinements to the library and thinking about how to make it even better. This brings us to the next major version of React Navigation.

<!--truncate-->

While React Navigation 5 was complete overhaul to the API of React Navigation, React Navigation 6 keeps the same API, with some breaking changes to make things more consistent and provide more flexibility. We also tried to address some common pain points and confusions that users had.

We'll share few highlights of the release in this blog post. If you're looking for a detailed upgrade guide, you can find it [here](/docs/upgrading-from-5.x).

## Highlights

- Params are now overwritten on navigation instead of merging (with option to merge them)
- Modals in [stack](/docs/stack-navigator) now use the presentation style on iOS by default, and there's a new slide animation for modals on Android
- [Drawer](/docs/drawer-navigator) now uses a slide animation by default on iOS
- Headers are now shown by default in [drawer](/docs/drawer-navigator) and [bottom tab](/docs/bottom-tab-navigator) screens, so you don't need extra stack navigators
- We got rid of `tabBarOptions`, `drawerContentOptions` etc. and moved those to [`options` prop on screen](/docs/screen-options) to make it possible to configure them per screen
- [Material Top Tabs](/docs/material-top-tab-navigator) now use a `ViewPager` based implementation, which means it'll provide a native experience
- We now have a [UI elements library](/docs/elements) which contains various components we use in React Navigation

## Try it out

If you'd like to try it out, add `@^6.x` to the package, you're installing. For example:

```bash npm2yarn
npm install @react-navigation/native@^6.x @react-navigation/stack@^6.x
```

## What's next?

We're planning to update our documentation to recommend [native-stack](/docs/native-stack-navigator) as the default. This will provide the best performance for people who don't need a lot of customization, while still having the option to use the JavaScript based implementation if they need it.

## Sponsor us

If React Navigation helps you to deliver value to your customers, it'd mean a lot if you could sponsor us. Sponsorships will help us to move more quickly towards our goal of building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈

---

We hope you find this release useful. Make sure to try the release out and provide feedback on what we can improve. You can open an issue in the [GitHub rep](https://github.com/react-navigation/react-navigation) or tweet to us [@reactnavigation](https://twitter.com/reactnavigation).
