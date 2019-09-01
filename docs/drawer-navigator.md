---
id: drawer-navigator
title: createDrawerNavigator
sidebar_label: createDrawerNavigator
---

Component that renders a navigation drawer which can be opened and closed via gestures.

To use this navigator, you need to install [`@react-navigation/drawer`](https://github.com/navigation-ex/packages/drawer):

```sh
yarn add @react-navigation/core@next @react-navigation/drawer@next
```

Now we need to install [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler) and [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated).

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-gesture-handler react-native-reanimated
```

If you are not using Expo, run the following:

```sh
yarn add react-native-gesture-handler react-native-reanimated
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

Next, we need to link these libraries. The steps depends on your React Native version:

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

  To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

  ```sh
  cd ios
  pod install
  cd ..
  ```

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the dependencies. To do that, run:

  ```sh
  react-native link react-native-reanimated
  react-native link react-native-gesture-handler
  ```

To finalize installation of `react-native-gesture-handler` for Android, be sure to make the necessary modifications to `MainActivity.java`:

```diff
package com.reactnavigation.example;

import com.facebook.react.ReactActivity;
+ import com.facebook.react.ReactActivityDelegate;
+ import com.facebook.react.ReactRootView;
+ import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Example";
  }

+  @Override
+  protected ReactActivityDelegate createReactActivityDelegate() {
+    return new ReactActivityDelegate(this, getMainComponentName()) {
+      @Override
+      protected ReactRootView createRootView() {
+       return new RNGestureHandlerEnabledRootView(MainActivity.this);
+      }
+    };
+  }
}
```

Finally, run `react-native run-android` or `react-native run-ios` to launch the app on your device/simulator.

## API Definition

To use this drawer navigator, import it from `@react-navigation/drawer`:

```js
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  );
}
```

> For a complete usage guide please visit [Tab Navigation](https://reactnavigation.org/docs/drawer-based-navigation.html)

### Props

The `Drawer.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

#### `backBehavior`

Behavior of back button handling.

- `initialRoute` to return to initial tab
- `order` to return to previous tab (in the order they are shown in the tab bar)
- `history` to return to last visited tab
- `none` to not handle back button

#### `drawerBackgroundColor`

Use the Drawer background for some color. The Default is `white`.

#### `drawerPosition`

Options are `left` or `right`. Default is `left` position.

#### `drawerType`

Type of the drawer. It determines how the drawer looks and animates.

- `front`: Traditional drawer which covers the screen with a overlay behind it.
- `back`: The drawer is revealed behind the screen on swipe.
- `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.

#### `drawerWidth`

Number or a function which returns the width of the drawer. If a function is provided, it'll be called again when the screen's dimensions change.

#### `edgeWidth`

Allows for defining how far from the edge of the content view the swipe gesture should activate

#### `hideStatusBar`

When set to true Drawer component will hide the OS status bar whenever the drawer is pulled or when its in an "open" state.

#### `statusBarAnimation`

Animation of the statusbar when hiding it. use in combination with `hideStatusBar`.

#### `keyboardDismissMode`

Whether the keyboard should be dismissed when the swipe gesture begins. Defaults to `'on-drag'`. Set to `'none'` to disable keyboard handling.

#### `minSwipeDistance`

Minimum swipe distance threshold that should activate opening the drawer.

#### `overlayColor`

Color overlay to be displayed on top of the content view when drawer gets open. The opacity is animated from `0` to `1` when the drawer opens.

#### `gestureHandlerProps`

Props to pass to the underlying pan gesture handler.

#### `lazy`

Whether the screens should render the first time they are accessed. Defaults to `true`. Set it to `false` if you want to render all screens on initial render.

#### `unmountInactiveRoutes`

Whether a screen should be unmounted when navigating away from it. Defaults to `false`.

#### `contentComponent`

Component used to render the content of the drawer, for example, navigation items. Receives the `navigation` prop and `drawerOpenProgress` for the drawer. Defaults to `DrawerItems`. For more information, see below.

#### `contentOptions`

An object containing the props for the drawer content component. See below for more details.

### Providing a custom `contentComponent`

The default component for the drawer is scrollable and only contains links for the routes in the RouteConfig. You can easily override the default component to add a header, footer, or other content to the drawer. By default the drawer is scrollable and supports iPhone X safe area. If you customize the content, be sure to wrap the content in a SafeAreaView:

```js
import SafeAreaView from 'react-native-safe-area-view';
import { DrawerItems } from '@react-navigation/drawer';

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

`contentComponent` also received a prop called `drawerOpenProgress` which is an Reanimated Node that represents the animated position of the drawer (0 is closed; 1 is open). This allows you to do interesting animations in your `contentComponent`, such as parallax motion of the drawer contents:

```js
const CustomDrawerContentComponent = props => {
  const translateX = props.drawerOpenProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      {/* ... drawer contents */}
    </Animated.View>
  );
};
```

### `contentOptions` for `DrawerItems`

- `items` - the array of routes, can be modified or overridden
- `activeItemKey` - key identifying the active route
- `activeTintColor` - label and icon color of the active label
- `activeBackgroundColor` - background color of the active label
- `inactiveTintColor` - label and icon color of the inactive label
- `inactiveBackgroundColor` - background color of the inactive label
- `onItemPress({ route, focused })` - function to be invoked when an item is pressed
- `itemsContainerStyle` - style object for the content section
- `itemStyle` - style object for the single item, which can contain an Icon and/or a Label
- `labelStyle` - style object to overwrite `Text` style inside content section, when your label is a string
- `activeLabelStyle` - style object to overwrite `Text` style of the active label, when your label is a string (merged with `labelStyle`)
- `inactiveLabelStyle` - style object to overwrite `Text` style of the inactive label, when your label is a string (merged with `labelStyle`)
- `iconContainerStyle` - style object to overwrite `View` icon container styles.

Example:

```js
contentOptions: {
  activeTintColor: '#e91e63',
  itemsContainerStyle: {
    marginVertical: 0,
  },
  iconContainerStyle: {
    opacity: 1
  }
}
```

### Options for `Tab.Screen`

The `options` prop can be used to configure individual screens inside the navigator. Supported options are:

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `drawerLabel`

#### `drawerLabel`

String or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in drawer sidebar. When undefined, scene `title` is used

#### `drawerIcon`

Function, that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in drawer sidebar

#### `drawerLockMode`

Specifies the [lock mode](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html#drawerlockmode) of the drawer. This can also update dynamically by using screenProps.drawerLockMode on your top level router.

### Nesting drawer navigators inside others

If a drawer navigator is nested inside of another navigator that provides some UI, for example a tab navigator or stack navigator, then the drawer will be rendered below the UI from those navigators. The drawer will appear below the tab bar and below the header of the stack. You will need to make the drawer navigator the parent of any navigator where the drawer should be rendered on top of its UI.
