---
id: common-mistakes
title: Common mistakes
sidebar_label: Common mistakes
---

This section attempts to outline issues that users frequently encounter when first getting accustomed to using React Navigation and serves as a reference in some cases for error messages.

## Wrapping AppContainer in a View without flex

If you wrap the `AppContainer` in a `View`, make sure the `View` is using flex.

```javascript
import * as React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';

// without the style you will see a blank screen
export default () => (
  <View style={{ flex: 1 }}>
    <NavigationNativeContainer>{/* ... */}</NavigationNativeContainer>
  </View>
);
```
