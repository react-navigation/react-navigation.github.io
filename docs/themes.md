---
id: themes
title: Themes
sidebar_label: Themes
---

Providing a light theme and a dark theme is a nice way to let your users adjust the appearance of your app depending on the time of day or their preference. It also signals that you are a hip app developer that keeps up with the trends of the day.

# Built-in themes

> Note: support for built-in themes requires react-navigation@>=3.12.0-alpha! There is not a stable release with support for this yet. Skip ahead to "Custom themes using React context" if you'd like to learn more about how you can use themes today on a stable release.

As operating systems add built-in support for light and dark modes, supporting dark mode is less about keeping hip to trends and more about conforming to the average user expectations for how apps should work. In order to provide support for light and dark mode in a way that is reasonably consistent with the OS defaults, these themes are built in to React Navigation. You can pass in a `theme` prop to your app container component in order to switch between light and dark mode, and the value of that `theme` prop can come from whichever API you use to detect user preferences for dark mode, or in the case of older operating system versions, from a custom configuration within your app UI.

```js
let Navigation = createAppContainer(RootStack);

// `theme` can be `light` or `dark`. It defaults to `light` if not specified.
export default () => <Navigation theme="light">;
```

This will take care of styling the stack navigator, bottom tab navigator, and drawer navigator for you. React Navigation also provides several tools to help you make your customizations of those navigators and the screens within the navigators support both themes too.

## Using the currently selected theme

Two tools are available to gain access to the theme in any component that descends from the app navigation container: `useTheme` and `ThemeConext`.

`useTheme` is a simple custom hook that returns the theme.

```js
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from 'react-navigation';

// Black background and white text in light theme, inverted on dark theme
function MyButton() {
  let theme = useTheme();

  return (
    <TouchableOpacity
      style={{ backgroundColor: theme === 'light' ? '#000' : '#fff' }}>
      <Text style={{ color: theme === 'light' ? '#fff' : '#000' }}>
        Button!
      </Text>
    </TouchableOpacity>
  );
}
```

`ThemeContext` lets you access the theme using the `ThemeContext.Consumer` pattern or with `static contextType`.

```js
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ThemeContext } from 'react-navigation';

function MyButton() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <TouchableOpacity
          style={{ backgroundColor: theme === 'light' ? '#000' : '#fff' }}>
          <Text style={{ color: theme === 'light' ? '#fff' : '#000' }}>Button!</Text>
        </TouchableOpacity>
      )}
    <ThemeContext.Consumer>
  );
}
```

```js
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ThemeContext } from 'react-navigation';

class MyButton extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <TouchableOpacity
        style={{ backgroundColor: theme === 'light' ? '#000' : '#fff' }}>
        <Text style={{ color: theme === 'light' ? '#fff' : '#000' }}>
          Button!
        </Text>
      </TouchableOpacity>
    );
  }
}
```

### Using default theme colors

There is a small but perhaps useful list of colors that are used to style navigators according to the theme. This list of colors is exported under `ThemeColors`. See the TypeScript definition for a full list of colors.

```js
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ThemeColors, useTheme } from 'react-navigation';

function MyButton() {
  let theme = useTheme();
  let colors = ThemeColors[theme];

  return (
    <TouchableOpacity style={{ backgroundColor: colors.bodyContent }}>
      <Text style={{ color: colors.label }}>Button!</Text>
    </TouchableOpacity>
  );
}
```

### Default themed components

Several components have defaults that are biased to a specific theme. `Text`, for example, defaults to black. `StatusBar` defaults to dark text. React Navigation provides themed alternatives to these.

```js
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Themed } from 'react-navigation';

function MyButton() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={{ backgroundColor: colors.bodyContent }}>
        <Themed.Text>Button!</Themed.Text>
      </TouchableOpacity>
      <Themed.StatusBar />
    </View>
  );
}
```

## Built-in themes inside `navigationOptions`

```jsx
import {
  ThemeColors,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation';

class HomeScreen extends React.Component {
  static navigationOptions = ({ theme }) => {
    return {
      title: 'Home',
      headerLeft: (
        <Button
          color={theme === 'dark' ? 'white' : 'blue'}
          title="Press me"
          onPress={() => alert('success!')}
        />
      ),
    };
  };

  render() {
    // etc...
  }
}
```

## Built-in themes inside static navigator configuration

Colors that are specified within the static configuration options for a navigator can now be specified as objects with `light` and `dark` keys:

```js
let Tabs = createBottomTabNavigator(
  {
    /* routes */
  },
  {
    tabBarOptions: {
      activeTintColor: {
        light: '#000',
        dark: '#fff',
      },
      inactiveTintColor: {
        light: 'rgba(0,0,0,0.2)',
        dark: 'rgba(255,255,255,0.2)',
      },
    },
  }
);
```

The old format still works too, but colors specified in the following way will not adapt to themes:

```js
let Tabs = createBottomTabNavigator(
  {
    /* routes */
  },
  {
    tabBarOptions: {
      activeTintColor: '#000',
      inactiveTintColor: 'rgba(0,0,0,0.2)',
    },
  }
);
```

# Custom themes using React context

You may want more control than what you're given with just the built-in themes. In this case, you can build your own themes entirely from scratch.

Building custom themes into an app with React Navigation is not too much different than a React app without it; the main differences are that you will need to use `screenProps` in order to update style properties controlled by `navigationOptions`, and when style properties are controlled in navigator configuration we'll need to take another approach. First we're going to recap how you would theme a React app without React Navigation, then we will dive deeper into these differences. Additionally, this guide assumes that you are already comfortable with React Navigation, in particular how to use and configure navigators.

