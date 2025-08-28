---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

What follows within the _Fundamentals_ section of this documentation is a tour of the most important aspects of React Navigation. It should cover enough for you to know how to build your typical small mobile application, and give you the background that you need to dive deeper into the more advanced parts of React Navigation.

## Pre-requisites

If you're already familiar with JavaScript, React and React Native, then you'll be able to get moving with React Navigation quickly! If not, we highly recommend you to gain some basic knowledge first, then come back here when you're done.

Here are some resources to help you out:

1. [Main Concepts of React](https://react.dev/learn)
2. [Getting started with React Native](https://reactnative.dev/docs/getting-started)
3. [React Hooks](https://react.dev/reference/react/hooks)
4. [React Context](https://react.dev/learn/passing-data-deeply-with-context)

## Minimum requirements

- `react-native` >= 0.72.0
- `expo` >= 52 (if you use [Expo Go](https://expo.dev/go))
- `typescript` >= 5.0.0 (if you use TypeScript)

## Starter template

If you're starting a new project, you can use the [React Navigation template](https://github.com/react-navigation/template) to quickly set up a new project with [Static configuration](#static-configuration):

```bash
npx create-expo-app@latest --template react-navigation/template
```

See the project's `README.md` for more information on how to get started.

If you created a new project using the template, you can skip the installation steps below and move on to ["Hello React Navigation"](hello-react-navigation.md?config=static).

Otherwise, you can follow the instructions below to install React Navigation into your existing project.

## Installation

Install the required packages in your React Native project:

```bash npm2yarn
npm install @react-navigation/native
```

React Navigation is made up of some core utilities and those are then used by navigators to create the navigation structure in your app. Don't worry too much about this for now, it'll become clear soon enough! To frontload the installation work, let's also install and configure dependencies used by most navigators, then we can move forward with starting to write some code.

The libraries we will install now are [`react-native-screens`](https://github.com/software-mansion/react-native-screens) and [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context). If you already have these libraries installed and at the latest version, you are done here! Otherwise, read on.

### Installing dependencies into an Expo managed project

In your project directory, run:

```bash
npx expo install react-native-screens react-native-safe-area-context
```

This will install versions of these libraries that are compatible.

You can now continue to ["Hello React Navigation"](hello-react-navigation.md) to start writing some code.

### Installing dependencies into a bare React Native project

In your project directory, run:

```bash npm2yarn
npm install react-native-screens react-native-safe-area-context
```

:::note

You might get warnings related to peer dependencies after installation. They are usually caused by incorrect version ranges specified in some packages. You can safely ignore these warnings as long as your app builds and works as expected.

:::

If you're on a Mac and developing for iOS, you need to install the pods (via [Cocoapods](https://cocoapods.org/)) to complete the linking.

```bash
npx pod-install ios
```

`react-native-screens` package requires one additional configuration step to properly
work on Android devices. Edit `MainActivity.kt` or `MainActivity.java` file which is located under `android/app/src/main/java/<your package name>/`.

Add the highlighted code to the body of `MainActivity` class:

<Tabs>
<TabItem value='kotlin' label='Kotlin' default>

```kotlin
class MainActivity: ReactActivity() {
  // ...
  // highlight-start
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
  // highlight-end
  // ...
}
```

  </TabItem>
  <TabItem value='java' label='Java'>

```java
public class MainActivity extends ReactActivity {
  // ...
  // highlight-start
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  // highlight-end
  // ...
}
```

</TabItem>
</Tabs>

and make sure to add the following import statement at the top of this file below your package statement:

```java
import android.os.Bundle;
```

This change is required to avoid crashes related to View state being not persisted consistently across Activity restarts.

:::info

When you use a navigator (such as stack navigator), you'll need to follow the installation instructions of that navigator for any additional dependencies. If you're getting an error "Unable to resolve module", you need to install that module in your project.

:::

## Setting up React Navigation

Once you've installed and configured the dependencies, you can move on to setting up your project to use React Navigation.

When using React Navigation, you configure [**navigators**](glossary-of-terms.md#navigator) in your app. Navigators handle the transition between screens in your app and provide UI such as header, tab bar etc.

There are 2 primary ways to configure the navigators:

### Static configuration

The static configuration API lets you write your configuration in an object, and is defined statically, i.e. it cannot change at runtime. This has reduced boilerplate and simplifies things such as TypeScript types and deep linking.

If you're starting a new project or are new to React Navigation, this is the **recommended way** to set up your app. If you need more flexibility in the future, you can always mix and match with the dynamic configuration.

Continue to ["Hello React Navigation"](hello-react-navigation.md?config=static) to start writing some code with the static API.

### Dynamic configuration

The dynamic configuration API lets you write your configuration in React components, and can change at runtime based on state or props. This allows for more flexibility but requires more boilerplate and configuration for Typescript types, deep linking etc.

Continue to ["Hello React Navigation"](hello-react-navigation.md?config=dynamic) to start writing some code with the dynamic API.
