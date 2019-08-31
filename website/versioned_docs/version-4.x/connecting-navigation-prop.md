---
id: version-4.x-connecting-navigation-prop
title: Access the navigation prop from any component
sidebar_label: Access the navigation prop from any component
original_id: connecting-navigation-prop
---

[`withNavigation`](with-navigation.html) is a higher order component which passes the `navigation` prop into a wrapped Component. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

An ordinary component that is not a screen component will not receive the navigation prop by default, for example in this `MyBackButton` component:

```javascript
import React from 'react';
import { Button } from 'react-native';

export default class MyBackButton extends React.Component {
  render() {
    // This will throw an 'undefined is not a function' exception because the navigation
    // prop is undefined.
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
```

To resolve this exception, you could pass the `navigation` prop in to `MyBackButton` when you render it from a screen, like so: `<MyBackButton navigation={this.props.navigation} />`.

Alternatively, you can use the `withNavigation` function to provide the `navigation` prop automatically (through React context, if you're curious). This function behaves similarly to Redux's `connect` function, except rather than providing the `dispatch` prop to the component it wraps, it provides the `navigation` prop.

```js
import React from 'react';
import { Button } from 'react-native';
import { withNavigation } from 'react-navigation';

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

Using this approach, you can render `MyBackButton` anywhere in your app without passing in a `navigation` prop explicitly and it will work as expected.
