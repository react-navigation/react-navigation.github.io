import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const getIsSignedIn = () => {
  // custom logic
  return true;
};

function EmptyScreen() {
  return <View />;
}

export default function App() {
  const isSignedIn = getIsSignedIn();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={EmptyScreen} />
            <Stack.Screen name="Profile" component={EmptyScreen} />
            <Stack.Screen name="Settings" component={EmptyScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={EmptyScreen} />
            <Stack.Screen name="SignUp" component={EmptyScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
