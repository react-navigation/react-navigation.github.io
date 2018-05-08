---
id: navigation-options-resolution
title: Navigation options resolution
sidebar_label: Navigation options resolution
---

Each screen can configure various aspects about how it gets presented in the navigator that renders it. In the [Configuring the header bar](headers.html) section of the fundamentals documentation we explain the basics of how this works.

In this document we'll explain how this works when there are multiple navigators. It's important to understand this so that you put your `navigationOptions` in the correct place and can properly configure your navigators. If you put them in the wrong place, at best nothing will happen and at worst something confusing and unexpected will happen. Thankfully, the logic for this could not be any easier to understand:

**You can only modify navigation options for a navigator from one of its screen components. This applies equally to navigators that are nested as screens.**

Let's take for example a tab navigator that contains a stack in each tab. What happens if we set the `navigationOptions` on a screen inside of the stack?

```js
class A extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home!',
  };

  // etc..
}

class B extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Settings!',
  };

  // etc..
}

let HomeStack = createStackNavigator({ A });
let SettingsStack = createStackNavigator({ B });

export default createBottomTabNavigator({
  HomeStack,
  SettingsStack,
});
```

<a href="https://snack.expo.io/@notbrent/nested-navigationoptions-wrong" target="blank" class="run-code-button">&rarr; Run this code</a>

As we mentioned earlier, you can only modify navigation options for a navigator from one of its screen components. `A` and `B` above are screen components in `HomeStack` and `SettingsStack` respectively, not in the tab navigator. So the result will be that the `tabBarLabel` property is not applied to the tab navigator. We can fix this though!

```js
let HomeStack = createStackNavigator({ A });
let SettingsStack = createStackNavigator({ B });

HomeStack.navigationOptions = {
  tabBarLabel: 'Home!',
};

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings!',
};

export default createBottomTabNavigator({
  HomeStack,
  SettingsStack,
});
```

<a href="https://snack.expo.io/@notbrent/nested-navigationoptions-correct" target="blank" class="run-code-button">&rarr; Run this code</a>

To understand what is going on here, first recall that in the following example, `MyComponent` and `MyOtherComponent` are identical:

```js
class MyComponent extends React.Component {
  static navigationOptions = {
    title: 'Hello!',
  };
  // etc.
}

class MyOtherComponent extends React.Component {
  // etc.
}

MyOtherComponent.navigationOptions = {
  title: 'Hello!',
};
```

We also know that `createStackNavigator` and related functions return React components. So when we set the `navigationOptions` directly on the `HomeStack` and `SettingsStack` component, it allows us to control the `navigationOptions` for its parent navigator when its used as a screen component. In this case, the `navigationOptions` on our stack components configure the label in the tab navigator that renders the stacks.

## **Caution**: navigationOption property isn't the same as the one in navigatorConfig

Navigators are initialized with `createXNavigator(routeConfig, navigatorConfig)`. Inside of `navigatorConfig` we can add `navigationOptions` as well. These `navigationOptions` are the default options for screens within that navigator. [Read more about sharing common navigationOptions](headers.html#sharing-common-navigationoptions-across-screens).

```js
const HomeStack = createStackNavigator({ A }, {
  // This is the default for screens in the stack, so `A` will
  // use this title unless it overrides it
  navigationOptions: {
    title: 'Welcome"
  }
})

// These are the options that are used by the navigator that renders
// the HomeStack, in our example above this is a tab navigator.
HomeStack.navigationOptions = {
  tabBarLabel: 'Home!',
};
```

We understand that overloading the naming here is a little bit confusing. Please [open a RFC](https://github.com/react-navigation/rfcs) if you have a suggestion about how we can make this API easier to learn and work with.