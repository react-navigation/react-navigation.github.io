---
id: route-prop
title: Route prop reference
sidebar_label: Route prop
---

Each `screen` component in your app is provided with the `route` prop automatically. The prop contains various information regarding current route (place in navigation hierarchy component lives).

- `route`
  - `key` - Unique key of the screen. Created automatically or added while navigating to this screen.
  - `name` - Name of the screen. Defined in navigator component hierarchy.
  - `path` - An optional string containing the path that opened the screen, exists when the screen was opened via a deep link.
  - `params` - An optional object containing params which is defined while navigating e.g. `navigate('Twitter', { user: 'Dan Abramov' })`.

<samp id="route-prop" />

```js
function ProfileScreen({ route }) {
  return (
    <View>
      <Text>This is the profile screen of the app</Text>
      <Text>{route.name}</Text>
    </View>
  );
}
```
