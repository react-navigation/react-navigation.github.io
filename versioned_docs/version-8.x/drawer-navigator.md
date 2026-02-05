---
id: drawer-navigator
title: Drawer Navigator
sidebar_label: Drawer
---

Drawer Navigator renders a navigation drawer on the side of the screen which can be opened and closed via gestures.

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/drawer.mp4" />
</video>

This wraps [`react-native-drawer-layout`](drawer-layout.md). If you want to use the drawer without React Navigation integration, use the library directly instead.

## Installation

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/drawer`](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer):

```bash npm2yarn
npm install @react-navigation/drawer@next
```

The navigator depends on [`react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/) for gestures and [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) for animations.

<Tabs groupId='framework' queryString="framework">
<TabItem value='expo' label='Expo' default>

If you have a Expo managed project, in your project directory, run:

```bash
npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets
```

</TabItem>
<TabItem value='community-cli' label='Community CLI'>

If you have a bare React Native project, in your project directory, run:

```bash npm2yarn
npm install react-native-gesture-handler react-native-reanimated react-native-worklets
```

After installation, configure the Reanimated Babel Plugin in your project following the [installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).

</TabItem>
</Tabs>

If you're on a Mac and developing for iOS, you also need to install [pods](https://cocoapods.org/) to complete the linking.

```bash
npx pod-install ios
```

## Usage

To use this navigator, import it from `@react-navigation/drawer`:

```js name="Drawer Navigator" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { createDrawerNavigator } from '@react-navigation/drawer';

// codeblock-focus-end
function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation('Profile');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

// codeblock-focus-start
const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
```

## API Definition

### Props

