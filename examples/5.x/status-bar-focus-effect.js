import * as React from 'react';
import {
  Text,
  StatusBar,
  Button,
  StyleSheet,
  Platform,
  API,
} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function Screen1({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text style={{ color: '#fff' }}>Light Screen</Text>
      <Button
        title="Toggle Drawer"
        onPress={() => navigation.toggleDrawer()}
        color="#fff"
      />
    </SafeAreaView>
  );
}

function Screen2({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Text>Dark Screen</Text>
      <Button title="Toggle Drawer" onPress={() => navigation.toggleDrawer()} />
    </SafeAreaView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Screen1" component={Screen1} />
          <Drawer.Screen name="Screen2" component={Screen2} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
