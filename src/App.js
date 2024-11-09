// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import 'leaflet/dist/leaflet.css';


function App() {
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    // Меняем язык на противоположный
    const newLanguage = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLanguage);
  };
  return (
    <Router>      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