In addition to the [common props](navigator.md#configuration) shared by all navigators, the drawer navigator component accepts the following additional props:

#### `backBehavior`

This controls what happens when `goBack` is called in the navigator. This includes pressing the device's back button or back gesture on Android.

It supports the following values:

- `firstRoute` - return to the first screen defined in the navigator (default)
- `initialRoute` - return to initial screen passed in `initialRouteName` prop, if not passed, defaults to the first screen
- `order` - return to screen defined before the focused screen
- `history` - return to last visited screen in the navigator; if the same screen is visited multiple times, the older entries are dropped from the history
- `fullHistory` - return to last visited screen in the navigator; doesn't drop duplicate entries unlike `history` - this behavior is useful to match how web pages work
- `none` - do not handle back button

#### `defaultStatus`

The default status of the drawer - whether the drawer should stay `open` or `closed` by default.

When this is set to `open`, the drawer will be open from the initial render. It can be closed normally using gestures or programmatically. However, when going back, the drawer will re-open if it was closed. This is essentially the opposite of the default behavior of the drawer where it starts `closed`, and the back button closes an open drawer.

#### `detachInactiveScreens`

Boolean used to indicate whether inactive screens should be detached from the view hierarchy to save memory. This enables integration with [react-native-screens](https://github.com/software-mansion/react-native-screens). Defaults to `true`.

#### `drawerContent`

Function that returns React element to render as the content of the drawer, for example, navigation items

The content component receives the following props by default:

- `state` - The [navigation state](navigation-state.md) of the navigator.
- `navigation` - The navigation object for the navigator.
- `descriptors` - An descriptor object containing options for the drawer screens. The options can be accessed at `descriptors[route.key].options`.

##### Providing a custom `drawerContent`

The default component for the drawer is scrollable and only contains links for the routes in the RouteConfig. You can easily override the default component to add a header, footer, or other content to the drawer. The default content component is exported as `DrawerContent`. It renders a `DrawerItemList` component inside a `ScrollView`.

By default, the drawer is scrollable and supports devices with notches. If you customize the content, you can use `DrawerContentScrollView` to handle this automatically:

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

```js name="Custom Drawer Content" snack static2dynamic
import * as React from 'react';
import { Text, View, Linking } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

// codeblock-focus-start
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
// codeblock-focus-end

const MyDrawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
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

Note that you **cannot** use the `useNavigation` hook inside the `drawerContent` since `useNavigation` is only available inside screens. You get a `navigation` prop for your `drawerContent` which you can use instead:

```js
function CustomDrawerContent({ navigation }) {
  return (
    <Button
      onPress={() => {
        // Navigate using the `navigation` prop that you received
        navigation.navigate('SomeScreen');
      }}
    >
      Go somewhere
    </Button>
  );
}
```

To use the custom component, we need to pass it in the `drawerContent` prop:

```js
<Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
  {/* screens */}
</Drawer.Navigator>
```

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator. These can be specified under `screenOptions` prop of `Drawer.Navigator` or `options` prop of `Drawer.Screen`.

#### `title`

A generic title that can be used as a fallback for `headerTitle` and `drawerLabel`.

#### `lazy`

Whether this screen should render the first time it's accessed. Defaults to `true`. Set it to `false` if you want to render the screen on initial render.

#### `drawerLabel`

String or a function that given `{ focused: boolean, color: string }` returns a React.Node, to display in drawer sidebar. When undefined, scene `title` is used.

#### `drawerIcon`

Function, that given `{ focused: boolean, color: string, size: number }` returns a React.Node to display in drawer sidebar.

#### `drawerActiveTintColor`

Color for the icon and label in the active item in the drawer.

<img src="/assets/7.x/drawer/drawerActiveTintColor.png" width="500" alt="Drawer active tint color" />

```js
   drawerActiveTintColor: 'green',
```

#### `drawerActiveBackgroundColor`

Background color for the active item in the drawer.

<img src="/assets/7.x/drawer/drawerActiveBackgroundColor.png" width="500" alt="Drawer active background color" />

```js
    screenOptions={{
      drawerActiveTintColor: 'white',
      drawerActiveBackgroundColor: '#003CB3',
      drawerLabelStyle: {
        color: 'white',
      },
    }}
```

#### `drawerInactiveTintColor`

Color for the icon and label in the inactive items in the drawer.

#### `drawerInactiveBackgroundColor`

Background color for the inactive items in the drawer.

#### `drawerItemStyle`

Style object for the single item, which can contain an icon and/or a label.

<img src="/assets/7.x/drawer/drawerItemStyle.png" width="500" alt="Drawer item style" />

Example:

```js
   drawerItemStyle: {
    backgroundColor: '#9dd3c8',
    borderColor: 'black',
    borderWidth: 2,
    opacity: 0.6,
  },
```

#### `drawerLabelStyle`

Style object to apply to the `Text` style inside content section which renders a label.

<img src="/assets/7.x/drawer/drawerLabelStyle.png" width="500" alt="Drawer label style" />

Example:

```js
   drawerLabelStyle: {
      color: 'black',
      fontSize: 20,
      fontFamily: 'Georgia',
    },
```

#### `drawerContentContainerStyle`

Style object for the content section inside the `ScrollView`.

#### `drawerContentStyle`

Style object for the wrapper view.

#### `drawerStyle`

Style object for the drawer component. You can pass a custom background color for a drawer or a custom width here.

<img src="/assets/7.x/drawer/drawerStyle.png" width="500" alt="Drawer style" />

```js
<Drawer.Navigator
  screenOptions={{
    drawerStyle: {
      backgroundColor: '#c6cbef',
      width: 240,
    },
  }}
>
  {/* screens */}
</Drawer.Navigator>
```

#### `drawerPosition`

Options are `left` or `right`. Defaults to `left` for LTR languages and `right` for RTL languages.

#### `drawerType`

Type of the drawer. It determines how the drawer looks and animates.

- `front`: Traditional drawer which covers the screen with an overlay behind it.
  <video playsInline autoPlay muted loop>
   <source src="/assets/7.x/drawer/drawerType-front.mp4" />
  </video>

- `back`: The drawer is revealed behind the screen on swipe.
  <video playsInline autoPlay muted loop>
   <source src="/assets/7.x/drawer/drawerType-back.mp4" />
  </video>

- `slide`: Both the screen and the drawer slide on swipe to reveal the drawer.
  <video playsInline autoPlay muted loop>
   <source src="/assets/7.x/drawer/drawerType-slide.mp4" />
  </video>

- `permanent`: A permanent drawer is shown as a sidebar. Useful for having always visible drawer on larger screens.

Defaults to `slide` on iOS and `front` on other platforms.

You can conditionally specify the `drawerType` to show a permanent drawer on bigger screens and a traditional drawer drawer on small screens:

```js
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
      }}
    >
      {/* Screens */}
    </Drawer.Navigator>
  );
}
```

You can also specify other props such as `drawerStyle` based on screen size to customize the behavior. For example, you can combine it with `defaultStatus="open"` to achieve a master-detail layout:

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/drawer/drawerType-masterDetail.mp4" />
</video>

```js
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

  return (
    <Drawer.Navigator
      defaultStatus="open"
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'back',
        drawerStyle: isLargeScreen ? null : { width: '100%' },
        overlayStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* Screens */}
    </Drawer.Navigator>
  );
}
```

#### `drawerHideStatusBarOnOpen`

When set to `true`, Drawer will hide the OS status bar whenever the drawer is pulled or when it's in an "open" state.

#### `drawerStatusBarAnimation`

Animation of the statusbar when hiding it. use in combination with `drawerHideStatusBarOnOpen`.

This is only supported on iOS. Defaults to `slide`.

Supported values:

- `slide`
  <video playsInline autoPlay muted loop>
    <source src="/assets/7.x/drawer/drawerStatusBarAnimation-slide.mp4" />
  </video>

- `fade`
  <video playsInline autoPlay muted loop>
    <source src="/assets/7.x/drawer/drawerStatusBarAnimation-fade.mp4" />
  </video>

- `none`

#### `overlayStyle`

Style for the overlay on top of the content view when drawer gets open. You can use this to customize the overlay color, opacity, and other properties:

```js
overlayStyle: {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}
```

  <video playsInline autoPlay muted loop>
    <source src="/assets/7.x/drawer/overlayColor.mp4" />
  </video>

#### `sceneStyle`

Style object for the component wrapping the screen content.

#### `configureGestureHandler`

Callback to configure the underlying [gesture from `react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture). It receives the `gesture` object as an argument:

