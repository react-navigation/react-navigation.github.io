---
id: use-link-props
title: useLinkProps
sidebar_label: useLinkProps
---

The `useLinkProps` hook lets us build our custom link component. The link component can be used as a button to navigate to a screen. On the web, it will be rendered as an anchor tag (`<a>`) with the `href` attribute so that all the accessibility features of a link are preserved, e.g. - such as `Right click -> Open link in new tab"`, `Ctrl+Click`/`⌘+Click` etc.

It returns an object with some props that you can pass to a component.

Example:

```js
import { useLinkProps } from '@react-navigation/native';

// ...

const LinkButton = ({ screen, params, action, href, children, ...rest }) => {
  const props = useLinkProps({ screen, params, action, href });

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Pressable {...props} {...rest}>
      <Text>{children}</Text>
    </Pressable>
  );
};
```

Then you can use the `LinkButton` component elsewhere in your app:

```js
function Home() {
  return (
    <LinkButton screen="Profile" params={{ id: 'jane' }}>
      Go to Jane's profile
    </LinkButton>
  );
}
```

## Options

### `screen` and `params`

You can pass `screen` and `params` to navigate to a screen on press:

```js
function Home() {
  return (
    <LinkButton screen="Profile" params={{ id: 'jane' }}>
      Go to Jane's profile
    </LinkButton>
  );
}
```

If you want to navigate to a nested screen, you can pass the name of the `screen` in `params` similar to [navigating to a screen in a nested navigator](nesting-navigators.md#navigating-to-a-screen-in-a-nested-navigator):

```js
<LinkButton screen="Root" params={{ screen: 'Post', params: { id: 123 } }}>
  Go to post 123
</LinkButton>
```

### `action`

Sometimes we want a different behavior for in-page navigation, such as `replace` instead of `navigate`. We can use the `action` prop to customize it:

Example:

```js
import { StackActions } from '@react-navigation/native';

// ...

function Home() {
  return (
    <LinkButton
      screen="Profile"
      params={{ id: 'jane' }}
      action={StackActions.replace('Profile', { id: 'jane' })}
    >
      Go to Jane's profile
    </LinkButton>
  );
}
```

The `screen` and `params` props can be omitted if the `action` prop is specified. In that case, we recommend specifying the `href` prop as well to ensure that the link is accessible.

### `href`

The `href` is used for the `href` attribute of the anchor tag on the Web to make the links accessible. By default, this is automatically determined based on the [`linking` options](navigation-container.md#linking) using the `screen` and `params` props.

If you want to use a custom `href`, you can pass it as the `href` prop:

```js
function Home() {
  return (
    <LinkButton
      action={StackActions.replace('Profile', { id: 'jane' })}
      href="/users/jane"
    >
      Getting Started
    </LinkButton>
  );
}
```
