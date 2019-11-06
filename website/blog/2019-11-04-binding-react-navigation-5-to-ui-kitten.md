---
title: Binding React Navigation 5 to UI Kitten
author: Artur Yorsh
authorURL: https://twitter.com/artyorsh
---

The complete step-by-step guide on using new React Navigation API.

## Introduction
 
The new React Navigation comes with several significant improvements such as [improving animation performance](https://blog.expo.io/re-writing-react-navigation-stack-db6a376522b1) with [gesture-handler](https://github.com/kmagiera/react-native-gesture-handler) and [reanimated](https://github.com/kmagiera/react-native-reanimated) libraries. What's more, it was migrated to TypeScript for improving the quality of your code base with type checking and more. But the biggest update is migrating to component-based API.

[Eva Design System](https://eva.design) is a customizable Design System that is easy to adapt to your brand. It provides Mobile and Web component libraries and allows businesses to quickly create beautiful unique branding themes. The React Native realization of Eva Design System includes [UI Kitten](http://akveo.github.io/react-native-ui-kitten), React Native framework for building modern cross-platform mobile applications.

The UI Kitten team started actively using React Navigation alpha and we're proud to announce the full compatibility to the new React Navigation API. In this guide, we won't consider how to implement all of the boilerplate stuff like auth screens. Instead, we will learn how to navigate between screens using Drawer, Bottom Tabs, Top Tabs, and Stack navigators to build a TODO-App. Furthermore, we'll demonstrate binding React Navigation to UI Kitten components.

<img src="assets/binding-react-navigation-5-to-ui-kitten/overview.gif" height="480"/>

## Overview

React Navigation 5 is nothing else rather than simplifying navigation structure in your app.

```js
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const AuthNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Sign In' component={SignInScreen}/>
    <Stack.Screen name='Sign Up' component={SignUpScreen}/>
  </Stack.Navigator>
);
```

The syntax is simple. You just import `createXNavigator` from the navigator package of your choice and use `Navigator` and `Screen` components from the value returned by this function.

Unlike the previous React Navigation versions, all the screens used inside a navigator are passed as child elements with wrapping it to a `Screen` component. If you need to set up additional navigator configuration like configuration of the header, you can simply pass corresponding props directly to the `Navigator` component.

## Getting started

Clone the project from GitHub. It contains all the required source code for the initial setup.

```bash
git clone https://github.com/artyorsh/react-navigation-ex-demo
```

### Step 1. Authentication flow

Assuming that your app users will need to authorize before getting to the home screen, we will need to create both Authentication and Home navigators. Then we're going to combine it with simple stack navigation and pick the initial screen depending on the user authorization status.

Open [./src/navigation/auth.navigator.tsx`](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/auth.navigator.tsx) file and paste the following code:


```js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignInScreen, SignUpScreen, ResetPasswordScreen } from '@app-scenes/auth';
import { AppRoute } from './app-routes';

const Stack = createStackNavigator();

export const AuthNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.SIGN_IN} component={SignInScreen}/>
    <Stack.Screen name={AppRoute.SIGN_UP} component={SignUpScreen}/>
    <Stack.Screen name={AppRoute.RESET_PASSWORD} component={ResetPasswordScreen}/>
  </Stack.Navigator>
);
```

In this example, we're using a `createStackNavigator` function to create simple stack navigation between Sign In, Sign Up and Reset Password screens. Under `Stack Navigator` we mean the default navigation behavior between screens: with slide-from-right animation on iOS, and slide-in-top on Android.

In app.navigator.tsx file and replace the placeholder screen with Auth Navigator. This will make authentication screens to be the starter point of your app.

```js
import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './auth.navigator';
import { AppRoute } from './app-routes';

const Stack = createStackNavigator();

export const AppNavigator = (config): React.ReactElement => (
  <NavigationNativeContainer>
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name={AppRoute.AUTH} component={AuthNavigator}/>
    </Stack.Navigator>
  </NavigationNativeContainer>
);
```

<img src="assets/binding-react-navigation-5-to-ui-kitten/stack-navigator.gif" height="420" />

### Step 2. Top tabs

Say, our app has both in-progress and finished tasks. So, you should separate them to avoid a mess. Here you can make it with two tabs on the home screen. To do this, we need to have three screens: two for tabs and one master screen for navigation management between tabs. Unlike the Stack Navigator component, the Top Tabs `Navigator` has a special prop for the component to control navigation between tabs - `tabBar`. We will use it to configure the tab bar with UI Kitten components.

Open [./src/navigation/todo.navigator.tsx`](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/todo.navigator.tsx) file and paste the following code:

```js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TodoScreen, TodoInProgressScreen, TodoDoneScreen } from '@app-scenes/todo';
import { AppRoute } from './app-routes';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export const TodoNavigator = (): React.ReactElement => (
  <TopTab.Navigator tabBar={TodoScreen}>
    <TopTab.Screen name={AppRoute.TODO_IN_PROGRESS} component={TodoInProgressScreen}/>
    <TopTab.Screen name={AppRoute.TODO_DONE} component={TodoDoneScreen}/>
  </TopTab.Navigator>
);
```

The code above will enable you to navigate with gestures between `In Progress` screen and `Done` screen, but not set up the Tab Bar. Open [./src/scenes/todo/todo.component.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/scenes/todo/todo.component.tsx) file and paste the following code:

```js
import React from 'react';
import { TabBar, Tab, Divider } from 'react-native-ui-kitten';
import { SafeAreaLayout, SaveAreaInset, SafeAreaLayoutElement } from '@app-components/safe-area-layout.component';
import { Toolbar } from '@app-components/toolbar.component';
import { DoneAllIcon, GridIcon } from '@app-assets/icons';

export const TodoScreen = (props): SafeAreaLayoutElement => {

  const onTabSelect = (index: number): void => {
    const { [index]: selectedTabRoute } = props.state.routeNames;
    props.navigation.navigate(selectedTabRoute);
  };

  return (
    <SafeAreaLayout insets={SaveAreaInset.TOP}>
      <Toolbar title='React Navigation Ex 🐱'/>
      <TabBar selectedIndex={props.state.index} onSelect={onTabSelect}>
        <Tab icon={GridIcon} title='IN PROGRESS'/>
        <Tab icon={DoneAllIcon} title='DONE'/>
      </TabBar>
      <Divider/>
    </SafeAreaLayout>
  );
};
```

With the code above we render `TabBar` component with two tabs inside: one per each screen inside `TodoNavigator`. Then, we use the React Navigation state to pass `selectedIndex` and `onSelect` props to navigate between screens. So, when the user taps one of the tabs, the `TabBar` component calls `onTabSelect` function and this is the place where we need to navigate to the corresponding route.

Finally, open [app.navigator.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/app.navigator.tsx) file and add the `TodoNavigator as a Home screen. Now you're able to navigate the home screen with todo tabs after sign in.

```js
import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './auth.navigator';
import { TodoNavigator } from './todo.navigator';
import { AppRoute } from './app-routes';

const Stack = createStackNavigator();

export const AppNavigator = (config): React.ReactElement => (
  <NavigationNativeContainer>
    <Stack.Navigator {...config} headerMode='none'>
      <Stack.Screen name={AppRoute.AUTH} component={AuthNavigator}/>
      <Stack.Screen name={AppRoute.HOME} component={TodoNavigator}/>
    </Stack.Navigator>
  </NavigationNativeContainer>
);
```

<img src="assets/binding-react-navigation-5-to-ui-kitten/material-top-tab-navigator.gif" height="480" />

### Step 3. Bottom tabs

Sometimes you may want your app to contain tabs at the bottom. Here is the main semantic difference regarding the tabs at the top: while they should represent the content of the same type, the bottom tabs could be used to show any content of your application. This is where we're going to use `createBottomTabNavigator` and `BottomNavigation`.

Let's start by creating another navigator for the second tab. The first one will be used for Todo screens. Open [./src/navigation/profile.navigator.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/profile.navigator.tsx) file and paste the following code: 

```js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '@app-scenes/profile';
import { AppRoute } from './app-routes';

const Stack = createStackNavigator();

export const ProfileNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name={AppRoute.PROFILE} component={ProfileScreen}/>
  </Stack.Navigator>
);
```

This will add a simple stack navigator, just like we did it for authentication flow.

Now we need to somehow connect `TodoNavigator` with `ProfileNavigator` . The implementation is as simple as creating a navigator for top tabs. Thanks to React Navigation, we have totally the same API for this. Open [./src/navigation/home.navigator.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/home.navigator.tsx) file and paste the following code:

```js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomHomeScreen } from '@app-scenes/home';
import { TodoNavigator } from './todo.navigator';
import { ProfileNavigator } from './profile.navigator';
import { AppRoute } from './app-routes';

const BottomTab = createBottomTabNavigator();

