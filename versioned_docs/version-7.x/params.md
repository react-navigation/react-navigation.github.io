---
id: params
title: Passing parameters to routes
sidebar_label: Passing parameters to routes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Remember when I said "more on that later when we talk about `params`!"? Well, the time has come.

Now that we know how to create a stack navigator with some routes and [navigate between those routes](navigating.md), let's look at how we can pass data to routes when we navigate to them.

There are two pieces to this:

1. Pass params to a route by putting them in an object as a second parameter to the `navigation.navigate` function: `navigation.navigate('RouteName', { /* params go here */ })`
2. Read the params in your screen component: `route.params`.

:::note

We recommend that the params you pass are JSON-serializable. That way, you'll be able to use [state persistence](state-persistence.md) and your screen components will have the right contract for implementing [deep linking](deep-linking.md).

:::

```js name="Passing params" snack
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
  <source src="/assets/7.x/fundamentals/navigatePassParams.mp4" />
</video>

## Initial params

You can also pass some initial params to a screen. If you didn't specify any params when navigating to this screen, the initial params will be used. They are also shallow merged with any params that you pass. Initial params can be specified in `initialParams`:

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

Screens can also update their params, like they can update their state. The `navigation.setParams` method lets you update the params of a screen. Refer to the [API reference for `setParams`](navigation-object.md#setparams) for more details.

Basic usage:

```js name="Updating params" snack
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

The `setParams` method merges the new params with the existing ones. To replace the existing params, you can use [`replaceParams`](navigation-object.md#replaceparams) instead.

:::note

Avoid using `setParams` or `replaceParams` to update screen options such as `title` etc. If you need to update options, use [`setOptions`](navigation-object.md#setoptions) instead.

:::

## Passing params to a previous screen

Params aren't only useful for passing some data to a new screen, but they can also be useful to pass data to a previous screen as well. For example, let's say you have a screen with a "Create post" button, and the button opens a new screen to create a post. After creating the post, you want to pass the data for the post back to the previous screen.

To achieve this, you can use the `popTo` method to go back to the previous screen as well as pass params to it:

```js name="Passing params back" snack
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
  <source src="/assets/7.x/fundamentals/navigatePassParamsToPrevScreen.mp4" />
</video>

Here, after you press "Done", the home screen's `route.params` will be updated to reflect the post text that you passed in `navigate`.

## Passing params to a nested screen

If you have nested navigators, you need to pass params a bit differently. For example, say you have a navigator inside the `More` screen and want to pass params to the `Settings` screen inside that navigator. Then you can pass params as the following:

```js name="Passing params to nested screen" snack
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

Some param names are reserved by React Navigation as part of the API for nested navigators. The list of the reserved param names are as follows:

- `screen`
- `params`
- `initial`
- `state`

You should avoid using these param names in your code unless navigating to a screen containing a nested navigator. Otherwise it will result in unexpected behavior, such as the screen not being able to access the params you passed. If you need to pass data to a nested screen, use a different names for the param.

## What should be in params

Params serve two main purposes:

- Information required to identify and display data on a screen (e.g. id of an object to be displayed on the screen)
- State specific to a screen (e.g. sort order, filters, page numbers etc. that can also be changed on the screen)

Params should contain the minimal information required to show a screen, nothing more. The actual data (e.g. user objects) should be in a global store or global cache.

You can think of the route object as a URL. The same principles apply to params. Think of visiting a shopping website; when you see product listings, the URL usually contains category name, type of sort, any filters etc., not the actual list of products displayed on the screen.

For example, say if you have a `Profile` screen. When navigating to it, you might be tempted to pass the user object in the params:

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

This looks convenient and lets you access the user objects with `route.params.user` without any extra work.

However, this is an anti-pattern. There are many reasons why this is a bad idea:

- The same data is duplicated in multiple places. This can lead to bugs such as the profile screen showing outdated data even if the user object has changed after navigation.
- Each screen that navigates to the `Profile` screen now needs to know how to fetch the user object - which increases the complexity of the code.
- URLs to the screen (browser URL on the web, or deep links on native) will contain the user object. This is problematic:
  1. Since the user object is in the URL, it's possible to pass a random user object representing a user that doesn't exist or has incorrect data in the profile.
  2. If the user object isn't passed or improperly formatted, this could result in crashes as the screen won't know how to handle it.
  3. The URL can become very long and unreadable.

A better way is to pass only the ID of the user in params:

```js
navigation.navigate('Profile', { userId: 'jane' });
```

Now, you can use the passed `userId` to grab the user from your global cache or fetch it from the API. Using a library such as [React Query](https://tanstack.com/query/) can simplify this process since it makes it easy to fetch and cache your data. This approach helps to avoid the problems mentioned above.

Some examples of what should be in params are:

- IDs such as user id, item id etc., e.g. `navigation.navigate('Profile', { userId: 'Jane' })`
- State for sorting, filtering data etc. when you have a list of items, e.g. `navigation.navigate('Feeds', { sortBy: 'latest' })`
- Timestamps, page numbers or cursors for pagination, e.g. `navigation.navigate('Chat', { beforeTime: 1603897152675 })`
- Data to fill inputs on a screen to compose something, e.g. `navigation.navigate('ComposeTweet', { title: 'Hello world!' })`

## Summary

- [`navigate`](navigation-actions.md#navigate) and [`push`](stack-actions.md#push) accept an optional second argument to let you pass parameters to the route you are navigating to. For example: `navigation.navigate('RouteName', { paramName: 'value' })`.
- You can read the params through [`route.params`](route-object.md) inside a screen
- You can update the screen's params with [`navigation.setParams`](navigation-object.md#setparams) or [`navigation.replaceParams`](navigation-object.md#replaceparams)
- Initial params can be passed via the [`initialParams`](screen.md#initial-params) prop on `Screen` or in the navigator config
- State such as sort order, filters etc. should be kept in params so that the state is reflected in the URL and can be shared/bookmarked.
- Params should contain the least amount of data required to identify a screen; for most cases, this means passing the ID of an object instead of passing a full object.
- Don't keep application specific data or cached data in params; instead, use a global store or cache.
- Some [param names are reserved](#reserved-param-names) by React Navigation and should be avoided
