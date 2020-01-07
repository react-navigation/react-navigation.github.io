import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// A very simple reducer
function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// A very simple store
let store = createStore(combineReducers({ count: counter }));

// A screen!
function Counter({ count, dispatch, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
      <Button
        title="Increment"
        onPress={() => dispatch({ type: 'INCREMENT' })}
      />
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: 'DECREMENT' })}
      />

      <Button
        title="Go to static count screen"
        onPress={() =>
          navigation.navigate('StaticCounter', {
            count,
          })
        }
      />
    </View>
  );
}

// Another screen!
function StaticCounter({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{route.params.count}</Text>
    </View>
  );
}

// Connect the screens to Redux
let CounterContainer = connect(state => ({ count: state.count }))(Counter);

// Create our stack navigator
let RootStack = createStackNavigator();

// Render the app container component with the provider around it
export default function App() {
  return (
    <Provider store={store}>
      <NavigationNativeContainer>
        <RootStack.Navigator>
          <RootStack.Screen name="Counter" component={CounterContainer} />
          <RootStack.Screen
            name="StaticCounter"
            component={StaticCounter}
            options={({ route }) => ({ title: route.params.count })}
          />
        </RootStack.Navigator>
      </NavigationNativeContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
