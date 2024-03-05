---
id: use-theme
title: useTheme
sidebar_label: useTheme
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The `useTheme` hook lets us access the currently active theme. You can use it in your own components to have them respond to changes in the theme.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="useTheme hook" snack version=7
import * as React from 'react';
import {
  useNavigation,
  createStaticNavigation,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Button, View, Text, TouchableOpacity, Appearance } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// codeblock-focus-start
import { useTheme } from '@react-navigation/native';

// codeblock-focus-end

function SettingsScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params;
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Settings Screen</Text>
      <Text style={{ color: colors.text }}>
        userParam: {JSON.stringify(user)}
      </Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Profile Screen</Text>
    </View>
  );
}

// codeblock-focus-start
function MyButton() {
  // highlight-next-line
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <MyButton />
      <Button
        title="Go to Settings"
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      />
    </View>
  );
}

const PanelStack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});

const Drawer = createDrawerNavigator({
  initialRouteName: 'Panel',
  screens: {
    Home: HomeScreen,
    Panel: {
      screen: PanelStack,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(Drawer);

export default function App() {
  const scheme = Appearance.getColorScheme();
  return <Navigation theme={scheme === 'dark' ? DarkTheme : DefaultTheme} />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="useTheme hook" snack version=7
import * as React from 'react';
import { Button, View, Text, TouchableOpacity, Appearance } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// codeblock-focus-start
import { useTheme } from '@react-navigation/native';

// codeblock-focus-end
function SettingsScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params;
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Settings Screen</Text>
      <Text style={{ color: colors.text }}>
        userParam: {JSON.stringify(user)}
      </Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}
function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Profile Screen</Text>
    </View>
  );
}

// codeblock-focus-start
function MyButton() {
  // highlight-next-line
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}
// codeblock-focus-end

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <MyButton />
      <Button
        title="Go to Settings"
        onPress={() =>
          navigation.navigate('Root', {
            screen: 'Settings',
            params: { user: 'jane' },
          })
        }
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = Appearance.getColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator useLegacyImplementation>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

See [theming guide](themes.md) for more details and usage guide around how to configure themes.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class MyButton extends React.Component {
  render() {
    // Get it from props
    const { theme } = this.props;
  }
}

// Wrap and export
export default function (props) {
  const theme = useTheme();

  return <MyButton {...props} theme={theme} />;
}
```
