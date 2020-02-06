---
original_id: localization
id: version-3.x-localization
title: Localization
sidebar_label: Localization
---

English is only one of many languages people speak around the world (thanks a lot, [Tower of Babel](https://en.wikipedia.org/wiki/Tower_of_Babel)) and it's polite and sometimes even necessary to translate our app into the languages our users speak. Let's look at one way this can be done in React Navigation - it's not the only way but it'll do the trick. Similar to [themes](themes.html), we will use `screenProps`. You may want to also use React's context API as demonstrated in the [themes](themes.html) guide in order to make it easier to access the translate function from a variety of components.

## Setting up a localization library

We'll need to use some kind of library to store our translations and provide a function that gives us access to them, along with handling fallbacks when we don't have a particular language defined. Localization and internationalization (i18n) are often used interchangeably, as in the example below where we get the current `locale` from `expo-localization` and use the `i18n-js` library for managing translations, for no particular reason other than it was available - use whatever you like.

```jsx
import  * as Localization from 'expo-localization'; // or whatever library you want
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

Next let's store our `locale` in the state of our root app component and then thread it through `screenProps` to make it available throughout React Navigation.

```jsx
export default class App extends React.Component {
  state = {
    locale: Localization.locale,
  };

  setLocale = locale => {
    this.setState({ locale });
  };

  t = (scope, options) => {
    return i18n.t(scope, { locale: this.state.locale, ...options });
  };

  render() {
    return (
      <AppContainer
        screenProps={{
          t: this.t,
          locale: this.state.locale,
          setLocale: this.setLocale,
        }}
      />
    );
  }
}
```

Now in our screens we can use these `screenProps` as follows:

```jsx
class Screen extends React.Component {
  static navigationOptions = ({ screenProps: { t } }) => ({
    title: t('foo'),
  });

  render() {
    let { t, locale } = this.props.screenProps;

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
          <Button
            title="Switch to French"
            onPress={() => this.props.screenProps.setLocale('fr')}
          />
        ) : (
          <Button
            title="Switch to English"
            onPress={() => this.props.screenProps.setLocale('en')}
          />
        )}
      </View>
    );
  }
}
```

You can run this example in [this Snack](https://snack.expo.io/@react-navigation/localization-example). Again, you may want to go further than just passing this through `screenProps` if you want to make it easier to access the `t` function or the other `screenProps` from any React component (and not just screen components that are rendered by React Navigation). Refer to [themes](themes.html) and the [React documentation on context](https://reactjs.org/docs/context.html) for help with that.
