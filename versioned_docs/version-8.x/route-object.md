---
id: route-object
title: Route object reference
sidebar_label: Route object
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Each `screen` component in your app is provided with the `route` object as a prop automatically. The prop contains information about the current route.

- `route`
  - `key` - Unique key of the screen. Created automatically or added while navigating to this screen.
  - `name` - Name of the screen. Defined in navigator component hierarchy.
  - `path` - An optional string containing the path that opened the screen. It exists when the screen was opened via a deep link.
  - `params` - An optional object containing params defined while navigating, e.g. `navigate('Twitter', { user: 'Jane Doe' })`.

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js name="Route prop" snack
import * as React from 'react';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      initialParams: { user: 'Jane Doe' },
    },
  },
});

// codeblock-focus-start
function ProfileScreen({ route }) {
  return (
    <View>
      <Text>This is the profile screen of the app</Text>
      <Text>{route.name}</Text>
      <Text>{route.path ?? 'No path'}</Text>
      <Text>{route.params?.user ?? 'No params'}</Text>
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
<TabItem value="dynamic" label="Dynamic">

```js name="Route prop" snack
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
      <Text>{route.path ?? 'No path'}</Text>
      <Text>{route.params?.user ?? 'No params'}</Text>
    </View>
  );
}
// codeblock-focus-end

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ user: 'Jane Doe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</TabItem>
</Tabs>
