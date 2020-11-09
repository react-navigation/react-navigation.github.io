---
id: drawer-navigator
title: createDrawerNavigator
sidebar_label: createDrawerNavigator
---

Component that renders a navigation drawer which can be opened and closed via gestures.

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/navigators/drawer/drawer.mov" />
  </video>
</div>

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/drawer`](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer):

```bash npm2yarn
npm install @react-navigation/drawer
```

## API Definition

To use this drawer navigator, import it from `@react-navigation/drawer`:

<samp id="simple-drawer" />

```js
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  );
}
```

> For a complete usage guide please visit [Drawer Navigation](drawer-based-navigation.md).

### Props

The `Drawer.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

#### `backBehavior`

How the going back behaves in the navigator, e.g. when `goBack` is called or device back button is pressed.

- `initialRoute` to return to initial tab
- `order` to return to previous tab (in the order they are shown in the tab bar)
- `history` to return to last visited tab
- `none` to not handle back button

#### `openByDefault`

Whether the drawer should stay open by default. When this is `true`, the drawer will be open from the initial render. It can be closed normally using gestures or programmatically. However, when going back, drawer will re-open if it was closed. This essentially reverses the behavior of the drawer where the closed state is the default state.

#### `drawerPosition`

Options are `left` or `right`. Default is `left` position.

#### `drawerType`

Type of the drawer. It determines how the drawer looks and animates.

- `front`: Traditional drawer which covers the screen with a overlay behind it.
- `back`: The drawer is revealed behind the screen on swipe.
- `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.
- `permanent`: A permanent drawer is shown as a sidebar. Useful for having always visible drawer on larger screens.

You can conditionally specify the `drawerType` to show a permanent drawer on bigger screens and a traditional drawer drawer on small screens:

```js
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerType={dimensions.width >= 768 ? 'permanent' : 'front'}
    >
      {/* Screens */}
    </Drawer.Navigator>
  );
}
```

You can also specify other props such as `drawerStyle` based on screen size to customize the behavior. For example, you can combine it with `openByDefault` to achieve a master-detail layout:

```js
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

  return (
    <Drawer.Navigator
      openByDefault
      drawerType={isLargeScreen ? 'permanent' : 'back'}
      drawerStyle={isLargeScreen ? null : { width: '100%' }}
      overlayColor="transparent"
    >
      {/* Screens */}
    </Drawer.Navigator>
  );
}
```

#### `edgeWidth`

Allows for defining how far from the edge of the content view the swipe gesture should activate.

This is not supported on Web.

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

#### `lazy`

Whether the screens should render the first time they are accessed. Defaults to `true`. Set it to `false` if you want to render all screens on initial render.

#### `sceneContainerStyle`

Style object for the component wrapping the screen content.

#### `drawerStyle`

Style object for the drawer component. You can pass a custom background color for a drawer or a custom width here.

<samp id="drawer-with-style" />

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

#### `drawerContent`

Function that returns React element to render as the content of the drawer, for example, navigation items

The content component receives following props by default:

- `state` - The [navigation state](navigation-state.md) of the navigator.
- `navigation` - The navigation object for the navigator.
- `descriptors` - An descriptor object containing options for the drawer screens. The options can be accessed at `descriptors[route.key].options`.
- `progress` - Reanimated Node that represents the animated position of the drawer (0 is closed; 1 is open).

#### `gestureHandlerProps`

Props to pass to the underlying pan gesture handler.

This is not supported on Web.

#### `detachInactiveScreens`

Boolean used to indicate whether inactive screens should be detached from the view hierarchy to save memory. Make sure to call `enableScreens` from [react-native-screens](https://github.com/software-mansion/react-native-screens) to make it work. Defaults to `true`.

##### Providing a custom `drawerContent`

The default component for the drawer is scrollable and only contains links for the routes in the RouteConfig. You can easily override the default component to add a header, footer, or other content to the drawer. The default content component is exported as `DrawerContent`. It renders a `DrawerItemList` component inside a `ScrollView`.

By default the drawer is scrollable and supports devices with notches. If you customize the content, you can use `DrawerContentScrollView` to handle this automatically:

```js
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
```

To add additional items in the drawer, you can use the `DrawerItem` component:

<samp id="custom-drawer-content" />

```js
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Help"
        onPress={() => Linking.openURL('https://mywebsite.com/help')}
      />
    </DrawerContentScrollView>
  );
}
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

The `progress` node can be used to do interesting animations in your `drawerContent`, such as parallax motion of the drawer contents:

<samp id="animated-drawer-content" />

```js
function CustomDrawerContent({ progress, ...rest }) {
  const translateX = Animated.interpolate(progress, {
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

Note that you **cannot** use the `useNavigation` hook inside the `drawerContent` since `useNavigation` is only available inside screens. You get a `navigation` prop for your `drawerContent` which you can use instead:

```js
function CustomDrawerContent({ navigation }) {
  return (
    <Button
      title="Go somewhere"
      onPress={() => {
        // Navigate using the `navigation` prop that you received
        navigation.navigate('SomeScreen');
      }}
    />
  );
}
```

To use the custom component, we need to pass it in the `drawerContent` prop:

```js
<Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
  {/* screens */}
