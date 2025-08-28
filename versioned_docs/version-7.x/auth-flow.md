---
id: auth-flow
title: Authentication flows
sidebar_label: Authentication flows
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Most apps require that a user authenticates in some way to have access to data associated with a user or other private content. Typically the flow will look like this:

- The user opens the app.
- The app loads some authentication state from encrypted persistent storage (for example, [`SecureStore`](https://docs.expo.io/versions/latest/sdk/securestore/)).
- When the state has loaded, the user is presented with either authentication screens or the main app, depending on whether valid authentication state was loaded.
- When the user signs out, we clear the authentication state and send them back to authentication screens.

:::note

We say "authentication screens" because usually there is more than one. You may have a main screen with a username and password field, another for "forgot password", and another set for sign up.

:::

## What we need

We want the following behavior from our authentication flow:

- When the user is signed in, we want to show the main app screens and not the authentication-related screens.
- When the user is signed out, we want to show the authentication screens and not the main app screens.
- After the user goes through the authentication flow and signs in, we want to unmount all of the screens related to authentication, and when we press the hardware back button, we expect to not be able to go back to the authentication flow.

## How it will work

We can configure different screens to be available based on some condition. For example, if the user is signed in, we want `Home` to be available. If the user is not signed in, we want `SignIn` to be available.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Authentication flow" snack
import * as React from 'react';
import { View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const useIsSignedIn = () => {
  return true;
};

const useIsSignedOut = () => {
  return !useIsSignedIn();
};

// codeblock-focus-start
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      if: useIsSignedIn,
      screen: HomeScreen,
    },
    SignIn: {
      if: useIsSignedOut,
      screen: SignInScreen,
    },
  },
});
// codeblock-focus-end

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

function HomeScreen() {
  return <View />;
}

function SignInScreen() {
  return <View />;
}
```

Here, for each screen, we have defined a condition using the `if` property which takes a hook. The hook returns a boolean value indicating whether the user is signed in or not. If the hook returns `true`, the screen will be available, otherwise it won't.

This means:

- When `useIsSignedIn` returns `true`, React Navigation will only use the `Home` screen, since it's the only screen matching the condition.
- Similarly, when `useIsSignedOut` returns `true`, React Navigation will use the `SignIn` screen.

This makes it impossible to navigate to the `Home` when the user is not signed in, and to `SignIn` when the user is signed in.

When the values returned by `useIsSignedin` and `useIsSignedOut` change, the screens matching the condition will change:

- Let's say, initially `useIsSignedOut` returns `true`. This means that `SignIn` screens is shown.
- After the user signs in, the return value of `useIsSignedIn` will change to `true` and `useIsSignedOut` will change to `false`, which means:
  - React Navigation will see that the `SignIn` screen is no longer matches the condition, so it will remove the screen.
  - Then it'll show the `Home` screen automatically because that's the first screen available when `useIsSignedIn` returns `true`.

The order of the screens matters when there are multiple screens matching the condition. For example, if there are two screens matching `useIsSignedIn`, the first screen will be shown when the condition is `true`.

## Define the hooks

To implement the `useIsSignedIn` and `useIsSignedOut` hooks, we can start by creating a context to store the authentication state. Let's call it `SignInContext`:

```js
import * as React from 'react';

const SignInContext = React.createContext();
```

Then we can implement the `useIsSignedIn` and `useIsSignedOut` hooks as follows:

```js
function useIsSignedIn() {
  const isSignedIn = React.useContext(SignInContext);
  return isSignedIn;
}

function useIsSignedOut() {
  return !useIsSignedIn();
}
```

We'll discuss how to provide the context value later.

</TabItem>

<TabItem value="dynamic" label="Dynamic">

```js name="Authentication flow" snack
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const isSignedIn = true;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        // codeblock-focus-start
        {isSignedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
        // codeblock-focus-end
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  return <View />;
}

