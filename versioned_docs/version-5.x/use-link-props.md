---
id: use-link-props
title: useLinkProps
sidebar_label: useLinkProps
---

The `useLinkProps` hook let's build our custom link components which let us navigate to a screen using a path instead of a screen name based on the [`linking` options](navigation-container.md#linking). It takes a path and returns an object with some props that you can pass to a component.

Example:

```js
import { useLinkProps } from '@react-navigation/native';

// ...

function LinkButton({ to, action }) {
  const props = useLinkProps({ to, action });

  return <TouchableOpacity {...props}>Go to Jane's profile</TouchableOpacity>;
}

function Home() {
  return <LinkButton to="/profile/jane">Go to Jane's profile</LinkButton>;
}
```

Then you can use the `LinkButton` component elsewhere in your app:

```js
function Home() {
  return <LinkButton to="/profile/jane">Go to Jane's profile</LinkButton>;
}
```

The `props` object returned by `useLinkProps` contains the required props for accessibility link components. When we use these props, the link component responds to user actions such as `Ctrl+Click`/`⌘+Click` to open links in new tab while keeping regular clicks within the same web page.

## Options

### `to`

Absolute path to the screen, e.g. - `/profile/jane`.

### `action`

Optional navigation action to use for in-app navigation. By default, the path provided to the `to` prop will be parsed and dispatched as a `navigate` action. However, sometimes we want a different behavior for in page navigation, such as `replace` instead of `navigate`. We can use the `action` prop to customize it:

Example:

```js
import { StackActions } from '@react-navigation/native';

// ...

function Home() {
  return (
    <LinkButton
      to="/profile/jane"
      action={StackActions.replace('Profile', { id: 'jane' })}
    >
      Go to Jane's profile
    </LinkButton>
  );
}
```
