---
title: Building custom screen transitions with react-native-screen-transitions
authors: ed
tags: [community, guide]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

There are a few ways to make an app feel more alive, and I'm a big believer that motion is one of them.

Most people already know their OS animations by muscle memory. That's why a custom transition can land so well: used in the right place, it breaks the routine just enough to make a flow feel intentional.

`react-native-screen-transitions` is a React Navigation transition toolkit for flows that need more control over navigation motion. In this article, we'll recreate an iOS-style page transition, then build up to a bounds-driven `navigation.zoom()` flow.

<!--truncate-->

One caveat before we start: this is not a blanket replacement for `@react-navigation/native-stack` or `@react-navigation/stack`. If `native-stack` already does the job, keep using it. If the JS stack already gives you enough control, keep using that too. `react-native-screen-transitions` fits when a specific flow needs more freedom: custom gesture choreography, snap points, bounds-driven motion, or a Reanimated-first transition model.

## Setup

The `react-native-screen-transitions` package contains the transition primitives. In your project directory, run:

```bash npm2yarn
npm install react-native-screen-transitions
```

### Installing peer dependencies

Next, install the necessary peer dependencies used by `react-native-screen-transitions`.

<Tabs groupId='framework' queryString="framework">
<TabItem value='expo' label='Expo' default>

In your project directory, run:

```bash
npx expo install react-native-reanimated react-native-gesture-handler \
  @react-navigation/native @react-navigation/native-stack \
  @react-navigation/elements react-native-screens \
  react-native-safe-area-context
```

This will install versions of these libraries that are compatible with your Expo SDK version.

For the `navigationMaskEnabled` example later in the article, install `@react-native-masked-view/masked-view` too:

```bash
npx expo install @react-native-masked-view/masked-view
```

</TabItem>
<TabItem value='bare' label='Bare React Native'>

In your project directory, run:

```bash npm2yarn
npm install react-native-reanimated react-native-gesture-handler \
  @react-navigation/native @react-navigation/native-stack \
  @react-navigation/elements react-native-screens \
  react-native-safe-area-context
```

If you're on a Mac and developing for iOS, install the pods via [CocoaPods](https://cocoapods.org/) to complete the linking:

```bash
npx pod-install ios
```

For the `navigationMaskEnabled` example later in the article, install `@react-native-masked-view/masked-view` too:

```bash npm2yarn
npm install @react-native-masked-view/masked-view
```

</TabItem>
</Tabs>

## Recreating the iOS page transition

<div className="device-frame">
<video playsInline autoPlay muted loop>
  <source src="/assets/blog/screen-transitions/ios-reference.mp4" />
</video>
</div>

Let's dissect the native iOS page animation and mimic it closely:

- the incoming screen slides in from the right
- the screen underneath shifts slightly left
- optionally, we can round the corners of the page, and on newer iOS versions that can move closer to a squircle look

## Start with a Blank Stack

Blank Stack is the navigator that ships with `react-native-screen-transitions`. It comes with no built-in animations, so every transition is yours to define. That's exactly what we want here.

```tsx static2dynamic
import { createBlankStackNavigator } from 'react-native-screen-transitions/blank-stack';

const RootStack = createBlankStackNavigator({
  screens: {
    Home: HomeScreen,
    Detail: DetailScreen,
  },
});
```

## Define the transition

To define a transition, we configure two things: how the gesture behaves, and how the screen animates.

`transitionSpec` controls the spring configuration for opening and closing. `screenStyleInterpolator` is the function that returns the animated styles for the transition based on values like progress and screen layout. For this example, we'll keep it simple and drive everything from the root-level progress helper.

