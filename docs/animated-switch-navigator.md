---
id: animated-switch-navigator
title: createAnimatedSwitchNavigator
sidebar_label: createAnimatedSwitchNavigator
---

A switch navigator with the ability to animate transitions between screens. 

To use this navigator, you need to install `react-native-reanimated >= 1.0.0`. If you have a managed Expo project, you need to use >= SDK 33 to have the correct version of Reanimated.

## API Definition

```js
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

createAnimatedSwitchNavigator(RouteConfigs, SwitchNavigatorConfig);
```

The route configs and navigator configs are identical to [createSwitchNavigator](switch-navigator.html)
