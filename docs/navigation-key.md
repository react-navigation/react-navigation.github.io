---
id: navigation-key
title: Using the navigation key
sidebar_label: Using the navigation key
---

The `key` parameter comes up repeatedly across different navigation functions. Let's take a look at a summary of its use cases:

### Idempotent navigation with the [`navigate` call](/docs/navigation-actions.html#navigate)

`navigate` function accepts an optional `key` parameter which is used as an identifier for the route to navigate to. If you provide the identifier (as for example in `navigate({ routeName: 'someScreen', params: { someParam: 'someValue' }, key: 'someScreen' })`) and user triggers such navigation action multiple times (eg. by pushing a button that calls the navigation action quickly multiple times in a row), the navigation action will be executed only once.

Without using the key, calling `navigate({ routeName: 'someScreen' })` twice would result in pushing the screen onto the stack two times. Providing the `key` instead results into one push only. The second call to `navigate` finds out that the screen is already present on the stack and instead of pushing a new instance of the same screen, it calls `setParams` on the existing screen. // TODO what if a screen with given key is present "earlier" in the navigation stack? Will it go back?

### Usage with [`reset`](/docs/navigation-actions.html#reset)

When resetting, `key` is also optional and can be a string or null. If set, the navigator with the given key will reset. If null, the root navigator will reset.
// TODO how to find navigator key?

### Usage with [`replace`](/docs/navigation-actions.html#replace)

With replace, key is a required parameter used for identifying the route to be replaced.

### Usage with `goBack`

Please refer to the [`goBack docs`](/docs/navigation-prop.html#goback-close-the-active-screen-and-move-back) for a detailed explanation.
