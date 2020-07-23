---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

What follows within the _Fundamentals_ section of this documentation is a tour of the most important aspects of React Navigation. It should cover enough for you to know how to build your typical small mobile application, and give you the background that you need to dive deeper into the more advanced parts of React Navigation.

## Pre-requisites

If you're already familiar with JavaScript, React and React Native, then you'll be able to get moving with React Navigation quickly! If not, we highly recommend you to gain some basic knowledge first, then come back here when you're done.

Here are some resources to help you out:

1. [React Native Express](http://reactnativeexpress.com/) (Sections 1 to 4)
2. [Main Concepts of React](https://reactjs.org/docs/hello-world.html)
3. [React Hooks](https://reactjs.org/docs/hooks-intro.html)
4. [React Context](https://reactjs.org/docs/context.html) (Advanced)

## Installation

Install the required packages in your React Native project:

```bash npm2yarn
npm install @react-navigation/native
```

React Navigation is made up of some core utilities and those are then used by navigators to create the navigation structure in your app. Don't worry too much about this for now, it'll become clear soon enough! To frontload the installation work, let's also install and configure dependencies used by most navigators, then we can move forward with starting to write some code.

The libraries we will install now are [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler), [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated), [`react-native-screens`](https://github.com/software-mansion/react-native-screens) and [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) and [`@react-native-community/masked-view`](https://github.com/react-native-community/react-native-masked-view). If you already have these libraries installed and at the latest version, you are done here! Otherwise, read on.

### Installing dependencies into an Expo managed project

In your project directory, run:

```sh
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

This will install versions of these libraries that are compatible.

You can now continue to ["Hello React Navigation"](hello-react-navigation.md) to start writing some code.

### Installing dependencies into a bare React Native project

In your project directory, run:

```bash npm2yarn
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

> Note: You might get warnings related to peer dependencies after installation. They are usually caused by incorrect version ranges specified in some packages. You can safely ignore most warnings as long as your app builds.

From React Native 0.60 and higher, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md). So you **don't need to run** `react-native link`.

If you're on a Mac and developing for iOS, you need to install the pods (via [Cocoapods](https://cocoapods.org/)) to complete the linking.

```sh
npx pod-install ios
```

To finalize installation of `react-native-gesture-handler`, add the following at the **top** (make sure it's at the top and there's nothing else before it) of your entry file, such as `index.js` or `App.js`:

```js
import 'react-native-gesture-handler';
```

> Note: If you skip this step, your app may crash in production even if it works fine in development.

Now, we need to wrap the whole app in `NavigationContainer`. Usually you'd do this in your entry file, such as `index.js` or `App.js`:

```js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
  );
}
```

> Note: When you use a navigator (such as stack navigator), you'll need to follow the installation instructions of that navigator for any additional dependencies. If you're getting an error "Unable to resolve module", you need to install that module in your project.

Now you are ready to build and run your app on the device/simulator.

Continue to ["Hello React Navigation"](hello-react-navigation.md) to start writing some code.
