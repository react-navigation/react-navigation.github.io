import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation: { navigate } }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the home screen of the app</Text>
      <Button
        onPress={() =>
          navigate('Profile', { names: ['Brent', 'Satya', 'Michaś'] })
        }
        title="Go to Brent's profile"
      />
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Text>Friends: </Text>
      <Text>{route.params.names[0]}</Text>
      <Text>{route.params.names[1]}</Text>
      <Text>{route.params.names[2]}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Replace this screen with Settings"
        onPress={() =>
          navigation.replace('Settings', {
            someParam: 'Param',
          })
        }
      />
      <Button
        title="Reset navigator state to Settings"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Settings',
                params: { someParam: 'Param1' },
              },
            ],
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings', { someParam: 'Param1' })}
      />
    </View>
  );
}

function SettingsScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings screen</Text>
      <Text>{route.params.someParam}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        onPress={() =>
          navigation.navigate('Profile', {
            names: ['Brent', 'Satya', 'Michaś'],
          })
        }
        title="Go to Brent's profile"
      />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default App;
