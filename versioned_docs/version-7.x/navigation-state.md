---
id: navigation-state
title: Navigation state reference
sidebar_label: Navigation state
---

The navigation state is the state where React Navigation stores the navigation structure and history of the app. It's useful to know about the structure of the navigation state if you need to do advanced operations such as [resetting the state](navigation-actions.md#reset), [providing a custom initial state](navigation-container.md#initialstate) etc.

It's a JavaScript object which looks like this:

```js
const state = {
  type: 'stack',
  key: 'stack-1',
  routeNames: ['Home', 'Profile', 'Settings'],
  routes: [
    { key: 'home-1', name: 'Home', params: { sortBy: 'latest' } },
    { key: 'settings-1', name: 'Settings' },
  ],
  index: 1,
  stale: false,
};
```

There are few properties present in every navigation state object:

- `type` - Type of the navigator that the state belongs to, e.g. `stack`, `tab`, `drawer`.
- `key` - Unique key to identify the navigator.
- `routeNames` - Name of the screens defined in the navigator. This is an unique array containing strings for each screen.
- `routes` - List of route objects (screens) which are rendered in the navigator. It also represents the history in a stack navigator. There should be at least one item present in this array.
- `index` - Index of the focused route object in the `routes` array.
- `history` - An optional list of visited items. See [History stack](#history-stack) for more details.
- `stale` - A navigation state is assumed to be stale unless the `stale` property is explicitly set to `false`. This means that the state object needs to be ["rehydrated"](#stale-state-objects).

Each route object in a `routes` array may contain the following properties:

- `key` - Unique key of the screen. Created automatically or added while navigating to this screen.
- `name` - Name of the screen. Defined in navigator component hierarchy.
- `params` - An optional object containing params which is defined while navigating e.g. `navigate('Home', { sortBy: 'latest' })`.
- `state` - An optional object containing the [stale navigation state](#stale-state-objects) of a child navigator nested inside this screen.

For example, a stack navigator containing a tab navigator nested inside it's home screen may have a navigation state object like this:

```js
const state = {
  type: 'stack',
  key: 'stack-1',
  routeNames: ['Home', 'Profile', 'Settings'],
  routes: [
    {
      key: 'home-1',
      name: 'Home',
      state: {
        key: 'tab-1',
        routeNames: ['Feed', 'Library', 'Favorites'],
        routes: [
          { key: 'feed-1', name: 'Feed', params: { sortBy: 'latest' } },
          { key: 'library-1', name: 'Library' },
          { key: 'favorites-1', name: 'Favorites' },
        ],
        index: 0,
      },
    },
    { key: 'settings-1', name: 'Settings' },
  ],
  index: 1,
};
```

It's important to note that even if there's a nested navigator, the `state` property on the `route` object is not added until a navigation happens, hence it's not guaranteed to exist, or maybe [stale](#stale-state-objects).

## History stack

In React Navigation, each navigator may maintain a history stack to keep track of visited entries. This is used when navigating back, syncing with browser history on the Web, etc.

Unlike Web, which has a linear history stack, React Navigation uses a nested history stack mirroring mobile navigation patterns. A parent navigator maintains its own history stack, while each child navigator also maintains its own history stack. When navigating back, it goes back in the history stack of the navigator where the "go back" action was triggered - and if that stack is empty, it bubbles up to the parent navigator's history stack. Any sibling navigators' history stacks are not affected.

The history stack for a navigator is determined from `state.history` if present, otherwise `state.routes` is used.

The content and shape of items in the `state.history` array can vary depending on the navigator. There should be at least one item present in this array. Among built-in navigators, this property is present only in tab and drawer navigators. For example, the `history` array in a drawer navigator looks like this:

```js
const state = {
  history: [
    { type: 'route', key: 'home-1' },
    { type: 'route', key: 'settings-1' },
    { type: 'drawer', status: 'open' },
  ],

  // ...
};
```

This array is populated based on the `backBehavior` prop of the tab or drawer navigators:

- `firstRoute` - the first route defined in the navigator and the focused route
- `initialRoute` - the initial route defined in the navigator and the focused route
- `order` - the focused route and any routes defined before it in the navigator, in the order they are defined
- `history` - deduplicated list of previously visited routes in the navigator and the focused route
- `fullHistory` - full list of previously visited routes in the navigator and the focused route
- `none` - only the focused route

[Custom routers](custom-routers.md) may also add different types of items to the `history` array to represent different kinds of history entries.

## Stale state objects

Earlier there was a mention of `stale` property in the navigation state. If the `stale` property is set to `true` or is missing, the state is assumed to be stale. Typically this is not something to worry about unless you're using the navigation state object directly for advanced use-cases.

A stale navigation state means that the state object may be partial, such as missing keys or routes, contain invalid routes, or may not be up-to-date. A stale state can be a result of [deep linking](deep-linking.md), [restoring from a persisted state](state-persistence.md) etc.

The state object is guaranteed to not be stale when accessing it with built-in APIs such as:

- Navigator's state with [`useNavigationState()`](use-navigation-state.md) or [`navigation.getState()`](navigation-object.md#getstate) - not including child navigators.
- Complete state of the navigation tree with [`ref.getRootState()`](navigation-container.md#getrootstate) including root navigator and all child navigators.
-

However, if you try to access a child navigator's state with the `state` property on the [`route`](route-object.md) object, it maybe a stale or partial state object. So it's not recommended to use this property directly.

When React Navigation encounters stale or partial state, it will automatically fix it up before using it. This includes adding missing keys, removing any invalid routes, ensuring the `index` is correct etc. This process of fixing stale state is called **rehydration**. If you're writing a [custom router](custom-routers.md), the `getRehydratedState` method lets you write custom rehydration logic to fix up state objects.

This feature comes handy when doing operations such as [reset](navigation-actions.md#reset), [providing a initial state](navigation-container.md#initialstate) etc., as you can safely omit many properties from the navigation state object and relying on React Navigation to add those properties for you, making your code simpler.

For example, you can only provide a state without `index`, `keys` etc. only with a `routes` array without any keys and React Navigation will automatically add everything that's needed to make it work:

```js
const state = {
  routes: [{ name: 'Home' }, { name: 'Profile' }],
};
```

After rehydration, it'll look something like this:

```js
const state = {
  type: 'stack',
  key: 'stack-1',
  routeNames: ['Home', 'Profile', 'Settings'],
  routes: [
    { key: 'home-1', name: 'Home' },
    { key: 'settings-1', name: 'Settings' },
  ],
  index: 1,
  stale: false,
};
```

Here, React Navigation filled in the missing bits such as keys, route names, index etc.

It's also possible to provide invalid data such as non-existent screens and it'll be fixed automatically. While it's not recommended to write code with invalid state objects, it can be super useful if you do things like [state persistence](state-persistence.md), where the configured screens might have changed after an update, which could cause problems if React Navigation didn't fix the state object automatically.

:::tip

If you want React Navigation to fix invalid state, make sure that you don't have `stale: false` in the state object. State objects with `stale: false` are assumed to be valid state objects and React Navigation won't attempt to fix them. If `stale` is missing or set to `true`, React Navigation will always try to rehydrate the state object.

:::

When you're providing a state object in [`initialState`](navigation-container.md#initialstate), React Navigation will always assume that it's a stale state object, since navigation configuration may have changed since the last time. This makes sure that things like [state persistence](state-persistence.md) work smoothly without extra manipulation of the state object.
