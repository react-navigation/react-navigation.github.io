---
id: version-5.x-auth-flow
title: Authentication flows
sidebar_label: Authentication flows
original_id: auth-flow
---

Most apps require that a user authenticate in some way to have access to data associated with a user or other private content. Typically the flow will look like this:

- The user opens the app.
- The app loads some authentication state from persistent storage (for example, `AsyncStorage`).
- When the state has loaded, the user is presented with either authentication screens or the main app, depending on whether valid authentication state was loaded.
- When the user signs out, we clear the authentication state and send them back to authentication screens.

> Note: We say "authentication screens" because usually there is more than one. You may have a main screen with a username and password field, another for "forgot password", and another set for sign up.

## What we need

This is the behavior that we want from the authentication flow: when users sign in, we want to throw away the state of the authentication flow and unmount all of the screens related to authentication, and when we press the hardware back button we expect to not be able to go back to the authentication flow.

## Implement the logic for restoring the token

In our component, we'll keep 2 states:

- `isLoading` - We set this to `true` when we're trying to check if we already have a token saved in `AsyncStorage`
- `userToken` - The token for the user. If it's non-null, we assume the user is logged in, otherwise not.

So we need to:

- Add some logic for restoring token, sign in and sign out
- Expose methods for sign in and sign out to other components

We'll use `React.useReducer` and `React.useContext` in this guide. But if you're using a state management library such as Redux or Mobx, you can use them for this functionality instead. In fact, in bigger apps, a global state management library is more suitable for storing authentication tokens.

First we'll need to create a context for auth where we can expose necessary methods:

```js
import * as React from 'react';

const AuthContext = React.createContext();
```

So our component will look like this:

```js
import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

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
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: undefined,
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
        userToken = await AsyncStorage.getItem('userToken');
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
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      {/* We'll render navigator content here */}
    </AuthContext.Provider>
  );
}
```

## Render the navigator content

In our navigator, we can conditionally render appropriate screens. For our case, let's say we have 3 screens:

- `SplashScreen` - This will show a splash or loading screen when we're restoring the token.
- `SignInScreen` - This is the screen we show if the user isn't signed in already (we couldn't find a token).
- `HomeScreen` - This is the screen we show if the user is already signed in.

So our navigator will look like:

<samp id="auth-flow" />

```js
return (
  <AuthContext.Provider value={authContext}>
    <Stack.Navigator>
      {state.isLoading ? (
        // We haven't finished checking for the token yet
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : state.userToken === null ? (
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
  </AuthContext.Provider>
);
```

In the above code snippet, we're conditionally defining screens:

- `Splash` screen is only defined if `isLoading` is `true`
- `SignIn` screen is only defined if `userToken` is `null`
- `Home` screen is only defined if `userToken` is non-null

This takes advantage of a new feature in React Navigation: being able to dynamically define and alter the screen definitions of a navigator based on props or state. The example shows stack navigator, but you can use the same approach with any navigator.

> Note: The following explanation is useful for people coming from older versions of React Navigation. If React Navigation 5 is your first version, then you can skip to the next section.

In earlier versions of React Navigation, there were 2 ways to handle this:

1. Keep multiple navigators and use switch navigator to switch the active navigator to a different one upon login (recommended)
2. Reset the state of the navigator to the desired screens upon login

Both of these approaches were imperative. We needed to update the state to save your token, and then do a `navigate` or `reset` to change screens manually. Seems reasonable, right? But what happens when the user logs out? We need to update the state to delete the token, then `navigate` or `reset` again manually to show the login screen. We have to imperatively do the task twice already. Add more scenarios to this (e.g. unverified user, guest etc.) and it becomes even more complex.

But with the above approach, you can declaratively say which screens should be accessible if user is logged in and which screens shouldn't be. If the user logs in or logs out, you update the `userToken` in state and the correct screens are shown automatically.

To summarize the benefits:

- No need for manually navigating to correct screen on log in or log out, correct screens are shown automatically.
- If the user is not logged in, it's impossible to navigate to screens which need the user to be logged in (e.g. from a deep link, restoring persisted state), which means you don't need to deal with inconsistent states.
- Since all our screens are under the stack navigator, we get smooth animations after log in or log out unlike the abrupt screen change with switch navigator.

This pattern has been in use by other routing libraries such as React Router for a long time, and is commonly knows as "Protected routes". Here, our screens which need the user to be logged in are "protected" and cannot be navigated to by other means if the user is not logged in.

## Fill in other components

We're conditionally defining one screen for each case here. But you could define multiple screens here too. For example, you probably want to defined password reset, signup, etc screens as well when the user isn't signed in. Similarly for your app, you probably have more than one screen. We can use `React.Fragment` - to define multiple screens:

```js
state.userToken == null ? (
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
