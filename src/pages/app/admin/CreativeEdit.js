import React, { useState, useEffect } from 'react';
import Select from "react-select";
import config from '../../../config'; 


const CreativeEdit = ({ onClose, onRefresh, creativeId }) => {
  const [name, setName] = useState('');
  const [advertiser, setAdvertiser] = useState([]); 
  const [error, setError] = useState('');
  const [newAdvertiserId, setNewAdvertiserId] = useState({id: "", name: "" });
  const [advertiserOptions, setAdvertiserOptions] = useState([]);
  const [isAdvertiserLoading, setIsAdvertiserLoading] = useState(false);
  

  // Загружаем рекламодателей и данные креатива при монтировании компонента
  useEffect(() => {
    const fetchCreative = async () => {
      try {
        const response = await fetch(`${config.api}/admin/creatives/${creativeId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setName(data.name); // устанавливаем имя креатива
          setAdvertiser(data.advertiser); // устанавливаем id рекламодателя
        } else {
          throw new Error("Не удалось загрузить креатив");
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки креатива");
      }
    };
    loadAdvertisers()
    if (creativeId) {
      fetchCreative(); // Загружаем креатив, если есть ID
    }
  }, [creativeId]);


  const loadAdvertisers = async (inputValue = '') => {
    setIsAdvertiserLoading(true);
    const sanitizedInputValue = typeof inputValue === 'string' ? inputValue : '';
    
    try {
      const response = await fetch(`${config.api}/admin/advertisers/?search=${sanitizedInputValue}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const options = data.results.map((advertiser) => ({
          value: advertiser.id,
          label: advertiser.name,
        }));
        setAdvertiserOptions(options); // Обновляем список креативов
      } else {
        throw new Error("Ошибка загрузки креативов");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setIsAdvertiserLoading(false);
    }
  };


  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.api}/admin/creatives/edit/${creativeId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ 
            name, 
            advertiser_id: newAdvertiserId.id || advertiser?.id || null,
          }),
      });
      if (response.ok) {
        onRefresh(); // Перезагружаем список
        onClose();   // Закрываем попап
      } else {
        throw new Error('Ошибка при обновлении креатива');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-container">
        <div className="popup-content">
        <div className="form-group">

          <h2>Редактировать Креатив</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Название" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <Select
              placeholder="Выберите рекламодателя"
              isClearable
              // isSearchable
              isLoading={isAdvertiserLoading}
              // onInputChange={loadCreatives} // Обрабатываем поиск
              options={advertiserOptions}
              onInputChange={(inputValue) => {
                loadAdvertisers(inputValue || ""); // Обеспечиваем, что всегда передается строка
              }}                        
              onChange={(selectedOption) =>
                setNewAdvertiserId(selectedOption ? { id: selectedOption.value, name: selectedOption.label } : { id: "", name: "" })
              }
              value={
                newAdvertiserId.id
                  ? { value: newAdvertiserId.id, label: newAdvertiserId.name } // Используем newCreativeId, если оно есть
                  : advertiser.name
                  ? { value: advertiser.id, label: advertiser.name } // Если newCreativeId пусто, берем данные из image
                  : null // Если нет данных вообще
              }
            />
            <div className="form-buttons">

              <button type="submit">Сохранить</button>
              <button onClick={onClose}>Закрыть</button>

              {error && <p className="error">{error}</p>}
              </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeEdit;
