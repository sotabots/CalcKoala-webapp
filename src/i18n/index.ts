// see example: https://github.com/i18next/react-i18next/tree/master/example/react-typescript/simple
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEn from './en/translation.json';
import translationRu from './ru/translation.json';

i18next.use(initReactI18next).init({
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',
  debug: true,
  resources: {
    en: {
      translation: translationEn,
    },
    ru: {
      translation: translationRu,
    },
  },
});

export default i18next;