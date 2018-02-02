---
id: modal
title: Opening a full-screen modal
sidebar_label: Opening a full-screen modal
---

Dictionary.com provides no satisfactory definition of modal as it relates to user interfaces, but semantic UI describes it as follows:

> A modal displays content that temporarily blocks interactions with the main view

This sounds about right. A modal is like a popup -- it's not part of your primary navigation flow &mdash; it usually has a different transition, a different way to dismiss it, and you it's usually intended to primary focus on one particular piece of content or interaction. Often these modals don't take up the entire screen (you can read more about that in the [Partial overlays section](partial-overlay.html)), but in this case we'll talk about modals that take up the user's entire screen.

The purpose of explaining this as part of the React Navigation fundamentals is not only because this is a common use case, but also because the implementation requires knowledge of *nesting navigators*, which is an important part of React Navigation.

## Creating a modal stack

const RootStack = StackNavigator({
  Main: {
    screen: MainStack,
  },
  
}, {

})

const MainStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    /* same configuration as before */
  }
);


## Summary

- hello hello
- [Full source of what we have built so far](https://snack.expo.io/@react-navigation/simple-header-button).