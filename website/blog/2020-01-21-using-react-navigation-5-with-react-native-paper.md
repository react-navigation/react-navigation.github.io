---
title: React Navigation v5 + React Native Paper = ❤️
author: Dawid Urbaniak
authorURL: https://twitter.com/trensik
---

This is a guest post by the [React Native Paper](https://reactnativepaper.com/) team. If you like this guide, checkout React Native Paper for more!

In this blog post, we'll show you how to build a real world app using React Navigation v5 and Paper.

## Introduction

React Navigation v5 is a breakthrough navigation. It not only provides a cross-platform native Stack, but also the API was redesigned from the ground up to allow things that were never possible before. Thanks to the component based API, all of the configuration is happening inside the **render method**. This means, we can access **props**, **state** and **context** and can **dynamically change configuration** for the navigator.

[React Native Paper](<(https://reactnativepaper.com/)>) is a UI component library that implements [MD Guidelines](https://material.io/design/).
It allows building beautiful interfaces on Mobile and Web with high quality cross-platform components.
Furthermore, Paper provides you with a full **theming support**, **accessibility**, **RTL** and it will take care of **platform adaptation**. This means you can focus on building apps with ready to use components instead of reimplementing the boring stuff.

In this guide, we would like to show you how to integrate React Navigation with Paper's components. To show all the details of the integration we've decided to build a clone of Twitter. Of course the functionalities will be very limited but the navigation part and main screens should look and feel similiar.

In the following gif, you can see what is the final version of the app gonna look like:

<img src="/blog/assets/using-react-navigation-5-with-paper/final-app.gif" height="480"/>

## Overview of the App

Since original Twitter is a very complex app, we will build only a part of it. This means we will implement:

- Drawer
- Stack Navigator with two screens: Screen showing bottom navigation and Details of a tweet
- Bottom navigation with 3 tabs: Feed, Notifications and Messages

I will focus this guide on a React Navigation and React Native Paper integration. It means I won't show you how to build all of the components necessary to create such app, but you can always check the full implementation in the [github repo](https://github.com/Trancever/twitterClone).

Let's get started!

## Getting started

I assume you already have an [Expo](https://expo.io/) project running locally. If not, make sure to create one. I choosed Expo over plain React-Native, because it includes most of the dependencies that we need so there is less work to do for us.

Let's install React Native Paper, React Navigation v5 and other required dependencies.

```bash
npm install @react-navigation/native@next @react-navigation/stack@next @react-native-community/masked-view @react-navigation/drawer@next @react-navigation/material-bottom-tabs@next react-native-paper
```

In the next step we will make sure versions of these libraries are compatible.

```bash
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
```

After you run these two commands you should be ready to go. Let's start implementing the app!

### 1. React Navigation and React Native Paper initial setup.

Both these libraries require a minimal setup.

In case of React Native Paper we need to wrap the component tree with a **Provider**. You can do this inside the exported component in the **App.js** file.

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

React Navigation setup looks similiar. There is a component called **NavigationNativeContainer** which manages our navigation tree and contains the navigation state. It must wrap all navigator structure. We will render this components in **App.tsx** inside a **PaperProvider**. More informations can be found in the official [documentation](https://reactnavigation.org/docs/en/next/hello-react-navigation.html).

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

### 2. Drawer

In our Twitter clone we want to implement a Drawer that is available from any screen in the app. This means, it has to be a top most navigator.

In React Navigation v5 there is a common pattern for creating navigators. After importing **createXNavigator** function from the navigator package of your choice you can use **Navigator** and **Screen** components from the value it returns.

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

**DrawerContentScrollView** component makes the drawer vertically scrollable and provides support for devices with notches, so it's highly recommended to use it even for custom drawers.

**Components from React Native Paper** make a clean, material UI.

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

The final version of a drawer looks like this:

<img src="/blog/assets/using-react-navigation-5-with-paper/final-drawer.gif" height="480"/>

### 3. Stack Navigator + Paper's Appbar

Stack Navigator provides a way for an app to transition between screens when each new screen is placed on top of a stack. In case of this Twitter clone, we will use it to transition from a screen displaying feed of tweets to the screen showing details of a tweet.

React Navigation v5 provides two implementations of a Stack Navigator

- Native Stack
- JS based Stack

The main difference between them is that JS based stack re-implements animations and gestures while the native stack navigator relies on the platform primitives for animations and gestures.

In this section we will integrate React Native Paper [Appbar](https://callstack.github.io/react-native-paper/appbar-header.html) and JS based Stack Navigator.

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

<img src="/blog/assets/using-react-navigation-5-with-paper/stack.gif" height="480"/>

We still miss a last piece of our navigation flow - **Tab Navigator**. Let's move to the next section where we will take care of it.

### 4. Bottom Navigation

In this section we will implement a Tab Navigator with 3 tabs and we will make sure this component is now a one of Stack's screen.

We will use a [Bottom Navigation](https://callstack.github.io/react-native-paper/bottom-navigation.html) component from React Native Paper that is exposed via **@react-navigation/material-bottom-tabs** package.

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

When we check the screen of the phone now, we will see a nice looking, material bottom navigation. What's more, Stack Navigator integrates nicely with Tab.Navigator and we can still navigate to the tweet `Details` screen.

</br>
<img src="/blog/assets/using-react-navigation-5-with-paper/bottom-navigation.gif" height="480"/>

### 5. FAB and Portal

As it is stated in [MD Guidelines](https://material.io/components/buttons-floating-action-button/), the purpose of FAB button is to give an easy access to the main action of the application. Of course, official Twitter app follows this pattern. Based on the type of screen, it allows creating new tweets or sending direct messages via FAB. It also smoothly animates the icon of the FAB when user changes the tab and hides the FAB completely on specific screens.

In this section, we are going to implement the very same behaviour in our app. We are going to use a [FAB](https://callstack.github.io/react-native-paper/fab.html) and [Portal](https://callstack.github.io/react-native-paper/portal.html) components from React Native Paper.

`Portal` allows to render a component at a different place in the parent tree. It means you can use it to render content which should appear above other elemenets, similar to Modal.

As an initial step we will render a FAB on all tabs and then we will add additional functionalities.

Let's render a `FAB` and `Portal` in the same component where we render Tabs:

```jsx
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme, Portal, FAB } from 'react-native-paper';

import { Feed } from './feed';
import { Message } from './message';
import { Notifications } from './notifications';

const Tab = createMaterialBottomTabNavigator();

export const BottomTabs = () => {
  return (
    <React.Fragment>
      <Tab.Navigator
        initialRouteName="Feed"
        backBehavior="initialRoute"
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
          component={Message}
          options={{
            tabBarIcon: 'message-text-outline',
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          icon="feather"
          style={{
            position: 'absolute',
            bottom: 100,
            right: 16,
          }}
        />
      </Portal>
    </React.Fragment>
  );
};
```

With just few lines of JSX we have a nice looking FAB displayed on all tabs. Let's implement hiding it whenever user goes to the tweet details screen.

Our current navigation structure should be:

- StackNavigator that has two screens
- First screen of StackNavigator renders a TabNavigator with 3 tabs
- Second screen of StckNavigator renders a Tweet details

This means, a component that renders TabNavigator is a Stack's screen. Thanks to that, we can use `useIsFocused` hook provided by `@react-navigation/native` and conditionally hide `FAB`.

```jsx
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

import { Feed } from './feed';
import { Message } from './message';
import { Notifications } from './notifications';

const Tab = createMaterialBottomTabNavigator();

export const BottomTabs = () => {
  const isFocused = useIsFocused();

  return (
    <React.Fragment>
      <Tab.Navigator
        initialRouteName="Feed"
        backBehavior="initialRoute"
        shifting={true}
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
          component={Message}
          options={{
            tabBarIcon: 'message-text-outline',
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={isFocused} // show FAB only when this screen is focused
          icon="feather"
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
        />
      </Portal>
    </React.Fragment>
  );
};
```

In the last step we will add ability to show different icon depending on the active tab.

Currently, React Navigation v5 allows listening to `tabPress` event only in Tab.Navigator Screens. It means we can't set the listener in the component showed above which would be really handy because we also render a FAB there. To get around this problem we will use a context to get and set currently active tab.

```jsx
import React from 'react';

export type Tab = 'Feed' | 'Notifications' | 'Message';

type TabBarSetContext = (tab: Tab) => void;

export const TabBarContext = React.createContext < Tab > 'Feed';
export const TabBarSetContext =
  React.createContext < TabBarSetContext > (() => {});
```

Let's setup context providers in the root component:

```jsx
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationNativeContainer } from '@react-navigation/native';

export default function App() {
  const [tab, setTab] = React.useState < Tab > 'Feed';

  return (
    <PaperProvider>
      <NavigationNativeContainer>
        <TabBarContext.Provider value={tab}>
          <TabBarSetContext.Provider value={setTab}>
            <Main />
          </TabBarSetContext.Provider>
        </TabBarContext.Provider>
      </NavigationNativeContainer>
    </PaperProvider>
  );
}
```

We are finally ready to start listening to `tabPress` event. We will set the listener in each Tab.Navigator Screen.

Example for Feed Screen:

```jsx
import React from 'react';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabBarSetContext } from './context/tabBarContext';

type Props = {
  navigation: MaterialBottomTabNavigationProp<{}>,
};

export const Feed = (props: Props) => {
  const setTab = React.useContext(TabBarSetContext);

  React.useEffect(() => {
    const onTabPress = () => setTab('Feed'); // We pass a 'Feed' string representing Feed screen

    props.navigation.addListener('tabPress', onTabPress); // set listener

    return () => props.navigation.removeListener('tabPress', onTabPress); // remove listener
  }, [props.navigation, setTab]);

  return (
    <View>
      <Text>Feed</Text>
    </View>
  );
};
```

Now, we can access currently active tab in Feed screen using `TabBarContext` and render a proper icon in FAB:

```jsx
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

import { Feed } from './feed';
import { Message } from './message';
import { Notifications } from './notifications';
import { TabBarContext } from './context/tabBarContext';

const Tab = createMaterialBottomTabNavigator();

export const BottomTabs = () => {
  const isFocused = useIsFocused();

  const tab = React.useContext(TabBarContext); // get current active tab using TabBarContext

  let icon = 'feather';

  switch (tab) {
    case 'Message':
      icon = 'email-plus-outline';
      break;
    default:
      icon = 'feather';
      break;
  }

  return (
    <React.Fragment>
      <Tab.Navigator initialRouteName="Feed" shifting={true}>
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
          component={Message}
          options={{
            tabBarIcon: 'message-text-outline',
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={isFocused}
          icon={icon} // Pass a proper icon for current tab
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
        />
      </Portal>
    </React.Fragment>
  );
};
```

<img src="/blog/assets/using-react-navigation-5-with-paper/fab.gif" height="480"/>

As you can see on the gif, the FAB button works in a same way as in a Twitter app.
What's more, it even animates icon change properly even though we haven't implement it. That's the behaviour we get from React Native Paper's FAB out of the box.

### 5. Theming

Nowadays, supporting Light/Dark theme is no longer a fancy way to stand out from other apps, but it has become a standard. Happily, both React Navigation v5 and React Native Paper supports theming and in this section I'll guide you through setting it up.

#### React Navigation

React Navigation exports two themes:

- DefaultTheme
- DarkTheme

We can import them from `@react-navigation/native` package and pass to `NavigationNativeContainer` to apply the theme:

```jsx
import React from 'react';
import { NavigationNativeContainer, DarkTheme } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationNativeContainer theme={DarkTheme}>
      {/* content */}
    </NavigationNativeContainer>
  );
}
```

#### React Native Paper

React Native Paper similarly to React Navigation also exports two themes:

- DefaultTheme
- DarkTheme

Once we import a theme we can pass it to the Paper's `Provider` component:

```jsx
import * as React from 'react';
import {
  NavigationNativeContainer,
  DarkTheme,
} from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';

export default function Main() {
  return (
    <PaperProvider theme={PaperDarkTheme}>
      <NavigationNativeContainer theme={DarkTheme}>
        {/* content */}
      </NavigationNativeContainer>
    </PaperProvider>
  );
}
```

#### Themes Combining

Since both React Navigation and React Native Paper follows same pattern for theming and structure of the theme object is very similiar, we can combine them into one object:

```jsx
import * as React from 'react';
import {
  NavigationNativeContainer,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';

const CombinedDarkTheme = { ...PaperDarkTheme, ...NavigationDarkTheme };

export default function Main() {
  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <NavigationNativeContainer theme={CombinedDarkTheme}>
        {/* content */}
      </NavigationNativeContainer>
    </PaperProvider>
  );
}
```

Of course the built-in themes are not the only themes we can apply. Both libraries allows full customization and you can learn about it in the official documentation ([React Navigation](https://reactnavigation.org/docs/en/next/themes.html), [React Native Paper](https://callstack.github.io/react-native-paper/theming.html))

In the last step I want to show you how to change theme dynamically. We will implement a switch in a drawer that will allow users choosing light or dark theme.

We need to store an information about currently selected theme somewhere. Local state of the root component sounds reasonable. Also, we will conditionally pass different theme based on the state.

```jsx
import * as React from 'react';
import {
  NavigationNativeContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

const CombinedDefaultTheme = { ...PaperDefaultTheme, ...NavigationDefaultTheme };
const CombinedDarkTheme = { ...PaperDarkTheme, ...NavigationDarkTheme };

export default function Main() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme // Use Light/Dark theme based on a state

  function toggleTheme() {
    // We will pass this function to Drawer and invoke it on theme switch press
    setIsDarkTheme(isDark => !isDark);
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationNativeContainer theme={theme}>
        {/* content */}
      </NavigationNativeContainer>
    </PaperProvider>
  );
}
```

As you remember, we already render a Switch in a Drawer, but we haven't implement any logic when it is pressed. Let's take care of it now:

```jsx
import React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  useTheme,
  Avatar,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

type Props = {
  toggleTheme: () => void,
};

export function DrawerContent(props: Props) {
  const paperTheme = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      /* {...other - content} */
      <Drawer.Section title="Preferences">
        <TouchableRipple onPress={props.toggleTheme}>
          <View style={styles.preference}>
            <Text>Dark Theme</Text>
            <View pointerEvents="none">
              <Switch value={theme.dark} />
            </View>
          </View>
        </TouchableRipple>
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}
```

Firstly, we get a current theme using `useTheme` hook from Paper. This means, we can check `dark` property on it and pass correct value to `Switch`.
</br>Secondly, we pass a `toggleTheme` func to `TouchableRipple` to toggle theme whenever user press a Switch.

You should be able to toggle a switch now and both `Provider` from Paper and `NativeNavigationContainer` from React Navigation will automatically apply correct colors to the components.

</br>
<img src="/blog/assets/using-react-navigation-5-with-paper/theming.gif" height="480"/>
