# Multiple drawers

Version: 8.x

Sitemap: [llms-8.x.txt](https://reactnavigation.org/llms-8.x.txt)

Sometimes we want to have multiple drawers on the same screen: one on the left and one on the right. This can be achieved in 2 ways:

1. By using [`react-native-drawer-layout`](drawer-layout.md) directly (Recommended).
2. By [nesting](nesting-navigators.md) 2 [drawer navigators](drawer-navigator.md).

## Using `react-native-drawer-layout`

When we have multiple drawers, only one of them shows the list of screens. The second drawer may often be used to show some additional information such as the list of users etc.

In such cases, we can use [`react-native-drawer-layout`](drawer-layout.md) directly to render the second drawer. The drawer navigator will be used to render the first drawer and can be nested inside the second drawer:

**Static:**

```js

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
    </View>
  );
}

const LeftDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <LeftDrawerScreen />
    </Drawer>
  );
}

const Navigation = createStaticNavigation(RightDrawerScreen);

export default function App() {
  return <Navigation />;
}
```

**Dynamic:**

```js

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
    </View>
  );
}

const LeftDrawer = createDrawerNavigator();

const LeftDrawerScreen = () => {
  return (
    <LeftDrawer.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <LeftDrawer.Screen name="Home" component={HomeScreen} />
    </LeftDrawer.Navigator>
  );
};

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <LeftDrawerScreen />
    </Drawer>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawerScreen />
    </NavigationContainer>
  );
}
```

But there is one problem. When we call `navigation.openDrawer()` in our `HomeScreen`, it always opens the left drawer. We don't have access to the right drawer via the `navigation` object since it's not a navigator.

To solve this, we need to use context API to pass down a function to control the right drawer:

**Static:**

```js

const RightDrawerContext = React.createContext();

function HomeScreen() {
  const { openRightDrawer } = React.useContext(RightDrawerContext);
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()}>Open left drawer</Button>
      <Button onPress={() => openRightDrawer()}>Open right drawer</Button>
    </View>
  );
}

const LeftDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  const value = React.useMemo(
    () => ({
      openRightDrawer: () => setRightDrawerOpen(true),
      closeRightDrawer: () => setRightDrawerOpen(false),
    }),
    []
  );

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <RightDrawerContext.Provider value={value}>
        <LeftDrawerScreen />
      </RightDrawerContext.Provider>
    </Drawer>
  );
}

const Navigation = createStaticNavigation(RightDrawerScreen);

export default function App() {
  return <Navigation />;
}
```

**Dynamic:**

```js

const RightDrawerContext = React.createContext();

function HomeScreen() {
  const navigation = useNavigation('Home');
  const { openRightDrawer } = React.useContext(RightDrawerContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()}>Open left drawer</Button>
      <Button onPress={() => openRightDrawer()}>Open right drawer</Button>
    </View>
  );
}

const LeftDrawer = createDrawerNavigator();

const LeftDrawerScreen = () => {
  return (
    <LeftDrawer.Navigator screenOptions={{ drawerPosition: 'left' }}>
      <LeftDrawer.Screen name="Home" component={HomeScreen} />
    </LeftDrawer.Navigator>
  );
};

function RightDrawerScreen() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  const value = React.useMemo(
    () => ({
      openRightDrawer: () => setRightDrawerOpen(true),
      closeRightDrawer: () => setRightDrawerOpen(false),
    }),
    []
  );

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <>{/* Right drawer content */}</>}
    >
      <RightDrawerContext.Provider value={value}>
        <LeftDrawerScreen />
      </RightDrawerContext.Provider>
    </Drawer>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawerScreen />
    </NavigationContainer>
  );
}
```

Here, we are using the `RightDrawerContext` to pass down the `openRightDrawer` function to the `HomeScreen`. Then we use `openRightDrawer` to open the right drawer.

## Nesting 2 drawer navigators

An alternative approach is to nest 2 [drawer navigators](drawer-navigator.md) inside each other. This is not recommended since it requires creating an additional screen and more nesting - which can make navigating and type checking more verbose. But this can be useful if both navigators include multiple screens.

Here we have 2 drawer navigators nested inside each other, one is positioned on left and the other on the right:

**Static:**

```js

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
    </View>
  );
}

const LeftDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

const RightDrawerScreen = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'right',
    headerShown: false,
  },
  screens: {
    HomeDrawer: LeftDrawerScreen,
  },
});

const Navigation = createStaticNavigation(RightDrawerScreen);

export default function App() {
  return <Navigation />;
}
```

**Dynamic:**

```js
function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.openDrawer()}>Open drawer</Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function LeftDrawerScreen() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'left',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

const DrawerA = createDrawerNavigator();

function RightDrawerScreen() {
  return (
    <DrawerA.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
      }}
    >
      <DrawerA.Screen name="HomeDrawer" component={LeftDrawerScreen} />
    </DrawerA.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawerScreen />
    </NavigationContainer>
  );
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/drawer/drawer-multiple.mp4" />
</video>

But there is one problem. When we call `navigation.openDrawer()` in our `HomeScreen`, it always opens the left drawer since it's the immediate parent of the screen.

To solve this, we need to use [`navigation.getParent`](navigation-object.md#getparent) to refer to the right drawer which is the parent of the left drawer. So our code would look like:

```js
<Button onPress={() => navigation.openDrawer()} >Open left drawer</Button>
<Button onPress={() => navigation.getParent().openDrawer()}>Open right drawer</Button>
```

However, this means that our button needs to know about the parent navigators, which isn't ideal. If our button is further nested inside other navigators, it'd need multiple `getParent()` calls. To solve this, we can pass the name of the screen where the navigator is to the `getParent` method to directly refer to the desired navigator.

In this case:

- `navigation.getParent('Home').openDrawer()` opens the left drawer since `'Home'` is a screen in the left drawer navigator.
- `navigation.getParent('HomeDrawer').openDrawer()` opens the right drawer since `'HomeDrawer'` is a screen in the right drawer navigator.

To customize the contents of the drawer, we can use the [`drawerContent` prop](drawer-navigator.md#drawercontent) to pass in a function that renders a custom component.

The final code would look like this:

**Static:**

```js

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.getParent('Home').openDrawer()}>
        Open left drawer
      </Button>
      <Button onPress={() => navigation.getParent('HomeDrawer').openDrawer()}>
        Open right drawer
      </Button>
    </View>
  );
}

