---
id: deep-linking
title: Deep linking
sidebar_label: Deep linking
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide will describe how to configure your app to handle deep links on various platforms. To handle incoming links, you need to handle 2 scenarios:

1. If the app wasn't previously open, the deep link needs to set the initial state
2. If the app was already open, the deep link needs to update the state to reflect the incoming link

React Native provides a [`Linking`](https://reactnative.dev/docs/linking) to get notified of incoming links. React Navigation can integrate with the `Linking` module to automatically handle deep links. On Web, React Navigation can integrate with browser's `history` API to handle URLs on client side. See [configuring links](configuring-links.md) to see more details on how to configure links in React Navigation.

While you don't need to use the `linking` prop from React Navigation, and can handle deep links yourself by using the `Linking` API and navigating from there, it'll be significantly more complicated than using the `linking` prop which handles many edge cases for you. So we don't recommend implementing it by yourself.

Below, we'll go through required configurations so that the deep link integration works.

## Setup with Expo projects

First, you will want to specify a URL scheme for your app. This corresponds to the string before `://` in a URL, so if your scheme is `example` then a link to your app would be `example://`. You can register for a scheme in your `app.json` by adding a string under the scheme key:

```json
{
  "expo": {
    "scheme": "example"
  }
}
```

Next, install `expo-linking` which we'd need to get the deep link prefix:

```bash
npx expo install expo-linking
```

Then, let's configure React Navigation to use the `scheme` for parsing incoming deep links:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

/* content */

function App() {
  const linking = {
    prefixes: [prefix],
  };

  return <Navigation linking={linking} />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

function App() {
  const linking = {
    prefixes: [prefix],
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {/* content */}
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

It is necessary to use `Linking.createURL` since the scheme differs between the [Expo Dev Client](https://docs.expo.dev/versions/latest/sdk/dev-client/) and standalone apps.

The scheme specified in `app.json` only applies to standalone apps. In the Expo client app you can deep link using `exp://ADDRESS:PORT/--/` where `ADDRESS` is often `127.0.0.1` and `PORT` is often `19000` - the URL is printed when you run `expo start`. The `Linking.createURL` function abstracts it out so that you don't need to specify them manually.

If you are using universal links, you need to add your domain to the prefixes as well:

```js
const linking = {
  prefixes: [Linking.createURL('/'), 'https://app.example.com'],
};
```

### Universal Links on Expo

To set up iOS universal Links in your Expo app, you need to configure your [app config](https://docs.expo.dev/workflow/configuration) to include the associated domains and entitlements:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:app.example.com"],
      "entitlements": {
        "com.apple.developer.associated-domains": ["applinks:app.example.com"]
      }
    }
  }
}
```

You will also need to setup [Associated Domains](https://developer.apple.com/documentation/Xcode/supporting-associated-domains) on your server.

See [Expo's documentation on iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/) for more details.

### App Links on Expo

To set up Android App Links in your Expo app, you need to configure your [app config](https://docs.expo.dev/workflow/configuration) to include the `intentFilters`:

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "app.example.com"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

You will also need to [declare the association](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc) between your website and your intent filters by hosting a Digital Asset Links JSON file.

See [Expo's documentation on Android App Links](https://docs.expo.dev/linking/android-app-links/) for more details.

## Set up with bare React Native projects

### Setup on iOS

Let's configure the native iOS app to open based on the `example://` URI scheme.

You'll need to add the `LinkingIOS` folder into your header search paths as described [here](https://reactnative.dev/docs/linking-libraries-ios#step-3). Then you'll need to add the following lines to your or `AppDelegate.swift` or `AppDelegate.mm` file:

<Tabs groupId="ios-lang">
<TabItem value='swift' label='Swift' default>

```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  return RCTLinkingManager.application(app, open: url, options: options)
}
```

</TabItem>
<TabItem value='objc' label='Objective-C'>

```objc
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

</TabItem>
</Tabs>

If your app is using [Universal Links](https://developer.apple.com/ios/universal-links/), you'll need to add the following code as well:

<Tabs groupId="ios-lang">
<TabItem value='swift' label='Swift' default>

```swift
func application(
  _ application: UIApplication,
  continue userActivity: NSUserActivity,
  restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }
```

</TabItem>
<TabItem value='objc' label='Objective-C'>

```objc
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
```

</TabItem>
</Tabs>

Now you need to add the scheme to your project configuration.

The easiest way to do this is with the `uri-scheme` package by running the following:

```bash
npx uri-scheme add example --ios
```

If you want to do it manually, open the project (e.g. `SimpleApp/ios/SimpleApp.xcworkspace`) in Xcode. Select the project in sidebar and navigate to the info tab. Scroll down to "URL Types" and add one. In the new URL type, set the identifier and the URL scheme to your desired URL scheme.

![Xcode project info URL types with example added](/assets/deep-linking/xcode-linking.png)

To make sure Universal Links work in your app, you also need to setup [Associated Domains](https://developer.apple.com/documentation/Xcode/supporting-associated-domains) on your server.

#### Hybrid React Native and native iOS Applications

If you're using React Navigation within a hybrid app - an iOS app that has both Swift/ObjC and React Native parts - you may be missing the `RCTLinkingIOS` subspec in your `Podfile`, which is installed by default in new React Native projects. To add this, ensure your `Podfile` looks like the following:

```pod
 pod 'React', :path => '../node_modules/react-native', :subspecs => [
    . . . // other subspecs
    'RCTLinkingIOS',
    . . .
  ]
```

### Setup on Android

To configure the external linking in Android, you can create a new intent in the manifest.

The easiest way to do this is with the `uri-scheme` package: `npx uri-scheme add example --android`.

If you want to add it manually, open up `SimpleApp/android/app/src/main/AndroidManifest.xml`, and make the following adjustments:

1. Set `launchMode` of `MainActivity` to `singleTask` in order to receive intent on existing `MainActivity` (this is the default, so you may not need to actually change anything).
2. Add the new [`intent-filter`](http://developer.android.com/training/app-indexing/deep-linking.html#adding-filters) inside the `MainActivity` entry with a `VIEW` type action:

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="example" />
    </intent-filter>
</activity>
```

Similar to Universal Links on iOS, you can also use a domain to associate the app with your website on Android by [verifying Android App Links](https://developer.android.com/training/app-links/verify-android-applinks). First, you need to configure your `AndroidManifest.xml`:

1. Add `android:autoVerify="true"` to your `<intent-filter>` entry.
2. Add your domain's `scheme` and `host` in a new `<data>` entry inside the `<intent-filter>`.

After adding them, it should look like this:

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="example" />
    </intent-filter>
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="http" />
        <data android:scheme="https" />
        <data android:host="app.example.com" />
    </intent-filter>
</activity>
```

Then, you need to [declare the association](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc) between your website and your intent filters by hosting a Digital Asset Links JSON file.

## Testing deep links

Before testing deep links, make sure that you rebuild and install the app in your emulator/simulator/device.

If you're testing on iOS, run:

```bash
npx react-native run-ios
```

If you're testing on Android, run:

```bash
npx react-native run-android
```

If you're using Expo managed workflow and testing on Expo client, you don't need to rebuild the app. However, you will need to use the correct address and port that's printed when you run `expo start` ([see above](#setup-with-expo-projects)), e.g. `exp://127.0.0.1:19000/--/`.

If you want to test with your custom scheme in your Expo app, you will need rebuild your standalone app by running `expo build:ios -t simulator` or `expo build:android` and install the resulting binaries.

### Testing with `npx uri-scheme`

The `uri-scheme` package is a command line tool that can be used to test deep links on both iOS & Android. It can be used as follows:

```bash
npx uri-scheme open [your deep link] --[ios|android]
```

For example:

```bash
npx uri-scheme open "example://chat/jane" --ios
```

Or if using Expo client:

```bash
npx uri-scheme open "exp://127.0.0.1:19000/--/chat/jane" --ios
```

### Testing with `xcrun` on iOS

The `xcrun` command can be used as follows to test deep links with the iOS simulator:

```bash
xcrun simctl openurl booted [your deep link]
```

For example:

```bash
xcrun simctl openurl booted "example://chat/jane"
```

### Testing with `adb` on Android

The `adb` command can be used as follows to test deep links with the Android emulator or a connected device:

```bash
adb shell am start -W -a android.intent.action.VIEW -d [your deep link] [your android package name]
```

For example:

```bash
adb shell am start -W -a android.intent.action.VIEW -d "example://chat/jane" com.simpleapp
```

Or if using Expo client:

```bash
adb shell am start -W -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/chat/jane" host.exp.exponent
```

## Integrating with other tools

In addition to deep links and universal links with React Native's `Linking` API, you may also want to integrate other tools for handling incoming links, e.g. Push Notifications - so that tapping on a notification can open the app to a specific screen.

To achieve this, you'd need to override how React Navigation subscribes to incoming links. To do so, you can provide your own [`getInitialURL`](navigation-container.md#linkinggetinitialurl) and [`subscribe`](navigation-container.md#linkingsubscribe) functions.

Here is an example integration with [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications):

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Expo Notifications"
const linking = {
  prefixes: ['example://', 'https://app.example.com'],

  // Custom function to get the URL which was used to open the app
  async getInitialURL() {
    // First, handle deep links
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();

    return response?.notification.request.content.data.url;
  },

  // Custom function to subscribe to incoming links
  subscribe(listener) {
    // Listen to incoming links for deep links
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });

    // Listen to expo push notifications when user interacts with them
    const pushNotificationSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data.url;

        listener(url);
      });

    return () => {
      // Clean up the event listeners
      linkingSubscription.remove();
      pushNotificationSubscription.remove();
    };
  },
};
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Expo Notifications"
const linking = {
  prefixes: ['example://', 'https://app.example.com'],

  // Custom function to get the URL which was used to open the app
  async getInitialURL() {
    // First, handle deep links
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync();

    return response?.notification.request.content.data.url;
  },

  // Custom function to subscribe to incoming links
  subscribe(listener) {
    // Listen to incoming links for deep links
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });

    // Listen to expo push notifications when user interacts with them
    const pushNotificationSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data.url;

        listener(url);
      });

    return () => {
      // Clean up the event listeners
      linkingSubscription.remove();
      pushNotificationSubscription.remove();
    };
  },

  config: {
    // Deep link configuration
  },
};
```

</TabItem>
</Tabs>

Similar to the above example, you can integrate any API that provides a way to get the initial URL and to subscribe to new incoming URLs using the `getInitialURL` and `subscribe` options.
