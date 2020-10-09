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
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
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

Nesting navigators work very much like nesting regular components. To achieve the behavior you want, it's often necessary to nest multiple navigators.

## How nesting navigators affects the behaviour

When nesting navigators, there are some things to keep in mind:

### Each navigator keeps its own navigation history

For example, when you press the back button when inside a screen in a nested stack navigator, it'll go back to the previous screen inside the nested stack even if there's another navigator as the parent.

### Each navigator has its own options

For example, specifying a `title` option in a screen nested in a child navigator won't affect the title shown in a parent navigator.

If you want to achieve this behavior, see the guide for [screen options with nested navigators](screen-options-resolution.md#setting-parent-screen-options-based-on-child-navigators-state). this could be useful if you are rendering a tab navigator inside a stack navigator and want to show the title of the active screen inside the tab navigator in the header of the stack navigator.

### Each screen in a navigator has its own params

For example, any `params` passed to a screen in a nested navigator are in the `route` prop of that screen and aren't accessible from a screen in a parent or child navigator.

If you need to access params of the parent screen from a child screen, you can use [React Context](https://reactjs.org/docs/context.html) to expose params to children.

### Navigation actions are handled by current navigator and bubble up if couldn't be handled

For example, if you're calling `navigation.goBack()` in a nested screen, it'll only go back in the parent navigator if you're already on the first screen of the navigator. Other actions such as `navigate` work similarly, i.e. navigation will happen in the nested navigator and if the nested navigator couldn't handle it, then the parent navigator will try to handle it. In the above example, when calling `navigate('Messages')`, inside `Feed` screen, the nested tab navigator will handle it, but if you call `navigate('Settings')`, the parent stack navigator will handle it.

### Navigator specific methods are available in the navigators nested inside

For example, if you have a stack inside a drawer navigator, the drawer's `openDrawer`, `closeDrawer`, `toggleDrawer` methods etc. will also be available on the `navigation` prop in the screen's inside the stack navigator. But say you have a stack navigator as the parent of the drawer, then the screens inside the stack navigator won't have access to these methods, because they aren't nested inside the drawer.

Similarly, if you have a tab navigator inside stack navigator, the screens in the tab navigator will get the `push` and `replace` methods for stack in their `navigation` prop.

If you need to dispatch actions to the nested child navigators from a parent, you can use [`navigation.dispatch`](navigation-prop.md#dispatch):

```js
navigation.dispatch(DrawerActions.toggleDrawer());
```

### Nested navigators don't receive parent's events

For example, if you have a stack navigator nested inside a tab navigator, the screens in the stack navigator won't receive the events emitted by the parent tab navigator such as (`tabPress`) when using `navigation.addListener`.

To receive events from parent navigator, you can explicitly listen to parent's events with `navigation.dangerouslyGetParent()`:

```js
const unsubscribe = navigation
  .dangerouslyGetParent()
  .addListener('tabPress', (e) => {
    // Do something
  });
```

### Parent navigator's UI is rendered on top of child navigator

For example, when you nest a stack navigator inside a drawer navigator, you'll see that the drawer appears above the stack navigator's header. However, if you nest the drawer navigator inside a stack, the drawer will appear below the header. This is an important point to consider when deciding how to nest your navigators.

In your app, you will probably use these patterns depending on the behavior you want:

- Stack navigators nested inside each screen of drawer navigator - The drawer appears over the header from the stack.
- Tab navigator nested inside the initial screen of stack navigator - New screens cover the tab bar when you push them.
- Stack navigators nested inside each screen of tab navigator - The tab bar is always visible. Usually pressing the tab again also pops the stack to top.

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
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Root" component={Root} />
      </Drawer.Navigator>
    </NavigationContainer>
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

Now, the `Settings` screen will be rendered instead of `Profile` upon navigation.

<summary>
This may look very different from the way navigation used to work with nested screens previously. The difference is that in the previous versions, all configuration was static, so React Navigation could statically find the list of all the navigators and their screens by recursing into nested configurations. But with dynamic configuration, React Navigation doesn't know which screens are available and where until the navigator containing the screen renders. Normally, a screen doesn't render its contents until you navigate to it, so the configuration of navigators which haven't rendered is not yet available. This makes it necessary to specify the hierarchy you're navigating to. This is also why you should have as little nesting of navigators as possible to keep your code simpler.
</summary>

### Passing params to a screen in a nested navigator

You can also pass params by specifying a `params` key:

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
      screen: 'Media',
    },
  },
});
```

In the above case, you're navigating to the `Media` screen, which is in a navigator nested inside the `Sound` screen, which is in a navigator nested inside the `Settings` screen.

### Rendering initial route defined in the navigator

By default, when you navigate a screen in the nested navigator, the specified screen is used as the initial screen and the initial route prop on the navigator is ignored. This behaviour is different from the React Navigation 4.

If you need to render the initial route specified in the navigator, you can disable the behaviour of using the specified screen as the initial screen by setting `initial: false`:

```js
navigation.navigate('Root', {
  screen: 'Settings',
  initial: false,
});
```

## Nesting multiple stack navigators

It's sometimes useful to nest multiple stack navigators, for example, to have [some screens in a modal stack and some in regular stack](modal.md).

When nesting multiple stacks, React Navigation will automatically hide the header from the child stack navigator in order to avoid showing duplicate headers. However, depending on the scenario, it might be more useful to show the header in the child stack navigator instead and hide the header in the parent stack navigator.

To achieve this, you can hide the header in the screen containing the stack using the `headerShown: false` option.

For example:

```js
function Home() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="Profile" component={Profile} />
      <NestedStack.Screen name="Settings" component={Settings} />
    </NestedStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="EditPost" component={EditPost} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

