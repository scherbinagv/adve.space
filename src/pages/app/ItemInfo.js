// import React, { useEffect, useState } from 'react';
// import config from '../../config';

// function ItemInfo({ itemId, onClose }) {
//   const [itemData, setItemData] = useState(null); // Данные элемента
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentSubitemIndex, setCurrentSubitemIndex] = useState(0); // Текущий subitem
//   const [loading, setLoading] = useState(true); // Состояние загрузки
//   const [error, setError] = useState(null); // Ошибки

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${config.api}/items/${itemId}/`, {
//           headers: {
//             Authorization: `Token ${localStorage.getItem('authToken')}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
//         }

//         const result = await response.json();
//         setItemData(result);


//         if (result.subitems && result.subitems.length > 0) {
//         setCurrentSubitemIndex(0); // Устанавливаем первую вкладку как активную
//       }
      
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // Блокировка прокрутки при открытии попапа
//     document.body.classList.add('popup-active');
//     return () => {
//       document.body.classList.remove('popup-active');
//     };
//   }, [itemId]);

//   const subitems = itemData ? itemData.subitems : []; // Массив subitems
//   // const currentSubitem = itemData ? itemData.subitems[currentSubitemIndex] : null;

//   const previousImage = () => {
//     // setCurrentImageIndex((prevIndex) =>
//     //   currentSubitem.images.length > 0
//     //     ? (prevIndex === 0 ? currentSubitem.images.length - 1 : prevIndex - 1)
//     //     : 0
//     // );
//   };

//   const nextImage = () => {
//     // setCurrentImageIndex((prevIndex) =>
//     //   currentSubitem.images.length > 0
//     //     ? (prevIndex === currentSubitem.images.length - 1 ? 0 : prevIndex + 1)
//     //     : 0
//     // );
//   };


//   const currentSubitem = itemData ? itemData.subitems[currentSubitemIndex] : null;

//   // Проверка на наличие данных
//   if (loading) {
//     return <div>Загрузка...</div>;
//   }

//   if (error) {
//     return <div>Ошибка: {error}</div>;
//   }

//   return (
//     <div className="popup" onClick={onClose}>
//       <div className="popup-container" onClick={(e) => e.stopPropagation()}>
//         {/* Переключатель subitems */}
//         <div className="popup-panel-selector">
//           {subitems.map((subitem, index) => (
//             <button
//               key={index}
//               className={`panel-tab ${index === currentSubitemIndex ? 'active' : ''}`}
//               onClick={() => {
//                 setCurrentSubitemIndex(index);
//                 setCurrentImageIndex(0); // Сброс изображения
//                 console.log(itemData)
//               }}
//             >
//               {subitem.name || `Сторона ${index + 1}`}
//             </button>
//           ))}
//         </div>

//         <div className="popup-content">
//           <div className="popup-main">
//             {/* Блок с большим фото и таблицей */}
//             <div className="popup-photo-section">
//               <div className="popup-photo-wrapper">
//                 <button onClick={previousImage} className="popup-photo-nav">
//                   &#9664;
//                 </button>
//                 {currentSubitem && currentSubitem.current_image_url ? (
//                   <img
//                     src={currentSubitem.current_image_url}
//                     alt={`Изображение ${currentSubitem.name}`}
//                     className="popup-photo"
//                   />
//                 ) : (
//                   <div className="popup-photo-placeholder">Нет изображений</div>
//                 )}
//                 <button onClick={nextImage} className="popup-photo-nav">
//                   &#9654;
//                 </button>
//               </div>
//               <table className="popup-table">
//                 <tbody>
//                   <tr>
//                     <td>Последнее обновление</td>
//                     <td>{currentSubitem ? currentSubitem.current_image_upload_date || 'Нет данных' : 'Нет данных'}</td>
//                   </tr>
//                   <tr>
//                     <td>Креатив</td>
//                     <td>{currentSubitem ? currentSubitem.current_image_creative_name || 'Нет' : 'Нет'}</td>
//                   </tr>
//                   <tr>
//                     <td>Креатив замечен</td>
//                     {/* <td>{currentSubitem ? currentSubitem.creativeSeen || 'Нет' : 'Нет'}</td> */}
//                   </tr>
//                   <tr>
//                     <td>Время размещения</td>
//                     {/* <td>{currentSubitem ? currentSubitem.placementTime || 'Нет данных' : 'Нет данных'}</td> */}
//                   </tr>
//                   <tr>
//                     <td>Площадь</td>
//                     <td>{currentSubitem ? currentSubitem.area || 'Не указано' : 'Не указано'}</td>
//                   </tr>
//                   <tr>
//                     <td>Рекламодатель</td>
//                     <td>{currentSubitem ? currentSubitem.current_image_advertiser_name || 'Нет' : 'Нет'}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {/* Блок истории */}
//             <div className="popup-history">
//               <h3>История</h3>
//               {currentSubitem.history && currentSubitem.history.length > 0 ? (
//                 currentSubitem.history.map((entry) => (
//                   <div key={entry.date} className="popup-history-entry">
//                     <h4>{entry.date}</h4>
//                     <div className="popup-history-images">
//                       {entry.images.map((imgSrc, idx) => (
//                         <img
//                           key={idx}
//                           src={imgSrc}
//                           alt={`История за ${entry.date}`}
//                           className="popup-history-image"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>Нет истории</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Кнопка закрытия */}
//         <div className="popup-footer">
//           <button onClick={onClose} className="popup-close-button">
//             Закрыть
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ItemInfo;


