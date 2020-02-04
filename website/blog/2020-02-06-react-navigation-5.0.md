---
title: React Navigation 5.0 - A new way to navigate
author: Satyajit Sahoo, Michał Osadnik
authorURL: https://twitter.com/reactnavigation
---

Exactly two years ago, we published the first stable version of React Navigation. Throughout this time, the library has been actively developed by adding  many new features and bug fixes. The essence of React Navigation was that it was a project that was to become not only a project of individual programmers adapting it to their requirements, but a community as a whole, hence the emphasis on versatility, extensibility, and the tendency to reconsider the assumptions if there were such needs. Thanks to this, the Library has been undergoing metamorphosis of both incremental and completely reorganized shape.

This led us to the moment when React Navigation became one of the most popular navigation solutions in React Native and we are incredibly proud of it.

Today is the day, when we want to mark this vision and major refactoring of the project, that has taken place over the last six months, as stable. One could say that this significant change concerned the core library, and therefore the API, which has been developed and made more dynamic.

## Highlights

### Component based configuration

In previous versions of React Navigation, we used to configure the navigator statically using `createXNavigator` functions and `static navigationOptions`. In React Navigation 5, all of the configuration happens inside a component and is dynamic.

Example:

```js
function App() {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="settings" component={Settings} />
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{ title: 'John Doe' }}
      />
    </Stack.Navigator>
  );
}
```

This means we have access to props, state and context, and can dynamically change the configuration for the navigator!

We want to stress that this is the most important change. This seems to be just a difference in the API. It actually required reconsidering many of the assumptions made in React Navigation during the development of previous versions. The static API, known from previous versions may seem an easier and more obvious choice. In the current version, the navigation configuration is consistent with all patterns in the React community.
This made it necessary to rewrite the core of the library, which allowed us to make a number of improvements not only in this respect.

### New hooks

Hooks are great for stateful logic and code organization. Now we have several hooks for common use cases:

