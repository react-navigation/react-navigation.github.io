---
id: version-3.x-web-support
title: React Navigation on the Web
sidebar_label: Web Support
original_id: web-support
---

Starting in v3, React Navigation has built-in support for web sites, including server rendering.

To set up a navigator in a React app, [(such as one created with create-react-app)](https://github.com/react-navigation/example-web):

```js
import { createSwitchNavigator } from "@react-navigation/core";
import { createBrowserApp } from "@react-navigation/web";

const MyNavigator = createSwitchNavigator(routes);

const App = createBrowserApp(MyNavigator);

// now you can render "App" normally
```

## Web Links

We ship a utility out of the box which automatically sets up an `<a>` tag for you with the correct `href`.

This is necessary to properly support server rendering, critical for accessibility, and nice to provide a good user experience when the browser displays what URL the link will go to.

When the app is running, the default browser behavior will be blocked and a navigation action will be dispatched instead.

To render a link to the "Profile" route:

```js
<Link toRoute="Profile" params={{ name: "jamie" }}>
  Jamie's Profile
</Link>
```

Depending on the `path` that is set up for the `Profile` route, the above link may render to html as `<a href="/people/jamie">Jamie's Profile</a>`

You can alternatively provide an `action` prop to the `Link`, to specify the exact navigation action that will be used to handle this link.

## Server rendering

You can use the `handleServerRequest` function to get the top-level navigation prop for your app, as well as the current title for this route.

```js
expressApp.get("/*", (req, res) => {
  
  const { path, query } = req;

  const { navigation, title, options } = handleServerRequest(
    AppNavigator.router,
    path,
    query
  );

  const markup = renderToString(<AppNavigator navigation={navigation} />);

  res.send(
    `<!doctype html>
  <html lang="">
  <head>
    <title>${title}</title>
    <script src="main.js"></script>
  </head>
  <body>
    <div id="root">${markup}</div>
  </body>
</html>`
  );
});
```

For a full example, [see a full server+client React web app here](https://github.com/react-navigation/web-server-example)

## Custom navigators for the web

The built-in navigator components such as Stack are often not well suited for web sites, so you may want to create custom navigators yourself.

Your view can use `props.descriptors` to see the current set of screens, get their navigation object, and see the current navigation options. You should use `SceneView` to present your child screen components.

See ["Custom Navigators"](custom-navigators.html) for more details.

For an example of this, see how the custom `SidebarView` and `AppView` are used from [`App.js` in the web server example](https://github.com/react-navigation/web-server-example/blob/master/src/App.js).
