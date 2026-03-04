# Link

Version: 5.x

Sitemap: [llms-5.x.txt](https://reactnavigation.org/llms-5.x.txt)

The `Link` component lets us navigate to a screen using a path instead of a screen name based on the [`linking` options](navigation-container.md#linking). It preserves the default behavior of anchor tags in the browser such as `Right click -> Open link in new tab"`, `Ctrl+Click`/`⌘+Click` etc.

It uses a `Text` component under the hood.

Example:

```js

// ...

function Home() {
  return <Link to="/profile/jane">Go to Jane's profile</Link>;
}
```

If you want to use your own custom touchable, you can use [`useLinkProps`](use-link-props.md) instead

The `Link` component accepts the [same props as `useLinkProps`](use-link-props.md#options)
