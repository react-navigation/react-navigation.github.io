import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function App() {
  const ref = React.useRef(null);

  return (
    <View style={{ flex: 1 }}>
      <NavigationNativeContainer ref={ref}>
        <Stack.Navigator initialRouteName="Empty">
          <Stack.Screen name="Empty" component={() => <View></View>} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationNativeContainer>
      <Button
        onPress={() => ref.current && ref.current.navigate('Home')}
        title="Go home"
      />
    </View>
  );
}

export default App;
