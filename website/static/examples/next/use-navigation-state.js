import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationNativeContainer,
  useNavigationState,
} from '@react-navigation/native';

const BottomTabs = createBottomTabNavigator();

function TabScreen(props) {
  const routesLength = useNavigationState(state => state.routes.length);

  return (
    <View style={styles.container}>
      <Title>Tab {props.i}</Title>
      <Text>Number of routes: {routesLength}</Text>
      <Button onPress={() => props.setTabs(tabs => [...tabs, tabs.length])}>
        Add a tab
      </Button>
      <Button
        onPress={() =>
          props.setTabs(tabs => (tabs.length > 1 ? tabs.slice(0, -1) : tabs))
        }
      >
        Remove a tab
      </Button>
    </View>
  );
}

function BottomTabsScreen() {
  const [tabs, setTabs] = React.useState([0, 1]);

  return (
    <BottomTabs.Navigator>
      {tabs.map(i => (
        <BottomTabs.Screen
          key={i}
          name={`tab-${i}`}
          options={{
            title: `Tab ${i}`,
            tabBarIcon: ({ color, size }) => (
              <Feather name="octagon" color={color} size={size} />
            ),
          }}
        >
          {() => <TabScreen i={i} setTabs={setTabs} />}
        </BottomTabs.Screen>
      ))}
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationNativeContainer>
      <BottomTabsScreen />
    </NavigationNativeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