A complete example can be found in the [modal guide](modal.md). However, the principle isn't only specific to modals, but any kind of nesting of stack navigators.

In rare cases, you also might want to show both headers from the child and parent stack navigators. In this case, you can explicitly use `headerShown: true` on the child stack navigator to override the default behavior.

For example:

```js
function Home() {
  return (
    <NestedStack.Navigator screenOptions={{ headerShown: true }}>
      <NestedStack.Screen name="Profile" component={Profile} />
      <NestedStack.Screen name="Settings" component={Settings} />
    </NestedStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="EditPost" component={EditPost} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

In these examples, we have used a stack navigator directly nested inside another stack navigator, but the same principle applies when there are other navigators in the middle, for example: stack navigator inside a tab navigator which is inside another stack navigator.

When nesting multiple stack navigators, we recommend nesting at most 2 stack navigators, unless absolutely necessary.

## Best practices when nesting

We recommend to reduce nesting navigators to minimal. Try to achieve the behavior you want with as little nesting as possible. Nesting has many downsides:

- It results in deeply nested view hierarchy which can cause memory and performance issues in lower end devices
- Nesting same type of navigators (e.g. tabs inside tabs, drawer inside drawer etc.) might lead to a confusing UX
- With excessive nesting, code becomes difficult to follow when navigating to nested screens, configuring deep link etc.

Think of nesting navigators as a way to achieve the UI you want rather than a way to organize your code. If you want to create separate group of screens for organization, instead of using separate navigators, consider doing something like this:

```js
// Define multiple groups of screens in objects like this
const commonScreens = {
  Help: HelpScreen,
};

const authScreens = {
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
};

const userScreens = {
  Home: HomeScreen,
  Profile: ProfileScreen,
};

// Then use them in your components by looping over the object and creating screen configs
// You could extract this logic to a utility function and reuse it to simplify your code
<Stack.Navigator>
  {Object.entries({
    // Use the screens normally
    ...commonScreens,
    // Use some screens conditionally based on some condition
    ...(isLoggedIn ? userScreens : authScreens),
  }).map(([name, component]) => (
    <Stack.Screen name={name} component={component} />
  ))}
</Stack.Navigator>;
```