React's context API allows you to share state from an ancenstor component to any of its descendents without explicitly passing the value through layers and layers of components ("prop drilling"). This is a useful tool in order to build themes because we can define the theme at the root of the app, and then access it from anywhere else and re-render every themed component whenever the theme changes. If you are not familiar with how to use context already, you might want to read the [React documentation](https://reactjs.org/docs/context.html) for it before continuing.

```jsx
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ThemeContext = React.createContext(null);
const ThemeConstants = {
  light: {
    backgroundColor: '#fff',
    fontColor: '#000',
  },
  dark: {
    backgroundColor: '#000',
    fontColor: '#fff',
  },
};

export default class AppContainer extends React.Component {
  state = {
    theme: 'light',
  };

  toggleTheme = () => {
    this.setState(({ theme }) => ({
      theme: theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}>
        <HomeScreen />
      </ThemeContext.Provider>
    );
  }
}

class HomeScreen extends React.Component {
  render() {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemeContext.Consumer>
          {({ toggleTheme }) => (
            <ThemedButton title="Toggle theme" onPress={toggleTheme} />
          )}
        </ThemeContext.Consumer>
      </ThemedView>
    );
  }
}

class ThemedButton extends React.Component {
  render() {
    let { title, ...props } = this.props;
    return (
      <TouchableOpacity {...props}>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <Text style={{ color: ThemeConstants[theme].fontColor }}>
              {title}
            </Text>
          )}
        </ThemeContext.Consumer>
      </TouchableOpacity>
    );
  }
}

class ThemedView extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <View
            {...this.props}
            style={[
              this.props.style,
              { backgroundColor: ThemeConstants[theme].backgroundColor },
            ]}
          />
        )}
      </ThemeContext.Consumer>
    );
  }
}
```

Okay, that's a lot of code. There isn't much going on here aside from passing the theme around through context and then pulling it out of context when we need it inside of themed component. Themed components like `ThemedView` and `ThemedButton` are useful to help you avoid constantly repeating theme context related boilerplate.

## Themes inside `navigationOptions`

A regrettable limitation of the current implementation of `navigationOptions` is that we are unable to access React context for use in properties such as `headerStyle` and `headerTintColor`. We can and should use them in properties that access React components, for example in `headerRight` we could provide a component like `ThemedHeaderButton`. To apply the theme to other properties we need to use `screenProps`.

```jsx
import { createAppContainer, createStackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = ThemeConstants[screenProps.theme];

    return {
      title: 'Home',
      headerTintColor: currentTheme.fontColor,
      headerStyle: { backgroundColor: currentTheme.backgroundColor },
    };
  };

  render() {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemeContext.Consumer>
          {({ toggleTheme }) => (
            <ThemedButton title="Toggle theme" onPress={toggleTheme} />
          )}
        </ThemeContext.Consumer>
      </ThemedView>
    );
  }
}

const Stack = createStackNavigator({ Home: HomeScreen });
const Navigation = createAppContainer(Stack);

export default class AppContainer extends React.Component {
  state = {
    theme: 'light',
  };

  toggleTheme = () => {
    this.setState(({ theme }) => ({
      theme: theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}>
        <Navigation screenProps={{ theme: this.state.theme }} />
      </ThemeContext.Provider>
    );
  }
}
```

Success! The stack header style now updates when the theme changes.

> Note: in the future we would like to deprecate `screenProps` and move entirely over to React context. For now, `screenProps` is the best way to do that, and when this changes it will be easy to migrate.

## Theming tabs and other similar navigators

Some navigators may have their styles configured in the navigator configuration object when they are initialized. While it may be best to update these navigators so that they can be configured more easily through `navigationOptions`, as long as they allow us to override the UI that they render with our own component and give us access to the default component, we can work with them just fine. We'll look at how to theme a bottom tab navigator.

```jsx
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  BottomTabBar,
  ThemeContext,
} from 'react-navigation';

const ThemeConstants = {
  light: {
    backgroundColor: '#fff',
    fontColor: '#000',
    activeTintColor: 'blue',
    inactiveTintColor: '#ccc',
  },
  dark: {
    backgroundColor: '#000',
    fontColor: '#fff',
    activeTintColor: '#fff',
    inactiveTintColor: '#888',
  },
};

// Notice how we override the `activeTintColor`, `inactiveTintColor` and
// `backgroundColor` of the tab bar with our theme styles.
class ThemedBottomTabBar extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <BottomTabBar
            {...this.props}
            activeTintColor={ThemeConstants[theme].activeTintColor}
            inactiveTintColor={ThemeConstants[theme].inactiveTintColor}
            style={{
              backgroundColor: ThemeConstants[theme].backgroundColor,
            }}
          />
        )}
      </ThemeContext.Consumer>
    );
  }
}

const Stack = createStackNavigator({ Home: HomeScreen });
const Tabs = createBottomTabNavigator(
  { Stack },
  { tabBarComponent: ThemedBottomTabBar }
);
const Navigation = createAppContainer(Tabs);

// And the rest of the code goes here...
```

You will likely want to go a bit further than we detailed in this guide, such as change the status bar color depending on the theme and customize the border color for the header and tab bar as well. You can see all of the above code plus some more changes to make it more complete in [this Snack](https://snack.expo.io/@react-navigation/themes-example).

I never said it was easy, but this about covers what you need to know to theme an app that uses React Navigation. Good luck, remember me you're a billionaire.
