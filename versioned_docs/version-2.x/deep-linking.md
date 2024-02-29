---
id: deep-linking
title: Deep linking
sidebar_label: Deep linking
---

In this guide we will set up our app to handle external URIs. Let's suppose that we want a URI like `mychat://chat/Eric` to open our app and link straight into a chat screen for some user named "Eric".

## Configuration

Previously, we had defined a navigator like this:

```js
const SimpleApp = createStackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
});
```

We want paths like `chat/Eric` to link to a "Chat" screen with the `user` passed as a param. Let's re-configure our chat screen with a `path` that tells the router what relative path to match against, and what params to extract. This path spec would be `chat/:user`.

```js
const SimpleApp = createStackNavigator({
  Home: { screen: HomeScreen },
  Chat: {
    screen: ChatScreen,
    path: 'chat/:user',
  },
});
```

## Set up with Expo projects

You need to specify a scheme for your app. You can register for a scheme in your `app.json` by adding a string under the scheme key:

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
const SimpleApp = createStackNavigator({...});

const prefix = Expo.Linking.makeUrl('/');

const MainApp = () => <SimpleApp uriPrefix={prefix} />;
```

### iOS

To test the URI on the simulator (Expo client app ), run the following:

```
xcrun simctl openurl booted [ put your URI prefix in here ]

// for example

xcrun simctl openurl booted exp://127.0.0.1:19004/--/chat/Eric

```

### Android

To test the intent handling in Android (Expo client app ), run the following:

```
adb shell am start -W -a android.intent.action.VIEW -d "[ put your URI prefix in here ]" com.simpleapp

// for example

adb shell am start -W -a android.intent.action.VIEW -d "exp://127.0.0.1:19004/--/chat/Eric" com.simpleapp

```

Read the [Expo linking guide](https://docs.expo.io/versions/latest/guides/linking.html) for more information about how to configure linking in projects built with Expo.

## Set up with `react-native init` projects

### URI Prefix

Next, let's configure our navigation container to extract the path from the app's incoming URI.

```js
const SimpleApp = createStackNavigator({...});

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

In Xcode, open the project at `SimpleApp/ios/SimpleApp.xcodeproj`. Select the project in sidebar and navigate to the info tab. Scroll down to "URL Types" and add one. In the new URL type, set the identifier and the URL scheme to your desired URL scheme.

![Xcode project info URL types with mychat added](/assets/deep-linking/xcode-linking.png)

Now you can press play in Xcode, or re-build on the command line:

```bash
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

```bash
react-native run-android
```

To test the intent handling in Android, run the following:

```
adb shell am start -W -a android.intent.action.VIEW -d "mychat://chat/Eric" com.simpleapp
```

## Disable deep linking

In case you want to handle routing with deep-linking by yourself instead of `react-navigation`, you can pass `enableURLHandling={false}` prop to your top level navigator:

```js
const SimpleApp = createStackNavigator({...});

const MainApp = () => <SimpleApp enableURLHandling={false} />;
```

Then, to handle the URL with the parameters, you can use `Linking` in your components to react to events.

```js
componentDidMount() {
    // [...]
    Linking.addEventListener('url', this.handleDeepLink)
}
componentWillUnmount() {
    // [...]
    Linking.removeEventListener('url', this.handleDeepLink);
}
```

And the method to handle it :

```js
handleDeepLink(e) {
    const route = e.url.replace(/.*?:\/\//g, '')
    // use route to navigate
    // ...
}
```

This should get you started! 🥳
