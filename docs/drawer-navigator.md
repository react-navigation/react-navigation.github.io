---
id: drawer-navigator
title: createDrawerNavigator
sidebar_label: createDrawerNavigator
---

Component that renders a navigation drawer which can be opened and closed via gestures.

To use this navigator, you need to install [`@react-navigation/drawer`](https://github.com/react-navigation/navigation-ex/tree/master/packages/drawer):

```sh
yarn add @react-navigation/core@next @react-navigation/drawer@next
```

Now we need to install [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler), [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated), [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context).

If you are using Expo, to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

If you are not using Expo, run the following:

```sh
yarn add react-native-reanimated react-native-gesture-handler react-native-safe-area-context
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

```sh
cd ios
pod install
cd ..
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

> For a complete usage guide please visit [Drawer Navigation](https://reactnavigation.org/docs/drawer-based-navigation.html).

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

#### `drawerPosition`

Options are `left` or `right`. Default is `left` position.

#### `drawerType`

Type of the drawer. It determines how the drawer looks and animates.

- `front`: Traditional drawer which covers the screen with a overlay behind it.
- `back`: The drawer is revealed behind the screen on swipe.
- `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.

#### `edgeWidth`

Allows for defining how far from the edge of the content view the swipe gesture should activate

#### `hideStatusBar`

When set to true Drawer component will hide the OS status bar whenever the drawer is pulled or when it's in an "open" state.

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

#### `sceneContainerStyle`

Style object for the component wrapping the screen content.

#### `drawerStyle`

Style object for the drawer component. You can pass a custom background color for a drawer or a custom width here.

```js
<Drawer.Navigator
  drawerStyle={{
    backgroundColor: '#c6cbef',
    width: 240,
  }}
>
  {/* screens */}
</Drawer.Navigator>
```

#### `contentComponent`

Component used to render the content of the drawer, for example, navigation items.

The content component receives following props by default:

- `state` - The navigation state of the navigator, `state.routes` contains list of all routes
- `navigation` - The navigation object for the navigator.
- `descriptors` - An descriptor object containing options for the drawer screens. The options can be accessed at `descriptors[route.key].options`.
- `progress` - Reanimated Node that represents the animated position of the drawer (0 is closed; 1 is open).

##### Providing a custom `contentComponent`

The default component for the drawer is scrollable and only contains links for the routes in the RouteConfig. You can easily override the default component to add a header, footer, or other content to the drawer. The default content component is exported as `DrawerContent`. It renders a `DrawerItemList` component inside a `ScrollView`.

By default the drawer is scrollable and supports devices with notches. If you customize the content, be sure to apply safe area insets:

```js
import { useSafeArea } from 'react-native-safe-area-context';
import { DrawerItemList } from '@react-navigation/drawer';

function CustomDrawerContent({ drawerPosition, ...rest }) {
  const insets = useSafeArea();

  return (
    <ScrollView
      contentContainerStyle={[
        {
          paddingTop: insets.top + 4,
          paddingLeft: drawerPosition === 'left' ? insets.left : 0,
          paddingRight: drawerPosition === 'right' ? insets.right : 0,
        },
      ]}
      style={styles.container}
    >
      <DrawerItemList {...rest} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

To add additional items in the drawer, you can use the `DrawerItem` component:

```js
function CustomDrawerContent({ drawerPosition, ...rest }) {
  const insets = useSafeArea();

  return (
    <ScrollView
      contentContainerStyle={[
        {
          paddingTop: insets.top + 4,
          paddingLeft: drawerPosition === 'left' ? insets.left : 0,
          paddingRight: drawerPosition === 'right' ? insets.right : 0,
        },
      ]}
      style={styles.container}
    >
      <DrawerItemList {...rest} />
      <DrawerItem
        label="Help"
        onPress={() => Linking.openUrl('https://mywebsite.com/help')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

The `DrawerItem` component accepts the following props:

- `label` (required): The label text of the item. Can be string, or a function returning a react element. e.g. `({ focused, color }) => <Text style={{ color }}>{focused ? 'Focused text' : 'Unfocused text'}</Text>`.
- `icon`: Icon to display for the item. Accepts a function returning a react element. e.g. `({ focused, color, size }) => <Icon color={color} size={size} name={focused ? 'heart' : 'heart-outline'} />`.
- `focused`: Boolean indicating whether to highlight the drawer item as active.
- `onPress` (required): Function to execute on press.
- `activeTintColor`: Color for the icon and label when the item is active.
- `inactiveTintColor`: Color for the icon and label when the item is inactive.
- `activeBackgroundColor`: Background color for item when it's active.
- `inactiveBackgroundColor`: Background color for item when it's inactive.
- `labelStyle`: Style object for the label `Text`.
- `style`: Style object for the wrapper `View`.

The `progress` node can be used to do interesting animations in your `contentComponent`, such as parallax motion of the drawer contents:

```js
function CustomDrawerContent({ progress, ...rest }) {
  const translateX = props.drawerOpenProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      {/* ... drawer contents */}
    </Animated.View>
  );
}
```

To use the custom component, we need to pass it in the `contentComponent` prop:

```js
<Drawer.Navigator contentComponent={CustomDrawerContent}>
  {/* screens */}
</Drawer.Navigator>
```

#### `contentOptions`

An object containing the props for the drawer content component. See below for more details.

##### `activeTintColor`

Color for the icon and label in the active item in the drawer.

##### `activeBackgroundColor`

Background color for the active item in the drawer.

##### `inactiveTintColor`

Color for the icon and label in the inactive items in the drawer.

##### `inactiveBackgroundColor`

Background color for the inactive items in the drawer.

##### `itemStyle`

Style object for the single item, which can contain an icon and/or a label.

##### `labelStyle`

Style object to apply to the `Text` style inside content section which renders a label.

##### `contentContainerStyle`

Style object for the content section inside the `ScrollView`.

##### `style`

Style object for the wrapper view.

Example:

```js
<Drawer.Navigator
  contentOptions={{
    activeTintColor: '#e91e63',
    itemStyle: { marginVertical: 0 },
  }}
>
  {/* screens */}
</Drawer.Navigator>
```

### Options

The `options` prop can be used to configure individual screens inside the navigator. Supported options are:

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `drawerLabel`

#### `drawerLabel`

String or a function that given `{ focused: boolean, color: string }` returns a React.Node, to display in drawer sidebar. When undefined, scene `title` is used

#### `drawerIcon`

Function, that given `{ focused: boolean, color: string, size: number }` returns a React.Node, to display in drawer sidebar

#### `drawerLockMode`

Specifies the [lock mode](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html#drawerlockmode) of the drawer.

### Events

The navigator can emit events on certain actions. Supported events are:

#### `drawerOpen`

This event is fired when the drawer opens.

#### `drawerClose`

This event is fired when the drawer closes.

### Helpers

The drawer navigator adds the following methods to the navigation prop:

#### `openDrawer`

Opens the drawer pane.

```js
navigation.openDrawer();
```

#### `closeDrawer`

Closes the drawer pane.

```js
navigation.closeDrawer();
```

#### `toggleDrawer`

Opens the drawer pane if closed, closes the drawer pane if opened.

```js
navigation.toggleDrawer();
```

#### `jumpTo`

Navigates to an existing screen in the drawer navigator. The method accepts following arguments:

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

```js
navigation.jumpTo('Profile', { name: 'Satya' });
```

## Example

```js
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <Drawer.Navigator initialRouteName="Feed">
      <Drawer.Screen
        name="Feed"
        component={Feed}
        options={{ drawerLabel: 'Home' }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{ drawerLabel: 'Updates' }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ drawerLabel: 'Profile' }}
      />
    </Drawer.Navigator>
  );
}
```

## Nesting drawer navigators inside others

If a drawer navigator is nested inside of another navigator that provides some UI, for example a tab navigator or stack navigator, then the drawer will be rendered below the UI from those navigators. The drawer will appear below the tab bar and below the header of the stack. You will need to make the drawer navigator the parent of any navigator where the drawer should be rendered on top of its UI.
