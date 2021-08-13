---
title: React Navigation 6.0
author: Satyajit Sahoo
author_url: https://twitter.com/satya164
author_title: Core Team
author_image_url: https://avatars2.githubusercontent.com/u/1174278?s=200&v=4
tags: [release, announcement]
---

The documentation is now live at [reactnavigation.org](https://reactnavigation.org), and v5 lives [here](/docs/5.x/getting-started).

Largely, React Navigation 6 keeps the same core API as React Navigation 5, and you can think of it as further polishing what was in React Navigation 5. Let's talk about the highlights of this release in this blog post.

<!--truncate-->

## Highlights

### More flexible navigators

Many of the navigators accept some of the customization options as props, which means, we can’t customize them based on the active screen. To make this possible, we needed to move these props to options that you can configure per screen.

In React Navigation 6, many of the props are now screen's options, the most significant ones are `tabBarOptions` and `drawerContentOptions`, where all of them are moved to `options` instead. For example,

Before:

```js
<Tab.Navigator
  tabBarOptions={{
    inactiveTintColor: 'rgba(255, 255, 255, 0.5)',
    activeTintColor: '#fff',
    style: {
      position: 'absolute',
      borderTopColor: 'rgba(0, 0, 0, .2)',
    },
  }}
>
```

After:

```js
<Tab.Navigator
  screenOptions={{
    tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
    tabBarActiveTintColor: '#fff',
    tabBarStyle: {
      position: 'absolute',
      borderTopColor: 'rgba(0, 0, 0, .2)',
    },
  }}
>
```

See [deprecations](/docs/upgrading-from-5.x#deprecations) for more details.

### Elements Library

We also took out some of the components and helpers used across various navigators in React Navigations and published them under a new package called [`@react-navigation/elements`](/docs/elements). It can be useful if you're building your own navigator, or just want to reuse some of the components in your app.

Right now we have a small set of components, but there’s more to come.

### Simpler APIs for existing functionality

We made many APIs simpler with React Navigation 6 to address common use cases. For example:

- Single option to use a modal presentation style and transparent modal with [`presentation`](/docs/stack-navigator#presentation)
- Custom header doesn't require setting `headerMode="screen"` manually anymore
- The `useHeaderHeight` hook now ignores hidden headers and returns the height of the closest visible header in parent
- New option to set a [custom background](/docs/bottom-tab-navigator#tabbarbackground) (such as `BlurView`) for tab bar without having to use a custom tab bar
- New API to manage ref on the container [(`createNavigationContainerRef` and `useNavigationContainerRef`)](/docs/navigating-without-navigation-prop)

### New `Group` component for organization

We have now added a [`Group`](/docs/group) component to organize your screens. You can group your screens using a `Group` component in any navigator. You can even nest `Group` components inside other `Group` components. They are lightweight and don’t render anything - like fragments, so they won’t affect performance.

A nice feature of the `Group` component is that you can specify `screenOptions` on it like you can on a navigator. Passing `screenOptions` to a group configures all the screens inside that group to use these options. You can override these options by passing `options` to each Screen component, similar to how you can with `screenOptions` on Navigator.

In this code snippet, you can see that we group regular screens under one group and modal screens under another group:

```js
function App() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
```

### Headers by default in Bottom Tabs & Drawer

We often needed to show a header in the screens of drawer and bottom tabs. To do this, we had to nest a stack navigator which provides a header, even if it was a navigator with just one screen. So we now show headers by default in screens of drawer and bottom tabs. No nesting necessary.

We also export a [`Header`](/docs/elements#header) component in the new elements library to use anywhere in your components.

### Native navigation by default

Historically, React Navigation has been mostly JS based, with animations and gestures written in JavaScript. While this works for a lot of apps, apps with heavy screens can suffer from poor performance. So we also wanted to address this by using native primitives for navigation.

With React Navigation 5, we introduced [`@react-navigation/native-stack`](/docs/native-stack-navigator) package powered by [`react-native-screens`](https://github.com/software-mansion/react-native-screens), as well as a native backend for [`@react-navigation/material-top-tabs`](/docs/material-top-tab-navigator) powered by [`react-native-pager-view`](https://github.com/callstack/react-native-pager-view).

In React Navigation 6, we made `@react-navigation/native-stack` the default choice for setting up Stack navigation. It uses UINavigationController on iOS and Fragments on Android to implement navigation natively. We also focused a lot on aligning the API of `@react-navigation/native-stack` with `@react-navigation/stack` so that it’d be easier to switch between them.

Similarly, we switched `@react-navigation/material-top-tabs` to use `react-native-pager-view` by default.

### Better type-safety

React Navigation 5’s TypeScript support was much better than React Navigation 4. But some things such as `useNavigation` were still untyped by default. So we wanted to change that to make them more type-safe.

In React Navigation 6, you don’t need to annotate `useNavigation` to get autocompletion and type checking. This is possible by defining a type for the screens globally using declaration merging:

```js
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      Profile: { userId: string };
      NotFound: undefined;
    }
  }
}
```

You can read [more about it in our TypeScript docs](/docs/typescript#specifying-default-types-for-usenavigation-link-ref-etc).

### Flipper plugin

We now have a [Flipper](https://fbflipper.com/) plugin. It includes similar functionality to the currently available Redux Devtools Extensions integration. You can see all navigation actions, and jump back n forth between earlier and new navigation states. In addition, it also includes a tab to test your linking configuration.

Since the dev tools is built from scratch, we’re now free to add new features to make debugging easier in future.

One advantage of the Flipper plugin over Redux Devtools Extension is that it doesn’t need Chrome Debugger to work. Since Chrome Debugger can sometimes affect and change how things work, we won’t have this problem with Flipper.

![React Navigation Logs](/assets/devtools/flipper-plugin-logs.png)

![React Navigation Linking](/assets/devtools/flipper-plugin-linking.png)

See the [guide for setting it up](/docs/devtools#useflipper) for more details.

## Upgrading

So with every major release, there’s still the question about upgrade strategy. While React Navigation 6 isn’t a huge change like React Navigation 5, there are still some breaking changes. But possible to mix packages from React Navigation 5 and React Navigation 6 with few caveats so that you can gradually upgrade packages.

See the [upgrade guide](/docs/upgrading-from-5.x) for a full list of changes and more details.

## Sponsor us

If React Navigation helps you to deliver value to your customers, it'd awesome a lot if you could sponsor us. Sponsorships will help us to move more quickly towards our goal of building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈
