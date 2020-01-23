---
title: Using React Navigation v5 with React Native Paper
author: Dawid Urbaniak
authorURL: https://twitter.com/trensik
---

This is a guest post by the [React Native Paper](https://reactnativepaper.com/) team. If you like this guide, checkout React Native Paper for more!
In this blog post, we'll show you how to build a real world app using React Navigation v5 with Paper.

## Introduction

React Navigation v5 is a breakthrough navigation. It not only provides a cross-platform native Stack, but also the API was redesigned from the ground up to allow things that were never possible before. Thanks to the component based API, all of the configuration is happening inside the **render method**. This means, we can access **props**, **state** and **context** and can **dynamically change configuration** for the navigator.

React Native Paper is a UI component library that implements [MD Guidelines](https://material.io/design/).
It allows building beautiful interfaces on Mobile and Web with high quality cross-platform components.
Furthermore, Paper provides you with a full **theming support**, **accessibility**, **RTL** and it will take care of **platform adaptation**. This means you can focus on building apps with ready to use components instead of reimplementing the boring stuff.

In this guide, we would like to show you how to integrate React Navigation with Paper's components. To show all the details of the integration we've decided to build a clone of Twitter. Of course the functionalities will be very limited but the navigation part and main screens should look and feel similiar.

In the following gif, you can see what is the final version of the app gonna look like:

// TODO: record the app

## Overview of the App

Since original Twitter is a very complex app, we will build only a part of it. This means we will implement:

- Bottom navigation with 3 tabs: Feed, Notifications and Messages
- Drawer
- Screen that shows details of a Tweet

I won't show you how to build all of the components necessary to create such app, because that's not a point of this guide. You can always check the implementation in the [github repo](https://github.com/Trancever/twitterClone).

We will focus mostly on integrating React navigation with Paper's components such as **_BottomNavigation_**, **_Appbar_**, **_Drawer_**, **_FAB_** and **_Portal_**.

Let's get started!

## Getting started

I assume you already have an [Expo](https://expo.io/) project running locally. If not, make sure to create one. I choosed Expo over plain React-Native, because it includs most of the dependencies that we need so there is less work to do for us.

Let's install React-Native-Paper, React-Navigation v5 and other required dependencies.

```bash
yarn add @react-navigation/native@next @react-navigation/stack@next @react-native-community/masked-view @react-navigation/drawer@next @react-navigation/material-bottom-tabs@next react-native-paper
```

Or with npm

```bash
npm install @react-navigation/native@next @react-navigation/stack@next @react-native-community/masked-view @react-navigation/drawer@next @react-navigation/material-bottom-tabs@next react-native-paper
```

In the next step we will make sure versions of these libraries are compatible.

```bash
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
```

After you run these two commands you should be ready to go. Let's start implementing the app!

### Step 1. React-Navigation and React-Native-Paper initial setup.

Both these libraries require a minimal setup.

In case of React-Native-Paper we need to wrap the component tree with a **Provider**. You can do this inside the exported component in the **App.tsx** file.

```jsx
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Main from './src/Main';

export default function App() {
  return (
    <PaperProvider>
      <Main />
    </PaperProvider>
  );
}
```

The **PaperProvider** provides the theme to all the components in the framework. It also acts as a portal to components which need to be rendered at the top level. Check the full [Getting-Started](https://callstack.github.io/react-native-paper/getting-started.html) page for more information.

React-Navigation setup looks similiar. There is a component called **NavigationNativeContainer** which manages our navigation tree and contains the navigation state. It must wrap all navigator structure. We will render this components in **App.tsx** inside a **PaperProvider**. More informations can be found in the official [documentation](https://reactnavigation.org/docs/en/next/hello-react-navigation.html).

```jsx
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationNativeContainer } from '@react-navigation/native';
import Main from './src/Main';

export default function App() {
  return (
    <PaperProvider>
      <NavigationNativeContainer>
        <Main />
      </NavigationNativeContainer>
    </PaperProvider>
  );
}
```

### Step 2. Drawer

In our Twitter clone we want to implement a Drawer that is available from any screen in the app. This means, it has to be a top most navigator.

In React-Navigation v5 there is a common pattern for creating navigators. After importing **createXNavigator** function from the navigator package of your choice you can use **Navigator** and **Screen** components from the value it returns.

So let's create a basic version of a Drawer:

```jsx
import React from 'react';
import { Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function DrawerContent() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Drawer content</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

export const RootNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={() => <DrawerContent />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};
```

That's what we see on a screen:

<img src="/blog/assets/using-react-navigation-5-with-paper/simple-drawer.gif" height="480"/>

We can open a drawer with a swipe gesture, it looks very smooth. However, the UI doesn't look very impressive so let's add more content to the drawer to make it look just like in the final version.

We will use:

- **_DrawerContentScrollView_** and **_DrawerItem_** from **_@react-navigation/drawer_**
- **_Avatar_**, **_Text_** and **_Switch_** from **_react-native-paper_**

**DrawerContentScrollView** component makes the drawer scrollable and provides support for devices with notches, so it's highly recommended to use it even for custom drawers.

**Components from React-Native-Paper** make a nice looking, material UI.

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={
          styles.drawerContent,
        }
      >
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri:
                'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
            }}
            size={50}
          />
          <Title style={styles.title}>Dawid Urbaniak</Title>
          <Caption style={styles.caption}>@trensik</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Preferences"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={color}
                size={size}
              />
            )}
            label="Bookmarks"
            onPress={() => {}}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
```

That's how the final version of the drawer looks like:

<img src="/blog/assets/using-react-navigation-5-with-paper/final-drawer.gif" height="480"/>

### Step 3. Bottom Navigation

In this step we will implement a Tab Navigator with 3 tabs. We will use a [Bottom Navigation](https://callstack.github.io/react-native-paper/bottom-navigation.html) component from React-Native-Paper that is exposed via **@react-navigation/material-bottom-tabs** package.

Let's import the **createMaterialBottomTabNavigator** function first.

```jsx
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
```

Then we can get a reference to the Tab.Navigator and Tab.Screen components.

```jsx
const Tab = createMaterialBottomTabNavigator();
```

Now, we are ready to build the actual Bottom Navigation. We will render a `Tab.navigator` and 3 `Tab.Screen` components as a children. Each `Tab.Screen` representing a tab.

```jsx
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Feed } from './feed';
import { Messages } from './messages';
import { Notifications } from './notifications';

const Tab = createMaterialBottomTabNavigator();

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      shifting={true}
      sceneAnimationEnabled={false}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: 'home-account',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarIcon: 'bell-outline',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: 'message-text-outline',
        }}
      />
    </Tab.Navigator>
  );
};
```

When we check the screen of the phone now, we will see a nice looking, material bottom navigation.

<img src="/blog/assets/using-react-navigation-5-with-paper/bottom-navigation.gif" height="480"/>

We still miss a last piece of our navigation flow - **Stack Navigator**. Let's move to the next section where we will take care of it.

### Step 4. Stack Navigator + Paper's Appbar

Stack Navigator provides a way for an app to transition between screens when each new screen is placed on top of a stack. In case of this Twitter clone, we will use it to transition from a screen displaying feed of tweets to the screen showing details of a tweet.

React Navigation v5 provides two implementations of a Stack Navigator

- Native Stack
- JS based Stack

The main difference between them is that JS based stack re-implements animations and gestures while the native stack navigator relies on the platform primitivs for animations and gestures.

In this section we will integrate React-Native-Paper [Appbar](https://callstack.github.io/react-native-paper/appbar-header.html) and JS based Stack Navigator.

As a first step, we will create a minimal version of a Stack:

```jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Feed } from './feed';
import { Details } from './details';

