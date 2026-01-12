---
id: params
title: Passing parameters to routes
sidebar_label: Passing parameters to routes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Now that we know how to create a stack navigator with some routes and [navigate between those routes](navigating.md), let's look at how we can pass data to routes when we navigate to them.

There are two pieces to this:

1. Pass params as the second argument to navigation methods: `navigation.navigate('RouteName', { /* params go here */ })`
2. Read params from `route.params` inside the screen component.

:::note

We recommend that the params you pass are JSON-serializable. That way, you'll be able to use [state persistence](state-persistence.md) and your screen components will have the right contract for implementing [deep linking](deep-linking.md).

:::

```js name="Passing params" snack static2dynamic
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

// codeblock-focus-start
function HomeScreen() {
  const navigation = useNavigation();

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
  const navigation = useNavigation();

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
    Home: HomeScreen,
    Details: DetailsScreen,
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

Initial params can be specified in `initialParams`. These are used when navigating to the screen without params, and are shallow merged with any params that you pass:

<Tabs groupId="config" queryString="config">
<TabItem value="static" label="Static" default>

```js
{
  Details: {
    screen: DetailsScreen,
    // highlight-next-line
    initialParams: { itemId: 42 },
  },
}
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

Screens can update their params using [`navigation.setParams`](navigation-object.md#setparams):

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
  const navigation = useNavigation();
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
    Home: {
      screen: HomeScreen,
      initialParams: { itemId: 42 },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

`setParams` merges new params with existing ones. To replace params entirely, use [`replaceParams`](navigation-object.md#replaceparams).

:::note

Avoid using `setParams` or `replaceParams` to update screen options like `title`. Use [`setOptions`](navigation-object.md#setoptions) instead.

:::

## Passing params to a previous screen

Params can be passed to a previous screen as well, for example, when you have a "Create post" button that opens a new screen and you want to pass the post data back.

Use `popTo` to go back to the previous screen and pass params to it:

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
  const navigation = useNavigation();

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
  const navigation = useNavigation();
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
    Home: HomeScreen,
    CreatePost: CreatePostScreen,
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

After pressing "Done", the home screen's `route.params` will be updated with the post text.

## Passing params to a nested screen

If you have nested navigators, pass params using the same pattern as [navigating to a nested screen](nesting-navigators.md#navigating-to-a-screen-in-a-nested-navigator):

```js name="Passing params to nested screen" snack static2dynamic
import * as React from 'react';
import { Text, View, TextInput } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';

function SettingsScreen({ route }) {
  const navigation = useNavigation();
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
  const navigation = useNavigation();

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
    Settings: SettingsScreen,
    Profile: ProfileScreen,
  },
});

const RootTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    More: MoreStack,
  },
});

const Navigation = createStaticNavigation(RootTabs);

export default function App() {
  return <Navigation />;
}
```

See [Nesting navigators](nesting-navigators.md) for more details on nesting.

## Reserved param names

Some param names are reserved by React Navigation for nested navigator APIs:

- `screen`
- `params`
- `initial`
- `state`

Avoid using these param names in your code. Trying to read these params in parent screens is not recommended and will cause unexpected behavior.

## What should be in params

Params should contain the minimal information required to show a screen:

- Data to identify what to display (e.g. user id, item id)
- Screen-specific state (e.g. sort order, filters, page numbers)

Think of params like URL query parameters - they should contain identifiers and state, not actual data objects. The actual data should come from a global store or cache.

For example, say you have a `Profile` screen. You might be tempted to pass the user object in params:

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

This is an anti-pattern because:

- Data is duplicated, leading to stale data bugs
- Each screen navigating here needs to know how to fetch the user
- URLs/deep links would contain the full object, causing issues

Instead, pass only the ID:

```js
navigation.navigate('Profile', { userId: 'jane' });
```

Then fetch the user data using the ID from a global cache or API. Libraries like [React Query](https://tanstack.com/query/) can help with fetching and caching.

Good examples of params:

- IDs: `navigation.navigate('Profile', { userId: 'jane' })`
- Sorting/filtering: `navigation.navigate('Feeds', { sortBy: 'latest' })`
- Pagination: `navigation.navigate('Chat', { beforeTime: 1603897152675 })`
- Input data: `navigation.navigate('ComposeTweet', { title: 'Hello world!' })`

## Summary

- Params can be passed to screens as the second argument to navigation methods like [`navigate`](navigation-actions.md#navigate) and [`push`](stack-actions.md#push)
- Params can be read from the `params` property of the [`route`](route-object.md) object
- Params can be updated with [`navigation.setParams`](navigation-object.md#setparams) or [`navigation.replaceParams`](navigation-object.md#replaceparams)
- Initial params can be passed via the [`initialParams`](screen.md#initial-params) prop
- Params should contain the minimal data needed to identify a screen (e.g. IDs instead of full objects)
- Some [param names are reserved](#reserved-param-names) by React Navigation
