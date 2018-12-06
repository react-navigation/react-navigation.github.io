---
id: navigation-lifecycle
title: Navigation lifecycle
sidebar_label: Navigation lifecycle
---

在上一个章节里,我们学到了使用 stack navigator 来完成两个页面 (`Home` and `Details`) ，并知道了使用 `this.props.navigation.navigate('RouteName')` 进行页面间跳转.

那么更重要的一个问题是: 当我没说离开`Home`页会发生什么？我们点击返回呢？route是怎么知道页面是正要离开或者正要返回呢？

想想 react-navigation 在web端怎么用, 你也许会想当我们 离开A页面到B页面, A页面会执行 unmount (`componentWillUnmount`会被调用) ，当重新返回A页面的时候，A会重新执行mount. 那么React的生命周期函数在react-navigation中依然有效, 但是由于移动端复杂的需求，他们的用法有些不同。

## Example scenario

假如一个stack navigator有AB两个页面. 当到A页面之后, 它的 `componentDidMount` 会被调用. 再到B页面, B页面的 `componentDidMount`也会被调用, 但是A页面依然是挂载状态，并没有卸载， `componentWillUnmount`没有被调用.

我们从B回到A, B的`componentWillUnmount`会被调用, 但是A的 `componentDidMount`不会被调用，因为它一直存在，没有被重新加载.

其他navigators的生命周期在经过联想后也可以得出相似的结论. 假如一个tab navigator有两个tabs, 每个tab 都是一个 stack navigator:


```jsx
const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Profile: ProfileScreen,
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Settings: SettingsStack,
  }
);
```

我们开始是在 `HomeScreen` 然后到 `DetailsScreen`. 然后我们切换tabbar到 `SettingsScreen` 再到 `ProfileScreen`. 经过这一些列的操作, 所有的这四个页面的状态都是 mounted! 如果你切换tabbar回到 `HomeStack`, 你会注意到展示给你的是 `DetailsScreen` - `HomeStack`的路由栈状态已经被保存了!

## React Navigation lifecycle events

现在我们知道React lifecycle在React Navigation上是如何工作的,让我们回答一下刚开始的问题: "我们怎么判断一个页面是要离开还是要返回呢?"

React Navigation提供了 emits events 来监听页面的状态. 这里有四个events可以监听: `willFocus`, `willBlur`, `didFocus` and `didBlur`. 更多请参考 [API reference](navigation-prop.html#addlistener-subscribe-to-updates-to-navigation-lifecycle).

大部分的用法都可以参考 [`withNavigationFocus` HOC](with-navigation-focus.html) 或者 [`<NavigationEvents />` component](navigation-events.html) which are a little more straightforward to use.

## Summary

- while React's lifecycle methods are still valid, React Navigation adds more lifecycle events that you can subscribe to through the `navigation` prop.
- you may also use the `withNavigationFocus` HOC or `<NavigationEvents />` component to react to lifecycle changes