export const HomeNavigator = (): React.ReactElement => (
  <BottomTab.Navigator tabBar={BottomHomeScreen}>
    <BottomTab.Screen name={AppRoute.TODO} component={TodoNavigator}/>
    <BottomTab.Screen name={AppRoute.PROFILE} component={ProfileNavigator}/>
  </BottomTab.Navigator>
);
```

Just like in the case with tabs at the top, we also need to make a custom `tabBar`. Open [./src/scenes/home/bottom-home.component.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/bottom-home.component.tsx) file and paste the following code:

```js
import React from 'react';
import { BottomNavigation, BottomNavigationTab, Divider } from 'react-native-ui-kitten';
import { SafeAreaLayout, SafeAreaLayoutElement, SaveAreaInset } from '@app-components/safe-area-layout.component';
import { LayoutIcon, PersonIcon } from '@app-assets/icons';

export const BottomHomeScreen = (props): SafeAreaLayoutElement => {

  const onSelect = (index: number): void => {
    const { [index]: selectedRoute } = props.state.routeNames;
    props.navigation.navigate(selectedRoute);
  };

  return (
    <SafeAreaLayout insets={SaveAreaInset.BOTTOM}>
      <Divider/>
      <BottomNavigation
        appearance='noIndicator'
        selectedIndex={props.state.index}
        onSelect={onSelect}>
        <BottomNavigationTab icon={LayoutIcon} title='TODO'/>
        <BottomNavigationTab icon={PersonIcon} title='PROFILE'/>
      </BottomNavigation>
    </SafeAreaLayout>
  );
};
```

Using the code above we render `BottomNavigation` component with two tabs inside: one per each screen inside `HomeNavigator`. We use the React Navigation state to pass `selectedIndex` and `onSelect` props to navigate between screens. So, when the user taps one of the tabs, the `BottomNavigation` component calls `onSelect` function. Well, this is the place where we need to navigate to the corresponding route.

Then, open [app.navigator.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/app.navigator.tsx) file and replace the `TodoNavigator` with `HomeNavigator`:

```js
import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './auth.navigator';
import { HomeNavigator } from './home.navigator';
import { AppRoute } from './app-routes';

const Stack = createStackNavigator();

export const AppNavigator = (config): React.ReactElement => (
  <NavigationNativeContainer>
    <Stack.Navigator {...config} headerMode='none'>
      <Stack.Screen name={AppRoute.AUTH} component={AuthNavigator}/>
      <Stack.Screen name={AppRoute.HOME} component={HomeNavigator}/>
    </Stack.Navigator>
  </NavigationNativeContainer>
);
```

<img src="assets/binding-react-navigation-5-to-ui-kitten/bottom-tab-navigator.gif" height="480" />

### Step 4. Drawer menu

At the final stage of this guide, we will describe how to create the drawer navigation. While the top and bottom tabs can be used to present the main product features, a drawer menu can be also used to direct a user to legal information about it, or simply contain quick actions like a logout.

Usually, the drawer menu is available in app on the home screen, so let's add it to `HomeNavigator`. Open [./src/scenes/home/home.component.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/scenes/home/home.component.tsx) file and paste the following code:

```js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomHomeScreen, DrawerHomeScreen, AboutScreen } from '@app-scenes/home';
import { TodoNavigator } from './todo.navigator';
import { ProfileNavigator } from './profile.navigator';
import { AppRoute } from './app-routes';

const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();

const HomeBottomNavigator = (): React.ReactElement => (
  <BottomTab.Navigator tabBar={BottomHomeScreen}>
    <BottomTab.Screen name={AppRoute.TODO} component={TodoNavigator}/>
    <BottomTab.Screen name={AppRoute.PROFILE} component={ProfileNavigator}/>
  </BottomTab.Navigator>
);

export const HomeNavigator = (): React.ReactElement => (
  <Drawer.Navigator drawerContent={DrawerHomeScreen}>
    <Drawer.Screen name={AppRoute.HOME} component={HomeBottomNavigator}/>
    <Drawer.Screen name={AppRoute.ABOUT} component={AboutScreen}/>
  </Drawer.Navigator>
);
```

In this example, we've implemented a Drawer Navigator with `createDrawerNavigator` and used it to display on the Home screen. We have also added `AboutScreen` to demonstrate navigation directly from the Drawer menu.

Just like Top/Bottom tab navigators, the drawer navigator also has a special property for declaring custom drawer view. Use a `drawerContent` property to pass the custom view to the navigator. Open [./src/scenes/home/drawer-home.component.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/scenes/home/drawer-home.component.tsx) file and add the following code:

```js
import React from 'react';
import { Drawer, DrawerElement, MenuItemType } from 'react-native-ui-kitten';
import { InfoIcon, LogoutIcon } from '@app-assets/icons';
import { AppRoute } from '@app-navigation/app-routes';
import { SafeAreaLayout, SaveAreaInset} from '@app-components/safe-area-layout.component';

const drawerData: MenuItemType[] = [
  { icon: InfoIcon, title: 'About' },
  { icon: LogoutIcon, title: 'Log Out' },
];

