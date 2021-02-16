---
id: hiding-tabbar-in-screens
title: Hiding tab bar in specific screens
sidebar_label: Hiding tab bar in specific screens
---

Sometimes we may want to hide the tab bar in specific screens in a stack navigator nested in a tab navigator. Let's say we have 5 screens: `Home`, `Feed`, `Notifications`, `Profile` and `Settings`, and your navigation structure looks like this:

```js
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}
```

With this structure, when we navigate to the `Profile` or `Settings` screen, the tab bar will still stay visible over those screens.

But if we want to show the tab bar only on the `Home`, `Feed` and `Notifications` screens, but not on the `Profile` and `Settings` screens, we'll need to change the navigation structure. The easiest way to achieve this is to nest the tab navigator inside the first screen of the stack instead of nesting stack inside tab navigator:

```js
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeTabs} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
```

After re-organizing the navigation structure, now if we navigate to the `Profile` or `Settings` screens, the tab bar won't be visible over the screen anymore.

Some tab navigators such as [bottom tab navigator](bottom-tab-navigator.md) also have a `tabBarVisible` option which can be used to hide the tab bar based on instructions in the [Screen options resolution guide](screen-options-resolution.md). However, we don't recommend using it since showing/hiding the tab bar mid-navigation can affect the animation of the stack navigator causing glitchy behaviour.
