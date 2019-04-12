---
id: drawer-navigator
title: createDrawerNavigator
sidebar_label: createDrawerNavigator
---

```js
createDrawerNavigator(RouteConfigs, DrawerNavigatorConfig);
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](stack-navigator.html#routeconfigs) from `createStackNavigator`.

### DrawerNavigatorConfig

- `drawerWidth` - Width of the drawer or a function returning it.
- `drawerPosition` - Options are `left` or `right`. Default is `left` position.
- `contentComponent` - Component used to render the content of the drawer, for example, navigation items. Receives the `navigation` prop and `drawerOpenProgress` for the drawer. Defaults to `DrawerItems`. For more information, see below.
- `contentOptions` - Configure the drawer content, see below.
- `useNativeAnimations` - Enable native animations. Default is `true`.
- `drawerBackgroundColor` - Use the Drawer background for some color. The Default is `white`.
- `navigationOptions` - Navigation options for the navigator itself, to configure a parent navigator
- `defaultNavigationOptions` - Default navigation options to use for screens

The `DrawerNavigator` uses [`DrawerLayout`](https://kmagiera.github.io/react-native-gesture-handler/docs/component-drawer-layout.html) under the hood, therefore it inherits the following props:

- `drawerType` - One of `front` | `back` | `slide`
- `edgeWidth` - Allows for defining how far from the edge of the content view the swipe gesture should activate
- `hideStatusBar` - when set to true Drawer component will hide the OS status bar whenever the drawer is pulled or when its in an "open" state.
- `overlayColor` - Color overlay to be displayed on top of the content view when drawer gets open. A solid color should be used as the opacity is added by the Drawer itself and the opacity of the overlay is animated (from 0% to 70%).

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial route.
- `order` - Array of routeNames which defines the order of the drawer items.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause switch to the initial route? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### Providing a custom `contentComponent`

The default component for the drawer is scrollable and only contains links for the routes in the RouteConfig. You can easily override the default component to add a header, footer, or other content to the drawer. By default the drawer is scrollable and supports iPhone X safe area. If you customize the content, be sure to wrap the content in a SafeAreaView:

```js
import { DrawerItems, SafeAreaView } from 'react-navigation';

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
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

`contentComponent` also received a prop called `drawerOpenProgress` which is an [animated value](https://facebook.github.io/react-native/docs/animated#value) that represents the animated position of the drawer (0 is closed; 1 is open). This allows you to do interesting animations in your `contentComponent`, such as parallax motion of the drawer contents:

```js
const CustomDrawerContentComponent = props => {
  const translateX = props.drawerOpenProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return <Animated.View style={{ transform: [{ translateX }] }}>{/* ... drawer contents */}</Animated.View>;
};
```

### `contentOptions` for `DrawerItems`

- `items` - the array of routes, can be modified or overridden
- `activeItemKey` - key identifying the active route
- `activeTintColor` - label and icon color of the active label
- `activeBackgroundColor` - background color of the active label
- `inactiveTintColor` - label and icon color of the inactive label
- `inactiveBackgroundColor` - background color of the inactive label
- `onItemPress(route)` - function to be invoked when an item is pressed
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

Specifies the [lock mode](https://facebook.github.io/react-native/docs/drawerlayoutandroid.html#drawerlockmode) of the drawer. This can also update dynamically by using screenProps.drawerLockMode on your top level router.

### Nesting drawer navigators inside others

If a drawer navigator is nested inside of another navigator that provides some UI, for example a tab navigator or stack navigator, then the drawer will be rendered below the UI from those navigators. The drawer will appear below the tab bar and below the header of the stack. You will need to make the drawer navigator the parent of any navigator where the drawer should be rendered on top of its UI.
