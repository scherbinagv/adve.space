import React, { useState, useEffect } from 'react';
import config from '../../../config'; 

const CreativeCreate = ({ onClose, onRefresh }) => {
  const [name, setName] = useState('');
  const [advertiser_id, setAdvertiser] = useState(''); // изменено на пустую строку, так как будет строка id
  const [advertisers, setAdvertisers] = useState([]); // добавлено состояние для списка рекламодателей
  const [error, setError] = useState('');

  // Загружаем рекламодателей при монтировании компонента
  useEffect(() => {
    const fetchAdvertisers = async () => {
      try {
        const response = await fetch(`${config.api}/admin/advertisers/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAdvertisers(data.results); // сохраняем рекламодателей
        } else {
          throw new Error("Не удалось загрузить рекламодателей");
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки рекламодателей");
      }
    };

    fetchAdvertisers();
  }, []);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.api}/admin/creatives/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ 
            name, 
            advertiser_id: Number(advertiser_id), 
          }),
        });
      if (response.ok) {
        onRefresh(); // Перезагружаем список
        onClose();   // Закрываем попап
      } else {
        throw new Error('Ошибка при создании креатива');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-container">
        <div className="popup-content">
          <h2>Создать Креатив</h2>
          <form onSubmit={handleSubmit} >
            <div className="form-group">
              <input 
              type="text" 
              placeholder="Название" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <select 
              value={advertiser_id} 
              onChange={(e) => setAdvertiser(e.target.value)}
            >
              <option value="">Выберите Рекламодателя</option>
              {/* Отображаем список рекламодателей */}
              {advertisers.map((adv) => (
                <option key={adv.id} value={adv.id}>
                  {adv.name} ({adv.type.name})
                </option>
              ))}
            </select>
            <div className="form-buttons">
              <button type="submit">Создать</button>
              <button onClick={onClose}>Закрыть</button>
              {error && <p className="error">{error}</p>}
            </div>
            </div>
            
          </form>
           
        </div>
      </div>
    </div>
  );
};

export default CreativeCreate;
