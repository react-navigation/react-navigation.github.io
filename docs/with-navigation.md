---
id: with-navigation
title: Connecting the navigation prop to any component
sidebar_label: Connecting the navigation prop to any component
---

[`withNavigation`](/src/views/withNavigation.js) is a Higher Order Component which passes the `navigation` prop into a wrapped Component. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

## Example

```javascript
import { Button } 'react-native';
import { withNavigation } from 'react-navigation';

const MyComponent = ({ to, navigation }) => (
    <Button title={`navigate to ${to}`} onPress={() => navigation.navigate(to)} />
);

const MyComponentWithNavigation = withNavigation(MyComponent);


// or use decorators:

@withNavigation
export default class MainScreen extends Component {
  ...
}
```
