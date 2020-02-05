---
id: version-5.x-params
title: Passing parameters to routes
sidebar_label: Passing parameters to routes
original_id: params
---

Remember when I said "more on that later when we talk about `params`!"? Well, the time has come.

Now that we know how to [create a stack navigator with some routes](hello-react-navigation.html) and [navigate between those routes](navigating.html), let's look at how we can pass data to routes when we navigate to them.

There are two pieces to this:

1. Pass params to a route by putting them in an object as a second parameter to the `navigation.navigate` function: `navigation.navigate('RouteName', { /* params go here */ })`

2. Read the params in your screen component: `route.params`.

> We recommend that the params you pass are JSON-serializable. That way, you'll be able to use [state persistence](state-persistence.html) and your screen components will have the right contract for implementing [deep linking](deep-linking.html).

<samp id="passing-params" />

```js
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId } = route.params;
  const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
```

![Screen with passed parameters](/docs/assets/navigators/passing_params.png)

## Summary

- `navigate` and `push` accept an optional second argument to let you pass parameters to the route you are navigating to. For example: `navigation.navigate('RouteName', {paramName: 'value'})`.
- You can read the params through `route.params`
