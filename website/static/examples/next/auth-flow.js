import * as React from 'react';
import { AsyncStorage, Button, Text, TextInput, View } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View>
      <Text>Signed in!</Text>
    </View>
  );
}

function SignInScreen({ onSignIn }) {
  return (
    <View>
      <View>
        <Text>Name: </Text>
        <TextInput placeholder="Username" />
        <Text>Password: </Text>
        <TextInput placeholder="Password" secureTextEntry />
        <Button
          title="Sign in"
          mode="contained"
          onPress={() => onSignIn('token')}
        />
      </View>
    </View>
  );
}

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
            userToken: undefined,
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

  const Stack = createStackNavigator();

  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : state.userToken === null ? (
          // No token found, user isn't signed in
          <Stack.Screen name="SignIn">
            {() => (
              <SignInScreen
                onSignIn={token => {
                  // In a real app, you should also store this token in async storage
                  dispatch({ type: 'SIGN_IN', token });
                }}
              />
            )}
          </Stack.Screen>
        ) : (
          // User is signed in
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}