```tsx
import { interpolate } from 'react-native-reanimated';
import Transition, {
  type ScreenTransitionConfig,
} from 'react-native-screen-transitions';

const iosCardStackTransition: ScreenTransitionConfig = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: Transition.Specs.DefaultSpec,
    close: Transition.Specs.DefaultSpec,
  },
  screenStyleInterpolator: ({ active, current, progress }) => {
    'worklet';

    const width = current.layouts.screen.width;
    const translateX = interpolate(
      progress,
      [0, 1, 2],
      [width, 0, -width * 0.3],
      'clamp'
    );

    return {
      content: {
        borderRadius: active.settled ? 0 : DEVICE_CORNER_RADIUS,
        borderCurve: active.settled ? 'continuous' : 'circular',
        overflow: 'hidden',
        transform: [{ translateX }],
      },
      backdrop: {
        backgroundColor: 'rgba(0,0,0,1)',
        opacity: interpolate(active.progress, [0, 1], [0, 0.1], 'clamp'),
      },
    };
  },
};
```

Then apply that config to the stack:

```tsx static2dynamic
const RootStack = createBlankStackNavigator({
  screens: {
    Home: HomeScreen,
    Detail: {
      screen: DetailScreen,
      options: iosCardStackTransition,
    },
  },
});
```

<div className="device-frame">
<video playsInline autoPlay muted loop>
  <source src="/assets/blog/screen-transitions/ios-card-transition.mp4" />
</video>
</div>

And we're set: a close replica of the iOS page animation.

The interesting bit is `screenStyleInterpolator`. We're using one root-level `progress` value to describe both sides of the transition:

- When `progress` goes from `0 -> 1`: the incoming screen moves from `width` to `0`
- When `progress` goes from `1 -> 2`: the previous screen continues from `0` to `-width * 0.3`
- `current.layouts.screen.width` gives us the full distance to work with
- `transform: [{ translateX }]` is applied on `content`, so the whole screen moves as one unit
- `borderRadius: active.settled ? 0 : DEVICE_CORNER_RADIUS` only rounds the screen while it is moving, then lets it settle back to full-bleed
- `borderCurve` helps the corners read closer to the system look while the card is in motion
- the `backdrop` fade adds just a little depth under the active screen

## Why not just use JS stack?

JS stack already does this, so what's the point?

For the example above, nothing. JS stack does this well, and if that's all you need, use it.

Where `react-native-screen-transitions` starts to pay off is when the transition needs to know about geometry: the position and size of a specific component on one screen, animating to a specific component on another. That's not something JS stack expresses cleanly, and it's what makes the next example possible.

## navigation.zoom()

<div className="device-frame">
<video playsInline autoPlay muted loop>
  <source src="/assets/blog/screen-transitions/navigation-zoom.mp4" />
</video>
</div>

One thing I'm really proud to announce with v3.4 is `navigation.zoom()`.

`navigation.zoom()` is a bounds-driven helper for recreating that navigation zoom handoff between a source element and a destination screen. It works by measuring component A and component B with the Bounds API, then animating between them. This isn't a traditional shared-element system, so if that's what you need, I'd wait for Reanimated's version to mature.

Let's start with the source screen. In a realistic flow, the card already knows which item it represents, so use that item's id as the boundary id and pass it through navigation.

```tsx
function FeedCard({ item, navigation }) {
  return (
    <Transition.Boundary.Trigger
      id={item.id}
      onPress={() => {
        navigation.navigate('Detail', { id: item.id });
      }}
    >
      <Image source={item.image} style={styles.card} />
    </Transition.Boundary.Trigger>
  );
}
```

On the destination screen, use the same `id` from `route.params`. You don't have to define a `Transition.Boundary.View` on the destination, but if you want the destination to resize itself to match component A's bounds, you should.

```tsx
function DetailScreen({ route }) {
  const item = getItem(route.params.id);

  return (
    <View style={styles.screen}>
      <Transition.Boundary.View id={item.id} style={styles.hero}>
        <Image source={item.image} style={styles.hero} />
      </Transition.Boundary.View>
    </View>
  );
}
```

Now orchestrate the animation. `options` receives `route`, so we can derive the same `id` there and pass it into the bounds helper:

