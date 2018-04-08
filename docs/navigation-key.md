---
id: navigation-key
title: Using the navigation key
sidebar_label: Using the navigation key
---

The `key` parameter comes up repeatedly across different navigation functions. Let's take a look at a summary of its use cases:

### Usage with the [`navigate`](/docs/navigation-actions.html#navigate) call

TL;DR: The behavior of `navigate` together with `key` depends on the version of react-navigation you use. In v1, key has to be provided for navigate to behave idempotently. In v2, this is no longer needed.

#### v2 behavior

In v2, if no key is provided, `StackRouter` assumes the user just wants to either jump (along with setting new params) to the route by the given name if it exists in state already or push it if not. If, however, you want to push several instances of the same route, you can do so by providing a unique `key` parameter each time you call `navigate`, or you can use the `push` action available on `StackRouter`. See the related [RFC](https://github.com/react-navigation/rfcs/blob/master/text/0004-less-pushy-navigate.md) for more background.

#### v1 behavior

In v1, `key` parameter is used as an identifier for the route to navigate to. If you provide the identifier (as for example in `navigate({ routeName: 'someScreen', params: { someParam: 'someValue' }, key: 'someScreen' })`) and user triggers such navigation action twice (eg. by pushing a button that calls the navigation action quickly twice in a row), the navigation action will be executed only once. The second call to `navigate` finds out that the route with the key is already present on the stack and instead of pushing a new instance of the same route, it calls `setParams` on the existing one.

Without using the key, calling `navigate({ routeName: 'someScreen' })` twice would result in pushing the route onto the stack two times.

### Usage with [`reset`](/docs/navigation-actions.html#reset)

When resetting, `key` is also optional and can be a string or null. If set, the navigator with the given key will reset. If null, the root navigator will reset. You can obtain a route's navigator key by calling `this.props.navigation.dangerouslyGetParent().state.key`. Reason why the function is called `dangerouslyGetParent` is to warn developers against overusing it to eg. get parent of parent.

### Usage with [`replace`](/docs/navigation-actions.html#replace)

With the replace navigation action, key is a required parameter used for identifying the route to be replaced. If you use the helper function `this.props.navigation.replace`, we will automatically substitute the key of the current route.

### Usage with `goBack`

Please refer to the [`goBack docs`](/docs/navigation-prop.html#goback-close-the-active-screen-and-move-back) for a detailed explanation.
