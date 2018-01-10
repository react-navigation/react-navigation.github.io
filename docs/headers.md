---
id: headers
title: Configuring the header bar
sidebar_label: Configuring the header bar
---

Header is only available for StackNavigator. In the previous example, we created a `StackNavigator` to display several screens in our app.

When navigating to a chat screen, we can specify params for the new route by providing them to the navigate function. In this case, we want to provide the name of the person on the chat screen:

```js
this.props.navigation.navigate('Chat', { user:  'Lucy' });
```

The `user` param can be accessed from the chat screen:

```js
class ChatScreen extends React.Component {
  render() {
    const { params } = this.props.navigation.state;
    return <Text>Chat with {params.user}</Text>;
  }
}
```

### Setting the Header Title

Next, the header title can be configured to use the screen param:

```js
class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Chat with ${navigation.state.params.user}`,
  });
  ...
}
```

```phone-example
basic-header
```


### Adding a Right Button

Then we can add a [`header` navigation option](/docs/navigators/navigation-options#Stack-Navigation-Options) that allows us to add a custom right button:

```js
static navigationOptions = {
  headerRight: <Button title="Info" />,
  ...
```

```phone-example
header-button
```

The navigation options can be defined with a [navigation prop](/docs/navigators/navigation-prop). Let's render a different button based on the route params, and set up the button to call `navigation.setParams` when pressed.

```js
static navigationOptions = ({ navigation }) => {
  const { state, setParams } = navigation;
  const isInfo = state.params.mode === 'info';
  const { user } = state.params;
  return {
    title: isInfo ? `${user}'s Contact Info` : `Chat with ${state.params.user}`,
    headerRight: (
      <Button
        title={isInfo ? 'Done' : `${user}'s info`}
        onPress={() => setParams({ mode: isInfo ? 'none' : 'info' })}
      />
    ),
  };
};
```

Now, the header can interact with the screen route/state:

```phone-example
header-interaction
```

### Header interaction with screen component

Sometimes it is necessary for the header to access properties of the screen component such as functions or state.

Let's say we want to create an 'edit contact info' screen with a save button in the header. We want the save button to be replaced by an `ActivityIndicator` while saving.

```js
class EditInfoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Button
        title="Save"
        onPress={params.handleSave ? params.handleSave : () => null}
      />
    );
    if (params.isSaving) {
      headerRight = <ActivityIndicator />;
    }
    return { headerRight };
  };

  state = {
    nickname: 'Lucy jacuzzi'
  }

  _handleSave = () => {
    // Update state, show ActivityIndicator
    this.props.navigation.setParams({ isSaving: true });
    
    // Fictional function to save information in a store somewhere
    saveInfo().then(() => {
      this.props.navigation.setParams({ isSaving: false});
    })
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.props.navigation.setParams({ handleSave: this._handleSave });
  }

  render() {
    return (
      <TextInput
        onChangeText={(nickname) => this.setState({ nickname })}
        placeholder={'Nickname'}
        value={this.state.nickname}
      />
    );
  }
}
```

**Note**: Since the `handleSave`-param is only set on component mount it is not immediately available in the `navigationOptions`-function. Before `handleSave` is set we pass down an empty function to the `Button`-component in order to make it render immediately and avoid flickering.


To see the rest of the header options, see the [navigation options document](/docs/navigators/navigation-options#Stack-Navigation-Options).

As an alternative to `setParams`, you may want to consider using a state management library such as [MobX](https://github.com/mobxjs/mobx) or [Redux](https://github.com/reactjs/redux), and when navigating to a screen, pass an object which contains the data necessary for the screen to render, as well as functions you may want to call that modify the data, make network requests and etc. That way, both your screen component and the static `navbarOptions` block will have access to the object. When following this approach, make sure to consider deep linking, which works best in cases where only javascript primitives are passed as navigation props to your screen. In case when deep linking is necessary, you may use a [higher order component (HOC)](https://reactjs.org/docs/higher-order-components.html) to transform the primitives to the object your screen components expects.




<!-- Each screen can configure various aspects about how it gets presented in parent navigators. You can configure 

**Static configuration:** Each navigation option can either be directly assigned:

```js
class MyScreen extends React.Component {
  static navigationOptions = {
    title: 'Great',
  };
  ...
```

**Dynamic Configuration**

Or, the options can be a function that takes the following arguments, and returns an object of navigation options that will override the route-defined and navigator-defined navigationOptions.

- `props` - The same props that are available to the screen component
  - `navigation` - The [navigation prop](/docs/navigators/navigation-prop) for the screen, with the screen's route at `navigation.state`
  - `screenProps` - The props passing from above the navigator component
  - `navigationOptions` - The default or previous options that would be used if new values are not provided

```js
class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.name + "'s Profile!",
    headerRight: <Button color={screenProps.tintColor} {...} />,
  });
  ...
```

The screenProps are passed in at render-time. If this screen was hosted in a SimpleApp navigator:

```js
<SimpleApp
  screenProps={{tintColor: 'blue'}}
  // navigation={{state, dispatch}} // optionally control the app
/>
```

#### Generic Navigation Options

The `title` navigation option is generic between every navigator. It is used to set the title string for a given screen.

```js
class MyScreen extends React.Component {
  static navigationOptions = {
    title: 'Great',
  };
  ...
```

Unlike the other nav options which are only utilized by the navigator view, the title option can be used by the environment to update the title in the browser window or app switcher.

#### Default Navigation Options

It's very common to define `navigationOptions` on a screen, but sometimes it is useful to define `navigationOptions` on a navigator too.

Imagine the following scenario:
Your `TabNavigator` represents one of the screens in the app, and is nested within a top-level `StackNavigator`:

```
StackNavigator({
  route1: { screen: RouteOne },
  route2: { screen: MyTabNavigator },
});
```

Now, when `route2` is active, you would like to change the tint color of a header. It's easy to do it for `route1`, and it should also be easy to do it for `route2`. This is what Default Navigation Options are for - they are simply `navigationOptions` set on a navigator:

```js
const MyTabNavigator = TabNavigator({
  profile: ProfileScreen,
  ...
}, {
  navigationOptions: {
    headerTintColor: 'blue',
  },
});
```

Note that you can still decide to **also** specify the `navigationOptions` on the screens at the leaf level - e.g.  the `ProfileScreen` above. The `navigationOptions` from the screen will be merged key-by-key with the default options coming from the navigator. Whenever both the navigator and screen define the same option (e.g. `headerTintColor`), the screen wins. Therefore, you could change the tint color when `ProfileScreen` is active by doing the following:

```js
class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerTintColor: 'black',
  };
  ...
}
```

## Navigation Option Reference

List of available navigation options depends on the `navigator` the screen is added to.

Check available options for:
- [`drawer navigator`](/docs/navigators/drawer#Screen-Navigation-Options)
- [`stack navigator`](/docs/navigators/stack#Screen-Navigation-Options)
- [`tab navigator`](/docs/navigators/tab#Screen-Navigation-Options) -->