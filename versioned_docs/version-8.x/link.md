---
id: link
title: Link
sidebar_label: Link
---

The `Link` component renders a component that can navigate to a screen on press. This renders a `<a>` tag when used on the Web and uses a `Text` component on other platforms. It preserves the default behavior of anchor tags in the browser such as `Right click -> Open link in new tab"`, `Ctrl+Click`/`⌘+Click` etc. to provide a native experience.

The path in the `href` for the `<a>` tag is generated based on your [`linking` options](navigation-container.md#linking).

Example:

```js
import { Link } from '@react-navigation/native';

// ...

function Home() {
  return (
    <Link screen="Profile" params={{ id: 'jane' }}>
      Go to Jane's profile
    </Link>
  );
}
```

If you want to use your own custom link component, you can use [`useLinkProps`](use-link-props.md) instead.

The `Link` component accepts the [same props as `useLinkProps`](use-link-props.md#options)
