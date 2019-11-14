import * as React from 'react';
import { Text, StatusBar, Button, StyleSheet } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';

function Screen1({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text style={{ color: '#fff' }}>Light Screen</Text>
      <Button title="Next screen" onPress={() => navigation.navigate('Screen2')} color="#fff" />
    </SafeAreaView>
  );
}

function Screen2({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Text>Dark Screen</Text>
      <Button title="Next screen" onPress={() => navigation.navigate('Screen1')} />
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationNativeContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationNativeContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
