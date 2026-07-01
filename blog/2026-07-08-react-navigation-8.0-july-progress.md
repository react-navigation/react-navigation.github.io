---
title: React Navigation 8.0 - July Progress Report
authors: satya
tags: [announcement]
---

We've continued working on React Navigation 8.0 since the [March progress report](/blog/2026/03/10/react-navigation-8.0-march-progress). Since then, we've released many refinements, improvements and new features.

This post covers the highlights that landed since March 2026.

{/* truncate */}

## Minimum requirements

We have updated our navigators to use the newer APIs in [`react-native-screens`](https://github.com/software-mansion/react-native-screens) and [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler). So we now require:

- `react-native-screens` 4.25.0 or later
- `react-native-gesture-handler` 3.0.0 or later

In addition, we also use newer TypeScript features, so the minimum [TypeScript](https://www.typescriptlang.org/) version is now 6.0.0 if you use TypeScript in your app.

## Highlights

### Suspense-enabled navigation

React Navigation is now [Suspense-enabled](https://react.dev/reference/react/useTransition#building-a-suspense-enabled-router).

This means navigation state updates are compatible with [concurrent rendering](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react) and navigation actions are wrapped in [transitions](https://react.dev/reference/react/startTransition) when possible.

Navigations using transitions:

- **Can be interrupted** - users can navigate away without waiting for the re-render to complete.
- **Avoid unwanted loading indicators** - if a navigation suspends, React can keep the currently shown UI visible instead of immediately replacing it with a fallback.
- **Wait for pending actions** - React can wait for pending transition actions to complete before showing the new screen.

User-initiated navigations using [`useNavigation`](/docs/8.x/use-navigation), [`useLinkProps`](/docs/8.x/use-link-props) or [`ref`](/docs/8.x/navigation-container#ref) always use transitions. Some navigations such as switching tabs in native tab navigators, the native back action in native stack, gesture-driven navigations, etc. don't use transitions. When writing a custom navigator, you can decide whether you use transitions for navigations initiated by your navigator.

### Typed hooks in dynamic navigators

One of the best features we announced in the alpha was typed hooks. In the initial announcement, we mostly focused on the static configuration API where all of the features worked. Dynamic navigators were supported, but lacked nested navigator awareness.

Since then, we have added support for dynamic navigators as well. This means the `useNavigation` and `useNavigationState` hooks now know the type of navigator they are in as well as their parent navigators. So `navigation` object will have correct type for `setOptions`, `addListener` etc. as well as navigator specific actions like `push`, `openDrawer` etc. based on where the hook is used.

To achieve this, you need to change the generic that's passed to `NavigatorScreenParams` in your param list to the type of the child navigator:

```diff lang=ts
type RootStackParamList = {
  Home: undefined;
-   Account: NavigatorScreenParams<AccountTabsParamList>;
+   Account: NavigatorScreenParams<typeof AccountTabs>;
};
```

<video playsInline autoPlay muted loop style={{ width: '600px' }}>

  <source src="/assets/blog/8.x/dynamic-navigator-types.mp4" />
</video>

This also means that you no longer need to manually annotate `navigation` prop. If you use typed hooks everywhere, it'll automatically combined navigation objects from parent and child navigators. So you can remove usage of `CompositeNavigationProp` and `CompositeScreenProps` in your app reducing boilerplate:

```diff lang=ts
- type ProfileScreenNavigationProp = CompositeNavigationProp<
-   BottomTabNavigationProp<TabParamList, 'Profile'>,
-   CompositeNavigationProp<
-     StackNavigationProp<StackParamList, 'Account'>,
-     DrawerNavigationProp<DrawerParamList, 'Home'>
-   >
- >;
-
- type Props = {
-   navigation: ProfileScreenNavigationProp;
- };
-
- function ProfileScreen({ navigation }: Props) {
+ function ProfileScreen() {
+   const navigation = useNavigation('Profile');

  // ...
}
```

In addition, we have improved the type inference performance as well. So for complex apps, the typechecking, intellisense etc. should be noticeably faster.

Checkout the [initial announcement](/blog/2025/12/19/react-navigation-8.0-alpha#better-typescript-types-for-static-configuration) for more details, and the [TypeScript documentation](/docs/8.x/typescript) for setup guide.

### Simpler types for custom navigators

Custom navigators also get a simpler type API. Previously, custom navigator factories needed a long list of generic arguments to describe params, state, options, events, action helpers, and the navigator component along with a wrapper function for the factory.

We have reworked this to be significantly shorter and simpler:

```diff lang=ts
- export type MyTabTypeBag<
-   ParamList extends ParamListBase = ParamListBase,
-   NavigatorID extends string | undefined = string | undefined,
- > = {
-   ParamList: ParamList;
-   NavigatorID: NavigatorID;
-   State: TabNavigationState<ParamList>;
-   ScreenOptions: MyNavigationOptions;
-   EventMap: MyNavigationEventMap;
-   NavigationList: {
-     [RouteName in keyof ParamList]: MyNavigationProp<
-       ParamList,
-       RouteName,
-       NavigatorID
-     >;
-   };
-   Navigator: typeof TabNavigator;
- };
-
- export function createMyNavigator<
-   const ParamList extends ParamListBase,
-   const NavigatorID extends string | undefined = string | undefined,
-   const TypeBag extends NavigatorTypeBagBase = MyTabTypeBag<
-     ParamList,
-     NavigatorID
-   >,
-   const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
- >(config?: Config): TypedNavigator<TypeBag, Config> {
-   return createNavigatorFactory(TabNavigator)(config);
- }
+ export interface MyTabTypeBag extends NavigatorTypeBagBase {
+   State: TabNavigationState<this['ParamList']>;
+   ScreenOptions: MyNavigationOptions;
+   EventMap: MyNavigationEventMap;
+   ActionHelpers: TabActionHelpers<this['ParamList']>;
+   Navigator: typeof TabNavigator;
+ }
+
+ export const createMyNavigator =
+   createNavigatorFactory<MyTabTypeBag>(TabNavigator);

export const createMyScreen = createScreenFactory<MyTabTypeBag>();
```

See [Custom navigators documentation](/docs/8.x/custom-navigators) for more details.

### Shared paths for deep links

It's common pattern to have the same screen appear in multiple navigators. For example, a `Profile` screen may appear in both a `Feed` stack and a `Search` stack under a tab navigator.

Previously, this would require you to define two different paths for the same screen, which is not ideal. Now the same path can be used for the `Profile` screen in both stacks.

<video playsInline autoPlay muted loop style={{ width: '800px' }}>

  <source src="/assets/blog/8.x/shared-paths.mp4" />
</video>

When using static configuration with automatic path generation, React Navigation detects shared paths automatically when the same screen component or navigator reference appears in multiple branches with the same full path pattern:

```js
const Profile = createNativeStackScreen({
  screen: ProfileScreen,
  linking: 'profile/:id',
});

const FeedStack = createNativeStackNavigator({
  screens: {
    Feed: FeedScreen,
    Profile,
  },
});

const SearchStack = createNativeStackNavigator({
  screens: {
    Search: SearchScreen,
    Profile,
  },
});
```

You can also mark a path as shared manually:

```js
const Profile = createNativeStackScreen({
  screen: ProfileScreen,
  linking: {
    path: 'profile/:id',
    shared: true,
  },
});
```

This is also supported in dynamic config API's `linking` configuration:

```js
const linking = {
  config: {
    screens: {
      FeedStack: {
        screens: {
          Feed: 'feed',
          Profile: {
            path: 'profile/:id',
            shared: true,
          },
        },
      },
      SearchStack: {
        screens: {
          Search: 'search',
          Profile: {
            path: 'profile/:id',
            shared: true,
          },
        },
      },
    },
  },
};
```

When the user opens a deep link with a shared path, React Navigation will automatically navigate in the correct navigator based on where the user is in the app.

<video playsInline autoPlay muted loop style={{ width: '800px' }}>

  <source src="/assets/blog/8.x/shared-paths-deeplink.mp4" />
</video>

See [Shared paths documentation](/docs/8.x/configuring-links#shared-paths) for more details.

### Improved preloading in stack navigators

Previously, preloaded screens in stack weren't treated as regular screens and had several limitations, e.g. they couldn't receive events from parent navigators, update their params, update options, or render a nested navigator in them.

We have completely reworked how they work. They are now rendered as regular screens, so they can do everything a regular screen can do.

The `preload` method now also updates a matching preloaded screen instead of adding a duplicate if you preload the same screen again.

### Retaining screens in stack navigators

Stack navigators now support retaining screens. When a screen is retained, it's kept rendered even after navigating away, preserving its local state.

A screen can be marked for retention by calling `retain(true)`:

```js
navigation.retain(true);
```

Now, actions such as `goBack`, `pop`, `popToTop`, and `replace` remove it from history, but still keep it rendered. It will be brought back to focus once you navigate to it again.

The screen can be unmarked for retention by calling `retain(false)`, which will also unmount it if it's currently retained:

```js
navigation.retain(false);
```

This can be useful for keeping a frequently used heavy screen in memory, or keeping a screen with a video or audio player rendered for background playback or picture-in-picture mode.

<video playsInline autoPlay muted loop style={{ width: '295px' }}>

  <source src="/assets/blog/8.x/stack-retain-video.mp4" />
</video>

Retaining screens is currently only supported in JS-based [Stack Navigator](/docs/8.x/stack-navigator). [Native Stack Navigator](/docs/8.x/native-stack-navigator) doesn't support retaining screens yet.

See [`retain`](/docs/8.x/stack-actions#retain) for more details.

### Dynamic props with static configuration

One of the common use cases in static configuration is to configure options etc. based on some dynamic state, e.g. screen size, context etc. To make this possible, we have added a new `with` method to navigators created with static configuration.

The component passed to `with` receives the `Navigator` component and can render it with any props supported by the navigator, wrapped in providers, etc.:

```js
const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
  },
}).with(({ Navigator }) => {
  const isLargeScreen = useIsLargeScreen();

  return (
    <Navigator
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
      }}
    />
  );
});
```

We have also backported this feature to React Navigation 7. So you can start using it in your existing apps as well.

See [Static configuration documentation](/docs/8.x/static-configuration#passing-dynamic-props-or-wrapping-the-navigator) for more details.

### Material 3 design for Material top tabs and tab view

We have updated Material Top Tabs and `react-native-tab-view` to better align with Material Design 3.

<video playsInline autoPlay muted loop style={{ width: '420px' }}>

  <source src="/assets/navigators/material-top-tabs/highlights/primary-tabbar.mp4" />
</video>

By default, it uses the primary variant for the new look. The secondary variant looks closer to the previous design, so you can still use it if you prefer the old look.

<video playsInline autoPlay muted loop style={{ width: '420px' }}>

  <source src="/assets/navigators/material-top-tabs/highlights/secondary-tabbar.mp4" />
</video>

The indicator has been completely reworked to support the new design where it has rounded corners. It's now rendered in multiple pieces so we can still scale the indicator between tabs to keep the animation smooth while keeping the edges unscaled to avoid distorting border radius. So now it can support `borderRadius`, `borderTopLeftRadius`, `borderTopRightRadius`, etc. as well which has been a requested for a long time.

<video playsInline autoPlay muted loop style={{ width: '500px' }}>

  <source src="/assets/blog/8.x/tabbar-indicator-pieces.mp4" />
</video>

See [Material Top Tab Navigator documentation](/docs/8.x/material-top-tab-navigator) and [Tab View documentation](/docs/8.x/tab-view) for more details.

### Content transitions with SF Symbols

The `SFSymbol` component now supports `contentTransition` for transitions when the symbol name or variable value changes on iOS 17 or later. When the `contentTransition` prop is set, the symbol will animate to the new value using built-in animations instead of replacing it immediately:

```js
<SFSymbol
  name={isConnected ? 'wifi' : 'wifi.slash'}
  contentTransition={{
    type: 'replace',
    magic: true,
  }}
/>
```

<video playsInline autoPlay muted loop style={{ width: '200px', aspectRatio: 1 / 1 }}>

  <source src="/assets/icons/sf-symbol-magic-replace.mp4" />
</video>

See [Icons documentation](/docs/8.x/icons#sf-symbols) for more details.

### Streaming server rendering support

So far, React Navigation's server rendering support relied on the old [`renderToString`](https://react.dev/reference/react-dom/server/renderToString) API, which doesn't support streaming. We have now reworked the server rendering to support the new [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) API, which allows streaming the HTML to the client.

```js
import { ServerContainer } from '@react-navigation/native/server';
import { renderToPipeableStream } from 'react-dom/server';

function handler(request, response) {
  const location = new URL(request.url, 'https://example.org/');

  const { pipe } = renderToPipeableStream(
    <ServerContainer location={location}>
      <App />
    </ServerContainer>,
    {
      onShellReady() {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        pipe(response);
      },
    }
  );
}
```

See [Server rendering documentation](/docs/8.x/server-rendering) for more details.

### Standard Navigation for library authors

We worked on a new standard navigation API after discussing with Expo Router maintainers to make it easier for custom navigator authors to write navigators that can work with both React Navigation and Expo Router, or any other navigation library that chooses to support it.

It defines a standard agreed-upon interface that library authors can use to implement their navigators, and then pass this standard navigator to helpers from React Navigation or Expo Router which will translate it to the respective library's API:

```tsx
export const MyTabNavigator = createStandardNavigator<
  MyTabOptions,
  MyTabEventMap,
  MyTabNavigatorProps
>(({ state, descriptors, actions, emitter }) => {
  // Render the navigator UI here
});
```

We have also backported standard navigation support to React Navigation 7. So you don't need to wait for React Navigation 8 to build navigator supporting both React Navigation and Expo Router.

Checkout the [`standard-navigation`](https://github.com/react-navigation/standard-navigation/) package and our [Standard navigator documentation](/docs/8.x/standard-navigator) for more details on how to integrate with React Navigation.

### Agent skills for upgrading and migration

We have published Agent skills for the following:

- Upgrading React Navigation from 6.x to 7.x and from 7.x to 8.x
- Migrating from dynamic configuration to static configuration for 7.x and 8.x

To use them, you can install them with [`skills.sh`](https://skills.sh):

```bash
npx skills add react-navigation/skills
```

Check them out at [react-navigation/skills](http://github.com/react-navigation/skills). Give them a try and let us know if you have any feedback or suggestions for improvements.

## Try it out

If you'd like to try the latest changes, install from the `next` tag:

```sh npm2yarn
npm install @react-navigation/native@next @react-navigation/bottom-tabs@next
```

If you encounter any issues or have feedback, please let us know on [GitHub Issues](https://github.com/react-navigation/react-navigation/issues) or [GitHub Discussions](https://github.com/react-navigation/react-navigation/discussions).

## Sponsor us

If React Navigation helps you deliver value to your customers, it'd mean a lot if you could sponsor us. Sponsorships help us move faster toward building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈
