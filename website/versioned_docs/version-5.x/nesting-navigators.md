---
id: version-5.x-nesting-navigators
title: Nesting navigators
sidebar_label: Nesting navigators
original_id: nesting-navigators
---

Nesting navigators means rendering a navigator inside a screen of another navigator, for example:

```js
function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
```

In the above example, the `Home` component contains a tab navigator. The `Home` component is also used for the `Home` screen in your stack navigator inside the `App` component. So here, a tab navigator is nested inside a stack navigator:

- `Stack.Navigator`
  - `Home` (`Tab.Navigator`)
    - `Feed` (`Screen`)
    - `Messages` (`Screen`)
  - `Profile` (`Screen`)
  - `Settings` (`Screen`)

To achieve the behavior you want, it's often necessary to nest multiple navigators. For example, if you want.

When nesting navigators, there are some things to keep in mind:

- **Each navigator keeps its own navigation history.**

  For example, when you press the back button inside a nested stack navigator, it'll go back to the previous screen inside the nested stack even if there's another navigator as the parent.

- **Navigation actions are handled by current navigator and bubble up if couldn't be handled.**

  For example, if you're calling `navigation.goBack()` in a nested screen, it'll only go back in the parent navigator if you're already on the first screen of the navigator. Other actions such as `navigate` work similarly, i.e. navigation will happen in the nested navigator and if the nested navigator couldn't handle it, then the parent navigator will try to handle it. In the above example, when calling `navigate('Settings')`, inside `Profile` screen, the nested stack navigator will handle it, but if you call `navigate('Home')`, the parent tab navigator will handle it.

- **Navigator specific methods are available in the navigators nested inside**

  For example, if you have a stack inside a drawer navigator, the drawer's `openDrawer`, `closeDrawer` methods etc. will also be available on the `navigation` prop in the screen's inside the stack navigator. But say you have a stack navigator as the parent of the drawer, then the screens inside the stack navigator won't have access to these methods, because they aren't nested inside the drawer.

  Similarly, if you have a tab navigator inside stack navigator, the screens in the tab navigator will get the `push` and `replace` methods for stack in their `navigation` prop.

- **Parent navigator's UI is rendered on top of child navigator.**

  For example, when you nest a stack navigator inside a drawer navigator, you'll see that the drawer appears above the stack navigator's header. However, if you nest the drawer navigator inside a stack, the drawer will appear below the header. This is an important point to consider when deciding how to nest your navigators.

  In your app, you will probably use one of these patterns depending on the behavior you want:

  - Stack navigator nested inside drawer navigator - The drawer appears over the header from the stack.
  - Tab navigator nested inside stack navigator - New screens cover the tab bar when you push them.
  - Stack navigator nested inside tab navigator - The tab bar is always visible. Usually pressing the tab again also pops the stack to top.

## Navigating to a screen in a nested navigator

Consider the following example:

```js
function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Root" component={Root} />
    </Drawer.Navigator>
  );
}
```

Here, you might want to navigate to the `Root` stack from your `Home` component:

```js
navigation.navigate('Root');
```

It works, and the initial screen inside the `Root` component is shown, which is `Profile`. But sometimes you may want to control the screen that should be shown upon navigation. To achieve it, you can pass the name of the screen in params:

```js
navigation.navigate('Root', { screen: 'Settings' });
```

Now, the `Settings` screen will be rendered instead of `Profile` upon navigation. You can also pass params this way:

<samp id="nest-navigators" />

```js
navigation.navigate('Root', {
  screen: 'Settings',
  params: { user: 'jane' },
});
```

If the navigator was already rendered, navigating to another screen will push a new screen in case of stack navigator.

You can follow similar approach for deeply nested screens. Note that the second argument to `navigate` here is just `params`, so you can do something like:

```js
navigation.navigate('Root', {
  screen: 'Settings',
  params: {
    screen: 'Sound',
    params: {
      screen: 'Media'
    }
  },
});
```

In the above case, you're navigating to the `Media` screen, which is in a navigator nested inside the `Sound` screen, which is in a navigator nested inside the `Settings` screen.

This may look very different from the way navigation used to work with nested screens previously. The difference is that in the previous versions, all configuration was static, so React Navigation could statically find the list of all the navigators and their screens by recursing into nested configurations. But with dynamic configuration, React Navigation doesn't know which screens are available and where until the navigator containing the screen renders. Normally, a screen doesn't render its contents until you navigate to it, so the configuration of navigators which haven't rendered is not yet available. This makes it necessary to specify the hierarchy you're navigating to. This is also why you should have as little nesting of navigators as possible to keep your code simpler.

## Best practices when nesting

We recommend to reduce nesting navigators to minimal. Try to achieve the behavior you want with as little nesting as possible. Nesting has many downsides:

- Code becomes difficult to follow when navigating to nested screens
- It results in deeply nested view hierarchy which can cause memory and performance issues in lower end devices
- Nesting same type of navigators (e.g. tabs inside tabs, drawer inside drawer etc.) leads to a confusing UX

Think of nesting navigators as a way to achieve the UI you want rather than a way to organize your code. If you want to create separate group of screens for organization, keep them in separate objects/arrays rather than separate navigators.
