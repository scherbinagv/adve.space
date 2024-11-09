// src/pages/Dashboard.js
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainPage from './dashboard/MainPage';
import Invoices from './dashboard/Invoices';
import Notifications from './dashboard/Notifications';
import Settings from './dashboard/Settings';

function Dashboard() {
    const { t } = useTranslation();
    return (
        <div>
          <h1>{t('app.title')}</h1>
          <nav>
            <ul>
              <li><Link to="main">{t('app.main')}</Link></li>
              <li><Link to="invoices">{t('app.invoices')}</Link></li>
              <li><Link to="notifications">{t('app.notifications')}</Link></li>
              <li><Link to="settings">{t('app.settings')}</Link></li>
            </ul>
          </nav>
          
          <Routes>
            <Route path="main" element={<MainPage />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
    );
}
    

export default Dashboard;
