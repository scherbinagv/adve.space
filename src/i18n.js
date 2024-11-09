// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импорт переводов
import en from './locales/en.json';
import ru from './locales/ru.json';

i18n
  .use(LanguageDetector) // Автоматическое определение языка пользователя
  .use(initReactI18next) // Подключение к React
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru }
    },
    fallbackLng: 'en', // Язык по умолчанию, если текущий язык отсутствует
    interpolation: {
      escapeValue: false // Не экранируем перевод
    }
  });

export default i18n;
