---
id: params
title: Passing parameters to routes
sidebar_label: Passing parameters to routes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Now that we know how to [navigate between routes](navigating.md), let's look at how to pass data to routes when navigating.

## Passing params

Params can be passed to screens as the second argument to navigation methods like [`navigate`](navigation-actions.md#navigate), [`push`](stack-actions.md#push), or [`jumpTo`](tab-actions.md#jumpto):

```js
navigation.navigate('Details', {
  itemId: 86,
  otherParam: 'anything you want here',
});
```

:::note

Params should be JSON-serializable to support [state persistence](state-persistence.md) and [deep linking](deep-linking.md).

:::

## Reading params

Params can be read from the `params` property of the `route` object. There are 2 ways to access the `route` object:

1. Your screen components receive `route` as a prop:

   ```js
   // highlight-next-line
   function DetailsScreen({ route }) {
     // Access params from route.params
     const { itemId, otherParam } = route.params;

     return (
       // ...
     );
   }
   ```

2. You can use the [`useRoute`](use-route.md) hook in any component inside your screen:

   ```js
   import { useRoute } from '@react-navigation/native';

   function SomeComponent() {
     // highlight-next-line
     const route = useRoute('Details');
     const { itemId, otherParam } = route.params;

     return (
       // ...
     );
   }
   ```

   The `useRoute` hook takes the name of the current screen (or any parent screen) as an argument, and returns the route object containing the params for that screen.

In this example, the `HomeScreen` passes params to the `DetailsScreen`. The `DetailsScreen` then reads and displays those params:

```js name="Passing params" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          // highlight-start
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
          // highlight-end
        }}
      >
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen({ route }) {
  const navigation = useNavigation('Details');

  /* 2. Get the param */
  // highlight-next-line
  const { itemId, otherParam } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        onPress={
          () =>
            // highlight-start
            navigation.push('Details', {
              // Randomly generate an ID for demonstration purposes
              itemId: Math.floor(Math.random() * 100),
            })
          // highlight-end
        }
      >
        Go to Details... again
      </Button>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
    Details: createNativeStackScreen({
      screen: DetailsScreen,
    }),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/passing-params.mp4" />
</video>

## Initial params

You can specify default params for a screen using `initialParams`. These are used when no params are passed during navigation, and are shallow merged with any params you do pass:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
createNativeStackScreen({
  Details: {
    screen: DetailsScreen,
    // highlight-next-line
    initialParams: { itemId: 42 },
  },
});
```

</TabItem>
<TabItem value="dynamic" label="Dynamic">

```js
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  // highlight-next-line
  initialParams={{ itemId: 42 }}
/>
```

</TabItem>
</Tabs>

## Updating params

Screens can also update their params, like they can update their state. There are few ways to do this:

- [`setParams`](navigation-actions.md#setparams) - updates the params by merging new params object with existing params
- [`replaceParams`](navigation-actions.md#replaceparams) - replaces the params with new params object
- [`pushParams`](navigation-actions.md#pushparams) - pushes a new entry in the history stack with the new params object

All of these methods are available on the `navigation` object and they take a params object as their argument.

Example:

```js name="Updating params" snack static2dynamic
import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen({ route }) {
  const navigation = useNavigation('Home');
  const { itemId } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.setParams({
              itemId: Math.floor(Math.random() * 100),
            })
          // codeblock-focus-end
        }
      >
        Update param
      </Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
      initialParams: { itemId: 42 },
    }),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

:::note

Avoid using `setParams`, `replaceParams`, or `pushParams` to update screen options such as `title` etc. If you need to update options, use [`setOptions`](navigation-object.md#setoptions) instead.

:::

## Passing params to a previous screen

Params aren't only useful for passing data to a new screen - they can also pass data back to a previous screen. For example, say you have a screen with a "Create post" button that opens a new screen. After creating the post, you want to pass the data back to the previous screen.

To achieve this, you can use the `popTo` method to go back while also passing params:

```js name="Passing params back" snack static2dynamic
import * as React from 'react';
import { Text, View, TextInput } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
function HomeScreen({ route }) {
  const navigation = useNavigation('Home');

  // Use an effect to monitor the update to params
  // highlight-start
  React.useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
      alert('New post: ' + route.params?.post);
    }
  }, [route.params?.post]);
  // highlight-end

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('CreatePost')}>
        Create post
      </Button>
      <Text style={{ margin: 10 }}>Post: {route.params?.post}</Text>
    </View>
  );
}

function CreatePostScreen({ route }) {
  const navigation = useNavigation('CreatePost');
  const [postText, setPostText] = React.useState('');

  return (
    <>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{ height: 200, padding: 10, backgroundColor: 'white' }}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        onPress={() => {
          // Pass params back to home screen
          // highlight-next-line
          navigation.popTo('Home', { post: postText });
        }}
      >
        Done
      </Button>
    </>
  );
}
// codeblock-focus-end

