import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Go to profile"
        onPress={() => navigation.jumpTo('Profile', { owner: 'Michaś' })}
      />
    </View>
  );
}

function ProfileScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
      <Text>
        {route?.params?.owner ? `${route.params.owner}'s Profile` : ''}
      </Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationNativeContainer>
  );
}
