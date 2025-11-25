---
id: web-support
title: React Navigation on Web
sidebar_label: Web support
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

React Navigation has built-in support for the Web platform. This allows you to use the same navigation logic in your React Native app as well as on the web. The navigators require using [React Native for Web](https://github.com/necolas/react-native-web) to work on the web.

## Pre-requisites

While Web support works out of the box, there are some things to configure to ensure a good experience on the web:

1. [**Configure linking**](configuring-links.md)

   Configuring linking allows React Navigation to integrate with the browser's URL bar. This is crucial for web apps to have proper URLs for each screen.

2. [**Use Button or Link components**](link.md)

   You may be familiar with using `navigation.navigate` to navigate between screens. But it's important to avoid using it when supporting the web. Instead, use the `Link` or [`Button`](elements.md#button) components to navigate between screens. This ensures that an anchor tag is rendered which provides the expected behavior on the web.

3. [**Server rendering**](server-rendering.md)

   Currently, React Navigation works best with fully client-side rendered apps. However, minimal server-side rendering support is available. So you can optionally choose to server render your app.

4. **Adapt to web-specific behavior**

   Depending on your app's requirements and design, you may also want to tweak some of the navigators' behavior on the web. For example:
   - Change `backBehavior` to `fullHistory` for [tabs](bottom-tab-navigator.md#backbehavior) and [drawer](drawer-navigator.md#backbehavior) on the web to always push a new entry to the browser history.
   - Use sidebars on larger screens instead of [bottom tabs](bottom-tab-navigator.md#tabbarposition) - while not specific to web, responsive design much more important on the web.

:::note

In React Navigation 4, it was necessary to install a separate package called `@react-navigation/web` to use web integration. This package is no longer needed in recent versions of React Navigation. If you have it installed, make sure to uninstall it to avoid conflicts.

:::

## Lazy loading screens

By default, screen components are bundled in the main bundle. This can lead to a large bundle size if you have many screens. It's important to keep the bundle size small on the web for faster loading times.

To reduce the bundle size, you can use [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) with [`React.lazy`](https://react.dev/reference/react/lazy) to lazy load screens:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Lazy loading screens" snack
import { Suspense, lazy } from 'react';

const MyStack = createNativeStackNavigator({
  screenLayout: ({ children }) => (
    <Suspense fallback={<Loading />}>{children}</Suspense>
  ),
  screens: {
    Home: {
      component: lazy(() => import('./HomeScreen')),
    },
    Profile: {
      component: lazy(() => import('./ProfileScreen')),
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Lazy loading screens" snack
import { Suspense, lazy } from 'react';

const HomeScreen = lazy(() => import('./HomeScreen'));
const ProfileScreen = lazy(() => import('./ProfileScreen'));

function MyStack() {
  return (
    <Stack.Navigator
      screenLayout={({ children }) => (
        <Suspense fallback={<Loading />}>{children}</Suspense>
      )}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

:::warning

Make sure to use `React.lazy` **outside** the component containing the navigator configuration. Otherwise, it will return a new component on each render, causing the [screen to be unmounted and remounted](troubleshooting.md#screens-are-unmountingremounting-during-navigation) every time the component rerenders.

:::

</TabItem>
</Tabs>

This will split the screen components into separate chunks (depending on your bundler) which are loaded on-demand when the screen is rendered. This can significantly reduce the initial bundle size.

In addition, you can use the [`screenLayout`](navigator.md#screen-layout) to wrap your screens in a [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary. The suspense fallback can be used to show a loading indicator and will be shown while the screen component is being loaded.

## Web-specific behavior

Some of the navigators have different behavior on the web compared to native platforms:

1. [**Native Stack Navigator**](stack-navigator.md)

   Native Stack Navigator uses the platform's primitives to handle animations and gestures on native platforms. However, animations and gestures are not supported on the web.

2. [**Stack Navigator**](stack-navigator.md)

   Stack Navigator uses [`react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/) to handle swipe gestures on native platforms. However, gestures are not supported on the web.

   In addition, screen transitions are disabled by default on the web. You can enable them by setting `animationEnabled: true` in the navigator's options.

3. [**Drawer Navigator**](drawer-navigator.md)

   Drawer Navigator uses [`react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/) to handle swipe gestures and [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) for animations on native platforms. However, gestures are not supported on the web, and animations are handled using CSS transitions.

In addition, navigators render hyperlinks on the web when possible, such as in the drawer sidebar, tab bar, stack navigator's back button, etc.

Since `react-native-gesture-handler` and `react-native-reanimated` are not used on the web, avoid importing them in your own code to reduce the bundle size unless you need them for your components. You can use `.native.js` or `.native.ts` extensions for code specific to native platforms.

## Configuring hosting providers

React Navigation is designed for Single Page Applications (SPAs). This usually means that the `index.html` file needs to be served for all routes.

During development, the bundler such as Webpack or Metro automatically handles this. However, when deploying the site, you may need to configure redirects to ensure that the `index.html` file is served for all routes to avoid 404 errors.

Here are instructions for some of the popular hosting providers:

### Netlify

To handle redirects on Netlify, add the following in the `netlify.toml` file at the root of your project:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

To handle redirects on Vercel, add the following in the `vercel.json` file at the root of your project:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages

GitHub Pages doesn't support such redirection configuration for SPAs. There are a couple of ways to work around this:

- Rename your `index.html` to `404.html`. This will serve the `404.html` file for all routes. However, this will cause a 404 status code to be returned for all routes. So it's not ideal for SEO.
- Write a script that copies the `index.html` file to all routes in the build output. For example, if your app has routes `/`, `/about`, and `/contact`, you can copy the `index.html` file to `about.html` and `contact.html`.
