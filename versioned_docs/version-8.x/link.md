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
    <Link in="Home" screen="Profile" params={{ id: 'jane' }}>
      Go to Jane's profile
    </Link>
  );
}
```

If you want to use your own custom link component, you can use [`useLinkProps`](use-link-props.md) instead.

The `Link` component accepts the [same props as `useLinkProps`](use-link-props.md#options), along with the following props:

- `children` - Content to render inside the link.
- `disabled` - Whether interaction with the link is disabled.
- `onPress` - Callback called when the link is pressed. Calling `preventDefault` on the event prevents navigation.
- `target` - Target for the anchor on the Web, such as `_blank` or `_self`.
- `className` - CSS class for the anchor on the Web.
- `style` - Plain style object for the link. If you need to pass a style array, use `StyleSheet.flatten` to convert it to a plain style object.
- `id` - ID for the rendered element.
- `testID` - ID to locate the link in tests.
- `numberOfLines` - Maximum number of lines for the text on native platforms. This prop has no effect on the Web.
- `aria-label`, `aria-busy`, `aria-expanded`, `aria-hidden`, `aria-labelledby`, `aria-live` - Accessibility properties supported by the link.
