import * as React from 'react';
import { Alert, View, TextEditText, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const EditTextScreen = ({ navigation }) => {
  const [text, setText] = React.useState('');

  const hasUnsavedChanges = Boolean(text);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        const action = e.data.action;
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(action),
            },
          ]
        );
      }),
    [hasUnsavedChanges, navigation]
  );

  return (
    <View style={styles.content}>
      <TextEditText
        autoFocus
        style={styles.input}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.buttons}>
      <Button
        mode="contained"
        onPress={() => navigation.push('EditText')}
        style={styles.button}
      >
        Push EditText
      </Button>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditText" component={EditTextScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'white',
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
