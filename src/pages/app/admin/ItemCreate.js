import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import config from '../../../config';
import Select from 'react-select';

const ItemCreate = ({ lat, lng, onCreate, onClose }) => {
    const [itemLat, setItemLat] = useState(lat); // Изначальная широта
    const [itemLng, setItemLng] = useState(lng); // Изначальная долгота
    const [itemType, setItemType] = useState('');
    const [error, setError] = useState('');
    const [tariffGroups, setTariffGroups] = useState([]); // Состояние для тарифных групп
    const [itemTypes, setItemTypes] = useState([]);
    const [selectedTariffs, setSelectedTariffs] = useState([]); 


    // Получаем список тарифных групп из API
    useEffect(() => {
        fetchTypes();
        fetchTariffGroups();
    }, []); // Эффект срабатывает один раз при монтировании компонента

    const fetchTariffGroups = async () => {
        try {
            const response = await fetch(`${config.api}/admin/tariff-groups/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить тарифные группы');
            }

            const data = await response.json();
            setTariffGroups(data.results); // Сохраняем полученные данные в состояние
        } catch (err) {
            setError('Не удалось загрузить тарифные группы.');
            console.error(err);
        }
    };

    const fetchTypes = async () => {
        try {
          const response = await fetch(`${config.api}/item-types/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("authToken")}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setItemTypes(data.results);
          } else {
            throw new Error("Не удалось загрузить типы ");
          }
        } catch (err) {
          console.error(err);
          setError("Ошибка загрузки типов");
        }
      };

    const tariffOptions = tariffGroups.map(group => ({
        value: group.id,
        label: group.name,
    }));

    const selectedTariffOptions = selectedTariffs.map(id => ({
        value: id,
        label: tariffGroups.find(group => group.id === id)?.name || ''
    }));

    const handleTariffGroupChange = (selectedOptions) => {
        const selectedGroups = selectedOptions.map((option) => option.value);
        setSelectedTariffs(selectedGroups);
    };

    // Обработчик карты для обновления координат при перемещении карты
    const MapEventHandler = () => {
        useMapEvents({
            moveend: (e) => {
                const map = e.target;
                const center = map.getCenter();
                setItemLat(center.lat); // Обновляем широту
                setItemLng(center.lng); // Обновляем долготу
            },
        });
        return null;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Валидация данных
        if (!itemLat || !itemLng || !itemType) {
            setError('Все поля обязательны для заполнения.');
            return;
        }

        // Передаем данные в родительский компонент
        onCreate({ lat: itemLat, lng: itemLng, itemType, tariff_groups: selectedTariffs });
        onClose(); // Закрываем попап
    };

    return (
        <div className="popup" onClick={onClose}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
                <div className="popup-panel-selector">
                <h2>Создание конструкции</h2>
                </div>

                <div className="popup-content">
                    <div className="popup-main">
                        <div className="popup-form">
                            <form onSubmit={handleSubmit}>

                                {/* <div className="popup-field">
                                    <label>Тип конструкции:</label>
                                    <select
                                        value={itemType}
                                        onChange={(e) => setItemType(e.target.value)}
                                        required
                                    >
                                        <option value="">Выберите тип</option>
                                        <option value="Billboard">Billboard</option>
                                        <option value="Sitylight">Sitylight</option>
                                        <option value="Prismatron">Prismatron</option>
                                    </select>
                                </div> */}
                                <div className="popup-field">
                                    <label>Тип конструкции:</label>
                                    <select
                                        value={itemType}
                                        onChange={(e) => setItemType(e.target.value)}
                                        required
                                    >
                                        <option value="">Выберите тип</option>
                                        {itemTypes.map((type) => (
                                            <option key={type.id} value={type.id}> {/* Предполагаем, что `id` уникально для каждого типа */}
                                                {type.name} {/* Здесь отображаем поле name */}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {error && <div className="popup-error">{error}</div>}

                                {/* Карта */}
                                <div className="popup-map">
                                    <MapContainer
                                        center={[itemLat, itemLng]}
                                        zoom={18}
                                        style={{ height: '300px', width: '100%' }}
                                    >
                                        <MapEventHandler />
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker 
                                            position={[itemLat, itemLng]}
                                            icon={new L.Icon({
                                                iconUrl: '../../images/bb1.svg', // Путь к вашему изображению
                                                iconSize: [38, 38], // Размер маркера
                                            })}
                                            >
                                            <Popup>Выбранные координаты</Popup>
                                        </Marker>
                                    </MapContainer>
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

                                <div className="popup-actions">
                                    <button type="submit" className="popup-submit-button">
                                        Создать
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
        </div>
    );
};

export default ItemCreate;
