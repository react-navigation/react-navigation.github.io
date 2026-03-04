# Options for screens

Version: 8.x

Sitemap: [llms-8.x.txt](https://reactnavigation.org/llms-8.x.txt)

Each screen can configure various aspects about how it gets presented in the navigator that renders it by specifying certain options, for example, the header title in stack navigator, tab bar icon in bottom tab navigator etc. Different navigators support different set of options.

In the [configuring the header bar](headers.md) section of the fundamentals documentation we explain the basics of how this works. Also see the [screen options resolution guide](screen-options-resolution.md) to get an idea of how they work when there are multiple navigators.

See [our docs](typescript.md#annotating-options-and-screenoptions) to learn more about how to use TypeScript with `screenOptions` and `options`.

There are 3 ways of specifying options for screens:

## `options` prop on `Screen`

You can pass a prop named `options` to the `Screen` component to configure a screen, where you can specify an object with different options for that screen:

**Static:**

```js

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation('Profile');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

// codeblock-focus-start
const RootStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
      options: {
        title: 'Awesome app',
      },
    }),
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
      options: {
        title: 'My profile',
      },
    }),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
// codeblock-focus-end
```

**Dynamic:**

```js
function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation('Profile');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

// codeblock-focus-start
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My profile',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
// codeblock-focus-end
```

You can also pass a function to `options`. The function will receive the [`navigation` object](navigation-object.md) and the [`route` object](route-object.md) for that screen, as well as the [`theme` object](themes.md). This can be useful if you want to perform navigation in your options:

**Static:**

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
      options: ({ navigation }) => ({
        title: 'Awesome app',
        headerLeft: () => {
          <DrawerButton onPress={() => navigation.toggleDrawer()} />;
        },
      }),
    }),
  },
});
```

**Dynamic:**

```js
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Awesome app',
          headerLeft: () => {
            <DrawerButton onPress={() => navigation.toggleDrawer()} />;
          },
        })}
      />
    </Stack.Navigator>
  );
}
```

## `screenOptions` prop on `Group`

You can pass a prop named `screenOptions` to the `Group` component to configure screens inside the group, where you can specify an object with different options. The options specified in `screenOptions` apply to all of the screens in the group.

Example:

**Static:**

```js

// codeblock-focus-start
const RootStack = createNativeStackNavigator({
  groups: {
    App: {
      screenOptions: {
        headerStyle: {
          backgroundColor: '#FFB6C1',
        },
      },
      screens: {
        Home: ScreenWithButton('Home', 'Profile'),
        Profile: ScreenWithButton('Profile', 'Settings'),
      },
    },
    Modal: {
      screenOptions: {
        presentation: 'modal',
      },
      screens: {
        Settings: ScreenWithButton('Settings', 'Share'),
        Share: ScreenWithButton('Share'),
      },
    },
  },
});
// codeblock-focus-end

function ScreenWithButton(screenName, navigateTo) {
  return function () {
    const navigation = useNavigation(screenName);

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{screenName} Screen</Text>
        {navigateTo && (
          <Button onPress={() => navigation.navigate(navigateTo)}>
            Go to {navigateTo}
          </Button>
        )}
      </View>
    );
  };
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

**Dynamic:**

```js

const Stack = createNativeStackNavigator();

function ScreenWithButton(screenName, navigateTo) {
  return function () {
    const navigation = useNavigation(screenName);

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{screenName} Screen</Text>
        {navigateTo && (
          <Button onPress={() => navigation.navigate(navigateTo)}>
            Go to {navigateTo}
          </Button>
        )}
      </View>
    );
  };
}

const HomeScreen = ScreenWithButton('Home', 'Profile');
const ProfileScreen = ScreenWithButton('Profile', 'Settings');
const SettingsScreen = ScreenWithButton('Settings', 'Share');
const ShareScreen = ScreenWithButton('Share');

export default function App() {
  return (
    <NavigationContainer>
      // codeblock-focus-start
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Share" component={ShareScreen} />
        </Stack.Group>
      </Stack.Navigator>
      // codeblock-focus-end
    </NavigationContainer>
  );
}
```

Similar to `options`, you can also pass a function to `screenOptions`. The function will receive the [`navigation` object](navigation-object.md) and the [`route` object](route-object.md) for each screen. This can be useful if you want to configure options for all the screens in one place based on the route:

**Static:**

```js
const Stack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
    }),
  },
  groups: {
    Modal: {
      screenOptions: {
        presentation: 'modal',
        headerLeft: () => <CancelButton onPress={navigation.goBack} />,
      },
      screens: {
        Settings: createNativeStackScreen({
          screen: Settings,
        }),
        Share: createNativeStackScreen({
          screen: Share,
        }),
      },
    },
  },
});
```

**Dynamic:**

```js
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
  <Stack.Group
    screenOptions={({ navigation }) => ({
      presentation: 'modal',
      headerLeft: () => <CancelButton onPress={navigation.goBack} />,
    })}
  >
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Share" component={Share} />
  </Stack.Group>
</Stack.Navigator>
```

## `screenOptions` prop on the navigator

You can pass a prop named `screenOptions` to the navigator component, where you can specify an object with different options. The options specified in `screenOptions` apply to all of the screens in the navigator. So this is a good place to specify options that you want to configure for the whole navigator.

Example:

**Static:**

```js
const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: 'papayawhip',
    },
  },
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
    }),
  },
});
```

**Dynamic:**

```js
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'papayawhip',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

Similar to `options`, you can also pass a function to `screenOptions`. The function will receive the [`navigation` object](navigation-object.md) and the [`route` object](route-object.md) for each screen. This can be useful if you want to configure options for all the screens in one place based on the route:

**Static:**

```js

// codeblock-focus-start
const MyTabs = createBottomTabNavigator({
  screenOptions: ({ route }) => {
    const title = route.name === 'Home' ? 'Welcome' : `${route.name} screen`;

    return {
      headerTitle: title,
    };
  },
  screens: {
    Home: createBottomTabScreen({
      screen: EmptyScreen,
    }),
    Profile: createBottomTabScreen({
      screen: EmptyScreen,
    }),
  },
});
// codeblock-focus-end

function EmptyScreen() {
  return <View />;
}

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <Navigation />;
}
```

**Dynamic:**

```js
// codeblock-focus-start
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const title =
          route.name === 'Home' ? 'Welcome' : `${route.name} screen`;

        return {
          headerTitle: title,
        };
      }}
    >
      <Tab.Screen name="Home" component={EmptyScreen} />
      <Tab.Screen name="Profile" component={EmptyScreen} />
    </Tab.Navigator>
  );
}
// codeblock-focus-end

function EmptyScreen() {
  return <View />;
}
// codeblock-focus-end

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
```

## `navigation.setOptions` method

The `navigation` object has a `setOptions` method that lets you update the options for a screen from within a component. See [navigation object's docs](navigation-object.md#setoptions) for more details.

```js
<Button onPress={() => navigation.setOptions({ title: 'Updated!' })}>
  Update options
</Button>
```
