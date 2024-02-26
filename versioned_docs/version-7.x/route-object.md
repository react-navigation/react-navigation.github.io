---
id: route-object
title: Route object reference
sidebar_label: Route object
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Each `screen` component in your app is provided with the `route` object as a prop automatically. The prop contains various information regarding current route (place in navigation hierarchy component lives).

- `route`
  - `key` - Unique key of the screen. Created automatically or added while navigating to this screen.
  - `name` - Name of the screen. Defined in navigator component hierarchy.
  - `path` - An optional string containing the path that opened the screen, exists when the screen was opened via a deep link.
  - `params` - An optional object containing params which is defined while navigating e.g. `navigate('Twitter', { user: 'Dan Abramov' })`.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Route prop" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator({
  screens: {
    Profile: ProfileScreen,
  },
});

// codeblock-focus-start
function ProfileScreen({ route }) {
  return (
    <View>
      <Text>This is the profile screen of the app</Text>
      <Text>{route.name}</Text>
    </View>
  );
}
// codeblock-focus-end

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return <Navigation />;
}
```

</TabItem>
<TabItem value="dynamic" label="Dynamic" default>

```js name="Route prop" snack version=7
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// codeblock-focus-start
function ProfileScreen({ route }) {
  return (
    <View>
      <Text>This is the profile screen of the app</Text>
      <Text>{route.name}</Text>
    </View>
  );
}
// codeblock-focus-end

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>
