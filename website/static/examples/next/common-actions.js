import * as React from 'react';
import { View, Button, Text } from 'react-native';
import {
  NavigationNativeContainer,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Navigate to Profile"
        onPress={() =>
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Profile',
              params: {
                user: 'jane',
              },
            })
          )
        }
      />
      <Button
        title="Replace screen with Profile"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.replace('Profile', {
              user: 'jane',
            }),
            source: route.key,
          })
        }
      />
      <Button
        title="Go back"
        onPress={() => navigation.dispatch(CommonActions.goBack())}
      />
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        title="Navigate to Home"
        onPress={() =>
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Home',
            })
          )
        }
      />
      <Button
        title="Reset navigation state"
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'Profile',
                  params: { user: 'jane', key: route.params.key },
                },
                { name: 'Home' },
              ],
            })
          )
        }
      />
      <Button
        title="Replace screen with Profile"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.replace('Profile', {
              user: 'jane',
            }),
            source: route.key,
          })
        }
      />
      <Button
        title="Change user param"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.setParams({ user: 'Wojtek' }),
            source: route.key,
          })
        }
      />
      <Button
        title="Go back"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.goBack(),
            source: route.key,
            target: route?.params?.key,
          })
        }
      />
    </View>
  );
}

const Tab = createStackNavigator();

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