function RightDrawerContent() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the right drawer</Text>
    </View>
  );
}

const LeftDrawer = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
  },
});

const RightDrawer = createDrawerNavigator({
  drawerContent: (props) => <RightDrawerContent {...props} />,
  screenOptions: {
    drawerPosition: 'right',
    headerShown: false,
  },
  screens: {
    HomeDrawer: LeftDrawer,
  },
});

const Navigation = createStaticNavigation(RightDrawer);

export default function App() {
  return <Navigation />;
}
```

**Dynamic:**

```js
function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.getParent('Home').openDrawer()}>
        Open left drawer
      </Button>
      <Button onPress={() => navigation.getParent('HomeDrawer').openDrawer()}>
        Open right drawer
      </Button>
    </View>
  );
}

function RightDrawerContent() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the right drawer</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function LeftDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'left',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

const DrawerA = createDrawerNavigator();

function RightDrawer() {
  return (
    <DrawerA.Navigator
      drawerContent={(props) => <RightDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
      }}
    >
      <DrawerA.Screen name="HomeDrawer" component={LeftDrawer} />
    </DrawerA.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RightDrawer />
    </NavigationContainer>
  );
}
```

## Summary

- To have multiple drawers, you can use [`react-native-drawer-layout`](drawer-layout.md) directly in combination with a drawer navigator.
- The [`drawerPosition`](drawer-layout.md#drawerposition) prop can be used to position the drawer on the right.
- The methods to control the drawer can be passed down using context API when using [`react-native-drawer-layout`](drawer-layout.md).
- When nesting multiple navigators, you can use [`navigation.getParent`](navigation-object.md#getparent) with a screen name to refer to the desired drawer.
