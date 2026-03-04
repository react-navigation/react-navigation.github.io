# withNavigation

Version: 4.x

Sitemap: [llms-4.x.txt](https://reactnavigation.org/llms-4.x.txt)

`withNavigation` is a higher order component which passes the `navigation` prop into a wrapped component. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

- `withNavigation(Component)` returns a Component.

## Example

```js

class MyBackButton extends React.Component {
  render() {
    return (
      <Button
        title="Back"
        onPress={() => {
          this.props.navigation.goBack();
        }}
      />
    );
  }
}

// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop
export default withNavigation(MyBackButton);
```

## Notes

- If you wish to use the `ref` prop on the wrapped component, you must pass the `onRef` prop instead. For example,

```js
// MyBackButton.ts
export default withNavigation(MyBackButton);

// MyNavBar.ts
<MyBackButton onRef={(elem) => (this.backButton = elem)} />;
```
