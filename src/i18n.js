// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


// Импорт переводов
import en from './locales/en.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';
import it from './locales/it.json';
import bg from './locales/bg.json';

i18n
  .use(LanguageDetector) // Автоматическое определение языка пользователя
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      ro: { translation: ro },
      it: { translation: it },
      bg: { translation: bg },
    },
    fallbackLng: 'en', // Язык по умолчанию, если текущий язык отсутствует
    interpolation: {
      escapeValue: false // Не экранируем перевод
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path'], // Сначала из querystring (например, /en)
      // caches: ['cookie', 'localStorage'], // Кешируем язык в cookie и localStorage
      lookupQuerystring: 'lng', // Ищем язык в querystring по параметру lng (например, /?lng=en)
      lookupLocalStorage: 'i18nextLng', // Ищем язык в localStorage по ключу i18nextLng
      lookupCookie: 'i18next', // Ищем язык в cookie
      // настройка для игнорирования региона
      caches: ['cookie', 'localStorage'], // Кеширование только в cookie и localStorage
      excludeCacheFor: ['cimode'], // Не кешировать язык, если он в режиме отладки
      cookieOptions: {
        path: '/', // Указываем путь для cookie
        domain: 'scherbinagv.github.io/adve.space', // Явный домен
      },
    },
    // Убираем региональный код
    supportedLngs: ['en', 'ru', 'ro', 'it', 'bg'], // только языковые коды, без региона
    nonExplicitSupportedLngs: true, // Поддержка неявных языков
  });


export default i18n;
