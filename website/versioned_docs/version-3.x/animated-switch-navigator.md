---
id: version-3.x-animated-switch-navigator
title: createAnimatedSwitchNavigator
sidebar_label: createAnimatedSwitchNavigator
original_id: animated-switch-navigator
---

An SwitchNavigator with animation support. 

To use this navigator, you need to install `react-native-reanimated >= 1.0.0`. If you have a managed Expo project, you need to use >= SDK 33 to have the correct version of Reanimated.

## API Definition

```js
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

createAnimatedSwitchNavigator(RouteConfigs, SwitchNavigatorConfig);
```

## RouteConfigs

The route configs are identical to [createSwitchNavigator](switch-navigator.html)

## SwitchNavigatorConfig

The switch navigator configs are identical to [createSwitchNavigator](switch-navigator.html).

By default, the transition between screens is a cross-fade. You can customize the transition with an additional option `transition`:

```jsx
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

const MySwitch = createAnimatedSwitchNavigator(
  {
    Home: HomeScreen,
    Other: OtherScreen,
  },
  {
    // The previous screen will slide to the bottom while the next screen will fade in
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  }
);
```

Since the transition are possible thanks to the `Transition` API from `react-native-reanimated`, you can learn more about it [here](https://github.com/kmagiera/react-native-reanimated).
