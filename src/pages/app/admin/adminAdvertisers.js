import React, { useState, useEffect } from 'react';
import config from '../../../config'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; 
import AdvertiserCreate from './AdvertiserCreate';
import AdvertiserEdit from './AdvertiserEdit';


const AdminAdvertisers = () => {
  const [advertisers, setAdvertisers] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(`${config.api}/admin/advertisers`); // Текущий URL для API
  const [nextPage, setNextPage] = useState(null); // URL следующей страницы
  const [previousPage, setPreviousPage] = useState(null); // URL предыдущей страницы
  const [showCreatePopup, setShowCreatePopup] = useState(false); 
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editAdvertiserId, setEditAdvertiserId] = useState(null);


  useEffect(() => {
    fetchAdvertisers(currentUrl);
  }, []);
  
  const fetchAdvertisers = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAdvertisers(data.results);
        setCurrentUrl(url); // Обновляем текущий URL
        setNextPage(data.next); // Устанавливаем URL следующей страницы
        setPreviousPage(data.previous); // Устанавливаем URL предыдущей страницы
      } else {
        throw new Error('Ошибка загрузки Рекламодателей');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleOpenCreatePopup = () => setShowCreatePopup(true);
  const handleCloseCreatePopup = () => setShowCreatePopup(false);


  const handleRowClick = (advertiserId) => {
    // setPopupData({ id: advertiserId });
  };


  const closePopup = () => {
    setShowCreatePopup(null);
  };

  const handleOpenEditPopup = (advertiserId) => {
    setEditAdvertiserId(advertiserId);
    setShowEditPopup(true);
  };
  const handleCloseEditPopup = () => {
    setEditAdvertiserId(null);
    setShowEditPopup(false);
  };

  const handleRefresh = () => {
    fetchAdvertisers(currentUrl); // Передаем текущий URL
  };


  return (
    <div className="invoices-container">
        <button
            className="button"
            onClick={handleOpenCreatePopup}
            style={{ marginBottom: '10px' }}
        >Создать Рекламодателя</button>

        {showCreatePopup && (
            <AdvertiserCreate
            onClose={handleCloseCreatePopup}
            onRefresh={handleRefresh} // Перезагрузка списка
            />
        )}

        {showEditPopup && (
            <AdvertiserEdit
            advertiserId={editAdvertiserId}
            onClose={handleCloseEditPopup}
            onRefresh={handleRefresh} // Перезагрузка списка
            />
        )}

        {(advertisers.length > 0) ? (
            <div className="section">
            <h2>Все Рекламодатели</h2>
            <table className="invoice-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Рекламодатель</th>
                    <th>Тип</th>
                    <th>Категория</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {advertisers.map((advertisers, index) => (
                        <tr key={index} onClick={() => handleRowClick(advertisers.id)}>
                        <td>{advertisers.id}</td>
                        <td>{advertisers.name}</td>
                        <td>{advertisers.type ? advertisers.type.name : ''}</td>
                        <td>{advertisers.category ? advertisers.category.name : ''}</td>
                        <td>                            
                            <button onClick={(e) => {
                                handleOpenEditPopup(advertisers.id)}
                                }>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
              <button
                onClick={() => fetchAdvertisers(previousPage)}
                disabled={!previousPage}
              >
                Назад
              </button>
              <button
                onClick={() => fetchAdvertisers(nextPage)}
                disabled={!nextPage}
              >
                Далее
              </button>
            </div>
            </div>
        ) : (
            <p>Нет Рекламодателей</p> // Message when no invoices
        )}
    </div>
  );
};

export default AdminAdvertisers;
