---
id: use-link-to
title: useLinkTo
sidebar_label: useLinkTo
---

> Note: This API is experimental and might change in a minor version.

The `useLinkTo` hook let's us navigate to a screen using a path instead of a screen name based on the [`linking` options](navigation-container.md#linking). It returns a function that receives the path to navigate to.

```js
import { useLinkTo } from '@react-navigation/native';

// ...

function Home() {
  const linkTo = useLinkTo();

  return (
    <Button onPress={() => linkTo('/profile/jane')}>
      Go to Jane's profile
    </Button>
  );
}
```

This is a low-level hook used to build more complex behavior on top. We recommended to use the [`useLinkProps` hook](use-link-props.md) to build your custom link components instead of using this hook directly. It will ensure that your component is properly accessible on the web.

## Using with class component

You can wrap your class component in a function component to use the hook:

```js
class Home extends React.Component {
  render() {
    // Get it from props
    const { linkTo } = this.props;
  }
}

// Wrap and export
export default function (props) {
  const linkTo = useLinkTo();

  return <Home {...props} linkTo={linkTo} />;
}
```