// import React, { useEffect, useState } from 'react';
// import config from '../../config';

// function ItemInfo({ itemId, onClose }) {
//   const [itemData, setItemData] = useState(null);
//   const [selectedPanels, setSelectedPanels] = useState([]); // Выбранные панели
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${config.api}/items/${itemId}/`, {
//           headers: {
//             Authorization: `Token ${localStorage.getItem('authToken')}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
//         }

//         const result = await response.json();
//         setItemData(result);

//         // Установить первую панель выбранной по умолчанию
//         if (result.subitems && result.subitems.length > 0) {
//           setSelectedPanels([0]);
//         }

//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // Блокировка прокрутки при открытии попапа
//     document.body.classList.add('popup-active');
//     return () => {
//       document.body.classList.remove('popup-active');
//     };
//   }, [itemId]);

//   const subitems = itemData ? itemData.subitems : [];

//   const togglePanel = (index) => {
//     setSelectedPanels((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index) // Убрать панель
//         : [...prev, index] // Добавить панель
//     );
//   };

//   if (loading) {
//     return <div>Загрузка...</div>;
//   }

//   if (error) {
//     return <div>Ошибка: {error}</div>;
//   }

//   return (
//     <div className="popup" onClick={onClose}>
//       <div className="popup-container" onClick={(e) => e.stopPropagation()}>
//         {/* Переключатель subitems */}
//         <div className="popup-panel-selector">
//           {subitems.map((subitem, index) => (
//             <button
//               key={index}
//               className={`panel-tab ${selectedPanels.includes(index) ? 'active' : ''}`}
//               onClick={() => togglePanel(index)}
//             >
//               {subitem.name || `Сторона ${index + 1}`}
//             </button>
//           ))}
//         </div>

//         {/* Контент выбранных панелей */}
//         <div className="popup-content">
//           {selectedPanels.length > 0 ? (
//             <div className="popup-panels">
//               {selectedPanels.map((panelIndex) => {
//                 const subitem = subitems[panelIndex];
//                 return (
//                   <div key={panelIndex} className="popup-panel">
//                     <h3>{subitem.name || `Сторона ${panelIndex + 1}`}</h3>
//                     <div className="popup-photo-section">
//                       {subitem.current_image_url ? (
//                         <img
//                           src={subitem.current_image_url}
//                           alt={`Изображение ${subitem.name}`}
//                           className="popup-photo"
//                         />
//                       ) : (
//                         <div className="popup-photo-placeholder">Нет изображений</div>
//                       )}
//                       <table className="popup-table">
//                         <tbody>
//                           <tr>
//                             <td>Последнее обновление</td>
//                             <td>{subitem.current_image_upload_date || 'Нет данных'}</td>
//                           </tr>
//                           <tr>
//                             <td>Креатив</td>
//                             <td>{subitem.current_image_creative_name || 'Нет'}</td>
//                           </tr>
//                           <tr>
//                             <td>Рекламодатель</td>
//                             <td>{subitem.current_image_advertiser_name || 'Нет'}</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p>Выберите хотя бы одну панель</p>
//           )}
//         </div>

//         {/* Кнопка закрытия */}
//         <div className="popup-footer">
//           <button onClick={onClose} className="popup-close-button">
//             Закрыть
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ItemInfo;
// 

// import React, { useEffect, useState } from 'react';
// import config from '../../config';

