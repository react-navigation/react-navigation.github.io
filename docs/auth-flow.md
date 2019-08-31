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

> Note: we say "authentication screens" because usually there is more than one. You may have a main screen with a username and password field, another for "forgot password", and another set for sign up.

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
  <SimpleStack.Navigator>
    {isLoading ? (
      // We haven't finished checking for the token yet
      <SimpleStack.Screen name="splash" component={Splash} />
    ) : userToken === undefined ? (
      // Notoken found, user isn't signed in
      <SimpleStack.Screen name="sign-in">
        {() => <SignInScreen onSignIn={setUserToken} />}
      </SimpleStack.Screen>
    ) : (
      // User is signed in
      <SimpleStack.Screen name="home" component={HomeScreen} />
    )}
  </SimpleStack.Navigator>
);
```

## Fill in other components

We're conditionally defining one screen for each case here. But you could define multiple screens here too. For example, you probably want to defined password reset, signup, etc screens as well when the user isn't signed in. Similarly for your app, you probably have more than one screen. We can use `React.Fragment` to define multiple screens:

```js
userToken === undefined ? (
  <>
    <SimpleStack.Screen name="sign-in">
      {() => <SignInScreen onSignIn={setUserToken} />}
    </SimpleStack.Screen>
    <SimpleStack.Screen name="sign-up">
      {() => <SignUpScreen onSignIn={setUserToken} />}
    </SimpleStack.Screen>
    <SimpleStack.Screen name="reset-password" component={ResetPassword} />
  </>
) : (
  <>
    <SimpleStack.Screen name="home" component={HomeScreen} />
    <SimpleStack.Screen name="profile" component={ProfileScreen} />
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
