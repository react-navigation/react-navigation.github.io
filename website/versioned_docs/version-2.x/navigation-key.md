---
id: version-2.x-navigation-key
title: Using the navigation key
sidebar_label: Using the navigation key
original_id: navigation-key
---

The `key` parameter comes up repeatedly across different navigation functions. Let's take a look at a summary of its use cases:

### Usage with the [`navigate`](navigation-actions.html#navigate) call

If no key is provided, `StackRouter` will behave as follows:

* if a route with the given name already exists in the state, `StackRouter` will jump to the existing route, along with setting the new parameters.
* if no such route exists, `StackRouter` will push it onto the stack

If, however, you want to push several instances of the same route, you can do so by providing a unique `key` parameter each time you call `navigate`, or you can use the `push` action available on `StackRouter`. See the related [RFC](https://github.com/react-navigation/rfcs/blob/master/text/0004-less-pushy-navigate.md) for more background.

> Note: the behavior of `navigate` without a `key` is significantly different in the 1.x series of releases. Read more about it [here](https://gist.github.com/vonovak/ef72f5efe1d36742de8968ff6a708985).

### Usage with [`reset`](navigation-actions.html#reset)

When resetting, `key` is also optional and can be a string or `null`. If set, the navigator with the given key will reset. If `null`, the root navigator will reset. You can obtain a route's navigator key by calling `this.props.navigation.dangerouslyGetParent().state.key`. Reason why the function is called `dangerouslyGetParent` is to warn developers against overusing it to eg. get parent of parent and other hard-to-follow patterns.

### Usage with [`replace`](navigation-actions.html#replace)

With the `replace` navigation action, `key` is a required parameter used for identifying the route to be replaced. If you use the helper function `this.props.navigation.replace`, we will automatically substitute the key of the current route.

### Usage with `goBack`

Please refer to the [`goBack docs`](navigation-prop.html#goback-close-the-active-screen-and-move-back) for a detailed explanation.