const RootStack = createNativeStackNavigator({
  screens: {
    Home: createNativeStackScreen({
      screen: HomeScreen,
    }),
    CreatePost: createNativeStackScreen({
      screen: CreatePostScreen,
    }),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

<video playsInline autoPlay muted loop>
  <source src="/assets/navigators/params-to-parent.mp4" />
</video>

Here, after you press "Done", the home screen's `route.params` will be updated to reflect the post text that you passed in `navigate`.

## Passing params to a nested screen

If you have nested navigators, you need to pass params a bit differently. For example, say you have a navigator inside the `More` screen and want to pass params to the `Settings` screen inside that navigator. Then you can pass params as the following:

```js name="Passing params to nested screen" snack static2dynamic
import * as React from 'react';
import { Text, View, TextInput } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function SettingsScreen({ route }) {
  const navigation = useNavigation('Settings');
  const { userId } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Text>User ID: {JSON.stringify(userId)}</Text>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation('Home');

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={
          () =>
            // codeblock-focus-start
            navigation.navigate('More', {
              screen: 'Settings',
              params: { userId: 'jane' },
            })
          // codeblock-focus-end
        }
      >
        Go to Settings
      </Button>
    </View>
  );
}

const MoreStack = createNativeStackNavigator({
  screens: {
    Settings: createNativeStackScreen({
      screen: SettingsScreen,
    }),
    Profile: createNativeStackScreen({
      screen: ProfileScreen,
    }),
  },
});

const RootTabs = createBottomTabNavigator({
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
    }),
    More: createBottomTabScreen({
      screen: MoreStack,
    }),
  },
});

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

See [Nesting navigators](nesting-navigators.md) for more details on nesting.

## Reserved param names

Some param names are reserved by React Navigation as part of the API for nested navigators. The list of the reserved param names are as follows:

- `screen`
- `params`
- `initial`
- `state`

Avoid using these param names in your code. Trying to read these params in parent screens is not recommended and will cause unexpected behavior.

## What should be in params

Params serve two main purposes:

- Information required to identify and display data on a screen (e.g. id of an object to be displayed on the screen)
- State specific to a screen (e.g. sort order, filters, page numbers etc. that can also be changed on the screen)

Params should contain only the minimal information needed to show a screen. Think of params like URL query parameters - they identify what to show, not the actual data itself.

Think of visiting a shopping website; when you see product listings, the URL usually contains category name, type of sort, any filters etc., not the actual list of products displayed on the screen.

For example, when navigating to a `Profile` screen, you might be tempted to pass the user object:

```js
// Don't do this
navigation.navigate('Profile', {
  user: {
    id: 'jane',
    firstName: 'Jane',
    lastName: 'Done',
    age: 25,
  },
});
```

This looks convenient - you can access the user with `route.params.user` without any extra work. However, this is an anti-pattern because:

- The same data is duplicated in multiple places, leading to bugs like the profile showing outdated data after the user object changes
- Every screen navigating to `Profile` needs to know how to fetch user data
- URLs/deep links will contain the full object. This is problematic because random or malformed data could be passed in the URL, and the URLs become very long and unreadable

Instead, pass only the ID:

```js
navigation.navigate('Profile', { userId: 'jane' });
```

Then fetch the user data using the ID from a global cache or API. Libraries like [React Query](https://tanstack.com/query/) make this easy.

Some examples of what should be in params are:

- IDs such as user id, item id etc., e.g. `navigation.navigate('Profile', { userId: 'Jane' })`
- State for sorting, filtering data etc. when you have a list of items, e.g. `navigation.navigate('Feeds', { sortBy: 'latest' })`
- Timestamps, page numbers or cursors for pagination, e.g. `navigation.navigate('Chat', { beforeTime: 1603897152675 })`
- Data to fill inputs on a screen to compose something, e.g. `navigation.navigate('ComposeTweet', { title: 'Hello world!' })`

## Summary

- [`navigate`](navigation-actions.md#navigate) and [`push`](stack-actions.md#push) accept an optional second argument to let you pass parameters to the route you are navigating to. For example: `navigation.navigate('RouteName', { paramName: 'value' })`.
- You can read the params through [`route.params`](route-object.md) inside a screen
- You can update the screen's params with [`navigation.setParams`](navigation-object.md#setparams), [`navigation.replaceParams`](navigation-object.md#replaceparams) or [`navigation.pushParams`](navigation-object.md#pushparams)
- Initial params can be passed via the [`initialParams`](screen.md#initial-params) prop on `Screen` or in the navigator config
- State such as sort order, filters etc. should be kept in params so that the state is reflected in the URL and can be shared/bookmarked.
- Params should contain the least amount of data required to identify a screen; for most cases, this means passing the ID of an object instead of passing a full object.
- Don't keep application specific data or cached data in params; instead, use a global store or cache.
- Some [param names are reserved](#reserved-param-names) by React Navigation and should be avoided
