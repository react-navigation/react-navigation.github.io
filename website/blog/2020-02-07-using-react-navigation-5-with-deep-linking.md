---
title: Deep Linking in React Navigation v5
author: Wojciech Lewicki
authorURL: https://github.com/WoLewicki
---

In this blog post, I'll show you how to use deep linking provided by React Navigation v5.

## Introduction

React Navigation v5 ships with enhanced deep linking configuration, including shortening URLs for nested navigators or providing initial screen for a navigator. Let's dive into it by creating a simple app, which will try to give you a glance at all of the available features!

### What is deep linking?

Deep linking lets you open your app by passing a URL into it and retrieving the app's state from that URL. It works similarly to URLs on the web, where the segments of the URL string are parsed to return a certain webpage at the end. Similarly, in the application, the URL passed via deep linking is split into parts and each of them is then used to create part of the application's state object. It can work the other way round too when we want to create the URL string from a certain state of the app.

## Overview

To activate deep linking in your app, you're going to need some configuration, varying on whether your project is using Expo or bare React Native. You can check how to do it in [deep linking docs](https://reactnavigation.org/docs/en/deep-linking.html). In our example app, we will use the Expo managed workflow. The guide will focus on creating the deep linking configuration and not on creating the components themselves, but you can always check the full implementation in the [github repo](https://github.com/WoLewicki/DeepLinkingExample).

## Getting Started

Firstly, we need to create a structure for our application. To keep it simple, the main navigator will be bottom-tabs navigator with two screens. Its first screen will be a simple stack navigator with two screens, called `HomeStack`, with screens `Home` and `Profile`, and the second tabs screen will be just a simple one without any nested navigators, called `Settings`. After creating the app's structure, we can prepare a deep linking config object, which will statically recreate the structure with a URL path matching every state we would like to achieve. In our example, it would perhaps look like this:

```js
config = {
  HomeStack: 'stack',
  Home: 'home',
  Profile: 'user',
  Settings: 'settings',
};
```

Then, to get to `Home` screen in `HomeStack`, the URL would look like `/stack/home`, and for `Settings` screen, it would be `/settings`.
For such an app, without any parameters added to the routes and a very simple structure, it doesn't make too much sense to explicitly create `config`. If it wasn't present, the routes would be parsed by their names, so the first URL would have to be `/HomeStack/Home` and the second one `/Settings`.

But what if we want to have parameters in the URL, like the name of the person, whose profile we are visiting in the `Profile` screen? Or maybe we would like to define a screen that will be always present in the state for the `HomeStack` navigator? With properly defined `config` it can all be done easily, so let's do this!

## Defining better config

Even for such a simple configuration, we can make some optimization.
With the above config, in order to get to `Home` or `Profile` screen, we need to pass two "elements" to the URL. We can reduce it to only one by introducing nested navigators in our `config`. The syntax looks like that:

```js
config = {
  HomeStack: {
    path: 'stack',
    screens: {
      Home: 'home',
      Profile: 'user',
    },
  },
  Settings: 'settings',
};
```

As we can see, `Home` and `Profile` are now nested in the `screens` property of `HomeStack`. This means that when you pass the `/home` URL, it will be resolved to a `HomeStack`->`Home` state object (similarly for `/user` it would be `HomeStack`->`Profile`). `HomeStack`'s value became an object and if we want to navigate to it, we can pass the `path` property for it. The good thing about such config is that it can go as deep as you want, e.g. if `Home` was a navigator, you could make it an object with `screens` property, and put more screens or navigators inside it, making the URL string much shorter.

What if we wanted a specific screen to be always present in the state object for a navigator? For example, if we had a URL that would open `Home` screen, but we would like to be able to navigate to `Profile` from it by using navigation's `navigation.goBack()` method. It is possible by defining `initialRouteName` for a navigator. It would look like this then:

```js
config = {
  HomeStack: {
    path: 'stack',
    initialRouteName: 'Profile',
    screens: {
      Home: 'home',
      Profile: 'user',
    },
  },
  Settings: 'settings',
};
```

## Passing parameters to screens

A common case in having navigation in the application is passing parameters to the screens while navigating between them. In our example, we want the `Profile` screen to have the `id` param. While in app, we pass that param as a property of an object in the second argument of `navigation.navigate()` function. If we want to pass such param while opening the screen through deep linking, we can achieve it by extending the config for the screen. For `id` in `Profile`, it would be `Profile: 'user/:id'`. `/` is the separator between the path and each of the parameters. Passing URL `user/Wojciech` would resolve to `Profile` screen with a 'Wojciech' as a value of the `id` param in the screen params. It can be extracted from `route.params.id` in the screen component.

Sometimes we want to parse the param in a specific way. By default, all params are parsed to the screen as strings, but we can define a `parse` property, which will handle parsing. If we wanted to resolve `user/Wojciech/22` to user's age as a number and a modified id, we could make `Profile`'s config look like this:

```js
Profile: {
  path: 'user/:id/:age',
  parse: {
    id: id => `there, ${id}`,
    age: Number,
  },
}
```

Similarly to web URLs, there is also an option of using query params, which can only be applied to the deepest screen in the URL. To apply it to our config, the URL would look like this: `user?id=Wojciech&age=22` and config would not include params in the `path` property:

```js
Profile: {
  path: 'user',
  parse: {
    id: id => `there, ${id}`,
    age: Number,
  },
}
```

## Specific configuration

Here we will mention some of the consequences of using nested navigators in the config.

1. Using `initialRouteName` makes the screen always appear in the state of a navigator. It makes it impossible to pass params to that screen through the URL unless the screen is explicitly mentioned in it. It is then reasonable for that screen not to take any params or to provide default ones.

2. Having multiple screens of a nested navigator present in the state object is not possible through a one-part URL string. We also cannot provide a URL like (for the above configuration) `/user/home`, because it would be resolved to `HomeStack->Profile->HomeStack->Home`, If we want to get rid of the second `HomeStack`, we can provide an explicit config for `Home` screen in the first level of config nesting (remember to provide a different path string for each occurrence of a screen in the config):

   ```js
   config = {
     HomeStack: {
       path: 'stack',
       initialRouteName: 'Profile',
       screens: {
         Home: 'home',
         Profile: 'user',
       },
     },
     Settings: 'settings',
     Home: 'first',
   };
   ```

   Then `/user/first` will resolve to `HomeStack->Profile->Home`.

   We can also make the config not include nested navigator, which will make the URL even longer, but maybe a bit less confusing.

   ```js
   config = {
     HomeStack: 'stack',
     Home: 'home',
     Profile: 'user',
     Settings: 'settings',
   };
   ```

   Then `/stack/user/home` will resolve to `HomeStack->Profile->Home`.

3. Usage of the nested navigators disables the option of passing any params to the routes in the nested state, except for the last one. It shouldn't be a problem, because only the last part of the nested config should be a screen, while rest being navigators, which don't take any params.

4. There is an option to retrieve the URL path that would lead to the present screen by calling `getPathFromState()`. The function takes the current navigation state as the first argument (it can be retrieved by using `useNavigationState()` hook) and optionally the `config` as the second argument. The navigation in the application shouldn't typically be this complicated for the user to use this function.

## Summary

Deep linking is a very common and useful tool for managing apps with navigation included, but properly integrating it can be sometimes not very straightforward. I tried to show you the crucial aspects of deep linking configuration in this guide. I hope that after reading this article, the usage of these concepts won't be a problem for you.

Do you have any questions? Contact me via [github](https://github.com/WoLewicki).
