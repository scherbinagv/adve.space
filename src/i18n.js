// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


// Импорт переводов
import en from './locales/en.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';

i18n
  .use(LanguageDetector) // Автоматическое определение языка пользователя
  .use(initReactI18next) // Подключение к React
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      ro: { translation: ro }
    },
    fallbackLng: 'en', // Язык по умолчанию, если текущий язык отсутствует
    interpolation: {
      escapeValue: false // Не экранируем перевод
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path'], // Сначала из querystring (например, /en)
      // caches: ['cookie', 'localStorage'] // Кешируем язык в cookie и localStorage
    }
  });

export default i18n;