```tsx static2dynamic
const RootStack = createBlankStackNavigator({
  screens: {
    Feed: FeedScreen,
    Detail: {
      screen: DetailScreen,
      options: ({ route }) => {
        const zoomId = route.params.id;

        return {
          navigationMaskEnabled: Platform.OS === 'ios',
          gestureEnabled: true,
          gestureDirection: ['vertical', 'vertical-inverted', 'horizontal'],
          gestureDrivesProgress: false,
          transitionSpec: {
            open: Transition.Specs.DefaultSpec,
            close: Transition.Specs.FlingSpec,
          },
          screenStyleInterpolator: ({ bounds }) => {
            'worklet';

            return bounds({ id: zoomId }).navigation.zoom({
              target: 'bound',
            });
          },
        };
      },
    },
  },
});
```

A few choices here are worth calling out.

`navigationMaskEnabled` requires `@react-native-masked-view/masked-view`. I keep the platform guard because animating layout properties on the mask element tends to hold up much better on iOS than on Android.

`gestureDrivesProgress: false` means the drag does not directly scrub the stack's main transition progress. The gesture still updates live drag values and still participates in the dismiss decision on release, but the zoom helper stays in control of the interaction instead of behaving like a normal interactive pop.

`close: Transition.Specs.FlingSpec` turns `overshootClamping` off and uses a looser spring, so a release or fling feels more natural on the way out.

### Taking this further with boundary groups

The example above works well when you have one obvious source and one obvious destination. A gallery is more interesting. You might have a masonry grid on the index screen, then a paged detail screen where the user can swipe between images before closing.

<div className="device-frame">
<video playsInline autoPlay muted loop>
  <source src="/assets/blog/screen-transitions/boundary-groups.mp4" />
</video>
</div>

This is where the boundary `group` prop becomes useful. Think of `group` as a namespace for a family of related bounds. The `id` still chooses the specific item, but the `group` tells the system which collection that item belongs to.

Start by defining a stable group and a mutable value for the active item:

```tsx
export const GALLERY_GROUP = 'gallery';
export const activeGalleryId = makeMutable(GALLERY_ITEMS[0].id);
```

On the source screen, every thumbnail uses its own `id`, but they all share the same `group`:

```tsx
<Transition.Boundary.Trigger
  id={item.id}
  group={GALLERY_GROUP}
  onPress={() => {
    activeGalleryId.set(item.id);
    navigation.navigate('Detail', { id: item.id });
  }}
>
  <Image source={{ uri: item.uri }} style={styles.image} />
</Transition.Boundary.Trigger>
```

On the destination screen, the matching image uses the same `id` and the same `group`:

```tsx
<Transition.Boundary.View
  id={item.id}
  group={GALLERY_GROUP}
  style={{ width: imageWidth, height: imageHeight }}
>
  <Image source={{ uri: item.uri }} style={styles.image} />
</Transition.Boundary.View>
```

Then the transition asks bounds for both values:

```tsx
const id = activeGalleryId.get();

return bounds({
  id,
  group: GALLERY_GROUP,
}).navigation.zoom({ target: 'bound' });
```

Groups are useful when the active item can change while the destination stays mounted. The mutable `activeGalleryId` keeps track of the current active id, so when bounds need a fresh measurement, for example before a drag or dismiss, the system knows which element to remeasure.

The gallery example also updates `activeGalleryId` when the horizontal detail list settles on a new page. That way, if the user opens one image, swipes to another, and then closes the screen, the transition returns to the image they are actually looking at instead of the one they originally opened.

And that's the whole thing: SwiftUI's `navigation.zoom()` look in pure JS.

The full source for both examples lives [here](https://github.com/eds2002/react-native-screen-transitions) if you want to poke at it.

## What's next for Screen Transitions

I've been quietly working on the next wave of improvements: moving the architecture over to Reanimated 4, Gesture Handler v3, and React 19's new Activity component. Pinch-in and pinch-out transitions are also in progress, so there should be a few exciting changes landing soon.

Thanks for all the support on Screen Transitions. It's honestly a dream package for me, and I'm excited that other people seem to share the excitement. If you build something with it, I'd love to see it!
