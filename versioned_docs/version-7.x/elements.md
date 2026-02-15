---
id: elements
title: Elements Library
sidebar_label: Elements
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A component library containing the UI elements and helpers used in React Navigation. It can be useful if you're building your own navigator, or want to reuse a default functionality in your app.

## Installation

To use this package, ensure that you have [`@react-navigation/native` and its dependencies (follow this guide)](getting-started.md), then install [`@react-navigation/elements`](https://github.com/react-navigation/react-navigation/tree/main/packages/elements):

```bash npm2yarn
npm install @react-navigation/elements
```

## Components

### `Header`

A component that can be used as a header. This is used by all the navigators by default.

Usage:

```js name="React Navigation Elements Header" snack
import * as React from 'react';
import { SafeAreaProviderCompat } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
// codeblock-focus-start
import { Header } from '@react-navigation/elements';

function MyHeader() {
  return <Header title="My app" />;
}
// codeblock-focus-end

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProviderCompat>
        <MyHeader />
      </SafeAreaProviderCompat>
    </NavigationContainer>
  );
}
```

To use the header in a navigator, you can use the `header` option in the screen options:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Header with Native Stack" snack
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// codeblock-focus-start
import { Header, getHeaderTitle } from '@react-navigation/elements';

// codeblock-focus-end
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

// codeblock-focus-start
const MyStack = createNativeStackNavigator({
  screenOptions: {
    header: ({ options, route, back }) => (
      <Header
        {...options}
        back={back}
        title={getHeaderTitle(options, route.name)}
      />
    ),
  },
  screens: {
    Home: HomeScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Header with Native Stack" snack
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// codeblock-focus-start
import { Header, getHeaderTitle } from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ options, route, back }) => (
          <Header
            {...options}
            back={back}
            title={getHeaderTitle(options, route.name)}
          />
        ),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
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

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

:::note

This doesn't replicate the behavior of the header in stack and native stack navigators as the stack navigator also includes animations, and the native stack navigator header is provided by the native platform.

:::

It accepts the following props:

#### `headerTitle`

String or a function that returns a React Element to be used by the header. Defaults to scene `title`.

When a function is specified, it receives an object containing following properties:

- `allowFontScaling`: Whether it scale to respect Text Size accessibility settings.
- `tintColor`: Text color of the header title.
- `style`: Style object for the `Text` component.
- `children`: The title string (from `title` in `options`).

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerTitle: ({ allowFontScaling, tintColor, style, children }) => (
          <Text
            style={[style, { color: tintColor }]}
            allowFontScaling={allowFontScaling}
          >
            {children}
          </Text>
        ),
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerTitle: ({ allowFontScaling, tintColor, style, children }) => (
      <Text
        style={[style, { color: tintColor }]}
        allowFontScaling={allowFontScaling}
      >
        {children}
      </Text>
    ),
  }}
/>
```

</TabItem>
</Tabs>

#### `headerTitleAlign`

How to align the header title. Possible values:

- `left`
- `center`

Defaults to `center` on iOS and `left` on Android.

#### `headerTitleAllowFontScaling`

Whether header title font should scale to respect Text Size accessibility settings. Defaults to `false`.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header.

It receives an object containing following properties:

- `tintColor`: The color of the icon and label.
- `pressColor`: The color of the material ripple (Android >= 5.0 only).
- `pressOpacity`: The opacity of the button when it's pressed (Android < 5.0, and iOS).
- `displayMode`: How the element displays icon and title. Defaults to `default` on iOS and `minimal` on Android. Possible values:
  - `default`: Displays one of the following depending on the available space: previous screen's title, generic title (e.g. 'Back') or no title (only icon).
  - `generic`: Displays one of the following depending on the available space: generic title (e.g. 'Back') or no title (only icon). iOS >= 14 only, falls back to "default" on older iOS versions.
  - `minimal`: Always displays only the icon without a title.
- `href`: The URL to open when the button is pressed on the Web.

You can use it to implement your custom left button, for example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerLeft: (props) => (
          <MyButton {...props} onPress={() => {
            // Do something
          }}>
        )
      }
    }
  }
})
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerLeft: (props) => (
      <MyButton
        {...props}
        onPress={() => {
          // Do something
        }}
      />
    ),
  }}
/>
```

</TabItem>
</Tabs>

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

It receives an object containing following properties:

- `tintColor`: The color of the icon and label.
- `pressColor`: The color of the material ripple (Android >= 5.0 only).
- `pressOpacity`: The opacity of the button when it's pressed (Android < 5.0, and iOS).

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerLeft: (props) => (
          <MyButton {...props} onPress={() => {
            // Do something
          }}>
        )
      }
    }
  }
})
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{
    headerLeft: (props) => (
      <MyButton
        {...props}
        onPress={() => {
          // Do something
        }}
      />
    ),
  }}
/>
```

</TabItem>
</Tabs>

#### `headerSearchBarOptions`

Options for the search bar in the header. When this is specified, the header will contain a button to show a search input.

It can contain the following properties:

- `ref`: Ref to manipulate the search input imperatively. It contains the following methods:
  - `focus` - focuses the search bar
  - `blur` - removes focus from the search bar
  - `setText` - sets the search bar's content to given value
  - `clearText` - removes any text present in the search bar input field
  - `cancelSearch` - cancel the search and close the search bar
- `autoCapitalize`: The auto-capitalization behavior. Possible values: `none`, `words`, `sentences`, `characters`.
- `autoFocus`: Automatically focus search input on mount.
- `cancelButtonText`: Text to be used instead of default `Cancel` button text (iOS only).
- `hideNavigationBar`: Boolean indicating whether to hide the navigation bar during searching. When unset, defers to native iOS behavior (navigation bar is hidden during search). Set to `false` to keep the header title and buttons visible while the search bar is active. (iOS only)
- `inputType`: Type of the input. Possible values: `text`, `phone`, `number`, `email`.
- `onBlur`: Callback that gets called when search input has lost focus.
- `onChangeText`: Callback that gets called when the text changes.
- `onClose`: Callback that gets called when search input is closed.
- `onFocus`: Callback that gets called when search input has received focus.
- `placeholder`: Text displayed when search input is empty.

```js
React.useLayoutEffect(() => {
  navigation.setOptions({
    headerSearchBarOptions: {
      placeholder: 'Search',
      onChangeText: (text) => {
        // Do something
      },
    },
  });
}, [navigation]);
```

#### `headerShadowVisible`

Whether to hide the elevation shadow (Android) or the bottom border (iOS) on the header.

This is a short-hand for the following styles:

```js
{
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
}
```

If any of the above styles are specified in `headerStyle` along with `headerShadowVisible: false`, then the styles in `headerStyle` will take precedence.

#### `headerStyle`

Style object for the header. You can specify a custom background color here, for example:

```js
{
  backgroundColor: 'tomato',
}
```

Note that `headerStyle` won't take effect if you are also using [`headerBackground`](#headerbackground). In that case, you should style the element returned from `headerBackground` instead.

#### `headerTitleStyle`

Style object for the title component

#### `headerLeftContainerStyle`

Customize the style for the container of the `headerLeft` component, for example to add padding.

#### `headerRightContainerStyle`

Customize the style for the container of the `headerRight` component, for example to add padding.

#### `headerTitleContainerStyle`

Customize the style for the container of the `headerTitle` component, for example to add padding.

By default, `headerTitleContainerStyle` is with an absolute position style and offsets both `left` and `right`. This may lead to white space or overlap between `headerLeft` and `headerTitle` if a customized `headerLeft` is used. It can be solved by adjusting `left` and `right` style in `headerTitleContainerStyle` and `marginHorizontal` in `headerTitleStyle`.

#### `headerBackgroundContainerStyle`

Style object for the container of the `headerBackground` element.

#### `headerTintColor`

Tint color for the header

#### `headerPressColor`

Color for material ripple (Android >= 5.0 only)

#### `headerPressOpacity`

Press opacity for the buttons in header (Android < 5.0, and iOS)

#### `headerTransparent`

Defaults to `false`. If `true`, the header will not have a background unless you explicitly provide it with `headerBackground`. The header will also float over the screen so that it overlaps the content underneath.

This is useful if you want to render a semi-transparent header or a blurred background.

Note that if you don't want your content to appear under the header, you need to manually add a top margin to your content. React Navigation won't do it automatically.

To get the height of the header, you can use [`HeaderHeightContext`](#headerheightcontext) with [React's Context API](https://react.dev/reference/react/useContext#contextconsumer) or [`useHeaderHeight`](#useheaderheight).

#### `headerBackground`

Function which returns a React Element to render as the background of the header. This is useful for using backgrounds such as an image or a gradient.

For example, you can use this with `headerTransparent` to render a blur view to create a translucent header.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Header blur" snack dependencies=expo-blur
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from '@react-navigation/elements';
import { BlurView } from 'expo-blur';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

// codeblock-focus-start
const Stack = createStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerTransparent: true,
        headerBackground: () => (
          <BlurView
            tint="dark"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
      },
    },
    Profile: ProfileScreen,
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(Stack);

function App() {
  return <Navigation />;
}

export default App;
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Header blur" snack dependencies=expo-blur
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from '@react-navigation/elements';
// codeblock-focus-start
import { BlurView } from 'expo-blur';

// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        // codeblock-focus-start
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTransparent: true,
            headerBackground: () => (
              <BlurView
                tint="dark"
                intensity={100}
                style={StyleSheet.absoluteFill}
              />
            ),
          }}
        />
        // codeblock-focus-end
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

</TabItem>
</Tabs>

#### `headerStatusBarHeight`

Extra padding to add at the top of header to account for translucent status bar. By default, it uses the top value from the safe area insets of the device. Pass 0 or a custom value to disable the default behavior, and customize the height.

### `HeaderBackground`

A component containing the styles used in the background of the header, such as the background color and shadow. It's the default for [`headerBackground`](#headerbackground). It accepts the same props as a [`View`](https://reactnative.dev/docs/view).

Usage:

```js
<HeaderBackground style={{ backgroundColor: 'tomato' }} />
```

### `HeaderTitle`

A component used to show the title text in header. It's the default for [`headerTitle`](#headertitle). It accepts the same props as a [`Text`](https://reactnative.dev/docs/Text).

The color of title defaults to the [theme text color](themes.md). You can override it by passing a `tintColor` prop.

Usage:

```js
<HeaderTitle>Hello</HeaderTitle>
```

### `HeaderButton`

A component used to show a button in header. It can be used for both left and right buttons. It accepts the following props:

- `onPress` - Callback to call when the button is pressed.
- `href` - The `href` to use for the anchor tag on web.
- `disabled` - Boolean which controls whether the button is disabled.
- `accessibilityLabel` - Accessibility label for the button for screen readers.
- `testID` - ID to locate this button in tests.
- `tintColor` - Tint color for the header button.
- `pressColor` - Color for material ripple (Android >= 5.0 only).
- `pressOpacity` - Opacity when the button is pressed if material ripple isn't supported by the platform.
- `style` - Style object for the button.
- `children` - Content to render for the button. Usually the icon.

Usage:

```js
<HeaderButton
  accessibilityLabel="More options"
  onPress={() => console.log('button pressed')}