export const FeedStack = () => {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{ headerTitle: 'Twitter' }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerTitle: 'Tweet' }}
      />
    </Stack.Navigator>
  );
};
```

By default the stack navigator is configured to have the familiar iOS and Android header. That doesn't suit our needs, because we want to use a Paper's Appbar instead.
We can achieve that by passing an `Appbar.Header` component as a `header` in Stack's `screenOptions`:

```jsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Appbar, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Feed } from './feed';
import { Details } from './details';

export const FeedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="FeedList"
      screenOptions={{
        header: ({ scene, previous, navigation }) => {
          const { options } = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name;

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme.colors.surface } }}
            >
              {previous ? (
                <Appbar.BackAction
                  onPress={navigation.pop}
                  color={theme.colors.primary}
                />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                >
                  <Avatar.Image
                    size={40}
                    source={{
                      uri:
                        'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
                    }}
                  />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={
                  previous ? (
                    title
                  ) : (
                    <MaterialCommunityIcons
                      style={{ marginRight: 10 }}
                      name="twitter"
                      size={40}
                      color={theme.colors.primary}
                    />
                  )
                }
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
              />
            </Appbar.Header>
          );
        },
      }}
    >
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{ headerTitle: 'Twitter' }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerTitle: 'Tweet' }}
      />
    </Stack.Navigator>
  );
};

```

Function that we pass as a `header` has access to 3 properties:
- scene
- previous
- navigation

Thanks to the **scene** property we can access the title of top most screen on the stack and display it in the header.
**Previous** property tells us if there are any other screens lower on the Stack.
</br>
Finally, **navigation** property allows navigating to different screens e.g. opening a Drawer.

The thing that we haven't coverd yet and it is very important is how to actually navigate between Stack Navigator screens.
In case of Tab or Drawer Navigator we get it out of the box. We can swipe to open/close the Drawer or press a tab to change the scene. In Stack we have to implement it by ourselves.

React Navigation gives us many different ways to navigate, but we will mostly focus on `push` and `pop`. You can access these two methods in **navigation** prop.

As the name suggests `push` method pushes the new screen on the stack and `pop` removes current screen from the stack.

As you can see on a snippet above, we invoke a `navigation.pop` function whenever user presses the back button in header. This means user will be allowed to come back from **Details** to the **Feed** screen. 

We still need to implement an option to go from **Feed** to the **Details**. We can do it by invoking `navigation.push('Details')` whenever user presses a Tweet.

```jsx
  function onTweetPress() {
    navigation.push('Details');
  }
```


The implementation of `Feed` and `Details` components is quite big and complex, that's why i am not gonna post it here. Please make sure to check it out on [github repo](https://github.com/Trancever/twitterClone)

We have coverd only the basics of navigating between screens. If you want to learn more details check the official [documentation](https://reactnavigation.org/docs/en/next/navigating.html).

Now, let's see what does the app look like with Stack Navigator and Paper's Appbar.

<img src="/blog/assets/using-react-navigation-5-with-paper/stack-final.gif" height="480"/>