export const DrawerHomeScreen = (props): DrawerElement => {

  const onMenuItemSelect = (index: number): void => {
    const { [index]: selectedItem } = drawerData;

    switch (selectedItem.title) {
      case 'Log Out':
        props.navigation.navigate(AppRoute.AUTH);
        break;
      default:
        props.navigation.navigate(selectedItem.title);
        break;
    }

    props.navigation.closeDrawer();
  };

  return (
    <SafeAreaLayout insets={SaveAreaInset.TOP}>
      <Drawer data={drawerData} onSelect={onMenuItemSelect} />
    </SafeAreaLayout>
  );
};
```

Due to the use of this code, we render `Drawer` component with two actions inside: one for navigating to legal information screen and one for performing a user logout. Then, we pass `data` prop to display our actions and `onSelect` prop to handle it. So, when the user taps the action, the `Drawer` component calls `onMenuItemSelect function and this is the place where we need to handle it.`

The next thing to do is to modify the Todo screen by adding a menu icon to open a drawer:

```js
import React from 'react';
import { TabBar, Tab, Divider } from 'react-native-ui-kitten';
import { SafeAreaLayout, SaveAreaInset, SafeAreaLayoutElement } from '@app-components/safe-area-layout.component';
import { Toolbar } from '@app-components/toolbar.component';
import { DoneAllIcon, GridIcon, MenuIcon } from '@app-assets/icons';

export const TodoScreen = (props): SafeAreaLayoutElement => {

  const onTabSelect = (index: number): void => {
    const { [index]: selectedTabRoute } = props.state.routeNames;
    props.navigation.navigate(selectedTabRoute);
  };

  return (
    <SafeAreaLayout insets={SaveAreaInset.TOP}>
      <Toolbar
        title='React Navigation Ex 🐱'
        backIcon={MenuIcon}
        onBackPress={props.navigation.toggleDrawer}
      />
      <TabBar selectedIndex={props.state.index} onSelect={onTabSelect}>
        <Tab icon={GridIcon} title='IN PROGRESS'/>
        <Tab icon={DoneAllIcon} title='DONE'/>
      </TabBar>
      <Divider/>
    </SafeAreaLayout>
  );
};
```

<img src="assets/binding-react-navigation-5-to-ui-kitten/drawer-navigator.gif" height="420" />

### TypeScript

The new React Navigation has great TypeScript support and exports type definitions for navigators and custom navigation components. Sometimes you may want to type-check the params you're passing when navigating between routes. You also may want to make autocomplete work when working with navigation props. 

Let's add some type definitions for Auth screens. For this purpose, open [./src/navigation/auth.navigator.tsx](https://github.com/artyorsh/react-navigation-ex-demo/blob/complete-exmaples/src/navigation/auth.navigator.tsx) and paste the following code:

```js
import { ParamListBase, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppRoute } from './app-routes';

interface AuthNavigatorParams extends ParamListBase {
  [AppRoute.SIGN_IN]: undefined;
  [AppRoute.SIGN_UP]: undefined;
  [AppRoute.RESET_PASSWORD]: undefined;
}

export interface SignInScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_IN>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_IN>;
}

export interface SignUpScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
  route: RouteProp<AuthNavigatorParams, AppRoute.SIGN_UP>;
}

export interface ResetPasswordScreenProps {
  navigation: StackNavigationProp<AuthNavigatorParams, AppRoute.RESET_PASSWORD>;
  route: RouteProp<AuthNavigatorParams, AppRoute.RESET_PASSWORD>;
}
```

Now you can modify props of Auth screens props by adding types to make your autocomplete and IntelliSense work. For more complex examples, consider reading [type-checking](https://reactnavigation.org/docs/en/next/typescript.html) doc or reviewing [complete demo application sources](https://github.com/artyorsh/react-navigation-ex-demo/tree/complete-exmaples).

<img src="assets/binding-react-navigation-5-to-ui-kitten/typescript.gif" />

### Useful links

By the links below, you can find a lot of useful information about UI Kitten and React Navigation 5. The demo application may contain more complex examples. Also, by referring to the app built by the React Navigation team, you can find plenty of useful examples too.

- [Demo App by UI Kitten team](https://github.com/artyorsh/react-navigation-ex-demo/tree/complete-exmaples)
- [Demo App by React Navigation team](https://github.com/react-navigation/navigation-ex/tree/master/packages/example)
- [React Navigation 5 Highlights](https://blog.expo.io/announcing-react-navigation-5-0-bd9e5d45569e)
- [UI Kitten Documentation](https://akveo.github.io/react-native-ui-kitten/)
