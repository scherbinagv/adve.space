import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import config from '../../../config';
import ItemCreate from './ItemCreate'; // Импортируем компонент формы
import ItemView from './ItemView'; // Форма для просмотра данных конструкции


const ItemsMap = () => {
    const [items, setItems] = useState([]); // Список конструкций
    // const [loading, setLoading] = useState(false); // Индикатор загрузки
    const [error, setError] = useState(null); // Статус ошибки
    const boundsRef = useRef(null); // Хранение предыдущих границ карты
    const [showCreatePopup, setShowCreatePopup] = useState(false); // Статус отображения попапа для создания конструкции
    // const [lat, setLat] = useState([]); // Изначальная широта
    // const [lng, setLng] = useState([]); // Изначальная долгота
    // const [zoom, setZoom] = useState([]); // Изначальная долгота

    const [selectedItem, setSelectedItem] = useState(null); // Состояние для выбранной конструкции
    const [isViewing, setIsViewing] = useState(false); // Состояние для отображения формы просмотра

    const savedCenter = JSON.parse(localStorage.getItem('mapCenter'));
    const savedZoom = localStorage.getItem('mapZoom');
    const savedBounds = localStorage.getItem('mapBounds');
    


    // Функция загрузки данных с сервера
    const fetchItems = async (bounds) => {
        console.log(bounds)
        if (!bounds) {
            console.error('Bounds is undefined');
            return; // Прерываем выполнение, если bounds не получены
        }

        const { _southWest, _northEast } = bounds;

        // Формируем параметры запроса
        const queryParams = new URLSearchParams({
            minLat: _southWest.lat,
            maxLat: _northEast.lat,
            minLng: _southWest.lng,
            maxLng: _northEast.lng,
        });

        // setLoading(true);

        try {
            const response = await fetch(`${config.api}/admin/items/?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }

            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            // setLoading(false);
        }
    };

    // Хэндлер для карты
    const MapEventHandler = () => {
        useMapEvents({
            moveend: (event) => {
                const map = event.target;
                const bounds = map.getBounds();
                const center = map.getCenter();
                const zoom = map.getZoom();
                if (!bounds) {
                    console.error('Map bounds are not available');
                    return;
                }

                const { _southWest, _northEast } = bounds;

                // Сохраняем в localStorage текущее положение карты
                localStorage.setItem('mapCenter', JSON.stringify(center));
                localStorage.setItem('mapZoom', zoom);
                localStorage.setItem('mapBounds', JSON.stringify({
                    _southWest,
                    _northEast
                }));
                


                // setLat(center.lat); // Обновляем широту
                // setLng(center.lng); // Обновляем долготу
                // setZoom(zoom)

                console.log(center.lat, center.lng, zoom)

                // Проверяем изменения границ
                const prevBounds = boundsRef.current;
                if (
                    !prevBounds ||
                    bounds._southWest.lat !== prevBounds._southWest.lat ||
                    bounds._southWest.lng !== prevBounds._southWest.lng ||
                    bounds._northEast.lat !== prevBounds._northEast.lat ||
                    bounds._northEast.lng !== prevBounds._northEast.lng
                ) {
                    boundsRef.current = bounds; // Обновляем границы
                    fetchItems(bounds); // Выполняем запрос
                }
            },
        });
        return null;
    };

    useEffect(() => {
        let bounds = {
            _southWest: { lat: 44.3, lng: 26.0 },
            _northEast: { lat: 44.5, lng: 26.3 },
        };
    
        if (savedBounds) {
            bounds = JSON.parse(savedBounds);
        }
    
        fetchItems(bounds); // Выполняем fetch с дефолтными границами
    }, [savedBounds]); // Теперь useEffect зависит от savedBounds
    

    const handleCreateItem = async (itemData) => {
        try {
            const response = await fetch(`${config.api}/admin/items/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании конструкции');
            }
            const result = await response.json();

            // Обновляем список конструкций
            fetchItems(boundsRef.current); // Передаем текущие границы карты
            handleViewItem(result)
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenCreatePopup = () => setShowCreatePopup(true);
    const handleCloseCreatePopup = () => setShowCreatePopup(false);

    const handleViewItem = (item) => {
        setSelectedItem(item);
        setIsViewing(true);
    };

    const handleCloseView = () => {
        setIsViewing(false);
        setSelectedItem(null);
        fetchItems(boundsRef.current); // Передаем текущие границы карты
    };


    if (error) return <div>Ошибка: {error}</div>;


    return (
        <div>
            <button
                className="button"
                onClick={handleOpenCreatePopup}
                style={{ marginBottom: '10px' }}
            >Создать конструкцию</button>
            {showCreatePopup && (
                <ItemCreate
                    lat={savedCenter.lat}
                    lng={savedCenter.lng}
                    onCreate={handleCreateItem}
                    onClose={handleCloseCreatePopup}
                />
            )}

            <div style={{ height: '500px' }}>
                <MapContainer
                    // center={[44.4268, 26.1025]} // Устанавливаем начальное положение
                    // zoom={16} // Начальное увеличение
                    center={[
                        savedCenter?.lat || 44.4268, 
                        savedCenter?.lng || 26.1025
                      ]}
                      
                    
                    zoom= {savedZoom || 16}
                    style={{ height: '100%', margin: '10px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapEventHandler />
                    {items.map((item) =>
                        item.lat && item.lng ? (
                            <Marker
                                key={item.id}
                                position={[item.lat, item.lng]}
                                icon={
                                    new L.Icon({
                                        iconUrl: '../../images/bb1.svg',
                                        iconSize: [38, 38],
                                    })
                                }
                                eventHandlers={{
                                    click: () => handleViewItem(item), // Открытие формы просмотра
                                }}        
                            >
                            </Marker>
                        ) : null
                    )}
                </MapContainer>
                {isViewing && selectedItem && (
                <ItemView
                    itemId={selectedItem.id} // Передаем ID конструкции
                    onClose={handleCloseView} // Закрываем форму
                />
                )}
               
            </div>
        </div>
    );
};

export default ItemsMap;
