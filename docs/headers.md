---
id: headers
title: Configuring the header bar
sidebar_label: Configuring the header bar
---

By now you're probably tired of seeing a blank grey bar on the top of your screen &mdash; you're ready for some [flair](https://memegenerator.net/img/images/600x600/14303485/stan-flair-office-space.jpg). So let's jump in to configuring the header bar.

## Setting the header title

A screen component can have a static property called `navigationOptions` which is either an object or a function that returns an object that contains various configuration options. The one we use for the header title is `title`, as demonstrated in the following example.

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  /* render function, etc */
}

class DetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  };

  /* render function, etc */
}
```

<a href="https://snack.expo.io/@react-navigation/setting-header-title" target="blank" class="run-code-button">&rarr; Run this code</a>

## Using params in the title

In order to use params in the title, we need to make `navigationOptions` a function that returns a configuration object. It might be tempting to try to use `this.props` inside of `navigationOptions`, but because it is a static property of the component, `this` does not refer to an instance of the component and therefore no props are available. Instead, if we make `navigationOptions` a function then React Navigation will call it with an object containing `{ navigation, navigationOptions, screenProps }` -- in this case, all we care about is `navigation`, which is the same object that is passed to your screen props as `this.props.navigation`. You may recall that we can get the params from `navigation` through `navigation.state.params`, and so we do this below to extract a param and use it as a title.

```js
class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    
    return {
      title: params ? params.otherParam : 'A Nested Details Screen',
    }
  };

  /* render function, etc */
}
```

<a href="https://snack.expo.io/@react-navigation/using-params-in-title" target="blank" class="run-code-button">&rarr; Run this code</a>

## Updating `navigationOptions` with `setParams`

It's often necessary to update the `navigationOptions` configuration for the active screen from the mounted screen component itself. We can do this using `this.props.navigation.setParams`

```js
  /* Inside of render() */
  <Button
    title="Update the title"
    onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
  />
```

<a href="https://snack.expo.io/@react-navigation/updating-navigationoptions-with-setparams" target="blank" class="run-code-button">&rarr; Run this code</a>

## Adjusting header styles

There are three key properties to use when customizing the style of your header: `headerStyle`, `headerTintColor`, and `headerTitleStyle`.

- `headerStyle`: a style object that will be applied to the `View` that wraps the header. If you set `backgroundColor` on it, that will be the color of your header.
- `headerTintColor`: the back button and title both use this property as their color. In the example below, we set the tint color to white (`#fff`) so the back button and the header title would be white.
- `headerTitleStyle`: if we want to customize the `fontFamily`, `fontWeight` and other `Text` style properties for the title, we can use this to do it.

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  /* render function, etc */
}
```
<a href="https://snack.expo.io/@react-navigation/setting-header-styles" target="blank" class="run-code-button">&rarr; Run this code</a>

There are a couple of things to notice here:
1. On iOS the status bar is black, and this doesn't look great over a dark colored background. We won't discuss it here, but you should be sure to configure the status bar to fit with your screen colors [as described in the status bar guide](status-bar.html).
2. The configuration we set only applies to the home screen; when we navigate to the details screen, the default styles are back. We'll look at how to share `navigationOptions` between screens now.

## Sharing common `navigationOptions` across screens

It is common to want to configure the header in a similar way across many screen. For example, your company brand color might be red and so you want the header background color to be red and tint color to be white. Conveniently, these are the colors we're using our running example, and you'll notice that when you navigate to the `DetailsScreen` the colors go back to the defaults. Wouldn't it be awful if we had to copy the `navigationOptions` header style properties from `HomeScreen` to `DetailsScreen`, and for every single screen component we use in our app? Thankfully, we do not. We can instead move the configuration up to the `StackNavigator`.

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    /* No more header config here! */
  };

  /* render function, etc */
}

/* other code... */

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);
```
<a href="https://snack.expo.io/@react-navigation/sharing-header-styles" target="blank" class="run-code-button">&rarr; Run this code</a>

