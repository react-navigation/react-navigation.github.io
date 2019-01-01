---
id: deep-linking
title: Deep linking
sidebar_label: Deep linking
---

In this guide we will set up our app to handle external URIs. Let's suppose that we want a URI like `mychat://chat/Eric` to open our app and link straight into a chat screen for some user named "Eric".

## Configuration

Previously, we had defined a navigator like this:

```js
const SimpleApp = createAppContainer(createStackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
}));
```

We want paths like `chat/Eric` to link to a "Chat" screen with the `user` passed as a param. Let's re-configure our chat screen with a `path` that tells the router what relative path to match against, and what params to extract. This path spec would be `chat/:user`.

```js
const SimpleApp = createAppContainer(createStackNavigator({
  Home: { screen: HomeScreen },
  Chat: {
    screen: ChatScreen,
    path: 'chat/:user',
  },
}));
```

## Set up with Expo projects

First, you will want to specify a url scheme for your app. This corresponds to the string before `://` in a url, so if your scheme is `mychat` then a link to your app would be `mychat://`. The scheme only applies to standalone apps and you need to re-build the standalone app for the change to take effect. In the Expo client app you can deep link using `exp://ADDRESS:PORT` where `ADDRESS` is often `127.0.0.1` and `PORT` is often `19000` - the URL is printed when you run `expo start`. If you want to test with your custom scheme you will need to run `expo build:ios -t simulator` or `expo build:android` and install the resulting binaries in your emulators. You can register for a scheme in your `app.json` by adding a string under the scheme key:

```json
{
  "expo": {
    "scheme": "mychat"
  }
}
```


### URI Prefix

Next, let's configure our navigation container to extract the path from the app's incoming URI. 

```js
import * as Expo from 'expo';

const SimpleApp = createAppContainer(createStackNavigator({...}));

const prefix = Expo.Linking.makeUrl('/');

const MainApp = () => <SimpleApp uriPrefix={prefix} />;
```

The reason that is necessary to use `Expo.Linking.makeUrl` is that the scheme will differ depending on whether you're in the client app or in a standalone app.

### Test deep linking on iOS

To test the URI on the simulator in the Expo client app, run the following:

```
xcrun simctl openurl booted [ put your URI prefix in here ]

// for example

xcrun simctl openurl booted exp://127.0.0.1:19000/--/chat/Eric
```

### Test deep linking on Android

To test the intent handling in Android (Expo client app ), run the following:

```
adb shell am start -W -a android.intent.action.VIEW -d "[ put your URI prefix in here ]" com.simpleapp

// for example

adb shell am start -W -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/chat/Eric" com.simpleapp
```

Read the [Expo linking guide](https://docs.expo.io/versions/latest/guides/linking.html) for more information about how to configure linking in projects built with Expo.

## Set up with `react-native init` projects

### URI Prefix

Next, let's configure our navigation container to extract the path from the app's incoming URI. 

```js
const SimpleApp = createAppContainer(createStackNavigator({...}));

const prefix = 'mychat://';

const MainApp = () => <SimpleApp uriPrefix={prefix} />;
```

### iOS

Let's configure the native iOS app to open based on the `mychat://` URI scheme.

In `SimpleApp/ios/SimpleApp/AppDelegate.m`:

```
// Add the header at the top of the file:
#import <React/RCTLinkingManager.h>

// Add this above the `@end`:
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
```

In Xcode, open the project at `SimpleApp/ios/SimpleApp.xcodeproj`. Select the project in sidebar and navigate to the info tab. Scroll down to "URL Types" and add one. In the new URL type, set the identifier and the url scheme to your desired url scheme.

![Xcode project info URL types with mychat added](/docs/assets/deep-linking/xcode-linking.png)

Now you can press play in Xcode, or re-build on the command line:

```sh
react-native run-ios
```

To test the URI on the simulator, run the following:

```
xcrun simctl openurl booted mychat://chat/Eric
```

To test the URI on a real device, open Safari and type `mychat://chat/Eric`.

### Android

To configure the external linking in Android, you can create a new intent in the manifest.

In `SimpleApp/android/app/src/main/AndroidManifest.xml`, do these followings adjustments:
1. Set `launchMode` of `MainActivity` to `singleTask` in order to receive intent on existing `MainActivity`. It is useful if you want to perform navigation using deep link you have been registered - [details](http://developer.android.com/training/app-indexing/deep-linking.html#adding-filters)
2. Add the new `intent-filter` inside the `MainActivity` entry with a `VIEW` type action:

```
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
        <data android:scheme="mychat" />            
    </intent-filter>
</activity>
```

Now, re-install the app:

```sh
react-native run-android
```

To test the intent handling in Android, run the following:

```
adb shell am start -W -a android.intent.action.VIEW -d "mychat://chat/Eric" com.simpleapp
```
