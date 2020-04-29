---
id: link
title: Link
sidebar_label: Link
---

> Note: This API is experimental and might change in a minor version.

The `Link` component lets us navigate to a screen using a path instead of a screen name based on the [`linking` options](navigation-container.md#linking). It's preserves the default behavior of anchor tags in browser such as `Right click -> Open link in new tab"`, `Ctrl+Click`/`⌘+Click` etc.

It uses a `Text` component under the hood.

Example:

```js
import { Link } from '@react-navigation/native';

// ...

function Home() {
  return <Link to="/profile/jane">Go to Jane's profile</Link>;
}
```

If you want to use your own custom touchable, you can use [`useLinkProps`](use-link-props.md) instead

The `Link` component accepts the [same props as `useLinkProps`](use-link-props.md#options)
