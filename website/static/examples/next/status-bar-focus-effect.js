import * as React from 'react';
import {
  Text,
  StatusBar,
  Button,
  StyleSheet,
  Platform,
  API,
} from 'react-native';
import {
  NavigationNativeContainer,
  useFocusEffect,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';

function Screen1({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#6a51ae');
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
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
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('#ecf0f1');
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <Text>Dark Screen</Text>
      <Button title="Toggle Drawer" onPress={() => navigation.toggleDrawer()} />
    </SafeAreaView>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationNativeContainer>
        <Drawer.Navigator headerMode="none">
          <Drawer.Screen name="Screen1" component={Screen1} />
          <Drawer.Screen name="Screen2" component={Screen2} />
        </Drawer.Navigator>
      </NavigationNativeContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
