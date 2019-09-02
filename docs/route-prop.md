---
id: route-prop
title: Route prop reference
sidebar_label: Route prop
---

Each `screen` component in your app is provided with the `route` prop automatically. The prop contains various information regarding current route (place in navigation hierarchy component lives).

- `route`
  - `key` - key of the screen. Created automatically or added while navigating to this screen.
  - `name` - name of the screen. Defined in navigator component hierarchy.
  - `params` - set of params which is defined while navigating e.g. `navigate('Twitter', { user: 'Dan Abramov' })`.


```js
function ProfileScreen({ navigation: { route } }) {
  return (
    <View>
      <Text>This is the profile screen of the app</Text>
      <Text>{route.params.name}</Text>
    </View>
  );
}
```
