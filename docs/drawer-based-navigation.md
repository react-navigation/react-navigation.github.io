---
id: drawer-based-navigation
title: Drawer navigation
sidebar_label: Drawer navigation
---
This guide covers [createDrawerNavigator](drawer-navigator.html). 
#TODO 
```js
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./chats-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Notifications',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./notif-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Notifications: {
    screen: MyNotificationsScreen,
  },
});

const MyApp = createAppContainer(MyDrawerNavigator);
```

To open and close drawer, use the following helpers to open and close the drawer:

```js
this.props.navigation.openDrawer();
this.props.navigation.closeDrawer();
```

If you would like to toggle the drawer you call the following:

```js
this.props.navigation.toggleDrawer();
```

Each of these functions, behind the scenes, are simply dispatching actions:

```js
this.props.navigation.dispatch(DrawerActions.openDrawer());
this.props.navigation.dispatch(DrawerActions.closeDrawer());
this.props.navigation.dispatch(DrawerActions.toggleDrawer());
```

If you would like to determine if drawer is open or closed, you can do the following:

```js
const parent = this.props.navigation.dangerouslyGetParent();
const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;
```
