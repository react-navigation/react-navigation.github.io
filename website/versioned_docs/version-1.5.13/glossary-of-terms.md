---
id: version-1.5.13-glossary-of-terms
title: Glossary of terms
sidebar_label: Glossary of terms
original_id: glossary-of-terms
---

> This is a new section of the documentation and it's missing a lot of terms! Please [submit a pull request or an issue](https://github.com/react-navigation/website) with a term that you think should be explained here.

## Header

Also known as navigation header, navigation bar, navbar, and probably many other things. This is the rectangle at the top of your screen that contains the back button and the title for your screen. The entire rectangle is often referred to as the header in React Navigation.

## Screen component

A screen component is a component that we use in our route configuration.

```js
const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,    // <----
    },
    Details: {
      screen: DetailsScreen, // <----
    },
  },
  {
    initialRouteName: 'Home',
  }
);
```

The suffix `Screen` in the component name is entirely optional, but a frequently used convention; we could call it `CasaPantalla` and this would work just the same. 

We saw earlier that our screen components are provided with the `navigator` prop. It's important to note that *this only happens if the screen is rendered as a route by React Navigation* (for example, in response to `this.props.navigation.navigate`). For example, if we render `DetailsScreen` as a child of `HomeScreen`, then `DetailsScreen` won't be provided with the `navigation` prop, and when you press the "Go to Details... again" button on the Home screen, the app will throw one of the quintessential JavaScript exceptions "undefined is not an object".

```js
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <DetailsScreen />
      </View>
    );
  }
}
```
<a href="https://snack.expo.io/@react-navigation/screen-components" target="blank" class="run-code-button">&rarr; Run this code</a>

The ["Navigation prop reference"](navigation-prop.html) section goes into more detail on this, describes workarounds, and provides more information on other properties available on `this.props.navigation`.