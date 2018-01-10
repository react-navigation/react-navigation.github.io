---
id: other-navigators
title: Beyond StackNavigator
sidebar_label: Beyond StackNavigator
---

`StackNavigator` and its related APIs are likely to be the most frequently used tools in your React Navigation toolbelt, but there are problems that they don't solve. For example, you can't build a tab-based navigation using a `StackNavigator`. The actions that you perform when navigating in a tab layout are fundamentally different from a stack.

In a `StackNavigator` when you navigate to a new route, you are *pushing* the route to the stack and making it the active screen. When you *pop* a screen from the stack (by going back), the screen is no longer rendered and the resources are freed up. The only way to change the active screen is to push or pop a route from the stack.

In tab-based navigation, you cannot *push* a new route, you can only *jump to* a route. To change the active screen, you just change the tab navigation state to point to the route that is now active; the inactive route is not unmounted but it is hidden from view. This is what *jump to* is in tab navigation -- it changes a pointer to the active screen but it doesn't actually add or remove any screens from the tab navigation state. In React Navigation, you can use [TabNavigator](__TODO__) to implement tab-based navigation.

The actions that are performed and the state that is modified in response to the actions is handled by a [router](__TODO__). For most applications you shouldn't have to implement any custom routers, but if you would like to implement your own navigator that models navigation state differently from `StackNavigator` or `TabNavigator` then you may need to create a new router to do so. You can read more about creating a custom navigator in the ["Build your own Navigator"](__TODO__) section.