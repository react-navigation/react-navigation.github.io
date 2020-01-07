import * as React from 'react';
import * as Localization from 'expo-localization'; // or whatever library you want
import i18n from 'i18n-js'; // or whatever library you want
import { View, Text, Button } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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

function MyScreen() {
  const { t, locale, setLocale } = React.useContext(LocalizationContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current locale: {locale}. </Text>
      <Text>
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

export const LocalizationContext = React.createContext();

const Stack = createStackNavigator();

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
      <NavigationNativeContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={MyScreen} />
        </Stack.Navigator>
      </NavigationNativeContainer>
    </LocalizationContext.Provider>
  );
}
