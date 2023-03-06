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
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('DrawerOpen')}>
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
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('DrawerOpen')}>
          <Text>Open Drawer</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Settings</Text>
      </View>
    );
  }
}

const MyDrawerNavigator = new DrawerNavigator(
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

export default MyDrawerNavigator;
```

<a href="https://snack.expo.io/@react-navigation/basic-drawer-v1" target="blank" class="run-code-button">&rarr; Run this code</a>

To open and close drawer, navigate to `'DrawerOpen'` and `'DrawerClose'` respectively.

```js
this.props.navigation.navigate('DrawerOpen'); // open drawer
this.props.navigation.navigate('DrawerClose'); // close drawer
```

If you would like to toggle the drawer you can navigate to `'DrawerToggle'`, and this will choose which navigation is appropriate for you given the drawers current state.

```js
// fires 'DrawerOpen'/'DrawerClose' accordingly
this.props.navigation.navigate('DrawerToggle');
```
