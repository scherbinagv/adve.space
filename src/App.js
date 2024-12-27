import React, { useEffect, useState  }  from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Application from './pages/Application';
import Tariffs from './pages/app/Tariffs';
import Invoices from './pages/app/Invoices';
import Settings from './pages/app/Settings';
import AdminPage from './pages/app/admin/AdminPage';
import Select from 'react-select';


import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import UserMenu from './pages/app/UserMenu';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import config from './config'; 


function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // Хук для навигации
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации
  const TOKEN_KEY = 'authToken'; // Define a key for localStorage
  const [username, setUsername] = useState("");
  const [permissions, setPermissions] = useState([]);


  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setIsAuthenticated(true);
    }
  
    // Восстанавливаем email из localStorage
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUsername(savedEmail);
    }
  }, []);
  
  const languageOptions = [
    {
      value: 'en',
      label: 'EN',
      flag: './images/flags/United-Kingdom.png',
    },
    {
      value: 'ru',
      label: 'RU',
      flag: './images/flags/Unknown.png',
    },
    {
      value: 'ro',
      label: 'RO',
      flag: './images/flags/Romania.png',
    },
    {
      value: 'it',
      label: 'IT',
      flag: './images/flags/Italy.png',
    },
    {
      value: 'bg',
      label: 'BG',
      flag: './images/flags/Bulgaria.png',
    },
  ];

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/' + i18n.language + '/app'); 
    } else {
      navigate('/' + i18n.language );
    }
  };

  const handleLogoutClick = async () => {
    try {
      // Получение токена из localStorage
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Отправка запроса на сервер для завершения сессии
        const response = await fetch(`${config.api}/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json', // Убедитесь, что сервер ожидает JSON
          },
        });
  
        // Проверка ответа от сервера
        if (!response.ok) {
          throw new Error('Ошибка при завершении сессии');
        }
      }
  
      // Очистка данных с клиента
      localStorage.removeItem(TOKEN_KEY); 
      localStorage.removeItem('userEmail'); 
      localStorage.removeItem('permissions'); 
  
      // Обновление состояния приложения
      setIsAuthenticated(false); 
  
      // Переход на главную страницу
      navigate('/' + i18n.language); 
    } catch (error) {
      console.error("Ошибка при завершении сессии:", error);
    }
  };  

  const handleLanguageChange = (event) => {
    console.log(i18n.language)
    const newLanguage = event.value;
    i18n.changeLanguage(newLanguage); // Меняем язык
    navigate(`/${newLanguage}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`); // Навигация без перезагрузки
  };

  const handleLoginSuccess = async (response) => {

    try {
        // Отправляем токен Google на сервер
        const res = await fetch(`${config.api}/google_login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: response.credential, // Передаем токен от Google
            }),
        });

        if (!res.ok) {
            // Обработка ошибок с сервера
            const errorData = await res.json();
            throw new Error(errorData.error || 'Something went wrong');
        }

        const data = await res.json();

        setUsername(data.user.email);
        setPermissions(data.user.permissions);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('permissions', data.user.permissions);

        // Сохраняем токен вашего приложения (например, JWT) в localStorage
        localStorage.setItem('authToken', data.token);

        // Устанавливаем состояние аутентификации и выполняем редирект
        setIsAuthenticated(true); // Авторизация
        navigate(`./${i18n.language}/app`); // Переход на страницу /ru/app или /en/app
        setShowPopup(false); // Закрытие popup при необходимости

    } catch (error) {
        console.error('Login failed:', error.message);
    }
  };


  const handleLoginError = () => {
      console.error('Google Login Failed');
  };

  return (
      <div>
        <header>
          <div className="header-left" onClick={handleLogoClick}>
            <img src="./images/logo.png" alt="Logo" className="logo"/>
            <div className="header-text">
              <h1>{i18n.t('header.title')}</h1>
            </div>
            <div className="header-slogan">
              <p>{i18n.t('header.slogan1')}</p><p>{i18n.t('header.slogan2')}</p>
            </div>
          </div>

          <div className="button-container">
            {isAuthenticated ? (
              <UserMenu username={username} handleLogoutClick={handleLogoutClick} />            
            ) : (
              <button className="auth-button" onClick={() => setShowPopup(true)}>
                {i18n.t('header.login')}
              </button>
            )}

            {/* Попап для Google Login */}
            {showPopup && (
              <div className="popup">
                <div className='popup-container-small'> 
                      <h3>{t('header.authOption')}</h3>
                      <GoogleOAuthProvider clientId="211956952890-neigfhdpot2959e49k63t48mad76olgl.apps.googleusercontent.com">
                          <div className="google-login-button">
                            <GoogleLogin 
                                onSuccess={(response) => handleLoginSuccess(response, setIsAuthenticated, setShowPopup)}
                                onError={handleLoginError} 
                                useOneTap={false} 
                                usePopup={true}
                            />
                          </div>
                      </GoogleOAuthProvider>
                      <button onClick={() => setShowPopup(false)} className="close-popup">
                        {t('header.close')}
                      </button>
                </div>
              </div>
            )}
            <div className="language-selector-container">
              <Select
                value={languageOptions.find(option => option.value === i18n.language)}
                onChange={handleLanguageChange}
                options={languageOptions}
                getOptionLabel={(option) => (
                  <div>
                    <img src={option.flag} alt={option.label} style={{ marginRight: '8px', width: '20px', verticalAlign: 'middle' }} />
                    {option.label}
                  </div>
                )}
                isSearchable={false}
              />
            </div>
          </div>
        </header>
        
        <div className="page-wrapper">
          <div className="content">
            <Routes>
            <Route path="/" element={<Navigate to={`./${i18n.language.split('-')[0]}`} />} />
              <Route path="/:lang" element={<LanguageRoute />} />
              <Route path="/:lang/app/*" element={<Application />} />
              <Route path="/:lang/tariffs/*" element={<Tariffs />} />
              <Route path="/:lang/invoices/*" element={<Invoices />} />
              <Route path="/:lang/settings/*" element={<Settings username={username} />} />
              <Route path="/:lang/admin/*" element={<AdminPage />} />
            </Routes>
          </div>
        </div>


        <footer className="footer">
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

  // useEffect(() => {
  //   if (lang) {
  //     i18n.changeLanguage(lang); // Меняем язык в i18next
  //   }
  // }, [lang, i18n]);

  return <HomePage />; // Выводим компонент страницы
}

export default App;