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

- `react-native` >= 0.81
- `expo` >= 54
- `typescript` >= 5.9.2 (if you use TypeScript)
- `react-native-web` >= 0.21.0 (if you support Web)

## Installation

The `@react-navigation/native` package contains the core functionality of React Navigation.

In your project directory, run:

```bash npm2yarn
npm install @react-navigation/native@next
```

### Installing dependencies

Let's also install and configure dependencies used by most navigators. The libraries we will install now are [`react-native-screens`](https://github.com/software-mansion/react-native-screens) and [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

<Tabs groupId='framework' queryString="framework">
<TabItem value='expo' label='Expo' default>

In your project directory, run:

```bash
npx expo install react-native-screens react-native-safe-area-context @callstack/liquid-glass
```

This will install versions of these libraries that are compatible with your Expo SDK version.

:::warning

[Expo Go](https://expo.dev/go) does not include all native dependencies required by React Navigation. So it will not reflect the actual behavior of your app in production. To properly test your app, you need to create a [development build](https://docs.expo.dev/development/introduction/) of your app.

:::

</TabItem>
<TabItem value='community-cli' label='Community CLI'>

In your project directory, run:

```bash npm2yarn
npm install react-native-screens react-native-safe-area-context @callstack/liquid-glass
```

If you're on a Mac and developing for iOS, you need to install the pods (via [Cocoapods](https://cocoapods.org/)) to complete the linking.

```bash
npx pod-install ios
```

#### Configuring `react-native-screens` on Android

[`react-native-screens`](https://github.com/software-mansion/react-native-screens) requires one additional configuration to properly work on Android.

Edit `MainActivity.kt` or `MainActivity.java` file under `android/app/src/main/java/<your package name>/`, and add the highlighted code to the body of `MainActivity` class:

<Tabs>
<TabItem value='kotlin' label='Kotlin' default>

```kotlin
// highlight-start
import android.os.Bundle
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory
// highlight-end

// ...

class MainActivity: ReactActivity() {
  // ...

  // highlight-start
  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    super.onCreate(savedInstanceState)
  }
  // highlight-end

  // ...
}
```

</TabItem>
<TabItem value='java' label='Java'>

```java
// highlight-start
import android.os.Bundle;
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory;
// highlight-end

// ...

public class MainActivity extends ReactActivity {
  // ...

  // highlight-start
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    getSupportFragmentManager().setFragmentFactory(new RNScreensFragmentFactory());
    super.onCreate(savedInstanceState);
  }
  // highlight-end

  // ...
}
```

</TabItem>
</Tabs>

This change is required to avoid crashes related to View state being not persisted consistently across Activity restarts.

#### Opting-out of predictive back on Android

React Navigation doesn't yet support Android's predictive back gesture. Disabling it is necessary for the system back gesture to work properly with React Navigation.

To opt out, in `AndroidManifest.xml`, in the `<application>` tag (or `<activity>` tag to opt-out at activity level), set the `android:enableOnBackInvokedCallback` flag to `false`:

```xml
<application
  // highlight-next-line
  android:enableOnBackInvokedCallback="false"
  >
  <!-- ... -->
</application>
```

</TabItem>
</Tabs>

## Setting up React Navigation

Once you've installed and configured the dependencies, you can move on to setting up your project to use React Navigation.

When using React Navigation, you configure [**navigators**](glossary-of-terms.md#navigator) in your app. Navigators handle the transition between screens in your app and provide UI such as header, tab bar etc.

:::info

When you use a navigator (such as stack navigator), you'll need to follow the installation instructions of that navigator for any additional dependencies.

:::

There are 2 primary ways to configure the navigators:

### Static configuration

The static configuration API lets you write your configuration in an object, and is defined statically, though some aspects of the configuration can still can be changed dynamically. This has reduced boilerplate and simplifies things such as TypeScript types and deep linking.

If you're starting a new project or are new to React Navigation, this is the **recommended way** to set up your app. If you need more flexibility in the future, you can always mix and match with the dynamic configuration.

Continue to ["Hello React Navigation"](hello-react-navigation.md?config=static) to start writing some code with the static API.

### Dynamic configuration

The dynamic configuration API lets you write your configuration in React components, and can change at runtime based on state or props. This allows for more flexibility but requires significantly more boilerplate and configuration for Typescript types, deep linking etc.

Continue to ["Hello React Navigation"](hello-react-navigation.md?config=dynamic) to start writing some code with the dynamic API.
