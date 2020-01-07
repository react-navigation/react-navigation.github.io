import * as React from 'react';
import { View, Button, Text } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const navigationRef = React.createRef();

function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}

function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Settings"
        onPress={() => navigate('Settings', { userName: 'Lucy' })}
      />
    </View>
  );
}

function Settings({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello {route.params.userName}</Text>
      <Button title="Go to Home" onPress={() => navigate('Home')} />
    </View>
  );
}

const RootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationNativeContainer ref={navigationRef}>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="Settings" component={Settings} />
      </RootStack.Navigator>
    </NavigationNativeContainer>
  );
}