- [`useNavigation`](https://reactnavigation.org/docs/use-navigation.html)
- [`useRoute`](https://reactnavigation.org/docs/use-route.html)
- [`useNavigationState`](https://reactnavigation.org/docs/use-navigation-state.html)
- [`useFocusEffect`](https://reactnavigation.org/docs/use-focus-effect.html)
- [`useIsFocused`](https://reactnavigation.org/docs/use-is-focused.html)
- [`useLinking`](https://reactnavigation.org/docs/use-linking.html)
- [`useScrollToTop`](https://reactnavigation.org/docs/use-scroll-to-top.html)

### Update options from component

We’ve added a new [`setOptions`](https://reactnavigation.org/docs/navigation-prop.html#setoptions---update-screen-options-from-the-component) method on the `navigation` prop to make configuring screen navigation options more intuitive than its `static navigationOptions` predecessor. It lets us **easily set screen options based on props, state or context without messing with params**. Instead of using static options, we can call it anytime to configure the screen.

```js
navigation.setOptions({
  headerRight: () => (
    <DoneButton
      onPress={async () => {
        await saveNote();
        navigation.replace('Notes');
      }}
    />
  ),
})
```

It can be used for things like adding a button in the header which needs to interact with the screen state.

### New theming API

In React Navigation, we had basic theming support where you could specify whether to use a light or dark theme. It wasn't easy to customize the colors used by the built-in components such as header, tab bar etc. without extra code or repetition.

Now, we have revamped the [theme system](https://reactnavigation.org/docs/themes.html) for easier customization. It is possible to provide a theme object with your desired colors for background, accent color etc. and it will automatically change the colors of all navigators without any extra code.

```js
const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
  },
};
```

### First-class types with TypeScript

The new version has been written from the ground-up with TypeScript. We now get first class autocompletion and type-checking.

![TypeScript in action](assets/announcing-5.0/typescript.gif)

We also have JSDoc for the built-in methods and options, so you get their description directly in your editor. See [our typescript documentation](https://reactnavigation.org/docs/typescript.html) for more details on how to use it.

### Redux DevTools integration

If you use [React Native Debugger](https://github.com/jhen0409/react-native-debugger) or [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension), you can see navigation actions in the devtools along with the current navigation state. It also supports time-travel debugging!

![Redux Devtools in action](assets/announcing-5.0/redux-devtools.gif)

You don't need to use Redux in your apps for this to work and it works without any extra setup!

### Native Stack Navigator

Traditionally, we have written our navigators in JavaScript for greater customizability. It fits a lot of use cases, but sometimes you want the exact native feel and the performance of native navigation. Now, we have added a new native stack navigator that uses native navigation primitives for navigation using the [`react-native-screens`](https://github.com/kmagiera/react-native-screens) library. Under the hood it just uses naitive components which might be obvious choice for native developement and might be good pick in the most cases. 

<img src="/blog/assets/android-native-stack.gif" height="530" />
<img src="/blog/assets/ios-native-stack.gif" height="530" />

### Native backends for Material top tab navigator

Similar to native stack, we also have [new backends](https://reactnavigation.org/docs/material-top-tab-navigator.html#pager) for Material top tab navigator based on [`react-native-viewpager`](https://github.com/react-native-community/react-native-viewpager) and [`ScrollView`](https://facebook.github.io/react-native/docs/scrollview).

```js
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';

// ...

<Tab.Navigator pager={props => <ViewPagerAdapter {...props} />}>
  {...}
</Tab.Navigator>
```

or 

```js
import ScrollPager from 'react-native-tab-view';

// ...

<Tab.Navigator pager={props => <ScrollPager {...props} />}>
  {...}
</Tab.Navigator>
```

### Other improvements

In addition to these larger improvements, there are several smaller improvements to fit more use cases and make it easier to do certain tasks:

- Revamped drawer navigator to make customizing the drawer sidebar content easier and more flexible.
- Simpler API for [`reset` action](https://reactnavigation.org/docs/navigation-prop.html#reset) where you can pass the new state directly instead of a chain of actions.
- More reliable [`focus` and `blur` events](https://reactnavigation.org/docs/navigation-lifecycle.html) to know when a screen's focus state changes.
- Integration with [`InteractionManager`](https://facebook.github.io/react-native/docs/interactionmanager) to delay tasks until animation is complete.
- Better safe area handling with [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

## Upgrading

This is a big release and, while the basic concepts such as nesting are the same, the new API is mostly incompatible with the previous API. We know it can be challenge to upgrade your code base. So we're going to keep supporting React Navigation 4 with bug fixes. We'll accept contributions and keep it compatible with the latest React Native version. The old code will now leave at [`react-navigation/react-navigation-4`](https://github.com/react-navigation/react-navigation-4) on GitHub.

We recommend starting your new projects with the new version so you can take advantage of the new APIs and the new features.

We have written an [upgrade guide](https://reactnavigation.org/docs/upgrading-from-4.x.html) which will give you an overview of what's changed and how to adapt the old API and concepts to the new API.

## A note for alpha users

If you were using React Navigation 5 when it was alpha, you might need to check the following changes when upgrading:

- If you have added `@react-navigation/core` to your dependencies, remove it, and replace all imports from `@react-navigation/core` with `@react-navigation/native`
- If you were importing `NavigationNativeContainer`, change it to `NavigationContainer`, if you were using `NavigationContainer`, change it to `BaseNavigationContainer`
- If you had deep linking configured, the config format has changed for nesting. Check the [deep linking docs](https://reactnavigation.org/docs/deep-linking.html) for details.

## Thanks to these wonderful people

React Navigation 5 wouldn't have possible without these wonderful people. A lot of thanks to [Michał Osadnik](https://github.com/osdnk) for working in this project with me from idea to fruition, [Brent Vatne](https://github.com/brentvatne) for his ideas, encouragement and funding from [Expo](https://expo.io), [Wojciech Lewicki](https://github.com/WoLewicki) and [Jakub Gonet](https://github.com/jakub-gonet) for improving the documentation, and working on deep link support, [Krzysztof Magiera](https://github.com/kmagiera) and [Software Mansion](https://github.com/software-mansion) for their awesome libraries that the core functionality depends on and contibutions, [Janic Duplessis](https://github.com/janicduplessis) for [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

Additionally, I would like to mention how important is the community's influence on building this project. Without you, your support, your readiness to test and apply the next versions of the libraries, it wouldn't be possible at all, and despite mentioning a few people by name, at no stage do we forget that this is a community activity and will respond to its needs. We are incredibly grateful for the opportunity to work on such an unusual project, which facilitates the work of a large number of users.

Thanks again and hope you find this release useful.
