---
id: use-navigation
title: useNavigation
sidebar_label: useNavigation
---

`useNavigation` is a hook which gives access to `navigation` object. It's useful when you cannot pass the `navigation` prop into the component directly, or don't want to pass it in case of a deeply nested child.

- `useRoute()` returns a `navigation` prop.


## Example

```js
import React from "react";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/core";

export default function MyBackButton() {
  const navigation = useNavigation();
  return (
    <Button
      title="Back"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}

```
