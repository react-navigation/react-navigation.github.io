---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution written entirely in JavaScript (so you can read and understand all of the source), on top of powerful native primitives.

Before you commit to using React Navigation for your project, you might want to read the [anti-pitch](pitch.md) &mdash; it will help you to understand the tradeoffs that we have chosen along with the areas where we consider the library to be deficient currently.

## What to expect

If you're already familiar with React Native then you'll be able to get moving with React Navigation quickly! If not, you may want to read sections 1 to 4 (inclusive) of [React Native Express](http://reactnativeexpress.com/) first, then come back here when you're done.

What follows within the _Fundamentals_ section of this documentation is a tour of the most important aspects of React Navigation. It should cover enough for you to know how to build your typical small mobile application, and give you the background that you need to dive deeper into the more advanced parts of React Navigation.

## Installation

Install the required packages in your React Native project.

```bash
yarn add @react-navigation/native@next @react-navigation/native@next
```

Or with npm

```sh
npm install @react-navigation/native@next @react-navigation/native@next
```

> When you use a navigator (such as stack navigator), you'll need to follow the installation instructions of that navigator for any additional configuration.

Now, we need to wrap the whole app in `NavigationNativeContainer`. Usually you'd do this in your entry file, such as `index.js` or `App.js`:

```js
import * as React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationNativeContainer>
      {/* Rest of your app code */}
    </NavigationNativeContainer>
  );
}
```

Continue to ["Hello React Navigation"](hello-react-navigation.md) to start writing some code.
