---
id: auth-flow
title: Authentication flows
sidebar_label: Authentication flows
---

Most apps require that a user authenticate in some way to have access to data associated with a user or other private content. Typically the flow will look like this:

- The user opens the app.
- The app loads some authentication state from persistent storage (for example, `AsyncStorage`).
- When the state has loaded, the user is presented with either authentication screens or the main app, depending on whether valid authentication state was loaded.
- When the user signs out, we clear the authentication state and send them back to authentication screens.

> Note: We say "authentication screens" because usually there is more than one. You may have a main screen with a username and password field, another for "forgot password", and another set for sign up.

## What we need

This is the behavior that we want from the authentication flow: when users sign in, we want to throw away the state of the authentication flow and unmount all of the screens, and when we press the hardware back button we expect to not be able to go back to the authentication flow.

## Implement the logic for restoring the token

In our component, we'll keep 2 states:

- `isLoading` - We set this to `true` when we're trying to check if we already have a token saved in `AsyncStorage`
- `userToken` - The token for the user. If it's there, we assume the user is logged in, otherwise not.

So our component will look like this:

```js
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

export default function App({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(undefined);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem('userToken');

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setIsLoading(false);
      setUserToken(userToken);
    };

    bootstrapAsync();
  }, []);

  return (
    /* We'll render navigator content here */
  );
}
```

## Render the navigator content

In our navigator, we can conditionally render appropriate screens. For our case, let's say we have 3 screens:

- `LoadingScreen` - This will show a loading screen when we're restoring the token.
- `SignInScreen` - This is the screen we show if the user isn't signed in already (we couldn't find a token).
- `HomeScreen` - This is the screen we show if the user is already signed in.

So our navigator will look like:

```js
return (
  <Stack.Navigator>
    {isLoading ? (
      // We haven't finished checking for the token yet
      <Stack.Screen name="Splash" component={SplashScreen} />
    ) : userToken === undefined ? (
      // Notoken found, user isn't signed in
      <Stack.Screen name="SignIn">
        {() => <SignInScreen onSignIn={setUserToken} />}
      </Stack.Screen>
    ) : (
      // User is signed in
      <Stack.Screen name="Home" component={HomeScreen} />
    )}
  </Stack.Navigator>
);
```

In the above code snippet, we're conditionally defining screens:

- `Splash` screen is only defined if `isLoading` is `true`
- `SignIn` screen is only defined if `userToken` is `undefined`
- `Home` screen is only defined if `userToken` is defined

This takes advantage of a new feature in React Navigation: being able to dynamically define and alter the screen definitions of a navigator based on props or state. The example shows stack navigator, but you can use the same approach with any navigator.

> Note: The following explanation is useful for people coming from older versions of React Navigation. If React Navigation 5 is your first version, then you can skip to the next section.

In earlier versions of React Navigation, there were 2 ways to handle this:

1. Keep multiple navigators and use switch navigator to switch the active navigator to a different one upon login (recommended)
2. Reset the state of the navigator to the desired screens upon login

Both of these approaches were imperative. We needed to update the state to save your token, and then do a `navigate` or `reset` to change screens manually. Seems reasonable, right? But what happens when the user logs out? We need to update the state to delete the token, then `navigate` or `reset` again manually to show the login screen. We have to imperatively do the task twice already. Add more scenarios to this (e.g. unverified user, guest etc.) and it becomes even more complex.

But now, with above approach, we can declaratively say which screens should be accessible if user is logged in and which screens shouldn't be. If the user logs in or logs out, we update the `userToken` in state and the correct screens are shown automatically.

Another advantage of this approach is that all the screens are still under the stack navigator, which means they are animated like any other screens in the stack. For example, when the user logs in, the new screen will animate in smoothly instead of an abrupt screen change like with switch navigator. There is an experimental animated switch navigator, but the same animations as stack are not available.

## Fill in other components

We're conditionally defining one screen for each case here. But you could define multiple screens here too. For example, you probably want to defined password reset, signup, etc screens as well when the user isn't signed in. Similarly for your app, you probably have more than one screen. We can use `React.Fragment` to define multiple screens:

```js
userToken === undefined ? (
  <>
    <Stack.Screen name="SignIn">
      {() => <SignInScreen onSignIn={setUserToken} />}
    </Stack.Screen>
    <Stack.Screen name="SignUp">
      {() => <SignUpScreen onSignIn={setUserToken} />}
    </Stack.Screen>
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
function SignInScreen({ setUserToken }) {
  return (
    <View style={styles.content}>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Button
        mode="contained"
        onPress={() => setUserToken('token')}
        style={styles.button}
      >
        Sign in
      </Button>
    </View>
  );
}
```
