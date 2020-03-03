---
id: drawer-navigator
title: createDrawerNavigator
sidebar_label: createDrawerNavigator
---

To use this navigator, ensure that you have [react-navigation and its dependencies installed](getting-started.md), then install [`react-navigation-drawer`](https://github.com/react-navigation/drawer).

```bash npm2yarn
npm install react-navigation-drawer
```

## API

```js
import { createDrawerNavigator } from 'react-navigation-drawer';

createDrawerNavigator(RouteConfigs, DrawerNavigatorConfig);
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](stack-navigator.html#routeconfigs) from `createStackNavigator`.

### DrawerNavigatorConfig

- `drawerBackgroundColor` - Use the Drawer background for some color. The Default is `white`.
- `drawerPosition` - Options are `left` or `right`. Default is `left` position.
- `drawerType` - Type of the drawer. It determines how the drawer looks and animates.

  - `front`: Traditional drawer which covers the screen with a overlay behind it.
  - `back`: The drawer is revealed behind the screen on swipe.
  - `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.

- `drawerWidth` - Number or a function which returns the width of the drawer. If a function is provided, it'll be called again when the screen's dimensions change.
- `edgeWidth` - Allows for defining how far from the edge of the content view the swipe gesture should activate
- `hideStatusBar` - when set to true Drawer component will hide the OS status bar whenever the drawer is pulled or when it's in an "open" state.
- `statusBarAnimation` - Animation of the statusbar when hiding it. use in combination with `hideStatusBar`.
- `keyboardDismissMode` - Whether the keyboard should be dismissed when the swipe gesture begins. Defaults to `'on-drag'`. Set to `'none'` to disable keyboard handling.
- `minSwipeDistance` - Minimum swipe distance threshold that should activate opening the drawer.
- `overlayColor` - Color overlay to be displayed on top of the content view when drawer gets open. The opacity is animated from `0` to `1` when the drawer opens.
- `gestureHandlerProps` - Props to pass to the underlying pan gesture handler.
- `lazy` - Whether the screens should render the first time they are accessed. Defaults to `true`. Set it to `false` if you want to render all screens on initial render.
- `unmountInactiveRoutes` - Whether a screen should be unmounted when navigating away from it. Defaults to `false`.
- `contentComponent` - Component used to render the content of the drawer, for example, navigation items. Receives the `navigation` prop and `drawerOpenProgress` for the drawer. Defaults to `DrawerItems`. For more information, see below.
- `contentOptions` - Configure the drawer content, see below.
- `navigationOptions` - Navigation options for the navigator itself, to configure a parent navigator
- `defaultNavigationOptions` - Default navigation options to use for screens

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial route.
- `order` - Array of routeNames which defines the order of the drawer items.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause switch to the initial route? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### Providing a custom `contentComponent`

The default component for the drawer is scrollable and only contains links for the routes in the RouteConfig. You can easily override the default component to add a header, footer, or other content to the drawer. By default the drawer is scrollable and supports iPhone X safe area. If you customize the content, be sure to wrap the content in a SafeAreaView:

```js
import SafeAreaView from 'react-native-safe-area-view';
import { DrawerItems } from 'react-navigation-drawer';

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
  const translateX = Animated.interpolate(drawerOpenProgress, {
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

#### Example:

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

### Screen Navigation Options

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `drawerLabel`

#### `drawerLabel`

String, React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in drawer sidebar. When undefined, scene `title` is used

#### `drawerIcon`

React Element or a function, that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in drawer sidebar

#### `drawerLockMode`

Specifies the lock mode of the drawer. The drawer can be locked in 3 states:

- `unlocked` (default) - that the drawer will respond (open/close) to touch gestures.
- `locked-closed` - that the drawer will stay closed and not respond to gestures.
- `locked-open` - that the drawer will stay opened and not respond to gestures. The drawer may still be opened and closed programmatically with `navigation.openDrawer` and `navigation.closeDrawer`.

### Nesting drawer navigators inside others

If a drawer navigator is nested inside of another navigator that provides some UI, for example a tab navigator or stack navigator, then the drawer will be rendered below the UI from those navigators. The drawer will appear below the tab bar and below the header of the stack. You will need to make the drawer navigator the parent of any navigator where the drawer should be rendered on top of its UI.
