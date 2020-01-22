import * as React from 'react';
import { Button, View, Text } from 'react-native';
import {
  NavigationNativeContainer,
  NavigationContext,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  return <SomeComponent />;
}

class SomeComponent extends React.Component {
  static contextType = NavigationContext;

  render() {
    // We can access navigation object via context
    const navigation = this.context;
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
}

function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
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
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default App;
