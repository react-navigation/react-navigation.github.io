---
id: navigation-actions
title: CommonActions reference
sidebar_label: CommonActions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A navigation action is an object containing at least a `type` property. Internally, the action can be handled by [routers](custom-routers.md) with the `getStateForAction` method to return a new state from an existing [navigation state](navigation-state.md).

Each navigation actions can contain at least the following properties:

- `type` (required) - A string that represents the name of the action.
- `payload` (options) - An object containing additional information about the action. For example, it will contain `name` and `params` for `navigate`.
- `source` (optional) - The key of the route which should be considered as the source of the action. This is used for some actions to determine which route to apply the action on. By default, `navigation.dispatch` adds the key of the route that dispatched the action.
- `target` (optional) - The key of the [navigation state](navigation-state.md) the action should be applied on.

It's important to highlight that dispatching a navigation action doesn't throw any error when the action is unhandled (similar to when you dispatch an action that isn't handled by a reducer in redux and nothing happens).

## Common actions

The library exports several action creators under the `CommonActions` namespace. You should use these action creators instead of writing action objects manually.

### navigate

The `navigate` action allows to navigate to a specific route. It takes the following arguments:

- `name` - _string_ - A destination name of the screen in the current or a parent navigator.
- `params` - _object_ - Params to use for the destination route.
- `options` - Options object containing the following properties:
  - `merge` - _boolean_ - Whether params should be merged with the existing route params, or replace them (when navigating to an existing screen). Defaults to `false`.
  - `pop` - _boolean_ - Whether screens should be popped to navigate to a matching screen in the stack. Defaults to `false`.

```js name="Common actions navigate" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
          // codeblock-focus-end
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

In a stack navigator ([stack](stack-navigator.md) or [native stack](native-stack-navigator.md)), calling `navigate` with a screen name will have the following behavior:

- If you're already on a screen with the same name, it will update its params and not push a new screen.
- If you're on a different screen, it will push the new screen onto the stack.
- If the [`getId`](screen.md#id) prop is specified, it's treated similarly to the name,
  - If you're already on a screen with the same id, it will update its params and not push a new screen.
  - If you're on a different screen, it will push the new screen onto the stack.

<details>
<summary>Advanced usage</summary>

The `navigate` action can also accepts an object as the argument with the following properties:

- `name` - _string_ - A destination name of the screen in the current or a parent navigator
- `params` - _object_ - Params to use for the destination route.
- `merge` - _boolean_ - Whether params should be merged with the existing route params, or replace them (when navigating to an existing screen). Defaults to `false`.
- `pop` - _boolean_ - Whether screens should be popped to navigate to a matching screen (by name or id if `getId` is specified) in the stack. Defaults to `false`.
- `path` - _string_ - The path (from deep link or universal link) to associate with the screen. This is primarily used internally to associate a path with a screen when it's from a URL.

</details>

### reset

The `reset` action allows to reset the [navigation state](navigation-state.md) to the given state. It takes the following arguments:

- `state` - _object_ - The new [navigation state](navigation-state.md) object to use.

```js name="Common actions reset" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'Profile',
                  params: { user: 'jane', key: route.params.key },
                },
                { name: 'Home' },
              ],
            })
          );
          // codeblock-focus-end
        }}
      >
        Reset navigation state
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

The state object specified in `reset` replaces the existing [navigation state](navigation-state.md) with the new one. This means that if you provide new route objects without a key, or route objects with a different key, it'll remove the existing screens for those routes and add new screens.

If you want to preserve the existing screens but only want to modify the state, you can pass a function to `dispatch` where you can get the existing state. Then you can change it as you like (make sure not to mutate the existing state, but create new state object for your changes). and return a `reset` action with the desired state:

```js
import { CommonActions } from '@react-navigation/native';

navigation.dispatch((state) => {
  // Remove all the screens after `Profile`
  const index = state.routes.findIndex((r) => r.name === 'Profile');
  const routes = state.routes.slice(0, index + 1);

  return CommonActions.reset({
    ...state,
    routes,
    index: routes.length - 1,
  });
});
```

:::warning

Consider the navigator's state object to be internal and subject to change in a minor release. Avoid using properties from the [navigation state](navigation-state.md) state object except `index` and `routes`, unless you really need it. If there is some functionality you cannot achieve without relying on the structure of the state object, please open an issue.

:::

#### Rewriting the history with `reset`

Since the `reset` action can update the navigation state with a new state object, it can be used to rewrite the navigation history. However, rewriting the history to alter the back stack is not recommended in most cases:

- It can lead to a confusing user experience, as users expect to be able to go back to the screen they were on before.
- When supporting the Web platform, the browser's history will still reflect the old navigation state, so users will see the old screen if they use the browser's back button - resulting in 2 different experiences depending on which back button the user presses.

So if you have such a use case, consider a different approach - e.g. updating the history once the user navigates back to the screen that has changed.

### goBack

The `goBack` action creator allows to go back to the previous route in history. It doesn't take any arguments.

```js name="Common actions goBack" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(CommonActions.goBack());
          // codeblock-focus-end
        }}
      >
        Go back
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

If you want to go back from a particular route, you can add a `source` property referring to the route key and a `target` property referring to the `key` of the navigator which contains the route:

```js name="Common actions goBack" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch({
            ...CommonActions.goBack(),
            source: route.key,
            target: navigation.getState().key,
          });
          // codeblock-focus-end
        }}
      >
        Go back
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

