---
id: server-rendering
title: Server rendering
sidebar_label: Server rendering
---

This guide will cover how to server render your React Native app using React Native for Web and React Navigation.

:::warning

Server rendering support is currently limited. It's not possible to provide a seamless SSR experience due to a lack of APIs such as media queries. Many third-party libraries often don't work well with server rendering as well.

:::

## Pre-requisites

Before you follow the guide, make sure that your app already renders fine on server. To do that, you will need to ensure the following:

- All of the dependencies that you use are [compiled before publishing](https://github.com/react-native-community/bob) to npm, so that you don't get syntax errors on Node.
- Node is configured to be able to `require` asset files such as images and fonts. You can try [webpack-isomorphic-tools](https://github.com/catamphetamine/webpack-isomorphic-tools) to do that.
- `react-native` is aliased to `react-native-web`. You can do it with [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver).

## Rendering the app

First, let's take a look at an example of how you'd do [streaming server rendering with React](https://react.dev/reference/react-dom/server/renderToPipeableStream) without involving React Navigation:

```js
import { AppRegistry } from 'react-native-web';
import { renderToPipeableStream } from 'react-dom/server';
import App from './src/App';

const { element, getStyleElement } = AppRegistry.getApplication('App');

function Document({ children, styles }) {
  return (
    <html style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover"
        />
        {styles}
      </head>
      <body style={{ minHeight: '100%' }}>
        <div id="root" style={{ display: 'flex', minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}

const { pipe } = renderToPipeableStream(
  <Document styles={getStyleElement()}>{element}</Document>,
  {
    onShellReady() {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      response.write('<!DOCTYPE html>');
      pipe(response);
    },
  }
);
```

Here, `./src/App` is the file where you have `AppRegistry.registerComponent('App', () => App)`.

If you're using React Navigation in your app, this will render the screens rendered by your home page. However, if you have [configured links](configuring-links.md) in your app, you'd want to render the correct screens for the request URL on server so that it matches what'll be rendered on the client.

We can use the [`ServerContainer`](server-container.md) to do that by passing this info in the `location` prop. It must be imported from `@react-navigation/native/server` and passed a `URL` object.

For example, with a Node server, you can create a `URL` object from `request.url`:

```js
import { ServerContainer } from '@react-navigation/native/server';
import { renderToPipeableStream } from 'react-dom/server';

function handler(request, response) {
  const { element, getStyleElement } = AppRegistry.getApplication('App');
  const location = new URL(request.url, 'https://example.org/');

  const { pipe } = renderToPipeableStream(
    <Document styles={getStyleElement()}>
      <ServerContainer location={location}>{element}</ServerContainer>
    </Document>,
    {
      onShellReady() {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        response.write('<!DOCTYPE html>');
        pipe(response);
      },
    }
  );
}
```

To resolve document titles, meta tags, and status codes, etc., you can use [`getStateFromPath`](navigation-container.md#linkinggetstatefrompath) to parse the incoming URL and derive them from the route configuration on the server based on the parsed state.

## Summary

- Use the `location` prop on `ServerContainer` to render correct screens based on the incoming request.
- Import `ServerContainer` from `@react-navigation/native/server`.
- Pass a `URL` object to `ServerContainer`.
