# useNavigation

Version: 5.x

Sitemap: [llms-5.x.txt](https://reactnavigation.org/llms-5.x.txt)

`useNavigation` is a hook which gives access to `navigation` object. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

`useNavigation()` returns the `navigation` prop of the screen it's inside.

## Example

<samp id="use-navigation-example" />

```js

function MyBackButton() {
  const navigation = useNavigation();

  return (
    <Button
      title="Back"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}
```

See the documentation for the [`navigation` prop](navigation-prop.md) for more info.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class MyBackButton extends React.Component {
  render() {
    // Get it from props
    const { navigation } = this.props;
  }
}

// Wrap and export
export default function (props) {
  const navigation = useNavigation();

  return <MyBackButton {...props} navigation={navigation} />;
}
```