function SignInScreen() {
  return <View />;
}
```

Here, we have conditionally defined the screens based on the value of `isSignedIn`.

This means:

- When `isSignedIn` is `true`, React Navigation will only see the `Home` screen, since it's the only screen defined based on the condition.
- Similarly, when `isSignedIn` is `false`, React Navigation will only see the `SignIn` screen.

This makes it impossible to navigate to the `Home` when the user is not signed in, and to `SignIn` when the user is signed in.

When the value of `isSignedin` changes, the screens defined based on the condition will change:

- Let's say, initially `isSignedin` is `false`. This means that `SignIn` screens is shown.
- After the user signs in, the value of `isSignedin` will change to `true`, which means:
  - React Navigation will see that the `SignIn` screen is no longer defined, so it will remove the screen.
  - Then it'll show the `Home` screen automatically because that's the first screen defined when `isSignedin` returns `true`.

The order of the screens matters when there are multiple screens matching the condition. For example, if there are two screens defined based on `isSignedin`, the first screen will be shown when the condition is `true`.

</TabItem>
</Tabs>

## Add more screens

For our case, let's say we have 3 screens:

- `SplashScreen` - This will show a splash or loading screen when we're restoring the token.
- `SignIn` - This is the screen we show if the user isn't signed in already (we couldn't find a token).
- `Home` - This is the screen we show if the user is already signed in.

So our navigator will look like:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      if: useIsSignedIn,
      screen: HomeScreen,
    },
    SignIn: {
      if: useIsSignedOut,
      screen: SignInScreen,
      options: {
        title: 'Sign in',
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
const Stack = createNativeStackNavigator();

export default function App() {
  const isSignedIn = true;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <Stack.Screen
            name="SignIn"
            component={SimpleSignInScreen}
            options={{
              title: 'Sign in',
            }}
            initialParams={{ setUserToken }}
          />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>

Notice how we have only defined the `Home` and `SignIn` screens here, and not the `SplashScreen`. The `SplashScreen` should be rendered before we render any navigators so that we don't render incorrect screens before we know whether the user is signed in or not.

When we use this in our component, it'd look something like this:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
if (isLoading) {
  // We haven't finished checking for the token yet
  return <SplashScreen />;
}

const isSignedIn = userToken != null;

return (
  <SignInContext.Provider value={isSignedIn}>
    <Navigation />
  </SignInContext.Provider>
);
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
if (isLoading) {
  // We haven't finished checking for the token yet
  return <SplashScreen />;
}

const isSignedIn = userToken != null;

return (
  <NavigationContainer>
    <Stack.Navigator>
      {isSignedIn ? (
        <Stack.Screen
          name="SignIn"
          component={SimpleSignInScreen}
          options={{
            title: 'Sign in',
          }}
          initialParams={{ setUserToken }}
        />
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  </NavigationContainer>
);
```

</TabItem>
</Tabs>

In the above snippet, `isLoading` means that we're still checking if we have a token. This can usually be done by checking if we have a token in `SecureStore` and validating the token.

Next, we're exposing the sign in status via the `SignInContext` so that it's available to the `useIsSignedIn` and `useIsSignedOut` hooks.

In the above example, we have one screen for each case. But you could also define multiple screens. For example, you probably want to define password reset, signup, etc screens as well when the user isn't signed in. Similarly for the screens accessible after sign in, you probably have more than one screen.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

