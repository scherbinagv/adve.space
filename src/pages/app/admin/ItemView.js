import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import config from '../../../config';
import ItemEdit from './ItemEdit'; 
import Select from "react-select";




const ItemView = ({ itemId, onClose }) => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [activeTab, setActiveTab] = useState(0); 
    const [isEditing, setIsEditing] = useState(false); 
    const [photoHistory, setPhotoHistory] = useState([]); // История фотографий текущего сабайтема
    const [photoHistoryLoading, setPhotoHistoryLoading] = useState(false); // Флаг загрузки истории фото
    const [photoHistoryError, setPhotoHistoryError] = useState(null); // Ошибка истории фото
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [creativeId, setCreativeId] = useState('');
    const [currentPhotoLoading, setCurrentPhotoLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [creativeOptions, setCreativeOptions] = useState([]);
    const [isCreativeLoading, setIsCreativeLoading] = useState(false);
    

    useEffect(() => {
        fetchData();
        loadCreatives("");
    }, [itemId]);

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.focus();
        }
        
        const fetchPhotoHistory = async () => {
            try {
                setPhotoHistoryLoading(true);
                setPhotoHistoryError(null);
                const currentSubitem = data?.subitems[activeTab];
                if (!currentSubitem) return;
    
                const response = await fetch(`${config.api}/admin/subitems/${currentSubitem.id}/photos/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки истории фото: ${response.statusText}`);
                }
    
                const result = await response.json();
    
                // Сортировка по дате загрузки от новых к старым
                result.images.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
    
                // Группировка по креативу
                const groupedPhotos = result.images.reduce((acc, photo) => {
                    const creativeName = photo.creative?.name || 'Без креатива'; // Если нет креатива, будет 'Без креатива'
                    if (!acc[creativeName]) {
                        acc[creativeName] = [];
                    }
                    acc[creativeName].push(photo);
                    return acc;
                }, {});
    
                setPhotoHistory(groupedPhotos);
            } catch (err) {
                setPhotoHistoryError(err.message);
            } finally {
                setPhotoHistoryLoading(false);
            }
        };
    
        if (data) fetchPhotoHistory();
    }, [activeTab, data]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Выполняем запрос к API
            const response = await fetch(`${config.api}/admin/items/${itemId}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.statusText}`);
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true); 
    };

    const handlePhotoUpload = async (e) => {
        e.preventDefault();
        try {
            if (!selectedFile) {
                setUploadError('Выберите файл.');
                return;
            }
    
            const formData = new FormData();
            // formData.append('image_file', selectedFile);
            formData.append('image_file', selectedFile);
            formData.append('subitem_id', data.subitems[activeTab].id);
            formData.append('creative_id', creativeId?.id || "");
    
            const response = await fetch(`${config.api}/admin/images/upload/`, {
                method: 'POST',
                headers: {
                    Authorization: `Token ${localStorage.getItem('authToken')}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.statusText}`);
            }
    
            setSelectedFile(null);
            setCreativeId(''); // Сбрасываем поле ID креатива
            fetchData();
        
        } catch (err) {
            setUploadError(err.message);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту фотографию?')) {
            try {
                const response = await fetch(`${config.api}/admin/images/delete/${photoId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Ошибка удаления фотографии: ${response.statusText}`);
                }
    
                // Обновляем список фото после удаления
                setPhotoHistory((prevHistory) => {
                    const updatedHistory = { ...prevHistory };
                    Object.entries(updatedHistory).forEach(([creativeName, photos]) => {
                        updatedHistory[creativeName] = photos.filter(photo => photo.id !== photoId);
                    });
                    return updatedHistory;
                });
    
                alert('Фотография удалена успешно!');
            } catch (err) {
                setPhotoHistoryError(err.message);
            }
        }
    };
    
    const loadCreatives = async (inputValue) => {
        setIsCreativeLoading(true);
        const sanitizedInputValue = typeof inputValue === 'string' ? inputValue : '';
        
        try {
          const response = await fetch(`${config.api}/admin/creatives/?search=${sanitizedInputValue}`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            const options = data.results.map((creative) => ({
              value: creative.id,
              label: creative.name,
            }));
            setCreativeOptions(options); // Обновляем список креативов
          } else {
            throw new Error("Ошибка загрузки креативов");
          }
        } catch (error) {
          console.error("Ошибка:", error);
        } finally {
          setIsCreativeLoading(false);
        }
      };

    if (loading) {
        return <div className="popup">Загрузка...</div>;
    }

    if (error) {
        return (
            <div className="popup">
                <div className="popup-container">
                    <h2>Ошибка</h2>
                    <p>{error}</p>
                    <button onClick={onClose} className="popup-close-button">
                        Закрыть
                    </button>
                </div>
            </div>
        );
    }

    const { lat, lng, item_type_name, subitems } = data;

    const currentSubitem = subitems[activeTab]; // Текущий сабайтем

    // Функция для переключения вкладок
    const handleTabChange = (index) => {
        setActiveTab(index);
    };


    const handlePaste = (e) => {
        const clipboardItems = e.clipboardData.items;
        for (let i = 0; i < clipboardItems.length; i++) {
            const item = clipboardItems[i];
            if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile();
                setSelectedFile(file);
                break;
            }
        }
    };

    const handleClearFile = () => {
        setSelectedFile(null);  // Очистить выбранный файл
        if (fileInputRef.current) {
            fileInputRef.current.value = '';  // Очистить значение в input
        }
    };

    return (
        <div className="popup" onClick={onClose}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
                <div className="popup-panel-selector">
                    <h2>Просмотр конструкции</h2>
                    <button onClick={handleEditClick} className="popup-edit-button">
                        Редактировать
                    </button>
                </div>
                {isEditing ? (
                    <ItemEdit itemId={itemId} onClose={onClose} /> // Показываем форму редактирования
                ) : (

                <div className="popup-content">
                    <div className="popup-main">
                        <div className="popup-form">

                            {/* <div className="popup-field">
                                <label>Тип конструкции:</label>
                                <div className="popup-static-field">{item_type_name}</div>
                            </div> */}

                            {/* Карта */}
                            {/* <div className="popup-map">
                                <MapContainer
                                    center={[lat, lng]}
                                    zoom={18}
                                    style={{ height: '300px', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker
                                        position={[lat, lng]}
                                        icon={new L.Icon({
                                            iconUrl: '../../images/bb1.svg', // Путь к вашему изображению
                                            iconSize: [38, 38], // Размер маркера
                                        })}
                                    >
                                        <Popup>Координаты конструкции</Popup>
                                    </Marker>
                                </MapContainer>
                            </div> */}

                            {/* Вкладки для сабайтемов */}
                            <div className="subitems-tabs">
                                <div className="tabs">
                                    {subitems.map((subitem, index) => (
                                        <button
                                            key={subitem.id}
                                            className={`tab ${activeTab === index ? 'active' : ''}`}
                                            onClick={() => handleTabChange(index)}
                                        >
                                            {subitem.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="tab-content">
                                    {subitems.length > 0 && (
                                        <div className="subitem-details">
                                            {/* <h3>{subitems[activeTab].name}</h3> */}
                                            <p><strong>Обновлено: </strong>{subitems[activeTab].last_updated || 'Не указано'}</p>
                                            <p><strong>Площадь: </strong>{subitems[activeTab].area || 'Не указано'}</p>
                                            <p><strong>Направление: </strong>{subitems[activeTab].direction ?? 'Не указано'}</p>
                                            
                                            <div className="photos-section">
                                                <div className="add-photo">
                                                    <h3>Добавить фото</h3>
                                                    <div onPaste={handlePaste}>
                                                        <form onSubmit={handlePhotoUpload}>
                                                            <div>
                                                                <label>Идентификатор креатива:</label>
                                                                {/* <input
                                                                    type="text"
                                                                    value={creativeId}
                                                                    onChange={(e) => setCreativeId(e.target.value)}
                                                                    placeholder="Введите ID креатива"
                                                                /> */}
                                                                <Select
                                                                    placeholder="Выберите креатив"
                                                                    isClearable
                                                                    // isSearchable
                                                                    isLoading={isCreativeLoading}
                                                                    // onInputChange={loadCreatives} // Обрабатываем поиск
                                                                    options={creativeOptions}
                                                                    onInputChange={(inputValue) => {
                                                                    loadCreatives(inputValue || ""); // Обеспечиваем, что всегда передается строка
                                                                    }}                        
                                                                    onChange={(selectedOption) =>
                                                                    setCreativeId(selectedOption ? { id: selectedOption.value, name: selectedOption.label } : { id: "", name: "" })
                                                                    }
                                                                    value={
                                                                        creativeId.id
                                                                        ? { value: creativeId.id, label: creativeId.name } 
                                                                        : null // Если нет данных вообще
                                                                    }
                                                                />
                                                            </div>
                                                            {/* <div>
                                                                <label>Выберите файл:</label>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                                                    ref={fileInputRef}
                                                                    required={!selectedFile}
                                                                />
                                                            </div> */}
                                                            {selectedFile && (
                                                                <div>
                                                                    <img
                                                                        src={URL.createObjectURL(selectedFile)}
                                                                        alt="Preview"
                                                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <button type="submit" className="upload-button">
                                                                Загрузить фото
                                                            </button>
                                                            {selectedFile && (
                                                                <button type="button" onClick={handleClearFile} className="clear-button">
                                                                    Очистить файл
                                                                </button>
                                                            )}
                                                        </form>
                                                    </div>
                                                </div>
                                                <h3>Текущее фото</h3>
                                                {currentSubitem && currentSubitem.current_image_url ? (
                                                    <div className="current-photo" style={{ position: 'relative' }}>
                                                        {currentPhotoLoading && <div className="loader">Загрузка фото...</div>}
                                                        <img
                                                            src={currentSubitem.current_image_url}
                                                            alt={currentSubitem.current_image_creative_name || 'Текущее фото'}
                                                            className={`photo ${currentPhotoLoading ? 'hidden' : 'fixed-size' }`}
                                                            onLoad={() => setCurrentPhotoLoading(false)}
                                                            onError={() => setCurrentPhotoLoading(false)}
                                                            
                                                        />
                                                        {!currentPhotoLoading && (
                                                            <>
                                                                <p><strong>Дата загрузки:</strong> {currentSubitem.current_image_upload_date || 'Не указано'}</p>
                                                                <p><strong>Креатив:</strong> {currentSubitem.current_image_creative_name || 'Не указано'}</p>
                                                                <p><strong>Рекламодатель:</strong> {currentSubitem.current_image_advertiser_name || 'Не указано'}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p>Фотографии отсутствуют</p>
                                                )}
                                            </div>

                                          
                                            <div className="photo-history">
                                                <h3>История фотографий</h3>
                                                {photoHistoryLoading ? (
                                                    <p>Загрузка истории фотографий...</p>
                                                ) : photoHistoryError ? (
                                                    <p>Ошибка загрузки: {photoHistoryError}</p>
                                                ) : Object.keys(photoHistory).length > 0 ? (
                                                    <div className="photo-list">
                                                        {Object.entries(photoHistory).map(([creativeName, photos]) => (
                                                            <div key={creativeName} className="photo-group">
                                                                <h4>{creativeName}</h4>
                                                                {photos.map((photo) => (
                                                                    <div key={photo.id} className="photo-item">
                                                                        <img
                                                                            src={photo.image_file}  // Путь к миниатюре
                                                                            alt={photo.creative?.name || 'Историческое фото'}
                                                                            className="photo fixed-size"
                                                                        />
                                                                        <p><strong>Дата загрузки:</strong> {new Date(photo.uploaded_at).toLocaleString()}</p>
                                                                        <button onClick={() => handleDeletePhoto(photo.id)}>Удалить</button>
                                                                    </div>
                                                                ))} 
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>История фотографий отсутствует.</p>
                                                )}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="popup-actions">
                                <button type="button" onClick={onClose} className="popup-close-button">
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default ItemView;
