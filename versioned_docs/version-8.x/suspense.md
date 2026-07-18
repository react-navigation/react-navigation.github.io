---
id: suspense
title: Suspense and pending UI
sidebar_label: Suspense and pending UI
---

[React Suspense](https://react.dev/reference/react/Suspense) lets you show a fallback - the loading UI shown in place of content that isn't ready yet - while code or data for part of the UI is loading. In this guide, we'll cover how React Navigation works with Suspense and how to handle pending UI during navigation.

## What can suspend

A Suspense boundary shows its fallback when a component inside it suspends while rendering. A component suspends when it's loaded with [`React.lazy`](https://react.dev/reference/react/lazy), reads a cached Promise with [`React.use`](https://react.dev/reference/react/use), or reads data through a framework or library that integrates with Suspense.

Only data read through one of these Suspense-enabled sources can trigger a boundary. Data fetched in an Effect or event handler has to be routed through such a source first. The examples in this guide assume your code or data is loaded this way.

## How navigation behaves with Suspense

A navigation action refers to any action that updates the [navigation state](navigation-state.md), including actions that don't change the visible screen, such as updating params. Navigation actions triggered from a screen through APIs such as [`useNavigation`](use-navigation.md) or [`useLinkProps`](use-link-props.md) run as [React transitions](https://react.dev/reference/react/startTransition) (not to be confused with visual transition animations).

While the navigation transition is pending:

- The current screen stays visible and interactive.
- Navigation and focus hooks and events still reflect the current screen.

Once the suspended content is ready, the destination appears and the navigator's animation starts. If you start another navigation before the pending one finishes, it takes over immediately, so you always land on the newest destination.

Some navigation actions don't use transitions, such as switching tabs in a [native tab navigator](bottom-tab-navigator.md), the native back action in a [native stack](native-stack-navigator.md), gesture-driven navigations etc. So a suspending destination shows the nearest fallback instead of keeping the current screen visible.

When writing a [custom navigator](custom-navigators.md), actions dispatched through the navigator's `navigation` prop don't automatically run as transitions. You can choose to wrap them in [`startTransition`](https://react.dev/reference/react/startTransition) based on how your navigator works.

## Existing and new Suspense boundaries

During a transition, React keeps already-visible content on screen instead of replacing it with a fallback. When a boundary first appears as part of the destination, it has no previous content to preserve, so it shows its fallback right away while the rest of the destination renders.

This is why a boundary around the navigator behaves differently from one inside a screen. The boundary around the navigator already exists, so it can keep the current screen visible. A new boundary inside the destination has nothing to keep visible, so it shows its loading UI instead.

## Choosing where to place Suspense boundaries

Where you place the nearest Suspense boundary decides what the user sees while content loads.

### Around the navigator

With a boundary around the whole navigator, the current screen stays visible while the destination suspends during a transition. You can use the navigator's [`layout`](navigator.md#layout) to add this boundary:

```js static2dynamic
const RootStack = createNativeStackNavigator({
  // highlight-start
  layout: ({ children }) => (
    <React.Suspense fallback={<LoadingPlaceholder />}>
      {children}
    </React.Suspense>
  ),
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

This fallback is still shown during the initial render, when there is no previously displayed screen to keep visible, or if a component suspends because of a state update that isn't wrapped in a transition.

This can be useful for [stack navigators](stack-navigator.md), where you'd keep the current screen visible during navigation and [show pending UI on the current screen](#showing-pending-ui-on-the-current-screen).

It's not recommended for native tab navigators, where switching tabs by tapping the native tab bar doesn't run as a transition, so the fallback would hide the tab bar if a screen suspends.

### Around each screen

With a boundary around each screen, the destination appears immediately with its fallback instead of keeping the current screen visible. You can use the [`screenLayout`](navigator.md#screen-layout) prop to add a boundary to every screen in a navigator, or a screen's [`layout`](screen.md#layout) to add a boundary to just that screen:

```js static2dynamic
const RootStack = createNativeStackNavigator({
  // highlight-start
  screenLayout: ({ children }) => (
    <React.Suspense fallback={<LoadingPlaceholder />}>
      {children}
    </React.Suspense>
  ),
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

This is ideal for tab and [drawer navigators](drawer-navigator.md), as it keeps the tab bar or drawer visible and shows the loading UI only in the screen's area.

### Around a section inside a screen

You don't always need to wait for the whole screen. If only specific parts of it suspend, you can wrap just that part in a boundary and let the rest of the screen render normally:

```js
function ProfileScreen() {
  return (
    <>
      <ProfileHeader />
      // highlight-next-line
      <React.Suspense fallback={<FeedSkeleton />}>
        <ProfileFeed />
      </React.Suspense>
    </>
  );
}
```

In this example, `ProfileHeader` appears immediately while `FeedSkeleton` is shown in place of `ProfileFeed`. Once the feed is ready, it replaces the skeleton without affecting the header.

We recommend putting content that should appear together under the same boundary. Avoid adding separate boundaries around every component.

## Showing pending UI on the current screen

When the current screen stays visible after a navigation that suspends, it may not be obvious that tapping a button did anything. Showing a pending state on that button makes it clear that navigation is in progress.

You can use the [`useTransition`](https://react.dev/reference/react/useTransition) hook to show a loading indicator while the navigation transition is pending. We recommend encapsulating this in a reusable button component so that each control manages its own transition, and the loading state of one control doesn't affect the others.

For example, a button that navigates using [`useLinkProps`](use-link-props.md):

```js
function LinkButton({ in: parent, screen, params, children }) {
  const { onPress, ...rest } = useLinkProps({ in: parent, screen, params });

  // highlight-start
  const [isPending, startTransition] = React.useTransition();
  const isPendingDeferred = React.useDeferredValue(isPending);
  // highlight-end

  return (
    <MyButton
      {...rest}
      // highlight-next-line
      loading={isPending && isPendingDeferred}
      onPress={(e) => {
        // highlight-start
        startTransition(() => {
          onPress(e);
        });
        // highlight-end
      }}
    >
      {children}
    </MyButton>
  );
}
```

In this example, deferring the `isPending` value with [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) helps avoid the loading indicator from flashing briefly when the navigation finishes quickly or the destination doesn't suspend.

You can then use the `LinkButton` for navigation:

```js
<LinkButton screen="Profile" params={{ userId: 'jane' }}>
  Open profile
</LinkButton>
```

Similarly, you can wrap any navigation action in a transition and show a pending UI while the navigation transition is in progress.

If you have multiple controls that can start a navigation, we recommend using separate transitions for each control, so that the loading state of one doesn't affect the others.

If you use the [`Button`](elements.md#button) component from `@react-navigation/elements` for navigation, it automatically handles transitions and shows a loading indicator while the navigation is pending.

## Handling errors

Suspense boundaries only handle pending content. If loading fails, or the component throws during rendering, an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) can be used to show an error message instead of crashing the whole app:

```js static2dynamic
const RootStack = createNativeStackNavigator({
  screenLayout: ({ children }) => (
    // highlight-next-line
    <ErrorBoundary fallback={<ErrorFallback />}>
      <React.Suspense fallback={<LoadingPlaceholder />}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  ),
  // highlight-end
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

Typically, the error boundary should give the user a way to recover, such as retrying the failed action or navigating back to a safe screen.