Now, any screen that belongs to the `RouteStack` will have our wonderful branded styles. Surely though, there must be a way to override these options if we need to?

## Overriding shared `navigationOptions`

The `navigationOptions` specified on your screen component are merged together with those of its parent `StackNavigator`, with the options on the screen component taking precedence. Let's use this knowledge to invert the background and tint colors on the details screen.


```js
class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.otherParam : 'A Nested Details Screen',
      /* These values are used instead of the shared configuration! */
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#f4511e',
    };
  };

  /* render function, etc */
}
```
<a href="https://snack.expo.io/@react-navigation/overriding-shared-header-styles" target="blank" class="run-code-button">&rarr; Run this code</a>

## Using a different component for the title

Next, the header title can be configured to use the screen param:

```js
class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Chat with ${navigation.state.params.user}`,
  });
  ...
}
```


## Additional configuration

You can read the full list of available screen `navigationOptions` for screens inside of `StackNavigator` in the [StackNavigator reference](stack-navigator.html#screen-navigation-options).

<!-- Each screen can configure various aspects about how it gets presented in parent navigators. You can configure 

**Static configuration:** Each navigation option can either be directly assigned:

```js
class MyScreen extends React.Component {
  static navigationOptions = {
    title: 'Great',
  };
  ...
```

**Dynamic Configuration**

Or, the options can be a function that takes the following arguments, and returns an object of navigation options that will override the route-defined and navigator-defined navigationOptions.

- `props` - The same props that are available to the screen component
  - `navigation` - The [navigation prop](/docs/navigators/navigation-prop) for the screen, with the screen's route at `navigation.state`
  - `screenProps` - The props passing from above the navigator component
  - `navigationOptions` - The default or previous options that would be used if new values are not provided

```js
class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.name + "'s Profile!",
    headerRight: <Button color={screenProps.tintColor} {...} />,
  });
  ...
```

The screenProps are passed in at render-time. If this screen was hosted in a SimpleApp navigator:

```js
<SimpleApp
  screenProps={{tintColor: 'blue'}}
  // navigation={{state, dispatch}} // optionally control the app
/>
```

## Generic Navigation Options

The `title` navigation option is generic between every navigator. It is used to set the title string for a given screen.

```js
class MyScreen extends React.Component {
  static navigationOptions = {
    title: 'Great',
  };
  ...
```

Unlike the other nav options which are only utilized by the navigator view, the title option can be used by the environment to update the title in the browser window or app switcher.

## Default Navigation Options

It's very common to define `navigationOptions` on a screen, but sometimes it is useful to define `navigationOptions` on a navigator too.

Imagine the following scenario:
Your `TabNavigator` represents one of the screens in the app, and is nested within a top-level `StackNavigator`:

```
StackNavigator({
  route1: { screen: RouteOne },
  route2: { screen: MyTabNavigator },
});
```

Now, when `route2` is active, you would like to change the tint color of a header. It's easy to do it for `route1`, and it should also be easy to do it for `route2`. This is what Default Navigation Options are for - they are simply `navigationOptions` set on a navigator:

```js
const MyTabNavigator = TabNavigator({
  profile: ProfileScreen,
  ...
}, {
  navigationOptions: {
    headerTintColor: 'blue',
  },
});
```

Note that you can still decide to **also** specify the `navigationOptions` on the screens at the leaf level - e.g.  the `ProfileScreen` above. The `navigationOptions` from the screen will be merged key-by-key with the default options coming from the navigator. Whenever both the navigator and screen define the same option (e.g. `headerTintColor`), the screen wins. Therefore, you could change the tint color when `ProfileScreen` is active by doing the following:

```js
class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerTintColor: 'black',
  };
  ...
}
```

## Navigation Option Reference

List of available navigation options depends on the `navigator` the screen is added to.

Check available options for:
- [`drawer navigator`](/docs/navigators/drawer#Screen-Navigation-Options)
- [`stack navigator`](/docs/navigators/stack#Screen-Navigation-Options)
- [`tab navigator`](/docs/navigators/tab#Screen-Navigation-Options) -->
