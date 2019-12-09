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

function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);

  navigation.setOptions({
    headerRight: () => (
      <Button
        onPress={() => setCount(c => c + 1)}
        title="Update count"
      />
    ),
  });

  return <Text>Count: {count}</Text>;
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            headerTitle: props => <LogoTitle {...props} />,
          })}
        />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default App;
