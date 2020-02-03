---
id: version-5.x-localization
title: Localization
sidebar_label: Localization
original_id: localization
---

English is only one of many languages that people speak around the world (thanks a lot, [Tower of Babel](https://en.wikipedia.org/wiki/Tower_of_Babel)) and it's polite and sometimes even necessary to translate to your app into the languages that your users speak. Let's look at one way you can do this in React Navigation - it's not the only way but it'll do the trick. Similar to [themes](themes.html), we will use React's context API in order to make it easier to access the translate function from a variety of components.

## Setting up a localization library

We'll need to use some kind of library to store our translations and provide a function that gives us access to them, along with handling fallbacks when we don't have a particular language defined. Localization and internationalization (i18n) are often used interchangeably, as in the example below where we get the current `locale` from `expo-localization` and use the `i18n-js` library for managing translations, for no particular reason other than it was available - use whatever you like.

```jsx
import * as Localization from 'expo-localization'; // or whatever library you want
import i18n from 'i18n-js'; // or whatever library you want

const en = {
  foo: 'Foo',
  bar: 'Bar {{someValue}}',
};

const fr = {
  foo: 'Fou',
  bar: 'Bár {{someValue}}',
};

i18n.fallbacks = true;
i18n.translations = { fr, en };

// This will log 'en' for me, as I'm an English speaker
console.log(Localization.locale);
```

## Wiring up your localization library to navigation

Next let's store our `locale` in the state of our root app component and then thread it through `LocalizationContext` to make it available throughout our app.

```js
export const LocalizationContext = React.createContext();

export default function App() {
  const [locale, setLocale] = React.useState(Localization.locale);
  const localizationContext = React.useMemo(
    () => ({
      t: (scope, options) => i18n.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  );

  return (
    <LocalizationContext.Provider value={localizationContext}>
      <NavigationContainer>
        {/* Screen configuration */}
      </NavigationContainer>
    </LocalizationContext.Provider>
  );
}
```

Now in our screens we can use these `LocalizationContext` as follows:

<samp id="localization" />

```js
function MyScreen() {
  const { t, locale, setLocale } = React.useContext(LocalizationContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Current locale: {locale}.{' '}
        {locale !== 'en' && locale !== 'fr'
          ? 'Translations will fall back to "en" because none available'
          : null}
      </Text>
      <Text>{t('bar', { someValue: Date.now() })}</Text>
      {locale === 'en' ? (
        <Button title="Switch to French" onPress={() => setLocale('fr')} />
      ) : (
        <Button title="Switch to English" onPress={() => setLocale('en')} />
      )}
    </View>
  );
}
```

We can also use it for screen options:

<samp id="localization-with-title" />

```js
function MyStack() {
  const { t } = React.useContext(LocalizationContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MyScreen}
        options={{ title: t('foo') }}
      />
    </Stack.Navigator>
  );
}
```

Refer to [themes](themes.html) and the [React documentation on context](https://reactjs.org/docs/context.html) for help.
