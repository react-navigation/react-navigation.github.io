---
id: navigating
title: Moving between screens
sidebar_label: Moving between screens
---

In the previous section, ["Hello React Navigation"](__TODO__), we defined a `StackNavigator` with two routes (`Home` and `Details`), but we didn't learn how to let a user navigate from from `Home` to `Details` (although we did learn how to change the _initial_ route in our code).

If this was a web browser, we'd be able to write something like this:

```
<a href="details.html">Go to Details</a>
```

Another way to write this would be:

```
<a onClick={() => { document.location.href = "details.html"; }}>Go to Details</a>
```

We'll do something similar to the latter, but rather than use a `document` global we'll use the `navigation` prop that is passed in our screen components.

## Navigating to the Details route

```js
import React from 'react';
import { Button, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

// ... other code from the previous section
```
<a href="https://snack.expo.io/@react-navigation/our-first-navigate" target="blank" class="run-code-button">&rarr; Run this code</a>

Let's break down this down:

* `this.props.navigation`: the `navigation` prop is passed in to every *screen* component in `StackNavigator` (more about this later in ["The navigation prop in depth"](navigation-prop.html)).
* `navigate('Details')`: we call the `navigate` function (on the `navigation` prop - naming is hard!) with the name of the route that we'd like to move the user to.

> If we call `this.props.navigation.navigate` with a route name that we haven't defined on a `StackNavigator`, nothing will happen. Said another way, we can only navigate to routes that have been defined on our `StackNavigator` -- we cannot navigate to an arbitrary component.

So we now have a stack with two routes: 1) the Home route 2) the Details route. What would happen if we navigated to the Details route again, from the Details screen?

## Going to the Details route... again?

```js
class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}
```
<a href="https://snack.expo.io/@react-navigation/navigating-to-details-again" target="blank" class="run-code-button">&rarr; Run this code</a>



## Going backwards

> talk about android back button
