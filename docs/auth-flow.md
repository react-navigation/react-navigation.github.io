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

## Set up our navigators

```js
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


 export default function SimpleStackScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState<string | undefined>(
    undefined
  );

   return (
    <SimpleStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <HeaderBackButton onPress={() => navigation.goBack()} />
        ),
      }}
    >
      {isLoading ? (
        <SimpleStack.Screen
          name="splash"
          options={{ title: `Auth Flow` }}
        >
          {() => <SplashScreen setIsLoading={setIsLoading} setUserToken={setUserToken} />}
        </SimpleStack.Screen>
      ) : userToken === undefined ? (
        <SimpleStack.Screen name="sign-in" options={{ title: `Sign in` }}>
          {() => <SignInScreen setUserToken={setUserToken} />}
        </SimpleStack.Screen>
      ) : (
        <SimpleStack.Screen name="home" options={{ title: 'Home' }}>
          {() => <HomeScreen setUserToken={setUserToken} />}
        </SimpleStack.Screen>
      )}
    </SimpleStack.Navigator>
  );
}

```


This is the behavior that we want from the authentication flow: when users sign in, we want to throw away the state of the authentication flow and unmount all of the screens, and when we press the hardware back button we expect to not be able to go back to the authentication flow.

## Implement our authentication loading screen

```js
import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";

function AuthLoadingScreen({ setIsLoading, setUserToken }) {
  React.useEffect(() => this._bootstrapAsync();)

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("userToken");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    setIsLoading(false);
    setUserToken(userToken);
  };

  // Render any loading content that you like here
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
}
```


## Fill in other components

Our `App` and `Auth` routes are both stack navigators, but you could do whatever you like here. As mentioned above, you probably want your authentication route to be a stack for password reset, signup, etc. Similarly for your app, you probably have more than one screen. We won't talk about how to implement the text inputs and buttons for the authentication screen, that is outside of the scope of navigation. We'll just fill in some placeholder content.

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
};
```
