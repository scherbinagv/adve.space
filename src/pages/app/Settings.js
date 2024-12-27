import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Используем axios для HTTP-запросов
import config from '../../config'; 



function Settings( {username} ) {

  const { t } = useTranslation();

  const [notifications, setNotifications] = useState({
    summary_report: null,
    favorites_update: null,
    new_offers: null,
    reminders: null,
  });
  const [loading, setLoading] = useState(true); // Для отображения состояния загрузки
  const [error, setError] = useState(null); // Для обработки ошибок

  // Получение текущих настроек из API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.api}/settings/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`, // Используем токен из localStorage
          },
        });
        setNotifications(response.data); // Обновляем настройки из ответа
        console.log(response.data)
      } catch (err) {
        setError('Не удалось загрузить настройки.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Сохранение настроек через API
  const handleSave = async () => {
    try {
      const response = await axios.patch(`${config.api}/settings/`, notifications, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      alert('Настройки успешно сохранены!');
    } catch (err) {
      setError('Не удалось сохранить настройки.');
    }
  };

  if (loading) return <p>Загрузка настроек...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="email-notifications-settings">
      <h3>{t('settings.emailTitle')}</h3>
      <label>{username}</label>
        <div className="notifications-field">
          <h3>{t('settings.notificationsTitle')}</h3>
          <label>
            <input
              type="checkbox"
              name="summary_report"
              checked={notifications.summary_report}
              onChange={handleCheckboxChange}
            />
            {t('settings.notifications.summaryReport')}
          </label>
          <label>
            <input
              type="checkbox"
              name="favorites_update"
              checked={notifications.favorites_update}
              onChange={handleCheckboxChange}
            />
            {t('settings.notifications.favoritesUpdate')}
          </label>
          <label>
            <input
              type="checkbox"
              name="new_offers"
              checked={notifications.new_offers}
              onChange={handleCheckboxChange}
            />
            {t('settings.notifications.newOffers')}
          </label>
          <label>
            <input
              type="checkbox"
              name="reminders"
              checked={notifications.reminders}
              onChange={handleCheckboxChange}
            />
            {t('settings.notifications.reminders')}
          </label>
        </div>
      <button className="auth-button" onClick={handleSave}>
        <FontAwesomeIcon icon={faSave} className="icons" />
        {t('settings.saveButton')}
      </button>
    </div>
  );
}

export default Settings;
