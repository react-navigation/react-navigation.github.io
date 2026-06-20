---
id: from-expo-router
title: Moving from Expo Router
sidebar_label: Moving from Expo Router
---

[Expo Router](https://docs.expo.dev/router/introduction/) is a file-based router for React Native and Web apps. Moving to React Navigation means replacing file-based configuration with code-based configuration.

This guide intends to cover the main differences and the broad concepts between the two to get you started. It'll focus on the static configuration API, which is the recommended way to use React Navigation in new apps.

## Why React Navigation

### Comparison with Expo Router

Some of the benefits of React Navigation are:

- More expressive APIs for precise control over navigation structure and behavior.
- Modeled on state objects instead of URLs, which encode more information and enable features such as [`reset`](navigation-actions.md#reset) and [navigation state persistence](state-persistence.md).
- More flexible deep linking, such as parsing and schema support for params, regex support for paths, and even fully custom parsing with [`getStateFromPath`](navigation-container.md#linkinggetstatefrompath) etc.
- URL segments are not coupled to navigator nesting structure, making it possible to change the UI without affecting public URLs.
- Strong TypeScript support with type-safety as a primary goal of the API design.

Some of the benefits of Expo Router are:

- File-based configuration for routes, which can be faster to set up and is familiar when coming from web frameworks.
- Support for web-specific features such as static and server rendering, which can be beneficial for apps that need them for SEO.
- Expo CLI and bundler integration that automates tasks such as code-splitting and lazy loading of routes.
- Part of the Expo framework, making it more closely integrated with Expo SDK and tools.

### Common misconceptions

#### React Navigation requires a lot of boilerplate

React Navigation's static configuration API is designed to minimize boilerplate. It provides [automatic type inference based on the navigator and linking configuration](typescript.md#setting-up-the-types), and [automatic paths for deep linking](configuring-links.md) out of the box.

#### React Navigation doesn't support Web

React Navigation [supports Web out-of-the-box](web-support.md) with the same API as native. The Web implementation includes support for browser URLs, history, accessibility features as well as APIs such as [`pushParams`](navigation-actions.md#pushparams), [`backBehavior=fullHistory`](bottom-tab-navigator.md#backbehavior) etc. that are suitable for web apps. All official navigators also work on the web. The web support is optimized for PWAs and has limited [server rendering](server-rendering.md) support.

#### React Navigation doesn't use native navigation primitives

Official navigators in React Navigation such as [Native Stack](native-stack-navigator.md) and [Bottom Tabs](bottom-tab-navigator.md) use native primitives by default on Android & iOS, including platform styling such as [Liquid Glass on supported iOS versions](bottom-tab-navigator.md#native), [`SFSymbol`](icons.md#sf-symbols) and [Material Symbols](icons.md#material-symbols) support for icons, [Dynamic Material Themes on Android](themes.md#built-in-themes), and more.

## Mental model

Expo Router starts with URLs and files:

- Files in `app` become routes.
- `_layout.tsx` files define how child routes are nested.
- The path is inferred from file names such as `index.tsx`, `[id].tsx`, and route groups like `(tabs)`.
- APIs such as [`Link`](https://docs.expo.dev/versions/latest/sdk/router/link), [`Redirect`](https://docs.expo.dev/versions/latest/sdk/router/link#redirect), [`router`](https://docs.expo.dev/versions/latest/sdk/router/#imperativerouter), and [`useLocalSearchParams`](https://docs.expo.dev/versions/latest/sdk/router/#uselocalsearchparams) work with those inferred paths.

React Navigation starts with the navigation tree:

- Screens are declared in a [navigator's](navigator.md) `screens` object.
- Nested layouts are modeled by [nesting navigators](nesting-navigators.md).
- URLs are configured with the [`linking`](configuring-links.md) option.
- Navigation happens with screen names and params.

## Migration checklist

1. Remove Expo Router as the entry point.

   If your app uses [`expo-router/entry`](https://docs.expo.dev/router/installation) in `package.json`, replace it with your app's entry file. If you don't use Expo Router anywhere else, remove the `expo-router` package and the `expo-router` config plugin from your Expo app config.

   ```diff lang=json title="package.json"
   {
   -  "main": "expo-router/entry",
   +  "main": "index.js",
   }
   ```

   ```js title="index.js"
   import { registerRootComponent } from 'expo';

   import App from './src/App';

   registerRootComponent(App);
   ```

2. Create a root navigator.

   Define your root navigator with a `createXNavigator` function, create screen configs with the matching [`createXScreen`](static-configuration.md#createxscreen) helper, and render it with [`createStaticNavigation`](static-configuration.md#createstaticnavigation):

   ```tsx
   import { createStaticNavigation } from '@react-navigation/native';
   import {
     createNativeStackNavigator,
     createNativeStackScreen,
   } from '@react-navigation/native-stack';

   const RootStack = createNativeStackNavigator({
     screens: {
       Home: createNativeStackScreen({
         screen: HomeScreen,
       }),
       Profile: createNativeStackScreen({
         screen: ProfileScreen,
       }),
     },
   });

   const Navigation = createStaticNavigation(RootStack);

   export default function App() {
     return <Navigation />;
   }

   type RootStackType = typeof RootStack;

   declare module '@react-navigation/native' {
     interface RootNavigator extends RootStackType {}
   }
   ```

3. Move each route file into a screen registration.

   A route file such as `app/profile/[userId].tsx` becomes a screen component registered in a navigator. Keep the component code, but replace Expo Router hooks with React Navigation hooks such as [`useRoute`](use-route.md) and [`useNavigation`](use-navigation.md).

   ```ts
   const RootStack = createNativeStackNavigator({
     screens: {
       Profile: createNativeStackScreen({
         screen: ProfileScreen,
       }),
     },
   });
   ```

   ```ts
   function ProfileScreen() {
     const route = useRoute('Profile');

     const { userId } = route.params;

     // ...
   }
   ```

4. Recreate `_layout.tsx` files with nested navigators.

   A layout returning `<Stack />` becomes [`createNativeStackNavigator`](native-stack-navigator.md) or [`createStackNavigator`](stack-navigator.md), `<Tabs />` becomes [`createBottomTabNavigator`](bottom-tab-navigator.md), and `<Drawer />` becomes [`createDrawerNavigator`](drawer-navigator.md). Nested layout files become [nested navigators](nesting-navigators.md).

   ```ts
   const HomeTabs = createBottomTabNavigator({
     screens: {
       Home: createBottomTabScreen({
         screen: HomeScreen,
       }),
       Feed: createBottomTabScreen({
         screen: FeedScreen,
       }),
     },
   });

   const RootStack = createNativeStackNavigator({
     screens: {
       Main: createNativeStackScreen({
         screen: HomeTabs,
       }),
     },
   });
   ```

5. Recreate URLs with linking configuration.

   Expo Router infers paths from file names. React Navigation [generates paths automatically based on screen names](configuring-links.md#how-does-automatic-path-generation-work), and you can override paths with the `linking` property on a screen for custom patterns.

   Specify `linking` manually when the URL includes params, e.g., when a screen has path params such as `[userId]`, when you need a catch-all or 404 route, or when the public URL should differ from the screen name.

   ```ts
   const RootStack = createNativeStackNavigator({
     screens: {
       Profile: createNativeStackScreen({
         screen: ProfileScreen,
         linking: 'profile/:userId',
       }),
     },
   });
   ```

   For example, Expo Router's `app/profile/[userId].tsx` can become a root stack screen with `linking: 'profile/:userId'`.

6. Replace redirects and protected routes.

   Replace [`Redirect`](https://docs.expo.dev/versions/latest/sdk/router/link#redirect) and [protected route groups](https://docs.expo.dev/router/advanced/protected) with conditional screens or groups. In static configuration, use the [`if`](static-configuration.md#if) property described in the [authentication flow](auth-flow.md?config=static) guide. When the condition changes, screens that no longer match are removed from the navigation state.

   ```ts
   const RootStack = createNativeStackNavigator({
     screens: {
       Home: createNativeStackScreen({
         if: useIsSignedIn,
         screen: HomeScreen,
       }),
       SignIn: createNativeStackScreen({
         if: useIsSignedOut,
         screen: SignInScreen,
       }),
     },
   });
   ```

7. Handle unmatched routes and deep links.

   Replace [`+not-found`](https://docs.expo.dev/router/error-handling/#unmatched-routes) with a screen that uses a catch-all linking path such as `'*'`. Replace [`+native-intent`](https://docs.expo.dev/router/advanced/native-intent) with [`getInitialURL` and `subscribe`](deep-linking.md#integrating-with-other-tools) in the [`linking`](navigation-container.md#linking) configuration.

   ```ts
   const RootStack = createNativeStackNavigator({
     screens: {
       NotFound: createNativeStackScreen({
         screen: NotFoundScreen,
         linking: '*',
       }),
     },
   });
   ```

## API mapping

### Files and layouts

| Expo Router                                                                                   | React Navigation                                                                                                       |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [`app/index.tsx`](https://docs.expo.dev/router/basics/notation)                               | A screen with `linking: ''`. Auto-detected based on the order or [`initialRouteName`](navigator.md#initial-route-name) |
| [`app/profile/[userId].tsx`](https://docs.expo.dev/router/reference/url-parameters)           | A screen with [`linking`](configuring-links.md#mapping-path-to-route-names) such as `profile/:userId`                  |
| [`app/[...slug].tsx`](https://docs.expo.dev/router/reference/url-parameters)                  | A screen with [`linking: '*'`](configuring-links.md#handling-unmatched-routes-or-404).                                 |
| [`app/+not-found.tsx`](https://docs.expo.dev/router/error-handling/#unmatched-routes)         | A screen with [`linking: '*'`](configuring-links.md#handling-unmatched-routes-or-404)                                  |
| [Groups such as `(tabs)`](https://docs.expo.dev/router/basics/navigation-layouts)             | [Groups](group.md) in navigator configuration.                                                                         |
| [`_layout.tsx`](https://docs.expo.dev/router/basics/navigation-layouts)                       | [Navigator](navigator.md) configuration.                                                                               |
| [`unstable_settings.initialRouteName`](https://docs.expo.dev/router/advanced/router-settings) | [`initialRouteName`](navigator.md#initial-route-name) on the [navigator](navigator.md).                                |

### Components and hooks

| Expo Router                                                                                                          | React Navigation                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Stack`](https://docs.expo.dev/router/advanced/stack)                                                               | [`createNativeStackNavigator`](native-stack-navigator.md)                                                                                                                                   |
| [`Tabs`](https://docs.expo.dev/router/advanced/tabs)                                                                 | [`createBottomTabNavigator`](bottom-tab-navigator.md).                                                                                                                                      |
| [`Drawer`](https://docs.expo.dev/router/advanced/drawer)                                                             | [`createDrawerNavigator`](drawer-navigator.md)                                                                                                                                              |
| [`SplitView`](https://docs.expo.dev/versions/latest/sdk/router/split-view)                                           | No direct equivalent, but planned.                                                                                                                                                          |
| [`Link`](https://docs.expo.dev/versions/latest/sdk/router/link)                                                      | [`Link`](link.md) with a screen name and params, or a reusable custom link built with [`useLinkProps`](use-link-props.md)                                                                   |
| [`Redirect`](https://docs.expo.dev/versions/latest/sdk/router/link#redirect)                                         | Conditional screens/groups with [`if`](static-configuration.md#if), or [`navigation.replace`](stack-actions.md#replace)                                                                     |
| [`router.push`](https://docs.expo.dev/versions/latest/sdk/router/#imperativerouter)                                  | [`navigation.push`](stack-actions.md#push) in stack navigators or [`navigation.pushParams`](navigation-actions.md#pushparams)                                                               |
| [`router.navigate`](https://docs.expo.dev/versions/latest/sdk/router/#imperativerouter)                              | [`navigation.navigate`](navigation-object.md#navigate)                                                                                                                                      |
| [`router.replace`](https://docs.expo.dev/versions/latest/sdk/router/#imperativerouter)                               | [`navigation.replace`](stack-actions.md#replace) in stack navigators                                                                                                                        |
| [`router.back`](https://docs.expo.dev/versions/latest/sdk/router/#imperativerouter)                                  | [`navigation.goBack`](navigation-object.md#goback)                                                                                                                                          |
| [`router.setParams`](https://docs.expo.dev/versions/latest/sdk/router/#imperativerouter)                             | [`navigation.setParams`](navigation-object.md#setparams), [`navigation.replaceParams`](navigation-actions.md#replaceparams) and [`navigation.pushParams`](navigation-actions.md#pushparams) |
| [`router.prefetch`](https://docs.expo.dev/versions/latest/sdk/router/#imperativerouter)                              | [`navigation.preload`](navigation-object.md#preload)                                                                                                                                        |
| [`useRouter`](https://docs.expo.dev/versions/latest/sdk/router/#userouter)                                           | [`useNavigation`](use-navigation.md)                                                                                                                                                        |
| [`useLocalSearchParams`](https://docs.expo.dev/versions/latest/sdk/router/#uselocalsearchparams)                     | [`useRoute`](use-route.md) and params from the [`route` object](route-object.md)                                                                                                            |
| [`useGlobalSearchParams`](https://docs.expo.dev/versions/latest/sdk/router/#useglobalsearchparams)                   | No direct equivalent.                                                                                                                                                                       |
| [`usePathname`](https://docs.expo.dev/versions/latest/sdk/router/#usepathname)                                       | [`useRoutePath`](use-route-path.md)                                                                                                                                                         |
| [`useSegments`](https://docs.expo.dev/versions/latest/sdk/router/#usesegments)                                       | No direct equivalent.                                                                                                                                                                       |
| [`useFocusEffect`](https://docs.expo.dev/versions/latest/sdk/router/#usefocuseffecteffect-do_not_pass_a_second_prop) | [`useFocusEffect`](use-focus-effect.md)                                                                                                                                                     |
| [`useNavigation`](https://docs.expo.dev/versions/latest/sdk/router/#usenavigationparent)                             | [`useNavigation`](use-navigation.md)                                                                                                                                                        |
| [`useSitemap`](https://docs.expo.dev/versions/latest/sdk/router/#usesitemap)                                         | No direct equivalent.                                                                                                                                                                       |
| [`useLoaderData`](https://docs.expo.dev/router/web/data-loaders)                                                     | No direct equivalent, but planned.                                                                                                                                                          |

### Features without direct replacements

| Expo Router                                                                                            | Alternative                                                                                                                               |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [Typed routes](https://docs.expo.dev/router/reference/typed-routes)                                    | [Type inference](typescript.md#setting-up-the-types) from the navigator and linking configuration.                                        |
| [Protected routes](https://docs.expo.dev/router/advanced/protected)                                    | Conditional screens or groups with [`if`](static-configuration.md#if).                                                                    |
| [Native tabs](https://docs.expo.dev/router/advanced/native-tabs)                                       | [Bottom tabs](bottom-tab-navigator.md) which render native tabs by default on Android & iOS.                                              |
| [Headless tabs from `expo-router/ui`](https://docs.expo.dev/router/advanced/custom-tabs)               | Custom [`tabBar`](bottom-tab-navigator.md#tabbar) or [custom navigator](custom-navigators.md).                                            |
| [API routes and server middleware](https://docs.expo.dev/router/web/api-routes)                        | No direct equivalent. Move this logic to your server.                                                                                     |
| [Server rendering](https://docs.expo.dev/router/web/static-rendering)                                  | [Server rendering](server-rendering.md) with manual setup.                                                                                |
| [Static rendering](https://docs.expo.dev/router/web/static-rendering)                                  | No direct equivalent.                                                                                                                     |
| [Link preview and link menu](https://docs.expo.dev/router/reference/link-preview)                      | Custom UI or platform-specific components.                                                                                                |
| [Zoom transition](https://docs.expo.dev/router/advanced/zoom-transition/)                              | No direct equivalent, but planned.                                                                                                        |
| [`Stack.Header`, `Stack.Toolbar`, `Stack.SearchBar` etc.](https://docs.expo.dev/router/advanced/stack) | Screen options, native stack options, custom headers etc.                                                                                 |
| [`Color`](https://docs.expo.dev/router/reference/color)                                                | [`PlatformColor`](https://reactnative.dev/docs/platformcolor) from React Native, [Material Themes](themes.md#built-in-themes) on Android. |

## Example setup

### Expo Router

Consider this Expo Router structure:

```text
app
|-- _layout.tsx
|-- +not-found.tsx
|-- (tabs)
|   |-- _layout.tsx
|   |-- index.tsx
|   `-- feed
|       |-- _layout.tsx
|       |-- index.tsx
|       `-- [postId].tsx
`-- profile
    `-- [userId].tsx
```

The corresponding Expo Router layouts may configure multiple navigators:

```tsx title="app/_layout.tsx"
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/[userId]"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
```

```tsx title="app/(tabs)/_layout.tsx"
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="feed">
        <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

```tsx title="app/(tabs)/feed/_layout.tsx"
import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerSearchBarOptions: {
            placeholder: 'Search posts',
          },
        }}
      />
      <Stack.Screen
        name="[postId]"
        options={{
          headerLargeTitle: false,
        }}
      />
    </Stack>
  );
}
```

### React Navigation

Model the same screens and options with explicit nested navigators:

```tsx title="src/RootStack.tsx"
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

import { HomeTabs } from './HomeTabs';
import { NotFoundScreen } from './NotFoundScreen';
import { ProfileScreen } from './ProfileScreen';

export const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerBackButtonDisplayMode: 'minimal',
  },
  screens: {
    Main: createNativeStackScreen({
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    }),
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      linking: 'profile/:userId',
      options: {
        presentation: 'modal',
      },
    }),
    NotFound: createNativeStackScreen({
      screen: NotFoundScreen,
      linking: '*',
    }),
  },
});
```

```tsx title="src/HomeTabs.tsx"
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

import { FeedStack } from './FeedStack';
import { HomeScreen } from './HomeScreen';

export const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    tabBarMinimizeBehavior: 'onScrollDown',
  },
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
      options: {
        tabBarLabel: 'Home',
        tabBarIcon: Platform.select({
          ios: {
            type: 'sfSymbol',
            name: 'house',
          },
          android: {
            type: 'materialSymbol',
            name: 'home',
          },
        }),
      },
    }),
    Feed: createBottomTabScreen({
      screen: FeedStack,
      linking: 'feed',
      options: {
        tabBarLabel: 'Feed',
        tabBarIcon: Platform.select({
          ios: {
            type: 'sfSymbol',
            name: 'list.bullet',
          },
          android: {
            type: 'materialSymbol',
            name: 'list',
          },
        }),
      },
    }),
  },
});
```

```tsx title="src/FeedStack.tsx"
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

import { FeedListScreen } from './FeedListScreen';
import { PostScreen } from './PostScreen';

export const FeedStack = createNativeStackNavigator({
  screenOptions: {
    headerLargeTitleEnabled: true,
  },
  screens: {
    FeedList: createNativeStackScreen({
      screen: FeedListScreen,
      linking: '',
      options: {
        headerSearchBarOptions: {
          placeholder: 'Search posts',
        },
      },
    }),
    Post: createNativeStackScreen({
      screen: PostScreen,
      linking: ':postId',
      options: {
        headerLargeTitleEnabled: false,
      },
    }),
  },
});
```

```tsx title="src/App.tsx"
import { createStaticNavigation } from '@react-navigation/native';

import { RootStack } from './RootStack';

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

type RootStackType = typeof RootStack;

declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType {}
}
```

After this migration:

- `app/(tabs)/index.tsx` maps to `Home`.
- `app/(tabs)/feed/index.tsx` maps to `FeedList`.
- `app/(tabs)/feed/[postId].tsx` maps to `Post` with `route.params.postId`.
- `app/profile/[userId].tsx` maps to `Profile` with `route.params.userId`.
- `app/+not-found.tsx` maps to `NotFound`.

## Replacing navigation and links

Expo Router links and navigation calls use URL paths:

```tsx
import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

<Link
  href={{
    pathname: '/profile/[userId]',
    params: { userId: 'jane' },
  }}
  asChild
>
  <Pressable>
    <Text>Open profile</Text>
  </Pressable>
</Link>;
```

```ts
router.push('/profile/jane');
router.push({
  pathname: '/profile/[userId]',
  params: { userId: 'jane' },
});
router.replace('/profile/jane');
router.replace({
  pathname: '/profile/[userId]',
  params: { userId: 'jane' },
});
router.setParams({ tab: 'posts' });
```

React Navigation links and navigation calls use screen names and params. For custom link UI, create a reusable component with [`useLinkProps`](use-link-props.md) and use that component throughout your app:

```tsx
import type { ReactNode } from 'react';

import type { LinkProps } from '@react-navigation/native';
import { useLinkProps } from '@react-navigation/native';
import { Pressable, Text } from 'react-native';

type MyLinkProps = LinkProps & {
  children: ReactNode;
};

function MyLink({ children, ...options }: MyLinkProps) {
  const props = useLinkProps(options);

  return (
    <Pressable {...props}>
      <Text>{children}</Text>
    </Pressable>
  );
}

<MyLink screen="Profile" params={{ userId: 'jane' }}>
  Open profile
</MyLink>;
```

```ts
navigation.push('Profile', { userId: 'jane' });
navigation.replace('Profile', { userId: 'jane' });
navigation.setParams({ tab: 'posts' });
```

For most app code, prefer screen names and params. They are easier to type-check and don't require manually building URLs.
