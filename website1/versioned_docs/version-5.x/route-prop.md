---
id: version-5.x-route-prop
title: Route prop reference
sidebar_label: Route prop
original_id: route-prop
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

You might also find a `state` property on the route object in some cases. This property contains the child navigator's state and may exist when you have a navigator inside this screen. It's important to note that **this property may be `undefined`** even if you have a child navigator. It gets initialized only after the first navigation in the child navigator. It's not recommended to use this property.
