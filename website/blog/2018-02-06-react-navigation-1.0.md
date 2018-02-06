---
title: React Navigation 1.0
author: Brent Vatne
authorURL: http://twitter.com/notbrent
---

> As the Internet has facilitated rapid and inexpensive distribution of software, companies have begun to take a looser approach to use of the word "beta". This technique may allow a developer to delay offering full support and responsibility for remaining issues.

<span class="quote-source">(Source: [Software release life cycle on Wikipedia](https://en.wikipedia.org/wiki/Software_release_life_cycle#Beta))</span>

Today we removed the “beta” qualifier from the React Navigation 1.0 release channel. This isn’t meant to be interpreted as a signal that React Navigation is “finished". Rather, this release recognizes that React Navigation is already widely used in production apps, that monotonic “beta” release numbers limit our ability to leverage semantic versioning, and that the word “beta” inaccurately conveys a lack of reliability and downplays our responsibility as the maintainers of the project.

In the future, we expect to make a number of breaking changes to the API in order to make React Navigation easier to use and more powerful. These changes will be run through our [new RFC process](https://github.com/react-navigation/rfcs). For example, the [Navigator View API RFC](https://github.com/react-navigation/rfcs/blob/master/text/0002-navigator-view-api.md) outlines a a plan to decouple views from the router in order to make it easier for other navigation APIs, such as [react-native-router-flux](https://github.com/aksonov/react-native-router-flux) and [react-router-native](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-native), to build on top of the same navigation views. We’re also very excited about a plan (no RFC is open yet, but keep an eye out for it) to use [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler) to run navigation gestures (sliding a drawer open, or swiping back on a stack, for example) on the UI thread using the Animated native driver.

Last week we released an updated version of our [documentation website](https://reactnavigation.org/docs/getting-started.html), built using [Docusaurus](https://docusaurus.io/). We hope that the new documentation will help newcomers get onboarded with the fundamentals of React Navigation, and serve as an ongoing resource to handle specific use cases as you come across them (under the “How do I do..?” section). [Contributions to the documentation are very welcome](https://github.com/react-navigation/react-navigation.github.io).

To see a list of recent improvements leading up to this 1.0 release, refer to the “[Renewed Path to React Navigation V1.0](https://github.com/react-navigation/react-navigation/issues/2585)” issue. Thank you to everybody who has filed high-quality bug reports, submitted pull requests, and helped out fellow developers while we were in beta!