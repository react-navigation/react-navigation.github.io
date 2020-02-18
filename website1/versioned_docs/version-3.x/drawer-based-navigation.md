---
id: version-3.x-drawer-based-navigation
title: Drawer navigation
sidebar_label: Drawer navigation
original_id: drawer-based-navigation
---
The drawer navigator allows you to present a navigation menu to your users. It can be customized out of the box, or you can completely control with a custom component.

This guide covers [createDrawerNavigator](drawer-navigator.html). 

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
    hideStatusBar: true,
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    overlayColor: '#6b52ae',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
  }
);

export default createAppContainer(DrawerNavigator);
```

<a href="https://snack.expo.io/@react-navigation/basic-drawer-v3" target="blank" class="run-code-button">&rarr; Run this code</a>

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

Additionally, you can automatically hide the status bar by passing the DrawerLayout prop of `hideStatusBar: true`.
