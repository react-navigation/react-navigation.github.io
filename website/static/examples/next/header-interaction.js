import * as React from 'react';
import { Button, Text, Image } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('@expo/snack-static/react-native-logo.png')}
    />
  );
}

function HomeScreen({ route }) {
  return <Text>Count: {route.params.count}</Text>;
}
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ count: 0 }}
          options={({ navigation, route }) => ({
            headerTitle: props => <LogoTitle {...props} />,
            headerRight: () => (
              <Button
                onPress={() =>
                  navigation.setParams({
                    count: route.params.count + 1,
                  })
                }
                title="Info"
                color="#00cc00"
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default App;
