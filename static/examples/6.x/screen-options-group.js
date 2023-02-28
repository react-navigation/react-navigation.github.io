import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ScreenWithButton(screenName, navigateTo) {
  return function ({ navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>`{screenName} Screen`</Text>
        {navigateTo && (
          <Button
            title={`Go to ${navigateTo}`}
            onPress={() => navigation.navigate(navigateTo)}
          />
        )}
      </View>
    );
  };
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}
        >
          <Stack.Screen
            name="Home"
            component={ScreenWithButton('Home', 'Profile')}
          />
          <Stack.Screen
            name="Profile"
            component={ScreenWithButton('Profile', 'Settings')}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="Settings"
            component={ScreenWithButton('Settings', 'Share')}
          />
          <Stack.Screen name="Share" component={ScreenWithButton('Share')} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
