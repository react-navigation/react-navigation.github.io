---
id: custom-navigators
title: Custom navigators
sidebar_label: Custom navigators
---

Navigators allow you to define your application's navigation structure. Navigators also render common elements such as headers and tab bars which you can configure.

Under the hood, navigators are plain React components.

## Built-in Navigators

We include some commonly needed navigators such as:

- [`createStackNavigator`](stack-navigator.html) - Renders one screen at a time and provides transitions between screens. When a new screen is opened it is placed on top of the stack.
- [`createDrawerNavigator`](drawer-navigator.html) - Provides a drawer that slides in from the left of the screen.
- [`createBottomTabNavigator`](bottom-tab-navigator.html) - Renders a tab bar that lets the user switch between several screens.
- [`createMaterialTopTabNavigator`](material-top-tab-navigator.html) - Renders tab view which lets the user switch between several screens using swipe gesture or the tab bar.
- [`createMaterialBottomTabNavigator`](material-bottom-tab-navigator.html) - Renders tab view which lets the user switch between several screens using swipe gesture or the tab bar.

## Extending Navigators

> TODO: We haven't written this guide yet. Please check back later.

## API for building custom navigators

A navigator bundles a router and a view which takes the navigation state and decides how to render it. We export a `useNavigationBuilder` hook to build custom navigators that integrate with rest of React Navigation.

### `useNavigationBuilder`

This hook allows a component to hook into React Navigation. It accepts the following arguments:

- `createRouter` - A factory method which returns a router object (e.g. `StackRouter`, `TabRouter`).
- `options` - Options for the hook and the router. The navigator should forward its props here so that user can provide props to configure the navigator. By default, the following options are accepted:

  - `children` (required) - The `children` prop should contain route configurations as `Screen` components.
  - `screenOptions` - The `screenOptions` prop should contain default options for all of the screens.
  - `initialRouteName` - The `initialRouteName` prop determines the screen to focus on initial render. This prop is forwarded to the router.

  If any other options are passed here, they'll be forwarded to the router.

The hook returns an object with following properties:

- `state` - The navigation state for the navigator. The component can take this state and decide how to render it.
- `navigation` - The navigation object containing various helper methods for the navigator to manipulate the navigation state. This isn't the same as the navigation object for the screen and includes some helpers such as `emit` to emit events to the screens.
- `descriptors` - This is an object containing descriptors for each route with the route keys as it's properties. The descriptor for a route can be accessed by `descriptors[route.key]`. Each descriptor contains the following properties:

  - `navigation` - The navigation prop for the screen. You don't need to pass this to the screen manually. But it's useful if we're rendering components outside the screen that need to receive `navigation` prop as well, such as a header component.
  - `options` - A getter which returns the options such as `title` for the screen if they are specified.
  - `render` - A function which can be used to render the actual screen. Calling `descriptors[route.key].render()` will return a React element containing the screen content. It's important to use this method to render a screen, otherwise any child navigators won't be connected to the navigation tree properly.

Example:

```js
import { useNavigationBuilder } from '@react-navigation/core';
import { TabRouter, TabActions } from '@react-navigation/routers';

function TabNavigator({ initialRouteName, children, screenOptions, ...rest }) {
  const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  return (
    <React.Fragment>
      <View>
        {state.routes.map(route => (
          <TouchableOpacity
            key={route.key}
            onPress={() =>
              navigation.dispatch({
                ...TabActions.jumpTo(route.name),
                target: state.key,
              })
            }
            style={{ flex: 1 }}
          >
            <Text>{descriptors[route.key].options.title || route.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {state.routes.map(route => descriptors[route.key].render())}
      </View>
    </React.Fragment>
  );
}
```

The `navigation` object for navigators also has an `emit` method to emit custom events to the child screens. The usage looks like this:

```js
navigation.emit({
  type: 'transitionStart',
  data: { blurring: false },
  target: route.key,
});
```

The `data` is available under the `data` property in the `event` object, i.e. `event.data`.

The `target` property determines the screen that will receive the event. If the `target` property is omitted, the event is dispatched to all screens in the navigator.

### `createNavigator`

This function is used to create a Navigator and Screen pair. Custom navigators need to wrap the navigator component in `createNavigator` before exporting.

Example:

```js
import { useNavigationBuilder, createNavigator } from '@react-navigation/core';

// ...

export default createNavigator(TabNavigator);
```

## Type-checking navigators

> TODO: We haven't written this guide yet. Please check back later.
