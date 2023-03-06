---
id: drawer-navigator
title: DrawerNavigator reference
sidebar_label: DrawerNavigator
---

```js
DrawerNavigator(RouteConfigs, DrawerNavigatorConfig)
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](stack-navigator.md#routeconfigs) from `StackNavigator`.

### DrawerNavigatorConfig

- `drawerWidth` - Width of the drawer or a function returning it.
- `drawerPosition` - Options are `left` or `right`. Default is `left` position.
- `contentComponent` - Component used to render the content of the drawer, for example, navigation items. Receives the `navigation` prop for the drawer. Defaults to `DrawerItems`. For more information, see below.
- `contentOptions` - Configure the drawer content, see below.
- `useNativeAnimations` - Enable native animations. Default is `true`.
- `drawerBackgroundColor` - Use the Drawer background for some color. The Default is `white`.

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial route.
- `order` - Array of routeNames which defines the order of the drawer items.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause switch to the initial route? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### Providing a custom `contentComponent`

The default component for the drawer is scrollable and only contains links for the routes in the RouteConfig. You can easily override the default component to add a header, footer, or other content to the drawer. By default the drawer is scrollable and supports iPhone X safe area. If you customize the content, be sure to wrap the content in a SafeAreaView:

```js
import { DrawerItems, SafeAreaView } from 'react-navigation';

const CustomDrawerContentComponent = (props) => (
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
- `iconContainerStyle` - style object to overwrite `View` icon container styles.

#### Example

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

Specifies the [lock mode](https://reactnative.dev/docs/drawerlayoutandroid.html#drawerlockmode) of the drawer. This can also update dynamically by using screenProps.drawerLockMode on your top level router.

### Navigator Props

The navigator component created by `DrawerNavigator(...)` takes the following props:

- `screenProps` - Pass down extra options to child screens, for example:

 ```jsx
 const DrawerNav = DrawerNavigator({
   // config
 });

 <DrawerNav
   screenProps={/* this prop will get passed to the screen components and nav options as props.screenProps */}
 />
 ```

### Nesting `DrawerNavigation`

Please bear in mind that if you nest the DrawerNavigation, the drawer will show below the parent navigation.
