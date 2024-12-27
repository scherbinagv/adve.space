import React, { useState, useEffect } from 'react';
import config from '../../../config'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; 
import CreativeCreate from './CreativeCreate';
import CreativeEdit from './CreativeEdit';

const AdminCreatives = () => {
  const [creatives, setCreatives] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(`${config.api}/admin/creatives`); // Текущий URL для API
  const [nextPage, setNextPage] = useState(null); // URL следующей страницы
  const [previousPage, setPreviousPage] = useState(null); // URL предыдущей страницы
  const [showCreatePopup, setShowCreatePopup] = useState(false); 
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editCreativeId, setEditCreativeId] = useState(null);

  useEffect(() => {
    fetchCreatives(currentUrl);
  }, []);

  const fetchCreatives = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCreatives(data.results);
        setCurrentUrl(url); // Обновляем текущий URL
        setNextPage(data.next); // Устанавливаем URL следующей страницы
        setPreviousPage(data.previous); // Устанавливаем URL предыдущей страницы
      } else {
        throw new Error('Ошибка загрузки Креативов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleOpenCreatePopup = () => setShowCreatePopup(true);
  const handleCloseCreatePopup = () => setShowCreatePopup(false);

  const handleOpenEditPopup = (creativeId) => {
    setEditCreativeId(creativeId);
    setShowEditPopup(true);
  };
  const handleCloseEditPopup = () => {
    setEditCreativeId(null);
    setShowEditPopup(false);
  };

  const handleRefresh = () => {
    fetchCreatives(currentUrl)  };

  return (
    <div className="invoices-container">
      <button
        className="button"
        onClick={handleOpenCreatePopup}
        style={{ marginBottom: '10px' }}
      >
        Создать Креатив
      </button>

      {showCreatePopup && (
        <CreativeCreate
          onClose={handleCloseCreatePopup}
          onRefresh={handleRefresh} // Перезагрузка списка после создания
        />
      )}

      {showEditPopup && (
        <CreativeEdit
          creativeId={editCreativeId}
          onClose={handleCloseEditPopup}
          onRefresh={handleRefresh} // Перезагрузка списка после редактирования
        />
      )}

      {creatives.length > 0 ? (
        <div className="section">
          <h2>Все Креативы</h2>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Рекламодатель</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {creatives.map((creative, index) => (
                <tr key={index}>
                  <td>{creative.id}</td>
                  <td>{creative.name}</td>
                  <td>{creative.advertiser ? creative.advertiser.name : ''}</td>
                  <td>
                    <button onClick={() => handleOpenEditPopup(creative.id)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => fetchCreatives(previousPage)}
              disabled={!previousPage}
            >
              Назад
            </button>
            <button
              onClick={() => fetchCreatives(nextPage)}
              disabled={!nextPage}
            >
              Далее
            </button>
          </div>
        </div>
      ) : (
        <p>Нет Креативов</p>
      )}
    </div>
  );
};

export default AdminCreatives;
