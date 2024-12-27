// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'; // Оборачиваем в Router
import './i18n'; // Импорт настроек i18next

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Router 
      // basename="/adve.space
    > 
      <App />
    </Router>
  // </React.StrictMode>
);

reportWebVitals();
