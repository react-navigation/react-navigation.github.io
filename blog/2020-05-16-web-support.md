---
title: React Navigation on the Web
author: Satyajit Sahoo
author_url: https://twitter.com/satya164
author_title: Core Team
author_image_url: https://avatars2.githubusercontent.com/u/1174278?s=200&v=4
tags: [announcement, web]
---

React Native has made cross-platform development much easier than before, and with React Native for Web, you can reuse code across Android, iOS and Web too!

One major pain point of reusing code for the web app has been navigation. React Navigation is one of the most widely used navigation libraries for React Native, but it didn’t support web. While you could run apps using React Navigation on the Web, a lot of things were missing, such as proper integration with URLs on the browser.

We have finally added preliminary web support to React Navigation. Let's take a look at the changes.

<!--truncate-->

## Integration with URLs in browsers

The first step for web support is to have proper URL integration. This means:

- Users should be able to navigate to a screen in the app using a URL
- URL in the browser's address bar should update as users navigate in the app
- Users should be able to go backwards and forwards using browser's back/forward buttons
- Buttons that navigate to other screens in the app should be links, and users should be able use standard shortcuts with them

<video playsInline autoPlay muted loop style={{ maxWidth: '100%', marginBottom: 32 }}>
  <source src="/assets/blog/web-support/url-integration.mp4" type="video/mp4" />
</video>

In native apps, it's already possible to navigate to a screen in the app using a URL via deep links. React Navigation can handle deep links if you provide a configuration in the `linking` prop of `NavigationContainer`. We now reuse the same configuration for URL integration in browsers. It also works for updating the URL in the browser when users navigates in the app. So if you have configured deep links in your app already, it'll work with URL integration on the web without any changes 🥳

By default, we'll reuse the route names as paths if you've provided `linking={{ enabled: true }}` without any extra configuration. However, you can also customize how the paths and params are parsed by providing mappings under the `config` property.

Example:

```js
const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      Home: '',
      Profile: ':id/profile',
      Settings: ':id/blog',
    }
  },
};

function App() {
  return (
    <NavigationContainer linking={linking} fallback={<SplashScreen />}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

We have a [playground](/docs/configuring-links/#playground) where you can try custom configurations and see how it's parsed. Give it a try, and we hope it'll make it easier for you to configure links in your apps.

There's a new [`<Link />` component](/docs/link) which lets you use URLs for navigation in the app.

Example:

```js
<Link to="/profile/jane">Go to Jane's profile</Link>
```

When you use this component, it renders anchor tags on the web. This means that users can use the same patterns that they are used to on the web, such as "Open in new tab", "Copy link address" etc.

Special thanks to [Michał](https://github.com/osdnk) and [Wojciech](https://github.com/WoLewicki) for their extensive work on URL integration.

## Improvements to the navigators

URL integration isn't enough to have proper web support. The navigators also need to feel at home on the web. We have made several improvements to the built-in navigators so that they behave as you expect on the web.

### Anchor tags in tabs and drawer

The first change is using anchor tags. When you use built-in navigators such as drawer navigator and tab navigator, they render anchor tags for the drawer and tab items respectively when you have linking configured. This means that they behave the same as normal links on the web.

<img src="/assets/blog/web-support/link-right-click.png" height="427"/>

### No gestures and animations

Another change is the removal of gestures on the web. Gestures are not commonly used on the web because they conflict with a lot of browser functionality and system gestures. For example, in Safari, you can swipe to go back to the previous page. Android has a system gesture to go back to previous pages too. Because of this, we've removed gestures on the web.

We've also disabled animations on the web by default since they are not commonly used and can be jarring, especially on larger screens. The animations in React Native Web also run entirely in JS, and tend not to be very performant on the web. So we've decided to disable them by default to better overall experience.

### Hide address bar on scroll

Phones have small screens, so it's important to maximize the use of available screen size. One of the ways mobile browsers achieve it is by hiding and showing the address bar when scrolling to give more vertical space to the content.

It's especially important in case of the [stack navigator](/docs/stack-navigator) because not only we have the browser's address bar, but also the header at the top which is taking vertical space. Now we'll automatically adjust the styles of the stack navigator to get this behavior without you having to write any special code.

<video playsInline autoPlay muted loop style={{ maxWidth: '100%' }}>
  <source src="/assets/blog/web-support/hide-addressbar.mp4" type="video/mp4" />
</video>

### Permanent drawer

Another way we can make maximum us of the available screen size is by making our UIs adapt to different screen sizes. For example, we may want to show a sidebar for navigation on large screens while switching to a drawer on smaller screens. You can now specify `drawerType` as `permanent` to show an always visible sidebar. See the [documentation for `drawerType`](/docs/drawer-navigator#drawertype) for example code on how to achieve it.

<video playsInline autoPlay muted loop style={{ maxWidth: '100%' }}>
  <source src="/assets/blog/web-support/permanent-drawer.mp4" type="video/mp4" />
</video>

Special thanks to [Noemi](https://twitter.com/noemi_rozpara) for implementing this feature.

## What's next?

This is just a start. We still need to figure out many things, such as SSR, handling of 404 etc. There is still a lot to do, but we’re excited to announce it and looking forward to feedback and bug reports.

Take a look at the [documentation](/docs/web-support) to give it a try and let us know what you think. You can also [check the example app](https://react-navigation-example.netlify.app/) to see a live demo of web support.
