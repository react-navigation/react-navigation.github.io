---
id: collapsible-header
title: Collapsible header
sidebar_label: Collapsible header
---

react-navigation-collapsible is a library and a `Higher Order Component` that adjusts your navigationOptions and makes your screen header collapsible. 

Since react-navigation's header is designed as `Animated` component. You can animate the header by passing `Animated.Value` from your `ScrollView` or `FlatList` to the header.

## Installation

Install the react-navigation-collapsible package in your project:

```
yarn add react-navigation-collapsible
# or, if you use npm:
npm install react-navigation-collapsible
```

## Usage

```javascript
import { withCollapsible } from 'react-navigation-collapsible';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyScreen extends Component {
  static navigationOptions = {
    title: 'Awesome Screen'
  };

  render() {
    const { paddingHeight, scrollY, onScroll } = this.props.collapsible;

    return (
      <AnimatedFlatList 
        ...
        contentContainerStyle={{ paddingTop: paddingHeight }}
        scrollIndicatorInsets={{ top: paddingHeight }}
        _mustAddThis={scrollY}
        onScroll={onScroll} 
        />
    )
  }
}

export default withCollapsible(MyScreen, {iOSCollapsedColor: '#031'});
```

<a href="https://snack.expo.io/@benevbright/react-navigation-collapsible" target="blank" class="run-code-button">&rarr; Run this code</a> 


## Links

[https://github.com/benevbright/react-navigation-collapsible](https://github.com/benevbright/react-navigation-collapsible)
