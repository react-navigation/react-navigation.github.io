---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The _Fundamentals_ section covers the most important aspects of React Navigation. It should be enough to build a typical mobile application and give you the background to dive deeper into the more advanced topics.

<details>
<summary>Prior knowledge</summary>

If you're already familiar with JavaScript, React and React Native, you'll be able to get moving with React Navigation quickly! If not, we recommend gaining some basic knowledge first, then coming back here when you're done.

1. [React Documentation](https://react.dev/learn)
2. [React Native Documentation](https://reactnative.dev/docs/getting-started)

</details>

<details>
<summary>Minimum requirements</summary>

- `react-native` >= 0.81
- `expo` >= 54 ([development build](https://docs.expo.dev/development/introduction/) is required)
- `typescript` >= 5.9.2 (if you use TypeScript)
- `react-native-web` >= 0.21.0 (if you support Web)

</details>

## Installation

The `@react-navigation/native` package contains the core functionality of React Navigation.

In your project directory, run:

```bash npm2yarn
npm install @react-navigation/native@next
```

### Installing dependencies

Next, install the dependencies used by most navigators: [`react-native-screens`](https://github.com/software-mansion/react-native-screens) and [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

<Tabs groupId='framework' queryString="framework">
<TabItem value='expo' label='Expo' default>

In your project directory, run:

```bash
npx expo install react-native-screens react-native-safe-area-context @callstack/liquid-glass
```

This will install versions of these libraries that are compatible with your Expo SDK version.

</TabItem>
<TabItem value='community-cli' label='Community CLI'>

In your project directory, run:

```bash npm2yarn
npm install react-native-screens react-native-safe-area-context @callstack/liquid-glass
```

If you're on a Mac and developing for iOS, install the pods via [Cocoapods](https://cocoapods.org/) to complete the linking:

```bash
npx pod-install ios
```

#### Configuring `react-native-screens` on Android

[`react-native-screens`](https://github.com/software-mansion/react-native-screens) requires one additional configuration to properly work on Android.

Edit `MainActivity.kt` or `MainActivity.java` under `android/app/src/main/java/<your package name>/` and add the highlighted code:

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

This avoids crashes related to View state not being persisted across Activity restarts.

#### Opting-out of predictive back on Android

React Navigation doesn't yet support Android's predictive back gesture, so you need to disable it for the system back gesture to work properly.

In `AndroidManifest.xml`, set `android:enableOnBackInvokedCallback` to `false` in the `<application>` tag (or `<activity>` tag to opt-out at activity level):

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

When using React Navigation, you configure [**navigators**](glossary-of-terms.md#navigator) in your app. Navigators handle transitions between screens and provide UI such as headers, tab bars, etc.

:::info

When you use a navigator (such as stack navigator), you'll need to follow that navigator's installation instructions for any additional dependencies.

:::

There are 2 ways to configure navigators:

### Static configuration

The static configuration API lets you write your navigation configuration in an object. This reduces boilerplate and simplifies TypeScript types and deep linking. Some aspects can still be changed dynamically.

This is the **recommended way** to set up your app. If you need more flexibility later, you can mix and match with the dynamic configuration.

Continue to ["Hello React Navigation"](hello-react-navigation.md?config=static) to start writing some code with the static API.

### Dynamic configuration

The dynamic configuration API lets you write your navigation configuration using React components that can change at runtime based on state or props. This offers more flexibility but requires significantly more boilerplate for TypeScript types, deep linking, etc.

Continue to ["Hello React Navigation"](hello-react-navigation.md?config=dynamic) to start writing some code with the dynamic API.
