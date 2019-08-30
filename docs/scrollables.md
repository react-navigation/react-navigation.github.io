---
id: scrollables
title: Scrollables
sidebar_label: Scrollables
---

React Navigation exports its own `ScrollView`, `FlatList`, and `SectionList`. The built-in components are wrapped in order to respond to events from navigation that will scroll to top when tapping on the active tab as you would expect from native tab bars.

Example

```jsx harmony
import React from "react";
import { Text, View } from "react-native";
// TODO
import { createAppContainer, FlatList } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

const data = new Array(150).fill(0);

class HomeScreen extends React.Component {
  renderItem = ({ index }) => {
    return (
      <View style={{ height: 50 }}>
        <Text style={{ textAlign: "center" }}>Item {index}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Home: { screen: HomeScreen }
});

export default createAppContainer(TabNavigator);
```

<a href="https://snack.expo.io/@react-navigation/basic-scrollables-tab-v3" target="blank" class="run-code-button">&rarr; Run this code</a>
