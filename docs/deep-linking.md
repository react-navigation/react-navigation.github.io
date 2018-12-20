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


### URI Prefix

Next, let's configure our navigation container to extract the path from the app's incoming URI. 

```js
const SimpleApp = createAppContainer(createStackNavigator({...}));

// on Android, the URI prefix typically contains a host in addition to scheme
// on Android, note the required / (slash) at the end of the host property
const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

const MainApp = () => <SimpleApp uriPrefix={prefix} />;
```

## Set up with Expo projects

Read the [Expo linking guide](https://docs.expo.io/versions/latest/guides/linking.html) for more information about how to configure linking in projects built with Expo.

## Set up with `react-native init` projects

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

In `SimpleApp/android/app/src/main/AndroidManifest.xml`, add the new `intent-filter` inside the `MainActivity` entry with a `VIEW` type action:

```
<intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="mychat" android:host="mychat" />            
</intent-filter>
```

Now, re-install the app:

```sh
react-native run-android
```

To test the intent handling in Android, run the following:

```
adb shell am start -W -a android.intent.action.VIEW -d "mychat://mychat/chat/Eric" com.simpleapp
```

### Firebase Dynamic Links
In case you want to handle [Dynamic Links](https://rnfirebase.io/docs/v5.x.x/links/reference/links#onLink) to navigate somewhere with `react-navigation` 
You should setup like this:

```javascript

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      App: AppTab,
      Auth: AuthStack,
      ResetPassword: {
        path: 'rspass/:token',
        screen: ResetPassword
      }
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)

// UTILS
export const getDomainName = (url: string): string => {
  let hostname
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }
  //find & remove port number
  hostname = hostname.split(':')[0]
  //find & remove "?"
  hostname = hostname.split('?')[0]
  hostname = hostname.replace('www.', '')

  return hostname
}
//$FlowFixMe
Array.prototype.remove = function(from: number, to: number) {
  var rest = this.slice((to || from) + 1 || this.length)
  this.length = from < 0 ? this.length + from : from
  return this.push.apply(this, rest)
}
export const extractDeepLinkFromDynamicLink = (
  dynamicLink: string = ''
): string => {
  const arr = dynamicLink.split('/').filter(str => str.length)
  const hostname = getDomainName(dynamicLink)
  arr.forEach((str, index) => {
    if (
      str.indexOf('http') === 0 ||
      str.indexOf('https') === 0 ||
      str === hostname
    ) {
      //$FlowFixMe
      arr.remove(index, index + 1)
    }
  })
  return `${hostname}://${arr.join('/')}`
}
// UTILS END

type Props = {}
const uriPrefix =
  Platform.OS === 'android'
    ? 'chat://chat/'
    : 'chat://'
export default class App extends React.PureComponent<Props> {
  unsubcribe: Function
  constructor(props: Props) {
    super(props)
    this.unsubcribe = firebase.links().onLink(url => {
      const path = extractDeepLinkFromDynamicLink(url)
      if (!path.length) {
        console.log('nothing to do with empty path')
        return
      }
      Linking.canOpenURL(path)
        .then(() => Linking.openURL(path))
        .catch(e => console.log('Unable to handle dynamic link as a deeplink', e))
    })
  }

  componentWillUnmount() {
    console.log('DYNAMIC_LINK unsubcribe')
    this.unsubcribe()
  }

  render() {
    return (
      <AppContainer
        uriPrefix={uriPrefix}
        ref={ref => {
          NavigationService.setTopLevelNavigator(ref)
        }}
      />
    )
  }
}

```
