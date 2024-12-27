import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import Select from 'react-select';
import L from 'leaflet';
import config from '../../../config';


const ItemEdit = ({ itemId, onEdit, onClose }) => {
    const [data, setData] = useState(null); // Состояние для данных конструкции
    const [loading, setLoading] = useState(true); // Флаг загрузки
    const [error, setError] = useState(null); // Состояние для ошибок
    const [activeTab, setActiveTab] = useState(0); // Состояние для активной вкладки
    const [formData, setFormData] = useState({
        lat: '',
        lng: '',
        item_type_name: '',
        subitems: [],
        tariff_groups: [],  // Добавляем состояние для тарифных групп
    });
    const [tariffGroups, setTariffGroups] = useState([]); // Состояние для тарифных групп
    const [selectedTariffs, setSelectedTariffs] = useState([]); 


    useEffect(() => {
        const fetchTariffGroups = async () => {
            try {
                const tariffResponse = await fetch(`${config.api}/admin/tariff-groups/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!tariffResponse.ok) {
                    throw new Error(`Ошибка загрузки тарифных групп: ${tariffResponse.statusText}`);
                }
                const tariffResult = await tariffResponse.json();
                setTariffGroups(tariffResult.results); // Сохраняем тарифные группы
            } catch (err) {
                setError(err.message);
            }
        };
    
        const fetchItemData = async () => {
            try {
                setLoading(true);
                setError(null);
    
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
                setFormData({
                    lat: result.lat,
                    lng: result.lng,
                    item_type_name: result.item_type_name,
                    subitems: result.subitems,
                    tariff_groups: result.tariff_groups ? result.tariff_groups.map(group => group.id) : [],
                });
                setSelectedTariffs(result.tariff_groups ? result.tariff_groups.map(group => group.id) : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTariffGroups().then(() => {
            fetchItemData();
        }).finally(() => {
        });

    }, [itemId]);

    const tariffOptions = tariffGroups.map(group => ({
        value: group.id,
        label: group.name,
    }));

    const selectedTariffOptions = selectedTariffs.map(id => ({
        value: id,
        label: tariffGroups.find(group => group.id === id)?.name || ''
    }));

    const MapEventHandler = () => {
        useMapEvents({
            moveend: (e) => {
                const map = e.target; // Получаем карту из события
                const center = map.getCenter(); // Получаем центр карты
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    lat: center.lat,
                    lng: center.lng,
                })); // Обновляем широту и долготу
            },
        });
        return null;
    };

    const handleTariffGroupChange = (selectedOptions) => {
        // Массив selectedOptions — это массив объектов, выбранных пользователем
        const selectedGroups = selectedOptions.map((option) => option.value);
        setFormData({
            ...formData,
            tariff_groups: selectedGroups,  // Обновляем выбранные тарифные группы
        });
        setSelectedTariffs(selectedGroups);
    };
 

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    const handleInputChange = (e, index, field) => {
        const value = e.target.value;
        if (field) {
            const updatedSubitems = [...formData.subitems];
            updatedSubitems[index][field] = value;
            setFormData((prevData) => ({
                ...prevData,
                subitems: updatedSubitems,
            }));
        } else {
            setFormData({
                ...formData,
                [e.target.name]: value,
            });
        }
    };

    const getNextLetter = (index) => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphabet[index % alphabet.length]; // Генерация буквы по индексу (повторяется после Z)
    };

    const handleAddTab = () => {
        const nextLetter = getNextLetter(formData.subitems.length); // Получаем следующую букву
        const newSubitem = {
            tab_id: Date.now(),
            name: nextLetter,
            area: null,
            direction: null,
        };

        setFormData((prevData) => ({
            ...prevData,
            subitems: [...prevData.subitems, newSubitem],
        }));
        setActiveTab(formData.subitems.length); // Переключаемся на новую вкладку
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.api}/admin/items/edit/${itemId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`Ошибка сохранения: ${response.statusText}`);
            }
            // Закрываем форму после успешного сохранения
            onClose();
            onEdit();
        } catch (err) {
            setError(err.message);
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

    const { lat, lng, item_type_name, subitems  } = formData;
    

    return (
        <div className="popup" onClick={onClose}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
                <div className="popup-panel-selector">
                    <h2>Редактирование конструкции</h2>
                </div>

                <div className="popup-content">
                    <div className="popup-main">
                        <form onSubmit={handleSubmit} className="popup-form">

                            <div className="popup-field">
                                <label>Тип конструкции:</label>
                                <input
                                    type="text"
                                    name="item_type_name"
                                    value={item_type_name}
                                    onChange={handleInputChange}
                                />
                            

                            {/* Карта */}
                            <div className="popup-map">

                                <MapContainer
                                    center={[formData.lat, formData.lng]}
                                    zoom={18}
                                    style={{ height: '300px', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <MapEventHandler /> {/* Подключаем обработчик */}
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker
                                        position={[formData.lat, formData.lng]}
                                        icon={new L.Icon({
                                            iconUrl: '../../images/bb1.svg',
                                            iconSize: [38, 38],
                                        })}
                                    >
                                        <Popup>Координаты конструкции</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                            </div>
                             {/* Мультиселект для тарифных групп */}
                             <div className="popup-field">
                                <label>Выберите тарифные группы:</label>
                                <Select
                                    isMulti
                                    value={selectedTariffOptions}  // Здесь выбранные тарифы
                                    onChange={handleTariffGroupChange}  // Важно передавать просто функцию, без e.target
                                    options={tariffOptions}  // Все доступные тарифные группы
                                    getOptionLabel={(e) => e.label}
                                    getOptionValue={(e) => e.value}
                                    className="tariff-select"
                                />
                            </div>


                            {/* Вкладки для сабайтемов */}
                            <div className="subitems-tabs">
                                <div className="tabs">
                                    {subitems.map((subitem, index) => (
                                        <button
                                            key={subitem.id}
                                            className={`tab ${activeTab === index ? 'active' : ''}`}
                                            type="button" // Задаем тип, чтобы не сработал submit
                                            onClick={() => handleTabChange(index)}
                                        >
                                            {subitem.name}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddTab}
                                        className="tab-add-button"
                                    >
                                        Добавить панель
                                    </button>
                                </div>

                                <div className="tab-content">
                                    {subitems.length > 0 && (
                                        <div className="subitem-details">
                                            <h3>{subitems[activeTab].name}</h3>

                                            <div className="popup-field">
                                                <label>Площадь:</label>
                                                <input
                                                    type="number"
                                                    value={subitems[activeTab].area || ''}
                                                    onChange={(e) => handleInputChange(e, activeTab, 'area')}
                                                />
                                            </div>

                                            <div className="popup-field">
                                                <label>Направление:</label>
                                                <input
                                                    type="number"
                                                    value={subitems[activeTab].direction ?? ''}
                                                    onChange={(e) => handleInputChange(e, activeTab, 'direction')}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="popup-actions">
                                <button type="submit" className="popup-submit-button">
                                    Сохранить
                                </button>
                                <button type="button" onClick={onClose} className="popup-close-button">
                                    Закрыть
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemEdit;
