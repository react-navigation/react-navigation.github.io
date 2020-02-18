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

<a href="https://snack.expo.io/@react-navigation/setting-header-title-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

> `createStackNavigator` uses platform conventions by default, so on iOS the title will be centered and on Android it will be left-aligned.

## Using params in the title

In order to use params in the title, we need to make `navigationOptions` a function that returns a configuration object. It might be tempting to try to use `this.props` inside of `navigationOptions`, but because it is a static property of the component, `this` does not refer to an instance of the component and therefore no props are available. Instead, if we make `navigationOptions` a function then React Navigation will call it with an object containing `{ navigation, navigationOptions, screenProps }` -- in this case, all we care about is `navigation`, which is the same object that is passed to your screen props as `this.props.navigation`. You may recall that we can get the params from `navigation` through `navigation.getParam` or `navigation.state.params`, and so we do this below to extract a param and use it as a title.

```js
class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('otherParam', 'A Nested Details Screen'),
    };
  };

  /* render function, etc */
}
```
<a href="https://snack.expo.io/@react-navigation/using-params-in-title-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

The argument that is passed in to the `navigationOptions` function is an object with the following properties:

- `navigation` - The [navigation prop](navigation-prop.html) for the screen, with the screen's route at `navigation.state`.
- `screenProps` - The props passing from above the navigator component
- `navigationOptions` - The default or previous options that would be used if new values are not provided

We only needed the `navigation` prop in the above example but you may in some cases want to use `screenProps` or `navigationOptions`.

## Updating `navigationOptions` with `setParams`

It's often necessary to update the `navigationOptions` configuration for the active screen from the mounted screen component itself. We can do this using `this.props.navigation.setParams`

```js
  /* Inside of render() */
  <Button
    title="Update the title"
    onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
  />
```

<a href="https://snack.expo.io/@react-navigation/updating-navigationoptions-with-setparams-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

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
<a href="https://snack.expo.io/@react-navigation/setting-header-styles-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

There are a couple of things to notice here:
1. On iOS, the status bar text and icons are black, and this doesn't look great over a dark-colored background. We won't discuss it here, but you should be sure to configure the status bar to fit with your screen colors [as described in the status bar guide](status-bar.html).
2. The configuration we set only applies to the home screen; when we navigate to the details screen, the default styles are back. We'll look at how to share `navigationOptions` between screens now.

## Sharing common `navigationOptions` across screens

It is common to want to configure the header in a similar way across many screens. For example, your company brand color might be red and so you want the header background color to be red and tint color to be white. Conveniently, these are the colors we're using in our running example, and you'll notice that when you navigate to the `DetailsScreen` the colors go back to the defaults. Wouldn't it be awful if we had to copy the `navigationOptions` header style properties from `HomeScreen` to `DetailsScreen`, and for every single screen component we use in our app? Thankfully, we do not. We can instead move the configuration up to the stack navigator.

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    /* No more header config here! */
  };

  /* render function, etc */
}

/* other code... */

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
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
<a href="https://snack.expo.io/@react-navigation/sharing-header-styles-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

Now, any screen that belongs to the `RootStack` will have our wonderful branded styles. Surely though, there must be a way to override these options if we need to?

## Overriding shared `navigationOptions`

The `navigationOptions` specified on your screen component are merged together with those of its parent stack navigator, with the options on the screen component taking precedence. Let's use this knowledge to invert the background and tint colors on the details screen.


```js
class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.otherParam : 'A Nested Details Screen',
      /* These values are used instead of the shared configuration! */
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor,
      },
      headerTintColor: navigationOptions.headerStyle.backgroundColor,
    };
  };

  /* render function, etc */
}
```
<a href="https://snack.expo.io/@react-navigation/overriding-shared-header-styles-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

## Replacing the title with a custom component

Sometimes you need more control than just changing the text and styles of your title -- for example, you may want to render an image in place of the title, or make the title into a button. In these cases you can completely override the component used for the title and provide your own.

```js
class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require('./spiro.png')}
        style={{ width: 30, height: 30 }}
      />
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <LogoTitle />,
  };

  /* render function, etc */
}
```
<a href="https://snack.expo.io/@react-navigation/custom-header-title-component-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

> You might be wondering, why `headerTitle` when we provide a component and not `title`, like before? The reason is that `headerTitle` is a property that is specific to a stack navigator, the `headerTitle` defaults to a `Text` component that displays the `title`.

## Additional configuration

You can read the full list of available `navigationOptions` for screens inside of a stack navigator in the [`createStackNavigator` reference](stack-navigator.html#navigationoptions-used-by-stacknavigator).

## Summary

- You can customize the header inside of the `navigationOptions` static property on your screen components. Read the full list of options [in the API reference](stack-navigator.html#navigationoptions-used-by-stacknavigator).
- The `navigationOptions` static property can be an object or a function. When it is a function, it is provided with an object with the `navigation` prop, `screenProps`, and `navigationOptions` on it.
- You can also specify shared `navigationOptions` in the stack navigator configuration when you initialize it. The static property takes precedence over that configuration.
- [Full source of what we have built so far](https://snack.expo.io/@react-navigation/custom-header-title-component-v2).
