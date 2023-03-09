import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  NavigationContainer,
  NavigationContext,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return <SomeComponent />;
}

function SomeComponent() {
  // We can access navigation object via context
  const navigation = React.useContext(NavigationContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Some component inside HomeScreen</Text>
      <Button
        onPress={() => navigation.navigate('Profile')}
        title="Go to Profile"
      />
    </View>
  );
}


function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
