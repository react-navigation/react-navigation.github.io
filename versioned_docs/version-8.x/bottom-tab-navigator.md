---
id: bottom-tab-navigator
title: Bottom Tabs Navigator
sidebar_label: Bottom Tabs
---

Bottom Tab Navigator displays a set of screens with a tab bar to switch between them.

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/native-bottom-tabs-android.mp4" />
</video>

<video playsInline autoPlay muted loop>
  <source src="/assets/7.x/native-bottom-tabs-ios.mp4" />
</video>

## Installation

To use this navigator, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/bottom-tabs`](https://github.com/react-navigation/react-navigation/tree/main/packages/bottom-tabs):

```bash npm2yarn
npm install @react-navigation/bottom-tabs@next
```

## Usage

To use this navigator, import it from `@react-navigation/bottom-tabs`:

```js name="Bottom Tab Navigator" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

## Highlights

<div className="feature-grid">

- <video playsInline autoPlay muted loop><source src="/assets/7.x/native-bottom-tabs-ios-search.mp4" /></video>

  [Search tab on iOS 26+](#search-tab-on-ios-26)

- <video playsInline autoPlay muted loop><source src="/assets/7.x/native-bottom-tabs-ios-bottom-accessory.mp4" /></video>

  [Bottom accessory](#bottomaccessory)

- <video playsInline autoPlay muted loop><source src="/assets/7.x/native-bottom-tabs-ios-minimize.mp4" /></video>

  [Minimize on scroll](#tabbarminimizebehavior)

</div>

## Native vs Custom implementation

The navigator provides 2 implementations that can be specified using the [`implementation`](#implementation) prop, `native` and `custom`. Many customization options are exclusive to one of the implementations. Make sure to check the documentation of each option to see which implementation it supports.

A custom [`tabBar`](#tabbar) can be provided with either implementation. However, you'll need to handle most of the options in your custom tab bar.

### `native`

Uses native primitives for rendering content - `UITabBarController` on iOS and `BottomNavigationView` on Android. This allows matching the native design such as liquid glass effect on iOS 26, native tab switch animations etc.

This is the default implementation on Android and iOS, and does not support other platforms.

### `custom`

Uses a JavaScript-based implementation for rendering content.

This is the default implementation on other platforms such as web, macOS and Windows, and supports all platforms.

## Notes

- Liquid Glass effect on iOS 26+ requires your app to be built with Xcode 26 or above.
- On Android, at most 5 tabs are supported with the `native` implementation. This is a limitation of the underlying native component.

## API Definition

### Props

In addition to the [common props](navigator.md#configuration) shared by all navigators, the bottom tab navigator accepts the following additional props:

#### `implementation`

The implementation to use for rendering the tab bar. Possible values:

- `native` - Uses native primitives for rendering content
- `custom` - Uses a JavaScript-based implementation for rendering content

See [Native vs Custom implementation](#native-vs-custom-implementation) for more details.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
createBottomTabNavigator({
  implementation: 'custom',
  // ...
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Tab.Navigator implementation="custom">{/* ... */}</Tab.Navigator>
```

</TabItem>
</Tabs>

#### `backBehavior`

This controls what happens when `goBack` is called in the navigator. This includes pressing the device's back button or back gesture on Android.

It supports the following values:

- `firstRoute` - return to the first screen defined in the navigator (default)
- `initialRoute` - return to initial screen passed in `initialRouteName` prop, if not passed, defaults to the first screen
- `order` - return to screen defined before the focused screen
- `history` - return to last visited screen in the navigator; if the same screen is visited multiple times, the older entries are dropped from the history
- `fullHistory` - return to last visited screen in the navigator; doesn't drop duplicate entries unlike `history` - this behavior is useful to match how web pages work
- `none` - do not handle back button

#### `detachInactiveScreens`

Boolean used to indicate whether inactive screens should be detached from the view hierarchy to save memory. This enables integration with [react-native-screens](https://github.com/software-mansion/react-native-screens). Defaults to `true`.

Only supported with `custom` implementation.

#### `tabBar`

Function that returns a React element to display as the tab bar.

The function receives an object containing the following properties as the argument:

- `state` - The state object for the tab navigator.
- `descriptors` - The descriptors object containing options for the tab navigator.
- `navigation` - The navigation object for the tab navigator.

The `state.routes` array contains all the routes defined in the navigator. Each route's options can be accessed using `descriptors[route.key].options`.

Example:

```js name="Custom tab bar" snack static2dynamic
import * as React from 'react';
import {
  createStaticNavigation,
  NavigationContainer,
} from '@react-navigation/native';
// codeblock-focus-start
import { View, Platform } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

// codeblock-focus-end

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const MyTabs = createBottomTabNavigator({
  // highlight-next-line
  tabBar: (props) => <MyTabBar {...props} />,
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

This example will render a basic tab bar with labels.

Note that you **cannot** use the `useNavigation` hook inside the `tabBar` since `useNavigation` is only available inside screens. You get a `navigation` prop for your `tabBar` which you can use instead:

```js
function MyTabBar({ navigation }) {
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

### Options

The following [options](screen-options.md) can be used to configure the screens in the navigator. These can be specified under `screenOptions` prop of `Tab.Navigator` or `options` prop of `Tab.Screen`.

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar. When undefined, scene `title` is used. To hide, see [`tabBarLabelVisibilityMode`](#tabbarlabelvisibilitymode).

Overrides the label provided by [`tabBarSystemItem`](#tabbarsystemitem) on iOS.

#### `tabBarSystemItem`

Uses iOS built-in tab bar items with standard iOS styling and localized titles. Supported values:

- `bookmarks`
- `contacts`
- `downloads`
- `favorites`
- `featured`
- `history`
- `more`
- `mostRecent`
- `mostViewed`
- `recents`
- `search`
- `topRated`

Only supported on iOS with `native` implementation.

The [`tabBarIcon`](#tabbaricon) and [`tabBarLabel`](#tabbarlabel) options will override the icon and label from the system item. If you want to keep the system behavior on iOS, but need to provide icon and label for other platforms, use `Platform.OS` or `Platform.select` to conditionally set `undefined` for `tabBarIcon` and `tabBarLabel` on iOS.

##### Search tab on iOS 26+

The `tabBarSystemItem` option has special styling and behavior when set to `search` on iOS 26+.

Additionally, when the `search` tab is selected, the tab bar transforms into a search field if:

- The screen has a nested [native stack navigator](native-stack-navigator.md)
- The focused screen in the nested native stack has [`headerSearchBarOptions`](native-stack-navigator.md#headersearchbaroptions)

This won't work if `headerSearchBarOptions` is set on the tab screen itself.

Example:

```js name="Search Tab on iOS 26" snack static2dynamic
import * as React from 'react';
import { View, Text, FlatList } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const DATA = [
  'Apple',
  'Banana',
  'Cherry',
  'Durian',
  'Elderberry',
  'Fig',
  'Grape',
];

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home Screen</Text>
    </View>
  );
}

function FruitsListScreen() {
  const [searchText, setSearchText] = React.useState('');

  const filteredData = DATA.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const navigation = useNavigation('FruitsList');

  React.useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search fruits',
        onChange: (e) => {
          setSearchText(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <View
          style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}
        >
          <Text>{item}</Text>
        </View>
      )}
    />
  );
}

// codeblock-focus-start
const SearchStack = createNativeStackNavigator({
  screens: {
    FruitsList: {
      screen: FruitsListScreen,
      options: {
        title: 'Search',
        // highlight-start
        headerSearchBarOptions: {
          placeholder: 'Search fruits',
        },
        // highlight-end
      },
    },
  },
});

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarIcon: Platform.select({
          ios: {
            type: 'sfSymbol',
            name: 'house',
          },
          android: {
            type: 'materialSymbol',
            name: 'home',
          },
        }),
      },
    },
    Search: {
      // highlight-next-line
      screen: SearchStack,
      options: {
        // highlight-next-line
        tabBarSystemItem: 'search',
      },
    },
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(HomeTabs);

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop data-landscape style={{ maxWidth: '402px' }}>

  <source src="/assets/7.x/native-bottom-tabs-ios-search.mp4" />
</video>

#### `tabBarLabelVisibilityMode`

The label visibility mode for the tab bar items. Supported values:

- `auto` - decided based on platform and implementation (default)
- `labeled` - labels are always shown
- `unlabeled` - labels are never shown
- `selected` - labels shown only for selected tab (only supported on Android with `native` implementation)

Supported on all platforms with `custom` implementation. Only supported on Android with `native` implementation.

#### `tabBarLabelPosition`

Whether the label is shown below the icon or beside the icon.

By default, the position is chosen automatically based on device width.

Only supported with `custom` implementation.

- `below-icon`: the label is shown below the icon (typical for iPhones)
  <img src="/assets/7.x/bottom-tabs/tabBarLabelPosition-below.png" width="400" alt="Tab bar label position - below" />

- `beside-icon` the label is shown next to the icon (typical for iPad)
  <img src="/assets/7.x/bottom-tabs/tabBarLabelPosition-beside.png" width="700" alt="Tab bar label position - beside" />

#### `tabBarAllowFontScaling`

Whether label font should scale to respect Text Size accessibility settings. Defaults to `true`.

Only supported with `custom` implementation.

#### `tabBarLabelStyle`

Style object for the tab label. Supported properties:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `fontStyle`

<img src="/assets/7.x/bottom-tabs/tabBarLabelStyle.png" width="500" alt="Tab bar label style" />

Example:

```js
tabBarLabelStyle: {
  fontSize: 16,
  fontFamily: 'Georgia',
  fontWeight: 300,
},
```

#### `tabBarIcon`

Icon object to display or a function that given `{ focused: boolean, color: string, size: number }` returns an icon to display in the tab bar. It can be one of the following:

- An icon object with both `native` and `custom` implementations
- A React element with `custom` implementation only

It overrides the icon provided by [`tabBarSystemItem`](#tabbarsystemitem) on iOS.

The icon object can be one of the following types:

- Local image - Supported on all platforms

  ```js
  tabBarIcon: {
    type: 'image',
    source: require('./path/to/icon.png'),
  }
  ```

  It's necessary to provide icons for multiple screen densities (1x, 2x, 3x), e.g.: `icon.png`, `icon@2x.png`, `icon@3x.png` etc. as icons are not scaled automatically on iOS for the `native` implementation.

  It also supports [drawable resource](https://developer.android.com/guide/topics/resources/drawable-resource) on Android, [xcasset](https://developer.apple.com/documentation/xcode/adding-images-to-your-xcode-project) on iOS:

  ```js
  tabBarIcon: {
    type: 'image',
    source: { uri: 'icon_name' },
  }
  ```

  A `tinted` property can be used to control whether the icon should be tinted with the active/inactive color:

  ```js
  tabBarIcon: {
    type: 'image',
    source: require('./path/to/icon.png'),
    tinted: false,
  }
  ```

  Set `tinted` to `false` if the image has its own colors that you want to preserve.

  The image is tinted by default. Overriding is only supported on iOS for the `native` implementation, all platforms for the `custom` implementation.

- [SF Symbols](https://developer.apple.com/sf-symbols/) name - Supported on iOS

  ```js
  tabBarIcon: {
    type: 'sfSymbol',
    name: 'heart',
  }
  ```

  See [Icons](icons.md#sf-symbols) for more details.

- [Material Symbols](https://fonts.google.com/icons) name - Supported on Android

  ```js
  tabBarIcon: {
    type: 'materialSymbol',
    name: 'favorite',
  }
  ```

  It also supports the following optional properties:
  - `variant` - Supported values: `outlined`, `rounded`, `sharp`
  - `weight` - Supported values: `100`, `200`, `300`, `400`, `500`, `600`, `700`

  See [Icons](icons.md#material-symbols) for more details.

To render different icons for active and inactive states, you can use a function:

```js
tabBarIcon: ({ focused }) => {
  return {
    type: 'sfSymbol',
    name: focused ? 'heart.fill' : 'heart',
  };
},
```

This not supported on Android with `native` implementation, the icon specified for inactive state will be used for both active and inactive states.

To provide different icons for different platforms, you can use [`Platform.select`](https://reactnative.dev/docs/platform-specific-code):

```js
tabBarIcon: Platform.select({
  ios: {
    type: 'sfSymbol',
    name: 'heart',
  },
  android: {
    type: 'materialSymbol',
    name: 'favorite',
  },
  default: {
    type: 'image',
    source: require('./path/to/icon.png'),
  },
});
```

#### `tabBarIconStyle`

Style object for the tab icon.

Only supported with `custom` implementation.

#### `tabBarBadge`

Text to show in a badge on the tab icon. Accepts a `string` or a `number`.

<img src="/assets/7.x/bottom-tabs/tabBarBadge.png" width="500" alt="Tab bar badge" />

#### `tabBarBadgeStyle`

Style for the badge on the tab icon. Supported properties:

- `backgroundColor`
- `color`

With `native` implementation, limited customization is supported:

- on iOS, you can only set the background color.
- on Android, you can set both background and text colors.

<img src="/assets/7.x/bottom-tabs/tabBarBadgeStyle.png" width="500" alt="Tab bar badge style" />

Example:

```js
tabBarBadgeStyle: {
  color: 'black',
  backgroundColor: 'yellow',
},
```

#### `tabBarAccessibilityLabel`

Accessibility label for the tab button. This is read by the screen reader when the user taps the tab. It's recommended to set this if you don't have a label for the tab.

Only supported with `custom` implementation.

#### `tabBarButton`

Function which returns a React element to render as the tab bar button. It wraps the icon and label. Renders [`PlatformPressable`](elements.md#platformpressable) by default.

Only supported with `custom` implementation.

You can specify a custom implementation here:

```js
tabBarButton: (props) => <TouchableOpacity {...props} />;
```

#### `tabBarButtonTestID`

ID to locate this tab button in tests.

Only supported with `custom` implementation.

#### `tabBarActiveTintColor`

Color for the icon and label in the active tab.
<img src="/assets/7.x/bottom-tabs/tabBarActiveTintColor.png" width="500" alt="Tab bar active tint color" />

#### `tabBarInactiveTintColor`

Color for the icon and label in the inactive tabs.
<img src="/assets/7.x/bottom-tabs/tabBarInactiveTintColor.png" width="500" alt="Tab bar inactive tint color" />

#### `tabBarActiveIndicatorColor`

Background color of the active indicator.

Only supported with `native` implementation on Android.

#### `tabBarActiveIndicatorEnabled`

Whether the active indicator should be used. Defaults to `true`.

Only supported with `native` implementation on Android.

#### `tabBarRippleColor`

Color of the ripple effect when pressing a tab.

Only supported with `native` implementation on Android.

#### `tabBarActiveBackgroundColor`

Background color for the active tab.

Only supported with `custom` implementation.

#### `tabBarInactiveBackgroundColor`

Background color for the inactive tabs.

Only supported with `custom` implementation.

#### `tabBarHideOnKeyboard`

Whether the tab bar is hidden when the keyboard opens. Defaults to `false`.

Only supported with `custom` implementation.

#### `tabBarVisibilityAnimationConfig`

Animation config for showing and hiding the tab bar when the keyboard is shown/hidden.

Only supported with `custom` implementation.

Example:

```js
tabBarVisibilityAnimationConfig: {
  show: {
    animation: 'timing',
    config: {
      duration: 200,
    },
  },
  hide: {
    animation: 'timing',
    config: {
      duration: 100,
    },
  },
},
```

#### `tabBarItemStyle`

Style object for the tab item container.

Only supported with `custom` implementation.

#### `tabBarStyle`

Style object for the tab bar. You can configure styles such as background color here.

With `custom` implementation, this accepts any style properties. With `native` implementation, only `backgroundColor` and `shadowColor` (iOS 18 and below) are supported.

To show your screen under the tab bar, you can set the `position` style to absolute (only with `custom` implementation):

```js
<Tab.Navigator
  screenOptions={{
    tabBarStyle: { position: 'absolute' },
  }}
>
```

You also might need to add a bottom margin to your content if you have an absolutely positioned tab bar. React Navigation won't do it automatically. See [`useBottomTabBarHeight`](#usebottomtabbarheight) for more details.

#### `tabBarBackground`

Function which returns a React Element to use as background for the tab bar. You could render an image, a gradient, blur view etc.

Only supported with `custom` implementation.

Example:

```js
import { BlurView } from 'expo-blur';

// ...

<Tab.Navigator
  screenOptions={{
    tabBarStyle: { position: 'absolute' },
    tabBarBackground: () => (
      <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
    ),
  }}
>
```

When using `BlurView`, make sure to set `position: 'absolute'` in `tabBarStyle` as well. You'd also need to use [`useBottomTabBarHeight`](#usebottomtabbarheight) to add bottom padding to your content.

<img src="/assets/7.x/bottom-tabs/tabBarBackground.png" width="500" alt="Tab bar background" />

#### `tabBarPosition`

Position of the tab bar. Available values are:

- `bottom` (Default)
- `top`
- `left`
- `right`

Only supported with `custom` implementation, or if a custom `tabBar` is provided with the [`tabBar`](#tabbar) prop.

When the tab bar is positioned on the `left` or `right`, it is styled as a sidebar. This can be useful when you want to show a sidebar on larger screens and a bottom tab bar on smaller screens:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Tabs = createBottomTabNavigator({
  screenOptions: {
    tabBarPosition: isLargeScreen ? 'left' : 'bottom',
  },

  // ...
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Tab.Navigator
  screenOptions={{
    tabBarPosition: isLargeScreen ? 'left' : 'bottom',
  }}
>
```

</TabItem>
</Tabs>

<img src="/assets/7.x/bottom-tabs-side.png" alt="Sidebar" data-landscape></img>

You can also render a compact sidebar by placing the label below the icon. This is only supported when the [`tabBarVariant`](#tabbarvariant) is set to `material`:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const Tabs = createBottomTabNavigator({
  screenOptions: {
    tabBarPosition: isLargeScreen ? 'left' : 'bottom',
    tabBarVariant: isLargeScreen ? 'material' : 'uikit',
    tabBarLabelPosition: 'below-icon',
  },

  // ...
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Tab.Navigator
  screenOptions={{
    tabBarPosition: dimensions.width < 600 ? 'bottom' : 'left',
    tabBarLabelPosition: 'below-icon',
  }}
>
```

</TabItem>
</Tabs>

![Compact sidebar](/assets/7.x/bottom-tabs-side-compact.png)

#### `tabBarVariant`

Variant of the tab bar. Available values are:

- `uikit` (Default) - The tab bar will be styled according to the iOS UIKit guidelines.
- `material` - The tab bar will be styled according to the Material Design guidelines.

Only supported with `custom` implementation.

The `material` variant is currently only supported when the [`tabBarPosition`](#tabbarposition) is set to `left` or `right`.

![Material sidebar](/assets/7.x/bottom-tabs-side-material.png)

#### `tabBarBlurEffect`

Blur effect applied to the tab bar on iOS 18 and lower when tab screen is selected.

Supported values:

- `none` - no blur effect
- `systemDefault` - default blur effect applied by the system
- `extraLight`
- `light`
- `dark`
- `regular`
- `prominent`
- `systemUltraThinMaterial`
- `systemThinMaterial`
- `systemMaterial`
- `systemThickMaterial`
- `systemChromeMaterial`
- `systemUltraThinMaterialLight`
- `systemThinMaterialLight`
- `systemMaterialLight`
- `systemThickMaterialLight`
- `systemChromeMaterialLight`
- `systemUltraThinMaterialDark`
- `systemThinMaterialDark`
- `systemMaterialDark`
- `systemThickMaterialDark`
- `systemChromeMaterialDark`

Defaults to `systemDefault`.

Only supported with `native` implementation on iOS 18 and below.

#### `tabBarControllerMode`

The display mode for the tab bar. Supported values:

- `auto` - the system sets the display mode based on the tab's content
- `tabBar` - the system displays the content only as a tab bar
- `tabSidebar` - the tab bar is displayed as a sidebar

Supported on all platforms with `custom` implementation. By default:

- `tabBar` is positioned at the bottom
- `tabSidebar` is positioned on the left (LTR) or right (RTL)

The [`tabBarPosition`](#tabbarposition) option can be used to override this in `custom` implementation or for custom [`tabBar`](#tabbar).

Supported on iOS 18 and above with `native` implementation. Not supported on tvOS.

#### `tabBarMinimizeBehavior`

The minimize behavior for the tab bar. Supported values:

- `auto` - resolves to the system default minimize behavior
- `never` - the tab bar does not minimize
- `onScrollDown` - the tab bar minimizes when scrolling down and expands when scrolling back up
- `onScrollUp` - the tab bar minimizes when scrolling up and expands when scrolling back down

Only supported with `native` implementation on iOS 26 and above.

<video playsInline autoPlay muted loop data-landscape style={{ maxWidth: '402px' }}>

  <source src="/assets/7.x/native-bottom-tabs-ios-minimize.mp4" />
</video>

#### `bottomAccessory`

Function that returns a React element to display as an accessory view. The function receives an options object with a `placement` parameter that can be one of the following values:

- `regular` - at bottom of the screen, above the tab bar if tab bar is at the bottom
- `inline` - inline with the collapsed bottom tab bar (e.g., when minimized based on [`tabBarMinimizeBehavior`](#tabbarminimizebehavior))

Example:

```js
bottomAccessory: ({ placement }) => {
  return (
    <View style={{ padding: 16 }}>
      <Text>Placement: {placement}</Text>
    </View>
  );
};
```

Only supported with `native` implementation on iOS 26 and above.

On Android, iOS 18 and below, nothing is rendered. You can either use the [`screenLayout`](navigator.md#screen-layout) or [`layout`](screen.md) props, or render content inside your screen component directly as a fallback.

<video playsInline autoPlay muted loop data-landscape style={{ maxWidth: '402px' }}>

  <source src="/assets/7.x/native-bottom-tabs-ios-bottom-accessory.mp4" />
</video>

:::note

The content is rendered twice for both placements, but only one is visible at a time based on the tab bar state. Any shared state should be stored outside of the component to keep both versions in sync.

:::

#### `scrollEdgeEffects`

Configures the scroll edge effect for the _content ScrollView_ (the ScrollView that is present in first descendants chain of the Screen).
Depending on values set, it will blur the scrolling content below certain UI elements (e.g. header items, search bar) for the specified edge of the ScrollView.
When set in nested containers, i.e. Native Stack inside Native Bottom Tabs, or the other way around, the ScrollView will use only the innermost one's config.

Edge effects can be configured for each edge separately. The following values are currently supported:

- `automatic` - the automatic scroll edge effect style,
- `hard` - a scroll edge effect with a hard cutoff and dividing line,
- `soft` - a soft-edged scroll edge effect,
- `hidden` - no scroll edge effect.

Defaults to `automatic` for each edge.

Only supported with `native` implementation on iOS 26 and above.

#### `lazy`

Whether this screen should render only after the first time it's accessed. Defaults to `true`. Set it to `false` if you want to render the screen on the initial render of the navigator.

#### `popToTopOnBlur`

Boolean indicating whether any nested stack should be popped to the top of the stack when navigating away from this tab. Defaults to `false`.

It only works when there is a stack navigator (e.g. [stack navigator](stack-navigator.md) or [native stack navigator](native-stack-navigator.md)) nested under the tab navigator.

#### `sceneStyle`

Style object for the component wrapping the screen content.

### Header related options

The navigator does not show a header by default. It renders a native stack header if `headerShown` is set to `true` in the screen options explicitly, or if a custom header is provided with the `header` option.

You can find the list of header related options [here](elements.md#header). These [options](screen-options.md) can be specified under `screenOptions` prop of `Tab.Navigator` or `options` prop of `Tab.Screen`. You don't have to be using `@react-navigation/elements` directly to use these options, they are just documented in that page.

In addition to those, the following options are also supported in bottom tabs:

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

Whether to show or hide the header for the screen. The header is not shown by default unless a custom header is provided with the `header` option.

### Events

The navigator can [emit events](navigation-events.md) on certain actions. Supported events are:

#### `tabPress`

This event is fired when the user presses the tab button for the current screen in the tab bar. By default a tab press does several things:

- If the tab is not focused, tab press will focus that tab
- If the tab is already focused:
  - If the screen for the tab renders a scroll view, you can use [`useScrollToTop`](use-scroll-to-top.md) to scroll it to top
  - If the screen for the tab renders a stack navigator, a `popToTop` action is performed on the stack

To prevent the default behavior, you can call `event.preventDefault`.

:::note

Calling `event.preventDefault` is only supported with the `custom` implementation. The default behavior cannot be prevented with the `native` implementation.

:::

```js name="Tab Press Event" snack static2dynamic
import * as React from 'react';
import { Alert, Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation('Home');

  // codeblock-focus-start
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      // Prevent default behavior
      e.preventDefault();

      // Do something manually
      // ...
    });

    return unsubscribe;
  }, [navigation]);
  // codeblock-focus-end

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text style={{ marginTop: 10, color: 'gray' }}>
        Tab press event is prevented
      </Text>
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

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

If you have a custom tab bar, make sure to emit this event.

:::note

By default, tabs are rendered lazily. So if you add a listener inside a screen component, it won't receive the event until the screen is focused for the first time. If you need to listen to this event before the screen is focused, you can specify the [listener in the screen config](navigation-events.md#listeners-prop-on-screen) instead.

:::

#### `tabLongPress`

This event is fired when the user presses the tab button for the current screen in the tab bar for an extended period. If you have a custom tab bar, make sure to emit this event.

Only supported with the `custom` implementation.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('tabLongPress', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

#### `transitionStart`

This event is fired when a transition animation starts when switching tabs.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('transitionStart', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

#### `transitionEnd`

This event is fired when a transition animation ends when switching tabs.

Example:

```js
React.useEffect(() => {
  const unsubscribe = navigation.addListener('transitionEnd', (e) => {
    // Do something
  });

  return unsubscribe;
}, [navigation]);
```

### Helpers

The tab navigator adds the following methods to the navigation object:

#### `jumpTo`

Navigates to an existing screen in the tab navigator. The method accepts following arguments:

- `name` - _string_ - Name of the route to jump to.
- `params` - _object_ - Screen params to use for the destination route.

```js name="Tab Navigator - jumpTo" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.jumpTo('Profile', { owner: 'Michaś' })
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

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

### Hooks

The bottom tab navigator exports the following hooks:

#### `useBottomTabBarHeight`

This hook returns the height of the bottom tab bar. By default, the screen content doesn't go under the tab bar. However, if you want to make the tab bar absolutely positioned and have the content go under it (e.g. to show a blur effect), it's necessary to adjust the content to take the tab bar height into account.

Example:

```js
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

function MyComponent() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <ScrollView contentStyle={{ paddingBottom: tabBarHeight }}>
      {/* Content */}
    </ScrollView>
  );
}
```

Alternatively, you can use the `BottomTabBarHeightContext` directly if you are using a class component or need it in a reusable component that can be used outside the bottom tab navigator:

```js
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

// ...

<BottomTabBarHeightContext.Consumer>
  {tabBarHeight => (
    /* render something */
  )}
</BottomTabBarHeightContext.Consumer>
```

## Animations

By default, switching between tabs doesn't have any animation. You can specify the `animation` option to customize the transition animation.

:::note

Customizing animations are only supported with the `custom` implementation.

:::

Supported values for `animation` are:

- `fade` - Cross-fade animation for the screen transition where the new screen fades in and the old screen fades out.

  <video playsInline autoPlay muted loop>
    <source src="/assets/7.x/bottom-tabs-fade.mp4" />
  </video>

- `shift` - Shifting animation for the screen transition where the screens slightly shift to left/right.

  <video playsInline autoPlay muted loop>
    <source src="/assets/7.x/bottom-tabs-shift.mp4" />
  </video>

- `none` - The screen transition doesn't have any animation. This is the default value.

```js name="Bottom Tabs animation" snack static2dynamic
import * as React from 'react';
import { View, Text, Easing } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

// codeblock-focus-start
const RootTabs = createBottomTabNavigator({
  screenOptions: {
    // highlight-start
    animation: 'fade',
    // highlight-end
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

If you need more control over the animation, you can customize individual parts of the animation using the various animation-related options:

### Animation related options

Bottom Tab Navigator exposes various options to configure the transition animation when switching tabs. These transition animations can be customized on a per-screen basis by specifying the options in the `options` for each screen, or for all screens in the tab navigator by specifying them in the `screenOptions`.

- `transitionSpec` - An object that specifies the animation type (`timing` or `spring`) and its options (such as `duration` for `timing`). It contains 2 properties:
  - `animation` - The animation function to use for the animation. Supported values are `timing` and `spring`.
  - `config` - The configuration object for the timing function. For `timing`, it can be `duration` and `easing`. For `spring`, it can be `stiffness`, `damping`, `mass`, `overshootClamping`, `restDisplacementThreshold` and `restSpeedThreshold`.

  A config that uses a timing animation looks like this:

  ```js
  const config = {
    animation: 'timing',
    config: {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    },
  };
  ```

  We can pass this config in the `transitionSpec` option:

  <Tabs groupId="config" queryString="config">
  <TabItem value="static" label="Static" default>

  ```js
  {
    Profile: {
      screen: Profile,
      options: {
        // highlight-start
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          },
        },
        // highlight-end
      },
    },
  }
  ```

  </TabItem>
  <TabItem value="dynamic" label="Dynamic">

  ```js
  <Tab.Screen
    name="Profile"
    component={Profile}
    options={{
      // highlight-start
      transitionSpec: {
        animation: 'timing',
        config: {
          duration: 150,
          easing: Easing.inOut(Easing.ease),
        },
      },
      // highlight-end
    }}
  />
  ```

  </TabItem>
  </Tabs>

- `sceneStyleInterpolator` - This is a function that specifies interpolated styles for various parts of the scene. It currently supports style for the view containing the screen:
  - `sceneStyle` - Style for the container view wrapping the screen content.

  The function receives the following properties in its argument:
  - `current` - Animation values for the current screen:
    - `progress` - Animated node representing the progress value of the current screen.

  A config that fades the screen looks like this:

  ```js
  const forFade = ({ current }) => ({
    sceneStyle: {
      opacity: current.progress.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 1, 0],
      }),
    },
  });
  ```

  The value of `current.progress` is as follows:
  - -1 if the index is lower than the active tab,
  - 0 if they're active,
  - 1 if the index is higher than the active tab

  We can pass this function in `sceneStyleInterpolator` option:

  <Tabs groupId="config" queryString="config">
  <TabItem value="static" label="Static" default>

  ```js
  {
    Profile: {
      screen: Profile,
      options: {
        // highlight-start
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            opacity: current.progress.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0, 1, 0],
            }),
          },
        }),
        // highlight-end
      },
    },
  }
  ```

  </TabItem>
  <TabItem value="dynamic" label="Dynamic">

  ```js
  <Tab.Screen
    name="Profile"
    component={Profile}
    options={{
      // highlight-start
      sceneStyleInterpolator: ({ current }) => ({
        sceneStyle: {
          opacity: current.progress.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0, 1, 0],
          }),
        },
      }),
      // highlight-end
    }}
  />
  ```

  </TabItem>
  </Tabs>

Putting these together, you can customize the transition animation for a screen:

Putting these together, you can customize the transition animation for a screen:

```js name="Bottom Tabs custom animation" snack static2dynamic
import * as React from 'react';
import { View, Text, Easing } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

// codeblock-focus-start
const RootTabs = createBottomTabNavigator({
  screenOptions: {
    transitionSpec: {
      animation: 'timing',
      config: {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
      },
    },
    sceneStyleInterpolator: ({ current }) => ({
      sceneStyle: {
        opacity: current.progress.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 1, 0],
        }),
      },
    }),
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

### Pre-made configs

We also export various configs from the library with ready-made configs that you can use to customize the animations:

#### `TransitionSpecs`

- `FadeSpec` - Configuration for a cross-fade animation between screens.
- `ShiftSpec` - Configuration for a shifting animation between screens.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import { TransitionSpecs } from '@react-navigation/bottom-tabs';

// ...

{
  Profile: {
    screen: Profile,
    options: {
      // highlight-start
      transitionSpec: TransitionSpecs.CrossFadeSpec,
      // highlight-end
    },
  },
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { TransitionSpecs } from '@react-navigation/bottom-tabs';

// ...

<Tab.Screen
  name="Profile"
  component={Profile}
  options={{
    // highlight-start
    transitionSpec: TransitionSpecs.FadeSpec,
    // highlight-end
  }}
/>;
```

</TabItem>
</Tabs>

#### `SceneStyleInterpolators`

- `forFade` - Cross-fade animation for the screen transition where the new screen fades in and the old screen fades out.
- `forShift` - Shifting animation for the screen transition where the screens slightly shift to left/right.

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import { SceneStyleInterpolators } from '@react-navigation/bottom-tabs';

// ...

{
  Profile: {
    screen: Profile,
    options: {
      // highlight-start
      sceneStyleInterpolator: SceneStyleInterpolators.forFade,
      // highlight-end
    },
  },
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { SceneStyleInterpolators } from '@react-navigation/bottom-tabs';

// ...

<Tab.Screen
  name="Profile"
  component={Profile}
  options={{
    // highlight-start
    sceneStyleInterpolator: SceneStyleInterpolators.forFade,
    // highlight-end
  }}
/>;
```

</TabItem>
</Tabs>

#### `TransitionPresets`

We export transition presets that bundle various sets of these options together. A transition preset is an object containing a few animation-related screen options exported under `TransitionPresets`. Currently the following presets are available:

- `FadeTransition` - Cross-fade animation for the screen transition where the new screen fades in and the old screen fades out.
- `ShiftTransition` - Shifting animation for the screen transition where the screens slightly shift to left/right.

You can spread these presets in `options` to customize the animation for a screen:

Example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
import { TransitionPresets } from '@react-navigation/bottom-tabs';

// ...

{
  Profile: {
    screen: Profile,
    options: {
      // highlight-start
      ...TransitionPresets.FadeTransition,
      // highlight-end
    },
  },
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
import { TransitionPresets } from '@react-navigation/bottom-tabs';

// ...

<Tab.Screen
  name="Profile"
  component={Profile}
  options={{
    // highlight-start
    ...TransitionPresets.FadeTransition,
    // highlight-end
  }}
/>;
```

</TabItem>
</Tabs>
