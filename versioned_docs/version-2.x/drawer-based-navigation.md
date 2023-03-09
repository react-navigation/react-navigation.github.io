---
id: drawer-based-navigation
title: Drawer navigation
sidebar_label: Drawer navigation
---

```js
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={this.props.navigation.openDrawer}>
          <Text>Open Drawer</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Home</Text>
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={this.props.navigation.openDrawer}>
          <Text>Open Drawer</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Settings</Text>
      </View>
    );
  }
}

const DrawerNavigator = createDrawerNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
  {
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
  }
);

export default createAppContainer(DrawerNavigator);
```

<a href="https://snack.expo.io/@react-navigation/basic-drawer-v2" target="blank" class="run-code-button">&rarr; Run this code</a>

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
