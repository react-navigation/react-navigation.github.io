---
id: handling-iphonex
title: iPhone X support
sidebar_label: iPhone X support
---

By default, React Navigation aids in ensuring your application displays correctly on the iPhoneX. It does so by using `SafeAreaView` inside of UI elements that may interact with the sensor cluster ("the notch") or the home activity indicator.

## Hidden/Custom Navigation Bar or Tab Bar

![Default React Navigation Behavior](/docs/assets/iphoneX/01-iphonex-default.png)

However, if you're overriding the default navigation bar, it's important to ensure your UI doesn't interfere with either of those hardware elements.

For example, if I render nothing for the `header` or `tabBarComponent`, nothing renders

```javascript
const Tabs = createBottomTabNavigator({
  ...
}, {
  tabBarComponent: () => null,
});

export default createStackNavigator({
  ...
}, {
  headerMode: 'none',
});
```

![Text hidden by iPhoneX UI elements](/docs/assets/iphoneX/02-iphonex-content-hidden.png)

To fix this issue you can wrap your content in a `SafeAreaView`, which can be imported from `react-navigation`.

```javascript
import { SafeAreaView } from 'react-navigation';

class App extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.paragraph}>
          This is top text.
        </Text>
        <Text style={styles.paragraph}>
          This is bottom text.
        </Text>
      </SafeAreaView>
    );
  }
}
```

![Content spaced correctly with SafeAreaView](/docs/assets/iphoneX/03-iphonex-content-fixed.png)

This will detect if the app is running on an iPhoneX and, if so, ensure the content isn't hidden behind any hardware elements.

## Landscape Mode

Even if you're using the default navigation bar and tab bar if your application works in landscape mode it's important to ensure you content isn't hidden behind the sensor cluster.

![App in landscape mode with text hidden](/docs/assets/iphoneX/04-iphonex-landscape-hidden.png)

To fix this you can, once again, wrap your content in a `SafeAreaView`. This will not conflict with the navigation bar or tab bar's default behavior in portrait mode.

![App in landscape mode with text visible](/docs/assets/iphoneX/05-iphonex-landscape-fixed.png)

In conclusion, use the `SafeAreaView` component on the screens you register with a React Navigation navigator.

A [Snack](https://snack.expo.io/BJ6-M8pEG) is available with the code used in this overview.

## Use `forceInset` to get more control

In some cases you might need more control over which paddings are applied. For example, you can remove bottom padding by passing `forceInset` prop to `SafeAreaView`.

```javascript
<SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
  <Text style={styles.paragraph}>
    This is top text.
  </Text>
  <Text style={styles.paragraph}>
    This is bottom text.
  </Text>
</SafeAreaView>
```

`forceInset` takes an object with the keys `top | bottom | left | right | vertical | horizontal` and the values `'always' | 'never'`. Or you can override the padding altogether by passing an integer.

There is also a [Snack](https://snack.expo.io/@jozan/react-navigation-docs:-safeareaview-demo) available to demonstrate how `forceInset` behaves.