>
  <MaterialCommunityIcons
    name="dots-horizontal-circle-outline"
    size={24}
    color={tintColor}
  />
</HeaderButton>
```

### `HeaderBackButton`

A component used to show the back button header. It's the default for [`headerLeft`](#headerleft) in the [stack navigator](stack-navigator.md). It accepts the following props:

- `disabled` - Boolean which controls Whether the button is disabled.
- `onPress` - Callback to call when the button is pressed.
- `pressColor` - Color for material ripple (Android >= 5.0 only).
- `backImage` - Function which returns a React Element to display custom image in header's back button.
- `tintColor` - Tint color for the header.
- `label` - Label text for the button. Usually the title of the previous screen. By default, this is only shown on iOS.
- `truncatedLabel` - Label text to show when there isn't enough space for the full label.
- `displayMode`: How the back button displays icon and title. Defaults to `default` on iOS and `minimal` on Android. Possible values:
  - `default`: Displays one of the following depending on the available space: previous screen's title, generic title (e.g. 'Back') or no title (only icon).
  - `generic`: Displays one of the following depending on the available space: generic title (e.g. 'Back') or no title (only icon). iOS >= 14 only, falls back to "default" on older iOS versions.
  - `minimal`: Always displays only the icon without a title.
- `labelStyle` - Style object for the label.
- `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings.
- `onLabelLayout` - Callback to trigger when the size of the label changes.
- `screenLayout` - Layout of the screen.
- `titleLayout` - Layout of the title element in the header.
- `canGoBack` - Boolean to indicate whether it's possible to navigate back in stack.
- `accessibilityLabel` - Accessibility label for the button for screen readers.
- `testID` - ID to locate this button in tests.
- `style` - Style object for the button.

Usage:

```js
<HeaderBackButton label="Hello" onPress={() => console.log('back pressed')} />
```

### `MissingIcon`

A component that renders a missing icon symbol. It can be used as a fallback for icons to show that there's a missing icon. It accepts the following props:

- `color` - Color of the icon.
- `size` - Size of the icon.
- `style` - Additional styles for the icon.

### `PlatformPressable`

A component which provides an abstraction on top of [`Pressable`](https://reactnative.dev/docs/Pressable) to handle platform differences. In addition to `Pressable`'s props, it accepts following additional props:

- `pressColor` - Color of material ripple on Android when it's pressed
- `pressOpacity` - Opacity when it's pressed if material ripple isn't supported by the platform

### `Button`

A component that renders a button. In addition to [`PlatformPressable`](#platformpressable)'s props, it accepts following additional props:

- `variant` - Variant of the button. Possible values are:
  - `tinted` (default)
  - `plain`
  - `filled`
- `color` - Color of the button. Defaults to the [theme](themes.md)'s primary color.
- `children` - Content to render inside the button.

In addition, the button integrates with React Navigation and accepts the same props as [`useLinkProps`](use-link-props.md#options) hook.

It can be used to navigate between screens by specifying a screen name and params:

```js
<Button screen="Profile" params={{ userId: 'jane' }}>
  Go to Profile
</Button>
```

Or as a regular button:

```js
<Button onPress={() => console.log('button pressed')}>Press me</Button>
```

### `Label`

The `Label` component is used to render small text. It is used in [Bottom Tab Navigator](bottom-tab-navigator.md) to render the label for each tab.

In addition to the standard [`Text`](https://reactnative.dev/docs/text) props, it accepts the following props:

- `tintColor` - Color of the label. Defaults to the [theme](themes.md)'s text color.

Usage:

```jsx
<Label>Home</Label>
```

### `ResourceSavingView`

A component which aids in improving performance for inactive screens by utilizing [`removeClippedSubviews`](https://reactnative.dev/docs/view#removeclippedsubviews). It accepts a `visible` prop to indicate whether a screen should be clipped.

Usage:

```js
<ResourceSavingView visible={0}>{/* Content */}</ResourceSavingView>
```

## Utilities

### `SafeAreaProviderCompat`

A wrapper over the `SafeAreaProvider` component from [`react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) which includes initial values.

Usage:

```js
<SafeAreaProviderCompat>{/* Your components */}</SafeAreaProviderCompat>
```

### `HeaderBackContext`

React context that can be used to get the back title of the parent screen.

```js
import { HeaderBackContext } from '@react-navigation/elements';

// ...

<HeaderBackContext.Consumer>
  {(headerBack) => {
    if (headerBack) {
      const backTitle = headerBack.title;

      /* render something */
    }

    /* render something */
  }}
</HeaderBackContext.Consumer>;
```

### `HeaderShownContext`

React context that can be used to check if a header is visible in a parent screen.

```js
import { HeaderShownContext } from '@react-navigation/elements';

// ...

<HeaderShownContext.Consumer>
  {(headerShown) => {
    /* render something */
  }}
</HeaderShownContext.Consumer>;
```

### `HeaderHeightContext`

React context that can be used to get the height of the nearest visible header in a parent screen.

```js
import { HeaderHeightContext } from '@react-navigation/elements';

// ...

<HeaderHeightContext.Consumer>
  {(headerHeight) => {
    /* render something */
  }}
</HeaderHeightContext.Consumer>;
```

### `useHeaderHeight`

Hook that returns the height of the nearest visible header in the parent screen.

```js
import { useHeaderHeight } from '@react-navigation/elements';

// ...

const headerHeight = useHeaderHeight();
```

### `getDefaultHeaderHeight`

Helper that returns the default header height. It takes the following parameters:

- `layout` - Layout of the screen, i.e. an object containing `height` and `width` properties.
- `statusBarHeight` - height of the statusbar

### `getHeaderTitle`

Helper that returns the title text to use in header. It takes the following parameters:

- `options` - The options object of the screen.
- `fallback` - Fallback title string if no title was found in options.

### `useFrameSize`

Hook that returns the size of the frame of the parent navigator. It accepts a selector function which receives the frame dimensions and returns a value:

```js
import { useFrameSize } from '@react-navigation/elements';

// ...

const isLandscape = useFrameSize((frame) => frame.width > frame.height);
```

The selector ensures that the component only re-renders when we need to.