```js
configureGestureHandler: ({ gesture }) => {
  return gesture.enableTrackpadTwoFingerGesture(false);
},
```

This is not supported on Web.

#### `swipeEnabled`

Whether you can use swipe gestures to open or close the drawer. Defaults to `true`.

Swipe gesture is not supported on Web.

#### `swipeEdgeWidth`

Allows for defining how far from the edge of the content view the swipe gesture should activate.

This is not supported on Web.

#### `swipeMinDistance`

Minimum swipe distance threshold that should activate opening the drawer.

#### `keyboardDismissMode`

Whether the keyboard should be dismissed when the swipe gesture begins. Defaults to `'on-drag'`. Set to `'none'` to disable keyboard handling.

#### `freezeOnBlur`

Boolean indicating whether to prevent inactive screens from re-rendering. Defaults to `false`.
Defaults to `true` when `enableFreeze()` from `react-native-screens` package is run at the top of the application.

Only supported on iOS and Android.

#### `popToTopOnBlur`

Boolean indicating whether any nested stack should be popped to the top of the stack when navigating away from this drawer screen. Defaults to `false`.

It only works when there is a stack navigator (e.g. [stack navigator](stack-navigator.md) or [native stack navigator](native-stack-navigator.md)) nested under the drawer navigator.

### Header related options

You can find the list of header related options [here](elements.md#header). These [options](screen-options.md) can be specified under `screenOptions` prop of `Drawer.Navigator` or `options` prop of `Drawer.Screen`. You don't have to be using `@react-navigation/elements` directly to use these options, they are just documented in that page.

In addition to those, the following options are also supported in drawer:

#### `header`

Custom header to use instead of the default header.

This accepts a function that returns a React Element to display as a header. The function receives an object containing the following properties as the argument:

- `navigation` - The navigation object for the current screen.
- `route` - The route object for the current screen.
- `options` - The options for the current screen

Example:

```js
import { getHeaderTitle } from '@react-navigation/elements';

// ..

header: ({ navigation, route, options }) => {
  const title = getHeaderTitle(options, route.name);

  return <MyHeader title={title} style={options.headerStyle} />;
};
```

To set a custom header for all the screens in the navigator, you can specify this option in the `screenOptions` prop of the navigator.

##### Specify a `height` in `headerStyle`

If your custom header's height differs from the default header height, then you might notice glitches due to measurement being async. Explicitly specifying the height will avoid such glitches.

Example:

```js
headerStyle: {
  height: 80, // Specify the height of your custom header
};
```

Note that this style is not applied to the header by default since you control the styling of your custom header. If you also want to apply this style to your header, use `options.headerStyle` from the props.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default. Setting this to `false` hides the header.

#### `headerLeft`

Custom element to display on the left side of the header. By default, renders a menu icon with the `DrawerToggleButton` component:

```js
import { DrawerToggleButton } from '@react-navigation/drawer';

// ...

headerLeft: (props) => <DrawerToggleButton {...props} />;
```

To customize the icon, you can use the `icon` prop of `DrawerToggleButton` component. It can be a function that returns a React Element or an icon object:

```js
import { DrawerToggleButton } from '@react-navigation/drawer';

// ...

headerLeft: (props) => (
  <DrawerToggleButton
    {...props}
    icon={({ color, size }) => (
      <MyCustomIcon name="menu" color={color} size={size} />
    )}
  />
);
```

See [Icons](icons.md) documentation on how to use [SF Symbols](icons.md#sf-symbols) and [Material Symbols](icons.md#material-symbols).

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `drawerItemPress`

This event is fired when the user presses the button for the screen in the drawer. By default a drawer item press does several things:

- If the screen is not focused, drawer item press will focus that screen
- If the screen is already focused, then it'll close the drawer

To prevent the default behavior, you can call `event.preventDefault`:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('drawerItemPress', (e) => {
    // Prevent default behavior
    e.preventDefault();

    // Do something manually
    // ...
  });

  return unsubscribe;
}, [navigation]);
```

If you have custom drawer content, make sure to emit this event.

### Helpers

The drawer navigator adds the following methods to the navigation object:

#### `openDrawer`

Opens the drawer pane.

```js name="Drawer Helper Methods" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createDrawerNavigator } from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <Text>Home Screen</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.openDrawer()
          // codeblock-focus-end
        }
      >
        Open Drawer
      </Button>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
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

