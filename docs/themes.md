---
id: themes
title: Themes
sidebar_label: Themes
---

Providing a light theme and a dark theme is a nice way to let your users adjust the appearance of your app depending on the time of day or their preference. It also signals that you are a hip app developer that keeps up with the trends of the day.

Building themes into an app with React Navigation is not too much different than a React app without it; the main differences are that you will need to use `screenProps` in order to update style properties controlled by `navigationOptions`, and when style properties are controlled in navigator configuration we'll need to take another approach. First we're going to recap how you would theme a React app without React Navigation, then we will dive deeper into these differences. Additionally, this guide assumes that you are already comfortable with React Navigation, in particular how to use and configure navigators.

## Using React context to theme components

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
        {({ theme }) => (
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
