---
title: React Navigation joins GitHub Sponsors
author: Brent Vatne
author_url: https://twitter.com/notbrent
author_title: Assistant to the Regional Core Team Manager
author_image_url: https://avatars3.githubusercontent.com/u/90494?s=200&v=4
description: We joined GitHub Sponsors - https://github.com/sponsors/react-navigation!

tags: [announcement, web]
---

tl;dr: We joined GitHub Sponsors, [click here to see our sponsors page and become a sponsor](https://github.com/sponsors/react-navigation)!

<hr />

React Navigation is depended on by some of the most respected engineering organizations, well-known brands, and talented startups. It's used by financial services apps like [Brex](https://brex.com/mobile/) and [Coinbase Pro](https://pro.coinbase.com/); educational apps like [Codecademy Go](https://www.codecademy.com/mobile-app-download) and [DataCamp](https://www.datacamp.com/mobile/); consumer apps like [Shop from Shopify](https://www.shopify.com/shop), [Bloomberg](https://www.bloombergapps.com/app/bloomberg/), [TaskRabbit](https://apps.apple.com/ca/app/taskrabbit-handyman-more/id374165361), and [Th3rdwave](https://www.th3rdwave.coffee/); entertainment apps like the [National Football League (NFL)](https://itunes.apple.com/app/nfl/id389781154) (in their main app and several others), [Cameo](https://apps.apple.com/us/app/cameo-personal-celeb-videos/id1258311581), [Tracker Network for Fortnite](https://apps.apple.com/us/app/tracker-network-for-fortnite/id1287696482), and the [Call of Duty companion app](https://www.callofduty.com/app) from Activision Blizzard. One of my personal favourite apps using React Navigation is [Readwise](https://readwise.io/), I love making my coffee with [Single Origin 2](https://singleoriginapp.com/), and managing household chores with [Sweepy](https://sweepy.app/).

We've also seen React Navigation used in apps that help in the fight against COVID-19. Our favourites are [How We Feel](https://howwefeel.org/) by Pinterest co-founder and CEO Ben Silbermann and a team from Pinterest in collaboration with leading scientists ([article](https://news.harvard.edu/gazette/story/2020/04/how-we-feel-app-helps-track-spread-of-covid-19/)) and [COVID Symptom Study](https://covid.joinzoe.com/) by ZOE Global in association with King's College London ([article](https://www.nytimes.com/2020/05/11/health/coronavirus-symptoms-app.html)).

There are so many more apps that we could mention here, but let's move on. If you've been following along with React Navigation, you already know what a huge improvement v5 has been for the library and for navigation in React Native in general. We haven't slowed down since shipping v5, some other substantial improvements we've shipped recently include:

- [First-class support for web](https://reactnavigation.org/blog/2020/05/16/web-support) 🎉
- The improvements to URL integration that made web support possible also drastically improves the experience of building deep linking in your iOS and Android apps! You can play around with route configuration directly in the browser with the [linking playground](https://reactnavigation.org/docs/configuring-links#playground).
- An alternative stack navigator implementation that uses `UINavigationController` on iOS and `Fragment` on Android. There is no beating the performance of the native stack navigator equivalents (at least for now), and so we made them available through [createNativeStackNavigator](https://github.com/software-mansion/react-native-screens/tree/master/native-stack) on [react-native-screens](). You don't get the same degree of customization with the native stacks, and there is no equivalent on web, so there are plenty of cases where you will still want to use [createStackNavigator](https://reactnavigation.org/docs/stack-navigator/). Your app, your choice. Mix and match if you want.

## React Navigation Team

This project has only been possible because of the time and money invested by [Expo](https://expo.io) and [Software Mansion](https://swmansion.com/) to support contributors like the current lead maintainer [Satyajit Sahoo](https://github.com/satya164) and others such as [Brent](https://github.com/brentvatne), [Eric](https://github.com/ericvicenti), [Evan](https://github.com/EvanBacon), [Krzysztof](https://github.com/kmagiera), and [Wojciech](https://github.com/WoLewicki).

Many folks from the community have also volunteered their valuable time to the project: [Michal Osadnik](https://github.com/osdnk) was instrumental in designing and building React Navigation v5, [Erivelton](https://github.com/eriveltonelias) has provided support and improved the documentation, [Vojtech](https://github.com/vonovak) maintains popular React Navigation utility libraries and chips in on the library and documentation when he has time, and [Janic](https://github.com/janicduplessis) regularly lives on the bleeding edge, testing new features and helping us improve them before they are included in stable releases and maintaining [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context), one of the building blocks for React Navigation.

`@react-navigation/core` has reached over 300,000 downloads per week on npm, compared to 380,000+ for `react-native`. It's not possible to draw any meaningful conclusions from npm download stats alone, but it is humbling to see React Navigation at nearly 80% of the weekly download count of React Native. We've managed this with an incredibly small team of, at most, one and a half full time engineers at any given time, and volunteers that chip in when they can.

## Sponsorship

To be blunt: **if React Navigation helps you to deliver value to your customers, we would be thrilled if you could show us some love through a sponsorship.**

Sponsorships will help us to move more quickly towards our goal of building the best cross-platform navigation library and continue to provide timely support for bug reports in our GitHub issues.

<div style={{marginTop: -30}} />

### 👉 [Visit our GitHub Sponsors page](https://github.com/sponsors/react-navigation) 👈

We appreciate and support you can provide, but please only donate if you have the financial means to do so comfortably.