Navigates to an existing screen in the drawer navigator. The method accepts the following arguments:

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to pass to the destination route.

```js name="Drawer Navigator - jumpTo" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createDrawerNavigator } from '@react-navigation/drawer';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.jumpTo('Profile', { owner: 'Satya' })
          // codeblock-focus-end
        }
      >
        Jump to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      {route.params?.owner && (
        <Text style={{ marginTop: 10 }}>Owner: {route.params.owner}</Text>
      )}
    </View>
  );
}

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
```

### Hooks

The drawer navigator exports the following hooks:

#### `useDrawerProgress`

This hook returns the progress of the drawer. It is available in the screen components rendered by the drawer navigator as well as in the [custom drawer content](#drawercontent).

The `progress` object is a `SharedValue` that represents the animated position of the drawer (`0` is closed; `1` is open). It can be used to animate elements based on the animation of the drawer with [Reanimated](https://docs.swmansion.com/react-native-reanimated/):

```js name="Drawer animation progress" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import {
  createDrawerNavigator,
  useDrawerProgress,
} from '@react-navigation/drawer';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

function HomeScreen() {
  // highlight-next-line
  const progress = useDrawerProgress();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * -100 }],
  }));

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            height: 100,
            aspectRatio: 1,
            backgroundColor: 'tomato',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
// codeblock-focus-end

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
```

If you are using class components, you can use the `DrawerProgressContext` to get the progress value.

:::warning

The `useDrawerProgress` hook (or `DrawerProgressContext`) will return a mock value on Web since Reanimated is not used on Web. The mock value can only represent the open state of the drawer (`0` when closed, `1` when open), and not the progress of the drawer.

:::

#### `useDrawerStatus`

You can check if the drawer is open by using the `useDrawerStatus` hook.

```js
import { useDrawerStatus } from '@react-navigation/drawer';

// ...

const isDrawerOpen = useDrawerStatus() === 'open';
```

If you can't use the hook, you can also use the `getDrawerStatusFromState` helper:

```js
import { getDrawerStatusFromState } from '@react-navigation/drawer';

// ...

const isDrawerOpen = getDrawerStatusFromState(navigation.getState()) === 'open';
```

For class components, you can listen to the `state` event to check if the drawer was opened or closed:

```js
class Profile extends React.Component {
  componentDidMount() {
    this._unsubscribe = navigation.addListener('state', () => {
      const isDrawerOpen =
        getDrawerStatusFromState(navigation.getState()) === 'open';

      // do something
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    // Content of the component
  }
}
```

## Nesting drawer navigators inside others

If a drawer navigator is nested inside of another navigator that provides some UI, for example, a tab navigator or stack navigator, then the drawer will be rendered below the UI from those navigators. The drawer will appear below the tab bar and below the header of the stack. You will need to make the drawer navigator the parent of any navigator where the drawer should be rendered on top of its UI.
