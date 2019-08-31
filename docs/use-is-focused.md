---
id: use-is-focused
title: useFocusEffect
sidebar_label: useFocusEffect
---

We might want to render different content based on the current focus state of the screen. The library exports a `useIsFocused` hook to make this easier:

```js
import { useIsFocused } from '@react-navigation/core';

// ...

const isFocused = useIsFocused();
```
