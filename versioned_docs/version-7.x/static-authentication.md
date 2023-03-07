---
id: static-authentication
title: Authentication flow with static API
sidebar_label: Authentication flow
---

Most apps require that a user authenticate in some way to have access to data associated with a user or other private content. Typically the flow will look like this:

- The user opens the app.
- The app loads some authentication state from encrypted persistent storage (for example, [`SecureStore`](https://docs.expo.io/versions/latest/sdk/securestore/)).
- When the state has loaded, the user is presented with either authentication screens or the main app, depending on whether valid authentication state was loaded.
- When the user signs out, we clear the authentication state and send them back to authentication screens.

> Note: We say "authentication screens" because usually there is more than one. You may have a main screen with a username and password field, another for "forgot password", and another set for sign up.

## What we need

This is the behavior that we want from the authentication flow: when users sign in, we want to throw away the state of the authentication flow and unmount all of the screens related to authentication, and when we press the hardware back button we expect to not be able to go back to the authentication flow.

## How it will work

We can configure different screens to be available based on some condition. For example, if the user is signed in, we can define `Home`, `Profile`, `Settings` etc. If the user is not signed in, we can define `SignIn` and `SignUp` screens. To do this, we need a couple of things:

1. Define two hooks: `useIsSignedIn` and `useIsSignedOut`, which return a boolean value indicating whether the user is signed in or not.
2. Use the `useIsSignedIn` and `useIsSignedOut` along with the [`if`](static-api-reference.md#if) property to define the screens that are available based on the condition.

This tells React Navigation to show specific screens based on the signed in status. When the signed in status changes, React Navigation will automatically show the appropriate screen.

## Don't manually navigate when using `if` for conditional screens

It's important to note that when using such a setup, you **don't manually navigate** to the `Home` screen by calling `navigation.navigate('Home')` or any other method. **React Navigation will automatically navigate to the correct screen** when `isSignedIn` changes - `Home` screen when `isSignedIn` becomes `true`, and to `SignIn` screen when `isSignedIn` becomes `false`. You'll get an error if you attempt to navigate manually.

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
  const isSignedIn = React.useContext(SignInContext);
  return !isSignedIn;
}
```

We'll discuss how to expose the context value later.

## Define our screens

For our case, let's say we have 3 screens:

- `SplashScreen` - This will show a splash or loading screen when we're restoring the token.
- `SignIn` - This is the screen we show if the user isn't signed in already (we couldn't find a token).
- `Home` - This is the screen we show if the user is already signed in.

We'd have our navigation tree defined with these screens as follows:

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

Notice how we have only defined the `Home` and `SignIn` screens here, and not the `SplashScreen`. The `SplashScreen` should be rendered before we render any navigators so that we don't render incorrect screens before we know whether the user is signed in or not.

When we use this in our component, it'd look something like this:

```js
if (state.isLoading) {
  // We haven't finished checking for the token yet
  return <SplashScreen />;
}

const isSignedIn = state.userToken != null;

return (
  <SignInContext.Provider value={isSignedIn}>
    <Navigation />
  </SignInContext.Provider>
);
```

In the above snippet, `isLoading` means that we're still checking if we have a token. This can usually be done by checking if we have a token in `SecureStore` and validating the token. After we get the token and if it's valid, we need to set the `userToken`. We also have another state called `isSignout` to have a different animation on sign out.

Next, we're exposing the sign in status via the `SignInContext` so that it's available to the `useIsSignedIn` and `useIsSignedOut` hooks.

In the above example, we're have one screen for each case. But you could also define multiple screens. For example, you probably want to define password reset, signup, etc screens as well when the user isn't signed in. Similarly for the screens accessible after sign in, you probably have more than one screen. We can use [`groups`](static-api-reference.md#groups) to define multiple screens:

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

> If you have both your login-related screens and rest of the screens in Stack navigators, we recommend to use a single Stack navigator and place the conditional inside instead of using 2 different navigators. This makes it possible to have a proper transition animation during login/logout.

## Implement the logic for restoring the token

> Note: The following is just an example of how you might implement the logic for authentication in your app. You don't need to follow it as is.

From the previous snippet, we can see that we need 2 state variables:

- `isLoading` - We set this to `true` when we're trying to check if we already have a token saved in `SecureStore`
- `userToken` - The token for the user. If it's non-null, we assume the user is logged in, otherwise not.

So we need to:

- Add some logic for restoring token, sign in and sign out
- Expose methods for sign in and sign out to other components

We'll use `React.useReducer` and `React.useContext` in this guide. But if you're using a state management library such as Redux or Mobx, you can use them for this functionality instead. In fact, in bigger apps, a global state management library is more suitable for storing authentication tokens. You can adapt the same approach to your state management library.

First we'll need to create a context for auth where we can expose necessary methods:

```js
import * as React from 'react';

const AuthContext = React.createContext();
```

In our component, we will:

- Store the token and loading state in `useReducer`
- Persist it to `SecureStore` and read it from there on app launch
- Expose the methods for sign in and sign out to child components using `AuthContext`

So we'll have something like this:

```js
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

export default function App({ navigation }) {
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
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps
      // ...

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
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <SignInContext.Provider value={isSignedIn}>
        <Navigation />
      </SignInContext.Provider>
    </AuthContext.Provider>
  );
}
```

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
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}
```

You can similarly fill in the other screens according to your requirements.