We can use [`groups`](static-configuration.md#groups) to define multiple screens:

```js
const RootStack = createNativeStackNavigator({
  screens: {
    // Common screens
  },
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Home: HomeScreen,
        Profile: ProfileScreen,
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: SignInScreen,
        SignUp: SignUpScreen,
        ResetPassword: ResetPasswordScreen,
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

We can use [`React.Fragment`](https://react.dev/reference/react/Fragment) or [`Group`](group.md) to define multiple screens:

```js
isSignedIn ? (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
  </>
) : (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </>
);
```

:::tip

Instead of having your login-related screens and rest of the screens in two different Stack navigators and render them conditionally, we recommend to use a single Stack navigator and place the conditional inside. This makes it possible to have a proper transition animation during login/logout.

:::

</TabItem>
</Tabs>

## Implement the logic for restoring the token

:::note

The following is just an example of how you might implement the logic for authentication in your app. You don't need to follow it as is.

:::

From the previous snippet, we can see that we need 3 state variables:

- `isLoading` - We set this to `true` when we're trying to check if we already have a token saved in `SecureStore`.
- `isSignout` - We set this to `true` when user is signing out, otherwise set it to `false`. This can be used to customize the animation when signing out.
- `userToken` - The token for the user. If it's non-null, we assume the user is logged in, otherwise not.

So we need to:

- Add some logic for restoring token, signing in and signing out
- Expose methods for signing in and signing out to other components

We'll use `React.useReducer` and `React.useContext` in this guide. But if you're using a state management library such as Redux or Mobx, you can use them for this functionality instead. In fact, in bigger apps, a global state management library is more suitable for storing authentication tokens. You can adapt the same approach to your state management library.

First we'll need to create a context for auth where we can expose the necessary methods:

```js
import * as React from 'react';

const AuthContext = React.createContext();
```

In our component, we will:

- Store the token and loading state in `useReducer`
- Persist it to `SecureStore` and read it from there on app launch
- Expose the methods for sign in and sign out to child components using `AuthContext`

So our component will look like this:
<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Signing in and signing out with AuthContext" snack dependencies=expo-secure-store
// codeblock-focus-start
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

// codeblock-focus-end
import { Text, TextInput, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

const AuthContext = React.createContext();

const SignInContext = React.createContext();

function useIsSignedIn() {
  const isSignedIn = React.useContext(SignInContext);
  return isSignedIn;
}

function useIsSignedOut() {
  return !useIsSignedIn();
}

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button onPress={signOut}>Sign out</Button>
    </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => signIn({ username, password })}>Sign in</Button>
    </View>
  );
}

// codeblock-focus-start
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  const isSignedIn = state.userToken != null;

  return (
    <AuthContext.Provider value={authContext}>
      <SignInContext.Provider value={isSignedIn}>
        <Navigation />
      </SignInContext.Provider>
    </AuthContext.Provider>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      if: useIsSignedIn,
      screen: HomeScreen,
    },
    SignIn: {
      if: useIsSignedOut,
      screen: SignInScreen,
      options: {
        title: 'Sign in',
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);
// codeblock-focus-end
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js name="Signing in and signing out with AuthContext" snack dependencies=expo-secure-store
// codeblock-focus-start
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

// codeblock-focus-end
import { Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button onPress={signOut}>Sign out</Button>
    </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => signIn({ username, password })}>Sign in</Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

// codeblock-focus-start
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
// codeblock-focus-end
```

</TabItem>
</Tabs>

## Fill in other components

We won't talk about how to implement the text inputs and buttons for the authentication screen, that is outside of the scope of navigation. We'll just fill in some placeholder content.

```js
function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => signIn({ username, password })}>Sign in</Button>
    </View>
  );
}
```

You can similarly fill in the other screens according to your requirements.

## Removing shared screens when auth state changes

Consider the following example:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
const RootStack = createNativeStackNavigator({
  groups: {
    LoggedIn: {
      if: useIsSignedIn,
      screens: {
        Home: HomeScreen,
        Profile: ProfileScreen,
      },
    },
    LoggedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: SignInScreen,
        SignUp: SignUpScreen,
      },
    },
  },
  screens: {
    Help: HelpScreen,
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
isSignedIn ? (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
  </>
) : (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
  </>
);
```

</TabItem>
</Tabs>

Here we have specific screens such as `SignIn`, `Home` etc. which are only shown depending on the sign in state. But we also have the `Help` screen which can be shown regardless of the login status. This also means that if the sign in state changes when the user is in the `Help` screen, they'll stay on the `Help` screen.

This can be a problem, we probably want the user to be taken to the `SignIn` screen or `Home` screen instead of keeping them on the `Help` screen.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

To make this work, we can move the `Help` screen to both of the groups instead of keeping it outside. This will ensure that the [`navigationKey`](screen.md#navigation-key) (the name of the group) for the screen changes when the sign in state changes.

So our updated code will look like the following:

```js
const RootStack = createNativeStackNavigator({
  groups: {
    LoggedIn: {
      if: useIsSignedIn,
      screens: {
        Home: HomeScreen,
        Profile: ProfileScreen,
        Help: HelpScreen,
      },
    },
    LoggedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: SignInScreen,
        SignUp: SignUpScreen,
        Help: HelpScreen,
      },
    },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

To make this work, we can use [`navigationKey`](screen.md#navigation-key). When the `navigationKey` changes, React Navigation will remove all the screen.

So our updated code will look like the following:

```js
<>
  {isSignedIn ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  )}
  <Stack.Screen
    navigationKey={isSignedIn ? 'user' : 'guest'}
    name="Help"
    component={HelpScreen}
  />
</>
```

If you have a bunch of shared screens, you can also use [`navigationKey` with a `Group`](group.md#navigation-key) to remove all of the screens in the group. For example:

```js
<>
  {isSignedIn ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  )}
  <Stack.Group navigationKey={isSignedIn ? 'user' : 'guest'}>
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Group>
</>
```

</TabItem>
</Tabs>

The examples above show stack navigator, but you can use the same approach with any navigator.

By specifying a condition for our screens, we can implement auth flow in a simple way that doesn't require additional logic to make sure that the correct screen is shown.

## Don't manually navigate when conditionally rendering screens

It's important to note that when using such a setup, you **don't manually navigate** to the `Home` screen by calling `navigation.navigate('Home')` or any other method. **React Navigation will automatically navigate to the correct screen** when `isSignedIn` changes - `Home` screen when `isSignedIn` becomes `true`, and to `SignIn` screen when `isSignedIn` becomes `false`. You'll get an error if you attempt to navigate manually.
