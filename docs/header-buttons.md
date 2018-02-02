---
id: header-buttons
title: Header buttons
sidebar_label: Header buttons
---

Now that we know how to customize the look of our headers, let's make them sentient! Actually perhaps that's ambitious, let's just make them able to respond to our touches in very well defined ways.

## Adding a button to the header

The most common way to interact with a header is by tapping on a button either to the left or the right of the title. Let's add a button to the right side of the header (one of the most difficult places to touch on your entire screen, depending on finger and phone size, but also a normal place to put buttons).

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    ),
  };
}
```
<a href="https://snack.expo.io/@react-navigation/simple-header-button" target="blank" class="run-code-button">&rarr; Run this code</a>

The binding of `this` in `navigationOptions` is *not* the `HomeScreen` instance, so you can't call `setState` or any instance methods on it. This is pretty important because it's extremely common to want the buttons in your header to interact with the screen that the header belongs to. So, we will look how to do this next.

## Header interaction with its screen component


## Customizing the back button

## Overriding the back button

<!-- The navigation options can be defined with a [navigation prop](/docs/navigators/navigation-prop). Let's render a different button based on the route params, and set up the button to call `navigation.setParams` when pressed.

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


## Header interaction with screen component

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


 -->
