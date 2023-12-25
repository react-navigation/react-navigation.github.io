---
id: headers
title: Configuring the header bar
sidebar_label: Configuring the header bar
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

We've seen how to configure the header title already, but let's go over that again before moving on to some other options &mdash; repetition is key to learning!

## Setting the header title

Each screen has `options` which is either an object or a function that returns an object, that contains various configuration options. The one we use for the header title is `title`, as shown in the following example.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'My home',
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

<samp id="basic-header-config">header title</samp>

```js
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

## Using params in the title

In order to use params in the title, we need to make `options` for the screen a function that returns a configuration object. If we make `options` a function then React Navigation will call it with an object containing `{ navigation, route }` - in this case, all we care about is `route`, which is the same object that is passed to your screen props as `route` prop. You may recall that we can get the params through `route.params`, and so we do this below to extract a param and use it as a title.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'My home',
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: ({ route }) => ({ title: route.params.name }),
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

<samp id="params-in-title">params in title</samp>

```js
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

The argument that is passed in to the `options` function is an object with the following properties:

- `navigation` - The [navigation object](navigation-object.md) for the screen.
- `route` - The [route object](route-object.md) for the screen

We only needed the `route` object in the above example but you may in some cases want to use `navigation` as well.

## Updating `options` with `setOptions`

It's often necessary to update the `options` configuration for the active screen from the mounted screen component itself. We can do this using `navigation.setOptions`

<samp id="updating-options-with-setoptions">updating navigation options</samp>

```js
<Button
  title="Update the title"
  onPress={() => navigation.setOptions({ title: 'Updated!' })}
/>
```

## Adjusting header styles

There are three key properties to use when customizing the style of your header: `headerStyle`, `headerTintColor`, and `headerTitleStyle`.

- `headerStyle`: a style object that will be applied to the view that wraps the header. If you set `backgroundColor` on it, that will be the color of your header.
- `headerTintColor`: the back button and title both use this property as their color. In the example below, we set the tint color to white (`#fff`) so the back button and the header title would be white.
- `headerTitleStyle`: if we want to customize the `fontFamily`, `fontWeight` and other `Text` style properties for the title, we can use this to do it.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'My home',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

<samp id="header-styles">header styles</samp>

```js
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'My home',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

![Custom header styles](/assets/headers/custom_headers.png)

There are a couple of things to notice here:

1. On iOS, the status bar text and icons are black, and this doesn't look great over a dark-colored background. We won't discuss it here, but you should be sure to configure the status bar to fit with your screen colors [as described in the status bar guide](status-bar.md).
2. The configuration we set only applies to the home screen; when we navigate to the details screen, the default styles are back. We'll look at how to share `options` between screens now.

## Sharing common `options` across screens

It is common to want to configure the header in a similar way across many screens. For example, your company brand color might be red and so you want the header background color to be red and the tint color to be white. Conveniently, these are the colors we're using in our running example, and you'll notice that when you navigate to the `DetailsScreen` the colors go back to the defaults. Wouldn't it be awful if we had to copy the `options` header style properties from `Home` to `Details`, and for every single screen we use in our app? Thankfully, we do not. We can instead move the configuration up to the native stack navigator under `screenOptions`:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const MyStack = createStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

<samp id="sharing-header-styles">sharing header styles</samp>

```js
function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

Now, any screen that belongs to this navigator will have our wonderful branded styles. Surely though, there must be a way to override these options if we need to?

## Replacing the title with a custom component

Sometimes you need more control than just changing the text and styles of your title -- for example, you may want to render an image in place of the title, or make the title into a button. In these cases you can completely override the component used for the title and provide your own.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('@expo/snack-static/react-native-logo.png')}
    />
  );
}

const MyStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerTitle: (props) => <LogoTitle {...props} />,
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

<samp id="custom-header-title-component">custom header title component</samp>

```js
function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('@expo/snack-static/react-native-logo.png')}
    />
  );
}

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
      />
    </Stack.Navigator>
  );
}
```

</TabItem>
</Tabs>

:::note

You might be wondering, why `headerTitle` when we provide a component and not `title`, like before? The reason is that `headerTitle` is a property that is specific to headers, whereas `title` will be used for tab bars, drawers etc. as well. The `headerTitle` defaults to a `Text` component that displays the `title`.

:::

## Additional configuration

You can read the full list of available `options` for screens inside of a native stack navigator in the [`createNativeStackNavigator` reference](native-stack-navigator.md#options).

## Summary

- You can customize the header inside of the `options` property of your screens. Read the full list of options [in the API reference](native-stack-navigator.md#options).
- The `options` property can be an object or a function. When it is a function, it is provided with an object with the `navigation` and `route` objects.
- You can also specify shared `screenOptions` in the stack navigator configuration when you initialize it. This will apply to all screens in the navigator.