</Drawer.Navigator>
```

#### `drawerContentOptions`

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

<samp id="drawer-content-options" />

```js
<Drawer.Navigator
  drawerContentOptions={{
    activeTintColor: '#e91e63',
    itemStyle: { marginVertical: 30 },
  }}
>
  {/* screens */}
</Drawer.Navigator>
```

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator:

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `drawerLabel`

#### `drawerLabel`

String or a function that given `{ focused: boolean, color: string }` returns a React.Node, to display in drawer sidebar. When undefined, scene `title` is used

#### `drawerIcon`

Function, that given `{ focused: boolean, color: string, size: number }` returns a React.Node, to display in drawer sidebar

#### `swipeEnabled`

Whether you can use swipe gestures to open or close the drawer. Defaults to `true`.

Swipe gesture is not supported on Web.

#### `gestureEnabled`

Whether you can use gestures to open or close the drawer. Setting this to `false` disables swipe gestures as well as tap on overlay to close. See `swipeEnabled` to disable only the swipe gesture.

#### `header`

Function that returns a React Element to display as a header. It accepts an object containing the following properties as the argument:

- `layout` - Dimensions of the screen
- `scene` - This contains 2 properties:
  - `route` - The route object for the header
  - `descriptor` - The descriptor containing the `navigation` prop and `options` for the screen

Example:

```js
header: ({ scene }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <MyHeader
      title={title}
      leftButton={
        <DrawerToggleButton
          onPress={scene.descriptor.navigation.toggleDrawer}
        />
      }
      style={options.headerStyle}
    />
  );
};
```

To set a custom header for all the screens in the navigator, you can specify this option in the `screenOptions` prop of the navigator.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default. Setting this to `false` hides the header.

#### `headerTitle`

String or a function that returns a React Element to be used by the header. Defaults to scene `title`. When a function is specified, it receives an object containing `allowFontScaling`, `style` and `children` properties. The `children` property contains the title string.

#### `headerTitleAlign`

How to align the header title. Possible values:

- `left`
- `center`

Defaults to `center` on iOS and `left` on Android.

#### `headerTitleAllowFontScaling`

Whether header title font should scale to respect Text Size accessibility settings. Defaults to false.

#### `headerTitleStyle`

Style object for the header title component.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. By default, a button to toggle the drawer is shown.

#### `headerLeftAccessibilityLabel`

Accessibility label for the header left button.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerPressColorAndroid`

Color for material ripple (Android >= 5.0 only).

#### `headerTintColor`

Tint color for the header.

#### `headerStyle`

Style object for the header. You can specify a custom background color here, for example.

#### `headerStatusBarHeight`

Extra padding to add at the top of header to account for translucent status bar. By default, it uses the top value from the safe area insets of the device. Pass 0 or a custom value to disable the default behavior, and customize the height.

#### `unmountOnBlur`

Whether this screen should be unmounted when navigating away from it. Unmounting a screen resets any local state in the screen as well as state of nested navigators in the screen. Defaults to `false`.

Normally, we don't recommend enabling this prop as users don't expect their navigation history to be lost when switching screens. If you enable this prop, please consider if this will actually provide a better experience for the user.

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `drawerOpen`

This event is fired when the drawer opens.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('drawerOpen', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

#### `drawerClose`

This event is fired when the drawer closes.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('drawerClose', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

### Helpers

The drawer navigator adds the following methods to the navigation prop:

#### `openDrawer`

Opens the drawer pane.

<samp id="drawer-open-close-toggle" />

```js
navigation.openDrawer();
```

#### `closeDrawer`

Closes the drawer pane.

<samp id="drawer-open-close-toggle" />

```js
navigation.closeDrawer();
```

#### `toggleDrawer`

Opens the drawer pane if closed, closes the drawer pane if opened.

<samp id="drawer-open-close-toggle" />

```js
navigation.toggleDrawer();
```

#### `jumpTo`

Navigates to an existing screen in the drawer navigator. The method accepts following arguments:

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

<samp id="drawer-example" />

```js
navigation.jumpTo('Profile', { owner: 'Satya' });
```

## Example

<samp id="drawer-example" />

```js
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
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

## Checking if the drawer is open

You can check if the drawer is open by using the `useIsDrawerOpen` hook.

```js
import { useIsDrawerOpen } from '@react-navigation/drawer';

// ...

const isDrawerOpen = useIsDrawerOpen();
```

## Nesting drawer navigators inside others

If a drawer navigator is nested inside of another navigator that provides some UI, for example a tab navigator or stack navigator, then the drawer will be rendered below the UI from those navigators. The drawer will appear below the tab bar and below the header of the stack. You will need to make the drawer navigator the parent of any navigator where the drawer should be rendered on top of its UI.