// function ItemInfo({ itemId, onClose }) {
//   const [itemData, setItemData] = useState(null);
//   const [panelHistories, setPanelHistories] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${config.api}/items/${itemId}/`, {
//           headers: {
//             Authorization: `Token ${localStorage.getItem('authToken')}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
//         }

//         const result = await response.json();
//         setItemData(result);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // Блокировка прокрутки при открытии попапа
//     document.body.classList.add('popup-active');
//     return () => {
//       document.body.classList.remove('popup-active');
//     };
//   }, [itemId]);

//   const loadHistory = async (panelIndex) => {
//     if (panelHistories[panelIndex]) return;

//     try {
//       const response = await fetch(`${config.api}/items/${itemId}/history/${panelIndex}/`, {
//         headers: {
//           Authorization: `Token ${localStorage.getItem('authToken')}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Ошибка загрузки истории: ${response.statusText}`);
//       }

//       const historyData = await response.json();
//       setPanelHistories((prev) => ({
//         ...prev,
//         [panelIndex]: historyData,
//       }));
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   if (loading) {
//     return <div>Загрузка...</div>;
//   }

//   if (error) {
//     return <div>Ошибка: {error}</div>;
//   }

//   const subitems = itemData ? itemData.subitems : [];

//   return (
//     <div className="popup" onClick={onClose}>
//       <div className="popup-container" onClick={(e) => e.stopPropagation()}>
//         <div className="popup-content">
//           {subitems.map((subitem, index) => (
//             <div key={index} className="popup-panel">
//               <div className="popup-panel-header">
//                 <img
//                   src={subitem.current_image_url || '/placeholder.png'}
//                   alt={`Изображение ${subitem.name}`}
//                   className="popup-photo"
//                 />
//                 <div className="popup-panel-info">
//                   <p><strong>Последнее обновление:</strong> {subitem.current_image_upload_date || 'Нет данных'}</p>
//                   <p><strong>Рекламодатель:</strong> {subitem.current_image_advertiser_name || 'Нет'}</p>
//                   <p><strong>Креатив:</strong> {subitem.current_image_creative_name || 'Нет'}</p>
//                   <button
//                     onClick={() => loadHistory(index)}
//                     className="popup-history-button"
//                   >
//                     Загрузить историю
//                   </button>
//                 </div>
//               </div>
//               {panelHistories[index] && (
//                 <div className="popup-history">
//                   {panelHistories[index].length > 0 ? (
//                     <div className="popup-history-gallery">
//                       {panelHistories[index].map((entry, idx) => (
//                         <div key={idx} className="popup-history-entry">
//                           <img
//                             src={entry.image_url}
//                             alt={`История ${entry.date}`}
//                             className="popup-history-image"
//                           />
//                           <p>{entry.date}</p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p>История отсутствует</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="popup-footer">
//           <button onClick={onClose} className="popup-close-button">
//             Закрыть
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ItemInfo;


import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import config from '../../config';

function ItemInfo({ itemId, onClose }) {
  const [itemData, setItemData] = useState(null);
  const [panelHistories, setPanelHistories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null); // Для открытого изображения
  const { t, i18n } = useTranslation();
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.api}/items/${itemId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
        }

        const result = await response.json();
        setItemData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Блокировка прокрутки при открытии попапа
    document.body.classList.add('popup-active');
    return () => {
      document.body.classList.remove('popup-active');
    };
  }, [itemId]);

  const loadHistory = async (panelIndex) => {
    if (panelHistories[panelIndex]) return;

    try {
      const response = await fetch(`${config.api}/items/${itemId}/history/${panelIndex}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки истории: ${response.statusText}`);
      }

      const historyData = await response.json();
      setPanelHistories((prev) => ({
        ...prev,
        [panelIndex]: historyData,
      }));
    } catch (err) {
      console.error(err.message);
    }
  };

  const openFullscreenImage = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const handlePopupClick = (e) => {
    // Закрывать попап только если клик был на фоне попапа
    if (e.target.classList.contains('popup')) {
      onClose();
    }
  };

  const subitems = itemData ? itemData.subitems : [];

  // return (
  //   <div className="popup" onClick={handlePopupClick}>
  //     <div className="popup-container" onClick={(e) => e.stopPropagation()}>
  //       <div className="popup-content">
  //         {subitems.map((subitem, index) => (
  //           <div key={index} className="popup-panel">
  //             <h3 className="popup-panel-title">
  //               {subitem.name || `Панель ${index + 1}`}
  //             </h3>
  //             <div className="popup-panel-header">
  //               <img
  //                 src={subitem.current_image_url || '/placeholder.png'}
  //                 alt={`Изображение ${subitem.name}`}
  //                 className="popup-photo"
  //                 onClick={() => openFullscreenImage(subitem.current_image_url || '/placeholder.png')}
  //               />
  //               <div className="popup-panel-info">
  //                 <p><strong>Последнее обновление:</strong> {subitem.current_image_upload_date || 'Нет данных'}</p>
  //                 <p><strong>Рекламодатель:</strong> {subitem.current_image_advertiser_name || 'Нет'}</p>
  //                 <p><strong>Креатив:</strong> {subitem.current_image_creative_name || 'Нет'}</p>
  //                 <button
  //                   onClick={() => loadHistory(index)}
  //                   className="popup-history-button"
  //                 >
  //                   Загрузить историю
  //                 </button>
  //               </div>
  //             </div>
  //             {panelHistories[index] && (
  //               <div className="popup-history">
  //                 {panelHistories[index].length > 0 ? (
  //                   <div className="popup-history-gallery">
  //                     {panelHistories[index].map((entry, idx) => (
  //                       <div key={idx} className="popup-history-entry">
  //                         <img
  //                           src={entry.image_url}
  //                           alt={`История ${entry.date}`}
  //                           className="popup-history-image"
  //                           onClick={() => openFullscreenImage(entry.image_url)}
  //                         />
  //                         <p>{entry.date}</p>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 ) : (
  //                   <p>История отсутствует</p>
  //                 )}
  //               </div>
  //             )}
  //           </div>
  //         ))}
  //       </div>
  //       <div className="popup-footer">
  //         <button onClick={onClose} className="popup-close-button">
  //           Закрыть
  //         </button>
  //       </div>
  //     </div>
  //     {/* Модальное окно для полноэкранного изображения */}
  //     {fullscreenImage && (
  //       <div className="fullscreen-modal" onClick={closeFullscreenImage}>
  //         <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
  //           <img
  //             src={fullscreenImage}
  //             alt="Полноэкранное изображение"
  //             className="fullscreen-image"
  //           />
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="popup" onClick={handlePopupClick}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-content">
          {subitems.map((subitem, index) => (
            <div key={index} className="popup-panel">
              <h3 className="popup-panel-title">
                {subitem.name || `${t('itemInfo.panel')} ${index + 1}`}
              </h3>
              <div className="popup-panel-header">
                <img
                  src={subitem.current_image_url || '/placeholder.png'}
                  alt={`${t('itemInfo.imageAlt', { name: subitem.name || '' })}`}
                  className="popup-photo"
                  onClick={() => openFullscreenImage(subitem.current_image_url || '/placeholder.png')}
                />
                <div className="popup-panel-info">
                  <p><strong>{t('itemInfo.lastUpdate')}:</strong> {subitem.current_image_upload_date || t('itemInfo.noData')}</p>
                  <p><strong>{t('itemInfo.advertiser')}:</strong> {subitem.current_image_advertiser_name || t('itemInfo.none')}</p>
                  {/* <p><strong>{t('itemInfo.creative')}:</strong> {subitem.current_image_creative_name || t('itemInfo.none')}</p> */}
                  <button
                    onClick={() => loadHistory(index)}
                    className="popup-history-button"
                  >
                    {t('itemInfo.loadHistory')}
                  </button>
                </div>
              </div>
              {panelHistories[index] && (
                <div className="popup-history">
                  {panelHistories[index].length > 0 ? (
                    <div className="popup-history-gallery">
                      {panelHistories[index].map((entry, idx) => (
                        <div key={idx} className="popup-history-entry">
                          <img
                            src={entry.image_url}
                            alt={`${t('itemInfo.historyImageAlt', { date: entry.date })}`}
                            className="popup-history-image"
                            onClick={() => openFullscreenImage(entry.image_url)}
                          />
                          <p>{entry.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{t('itemInfo.noHistory')}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="popup-footer">
          <button onClick={onClose} className="popup-close-button">
            {t('itemInfo.close')}
          </button>
        </div>
      </div>
      {/* Модальное окно для полноэкранного изображения */}
      {fullscreenImage && (
        <div className="fullscreen-modal" onClick={closeFullscreenImage}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={fullscreenImage}
              alt={t('itemInfo.fullscreenImageAlt')}
              className="fullscreen-image"
            />
          </div>
        </div>
      )}
    </div>
  );
  
}

export default ItemInfo;
