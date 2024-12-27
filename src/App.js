import React, { useEffect, useState  }  from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Application from './pages/Application';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // Хук для навигации

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации


  const handleLoginClick = () => {
    setIsAuthenticated(true); // Авторизация
    navigate('/' + i18n.language + '/app'); // Переход на страницу /ru/app или /en/app
  };

  const handleLogoutClick = () => {
    setIsAuthenticated(false); // Выход
    navigate('/' + i18n.language); // Переход на главную страницу
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage); // Меняем язык
    navigate(`/${newLanguage}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`); // Навигация без перезагрузки
  };

  return (
      <div>
        {/* Хедер с выбором языка */}
        <header>
          <div className="header-left">
            <img src="/images/logo.png" alt="Logo" className="logo" />
            <div className="header-text">
              <h1>{i18n.t('header.title')}</h1>
            </div>
            <div>
              <p>{i18n.t('header.slogan1')}</p><p>{i18n.t('header.slogan2')}</p>
            </div>
          </div>

          <div className="button-container">
            {isAuthenticated ? (
            // Если пользователь авторизован, показываем кнопку выхода
            <button className="auth-button" onClick={handleLogoutClick}>
              {i18n.t('header.logout')}
            </button>
          ) : (
            // Если пользователь не авторизован, показываем кнопку логина
            <button className="auth-button" onClick={handleLoginClick}>
              {i18n.t('header.login')}
            </button>
          )}
            <div>
              <select className="language-dropdown" onChange={handleLanguageChange} value={i18n.language}>
                <option value="en">EN</option>
                <option value="ru">RU</option>
                <option value="ro">RO</option>
              </select>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to={`/${i18n.language}`} />} /> {/* Переход на язык по умолчанию */}
          <Route path="/:lang" element={<LanguageRoute />} />
          <Route path="/:lang/app/*" element={<Application />} />
        </Routes>

        <footer>
          <p>{t('footer.rights')}</p>
          <a>{t('footer.links.about')}</a> | 
          <a>{t('footer.links.offers')}</a> | 
          <a>{t('footer.links.contacts')}</a> | 
          <a>{t('footer.links.partnership')}</a> | 
          <a>{t('footer.links.privacy_policy')}</a> | 
          <a>{t('footer.links.user_agreement')}</a>
        </footer>
      </div>
  );
}

function LanguageRoute() {
  const { lang } = useParams(); // Извлекаем язык из параметра URL
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang); // Меняем язык в i18next
    }
  }, [lang, i18n]);

  return <HomePage />; // Выводим компонент страницы
}

export default App;
