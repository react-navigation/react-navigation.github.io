---
id: nesting-navigators
title: Nesting navigators
sidebar_label: Nesting navigators
---

Nesting navigators means rendering a navigator inside a screen of another navigator, for example:

```js
function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Root} />
      <Tab.Screen name="Messages" component={Home} />
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

In the above example, the `Home` component contains a tab navigator. The `Home` component is also used for the `Home` screen in our stack navigator inside the `App` component. So here, a tab navigator is nested inside a stack navigator:

- `Stack.Navigator`
  - `Home` (`Tab.Navigator`)
    - `Feed` (`Screen`)
    - `Messages` (`Screen`)
  - `Profile` (`Screen`)
  - `Settings` (`Screen`)

To achieve the behavior we want, it's often necessary to nest multiple navigators. For example, if you want.

When nesting navigators, we get some interesting behavior:

- **Each navigator keeps its own navigation history.**

  For example, when we press the back button inside a nested stack navigator, it'll go back to the previous screen inside the stack.

- **Navigation actions are handled by current navigator and bubble up if couldn't be handled.**

  For example, if we're calling `navigation.goBack()` in a nested screen, it'll only go back in the parent navigator if you're already on the first screen of the navigator. Other actions such as `navigate` work similarly, i.e. navigation will happen in the nested navigator and if the nested navigator couldn't handle it, then the parent navigator will try to handle it. In the above example, when calling `navigate('Settings')`, inside `Profile` screen, the nested stack navigator will handle it, but if we call `navigate('Home')`, the parent tab navigator will handle it.

- **Parent navigator's UI is rendered on top of child navigator.**

  For example, when we nest a stack navigator inside a drawer navigator, we'll see that the drawer appears above the stack navigator's header. However, if we nest the drawer navigator inside a stack, the drawer will appear below the header. This is an important point to consider when deciding how to nest our navigators. Common patterns are to nest stack navigator inside drawer/tab navigators so that the drawer/tab bar are rendered on top of stack navigator's screens.

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

Here, we might want to navigate to the `Root` stack from our `Home` component:

```js
navigation.navigate('Root');
```

It works, and the initial screen inside the `Root` component is shown, which is `Profile`. But sometimes we may want to control the screen that should be shown upon navigation. To achieve it, we can pass the name of the screen in params:

```js
navigation.navigate('Root', { screen: 'Settings' });
```

Now, the `Settings` screen will be rendered instead of `Profile` upon navigation. We can also pass params this way:

<samp id="nest-navigators" />

```js
navigation.navigate('Root', {
  screen: 'Settings',
  params: { user: 'jane' },
});
```

If the navigator was already rendered, navigating to another screen will push a new screen in case of stack navigator.

## Best practices when nesting

We recommend to reduce nesting navigators to minimal. Try to achieve the behavior you want with as little nesting as possible. Nesting has many downsides:

- Code becomes difficult to follow when navigating to nested screens
- It results in deeply nested view hierarchy which can cause memory and performance issues in lower end devices
- Nesting same type of navigators (e.g. tabs inside tabs, drawer inside drawer etc.) leads to a confusing UX

Think of nesting navigators as a way to achieve the UI you want rather than a way to organize your code. If you want to create separate group of screens for organization, keep them in separate objects/arrays rather than separate navigators.