By default, the key of the route that dispatched the action is passed as the `source` property and the `target` property is `undefined`.

### preload

The `preload` action allows preloading a screen in the background before navigating to it. It takes the following arguments:

- `name` - _string_ - A destination name of the screen in the current or a parent navigator.
- `params` - _object_ - Params to use for the destination route.

```js name="Common actions preload" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(
            CommonActions.preload('Profile', { user: 'jane' })
          );
          // codeblock-focus-end
        }}
      >
        Preload Profile
      </Button>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  const [startTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEndTime(Date.now());
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Text>Preloaded for: {endTime ? endTime - startTime : 'N/A'}ms</Text>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

Preloading a screen means that the screen will be rendered in the background. All the components in the screen will be mounted and the `useEffect` hooks will be called. This can be useful when you want to improve the perceived performance by hiding the delay in mounting heavy components or loading data.

Depending on the navigator, `preload` may work differently:

- In a stack navigator ([stack](stack-navigator.md), [native stack](native-stack-navigator.md)), the screen will be rendered off-screen and animated in when you navigate to it. If [`getId`](screen.md#id) is specified, it'll be used for the navigation to identify the preloaded screen.
- In a tab or drawer navigator ([bottom tabs](bottom-tab-navigator.md), [material top tabs](material-top-tab-navigator.md), [drawer](drawer-navigator.md), etc.), the existing screen will be rendered as if `lazy` was set to `false`. Calling `preload` on a screen that is already rendered will not have any effect.

When a screen is preloaded in a stack navigator, it can't dispatch navigation actions (e.g. `navigate`, `goBack`, etc.) until it becomes active.

### setParams

The `setParams` action allows to replace params for a certain route. It takes the following arguments:

- `params` - _object_ - required - New params to be merged into existing route params.

```js name="Common actions setParams" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(CommonActions.setParams({ user: 'Wojtek' }));
          // codeblock-focus-end
        }}
      >
        Set user param
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

If you want to replace params for a particular route, you can add a `source` property referring to the route key:

```js name="Common actions setParams" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch({
            ...CommonActions.setParams({ user: 'Wojtek' }),
            source: route.key,
          });
          // codeblock-focus-end
        }}
      >
        Set user param
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

If the `source` property is explicitly set to `undefined`, it'll replace the params for the focused route.

### replaceParams

The `replaceParams` action allows to replace params for a certain route. It takes the following arguments:

- `params` - _object_ - required - New params to use for the route.

```js name="Common actions replaceParams" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(CommonActions.replaceParams({ user: 'Wojtek' }));
          // codeblock-focus-end
        }}
      >
        Replace params with user
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

If you want to replace params for a particular route, you can add a `source` property referring to the route key:

```js name="Common actions replaceParams" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home!</Text>
      <Button
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate('Profile', { user: 'jane' })
          );
        }}
      >
        Navigate to Profile
      </Button>
      <Button onPress={() => navigation.dispatch(CommonActions.goBack())}>
        Go back
      </Button>
    </View>
  );
}

function ProfileScreen({ route }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile!</Text>
      <Text>{route.params.user}'s profile</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch({
            ...CommonActions.replaceParams({ user: 'Wojtek' }),
            source: route.key,
          });
          // codeblock-focus-end
        }}
      >
        Replace params with user
      </Button>
    </View>
  );
}

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

If the `source` property is explicitly set to `undefined`, it'll replace the params for the focused route.

### pushParams

The `pushParams` action allows to add a new entry to the history stack with new params. It takes the following arguments:

- `params` - _object_ - required - New params to use for the route.

```js name="Common actions pushParams" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-navigation/elements';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function ProductListScreen({ route }) {
  const navigation = useNavigation();
  const filter = route.params?.filter || 'all';

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Product List</Text>
      <Text>Filter: {filter}</Text>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(CommonActions.pushParams({ filter: 'popular' }));
          // codeblock-focus-end
        }}
      >
        Show popular
      </Button>
      <Button
        onPress={() => {
          // codeblock-focus-start
          navigation.dispatch(CommonActions.pushParams({ filter: 'new' }));
          // codeblock-focus-end
        }}
      >
        Show new
      </Button>
      <Button
        onPress={() => {
          navigation.dispatch(CommonActions.goBack());
        }}
      >
        Go back
      </Button>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Settings</Text>
    </View>
  );
}

const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    backBehavior: 'history',
  },
  screens: {
    ProductList: ProductListScreen,
    Settings: SettingsScreen,
  },
});

const Navigation = createStaticNavigation(HomeTabs);

export default function App() {
  return <Navigation />;
}
```

Unlike `setParams`, the `pushParams` action does not merge the new params with the existing ones. Instead, it uses the new params object as-is and adds a new entry to the history stack.

The action works in all navigators, such as stack, tab, and drawer. This allows adding a new entry to the history stack without needing to push a new screen instance.

This can be useful in various scenarios:

- A product listing page with filters, where changing filters should create a new history entry so that users can go back to previous filter states.
- A screen with a custom modal component, where the modal is not a separate screen in the navigator, but its state should be reflected in the URL and history.

If you want to push params for a particular route, you can add a `source` property referring to the route key:

```js
navigation.dispatch({
  ...CommonActions.pushParams({ filter: 'popular' }),
  source: route.key,
});
```

If the `source` property is explicitly set to `undefined`, it'll push params for the focused route.
