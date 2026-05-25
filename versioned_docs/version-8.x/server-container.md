---
id: server-container
title: ServerContainer
sidebar_label: ServerContainer
---

The `ServerContainer` component provides utilities to render your app on server with the correct [navigation state](navigation-state.md).

Example:

```js
import { ServerContainer } from '@react-navigation/native/server';
import { renderToPipeableStream } from 'react-dom/server';

// Location object for the incoming request
const location = new URL('/profile?user=jane', 'https://example.org/');

const { pipe } = renderToPipeableStream(
  <ServerContainer location={location}>
    <App />
  </ServerContainer>,
  {
    onShellReady() {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      pipe(response);
    },
  }
);
```

The `ServerContainer` component should wrap your entire app during server rendering. Note that you still need a `NavigationContainer` in your app, `ServerContainer` doesn't replace it.

See the [`server rendering guide`](server-rendering.md) for a detailed guide and examples.

## Props

### `location`

`URL` object containing the location to use for server rendered output:

```js
<ServerContainer location={new URL('/profile', 'https://example.org/')}>
  <App />
</ServerContainer>
```

Normally, you'd construct this object based on the incoming request.

Basic example with a Node server:

```js
function handler(request, response) {
  const location = new URL(request.url, 'https://example.org/');

  const { pipe } = renderToPipeableStream(
    <ServerContainer location={location}>
      <App />
    </ServerContainer>,
    {
      onShellReady() {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        pipe(response);
      },
    }
  );
}
```
