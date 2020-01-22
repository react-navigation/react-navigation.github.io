import * as React from 'react';
import { View, ScrollView, Image } from 'react-native';
import {
  NavigationNativeContainer,
  useScrollToTop,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function Albums() {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return (
    <ScrollView ref={ref}>
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="1"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="2"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="3"
      />
      <Image
        source={{ uri: 'https://facebook.github.io/react/logo-og.png' }}
        style={{ width: 400, height: 400 }}
        key="4"
      />
    </ScrollView>
  );
}

function HomeScreen() {
  return <View />;
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationNativeContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Albums" component={Albums} />
      </Tab.Navigator>
    </NavigationNativeContainer>
  );
}
