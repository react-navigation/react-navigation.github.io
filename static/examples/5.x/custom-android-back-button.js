import * as React from 'react';
import {
  Pressable,
  Text,
  View,
  Button,
  BackHandler,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const listData = [{ key: 'Apple' }, { key: 'Orange' }, { key: 'Carrot' }];

function ScreenWithCustomBackBehavior() {
  const [selected, setSelected] = React.useState(listData[0].key);
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] =
    React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled) {
          setIsSelectionModeEnabled(false);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [isSelectionModeEnabled])
  );

  return (
    <View style={styles.container}>
      {listData.map((item) => (
        <>
          {isSelectionModeEnabled ? (
            <Pressable
              onPress={() => {
                setSelected(item.key);
              }}
              style={{
                textDecorationLine: item.key === selected ? 'underline' : '',
              }}
            >
              <Text
                style={{
                  textDecorationLine: item.key === selected ? 'underline' : '',
                  ...styles.text,
                }}
              >
                {item.key}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.text}>
              {item.key === selected ? 'Selected: ' : ''}
              {item.key}
            </Text>
          )}
        </>
      ))}
      <Button
        title="Toggle selection mode"
        onPress={() => setIsSelectionModeEnabled(!isSelectionModeEnabled)}
      />
      <Text>Selection mode: {isSelectionModeEnabled ? 'ON' : 'OFF'}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CustomScreen"
          component={ScreenWithCustomBackBehavior}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
