import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet'; // Подключаем Leaflet
import { useTranslation } from 'react-i18next';
import ItemInfoPopup from './ItemInfoDemo'; // Импортируем Popup компонент



const HomePage = () => {
    const { t, i18n } = useTranslation();
    const mapContainerRef = useRef(null); // ref для контейнера карты
    const mapInstance = useRef(null); // ref для экземпляра карты
    const [itemData, setItemData] = useState(null); // Состояние для попапа
    const [isItemViewing, setIsItemViewing] = useState(false); // Состояние для отображения формы просмотра

    const languageCoordinates = {
        en: [44.4268, 26.1025], // Бухарест
        ru: [44.4268, 26.1025], // Бухарест
        ro: [44.4268, 26.1025], // Бухарест
        it: [41.9028, 12.4964], // Рим
        bg: [42.6977, 23.3219], // София
    };

    const [mapCenter, setMapCenter] = useState(languageCoordinates[i18n.language]);

    const markersData = [
        {
            id: 1,
            lat: 44.4279,
            lng: 26.1014,
            images: ['./images/bb_free.png', './images/bb_free2.png', './images/bb_free3.png'],
            iconUrl: './images/bb1.svg',
            lastUpdate: 'Сегодня',
            creative: 'Свободное место',
            advertiser: 'Нет',
            agent: 'ТОВ Креатив',
        },
        {
            id: 2,
            lat: 44.4268,
            lng: 26.1025,
            images: ['./images/bb_free2.png', './images/bb_free.png'],
            iconUrl: './images/bb2.svg',
            lastUpdate: 'Сегодня',
            creative: 'Свободное место',
            advertiser: 'Нет',
            agent: 'ТОВ Креатив',
        },
        {
            id: 3,
            lat: 44.4257,
            lng: 26.1032,
            images: ['./images/bb_free.png', './images/bb_free3.png'],
            iconUrl: './images/bb3.svg',
            lastUpdate: 'Вчера',
            creative: 'Новое объявление',
            advertiser: 'Компания ABC',
            agent: 'ТОВ Агентство',
        },
        //Рим
        {
            id: 4,
            lat: 41.9029,
            lng: 12.4963,
            images: ['./images/bb_free.png', './images/bb_free2.png', './images/bb_free3.png'],
            iconUrl: './images/bb1.svg',
            lastUpdate: 'Сегодня',
            creative: 'Свободное место',
            advertiser: 'Нет',
            agent: 'Rome Agency',
        },
        {
            id: 5,
            lat: 41.9030,
            lng: 12.4970,
            images: ['./images/bb_free2.png', './images/bb_free.png'],
            iconUrl: './images/bb2.svg',
            lastUpdate: 'Вчера',
            creative: 'Новое объявление',
            advertiser: 'Компания XYZ',
            agent: 'Rome Advertising Group',
        },
        {
            id: 6,
            lat: 41.9025,
            lng: 12.4950,
            images: ['./images/bb_free.png', './images/bb_free3.png'],
            iconUrl: './images/bb3.svg',
            lastUpdate: 'Сегодня',
            creative: 'Свободное место',
            advertiser: 'Нет',
            agent: 'Rome Creatives',
        },
  
        //София
        {
            id: 7,
            lat: 42.6975,
            lng: 23.3217,
            images: ['./images/bb_free.png', './images/bb_free2.png', './images/bb_free3.png'],
            iconUrl: './images/bb1.svg',
            lastUpdate: 'Сегодня',
            creative: 'Свободное место',
            advertiser: 'Нет',
            agent: 'Sofia Agency',
        },
        {
            id: 8,
            lat: 42.6978,
            lng: 23.3225,
            images: ['./images/bb_free2.png', './images/bb_free.png'],
            iconUrl: './images/bb2.svg',
            lastUpdate: 'Вчера',
            creative: 'Новое объявление',
            advertiser: 'Компания ABC',
            agent: 'Sofia Advertising',
        },
        {
            id: 9,
            lat: 42.6969,
            lng: 23.3205,
            images: ['./images/bb_free.png', './images/bb_free3.png'],
            iconUrl: './images/bb3.svg',
            lastUpdate: 'Сегодня',
            creative: 'Свободное место',
            advertiser: 'Нет',
            agent: 'Sofia Creatives',
        },
    ];

    // Обновляем центр карты при смене языка
    useEffect(() => {
        setMapCenter(languageCoordinates[i18n.language]);
    }, [i18n.language]);

    // Инициализация карты и маркеров
    useEffect(() => {
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapContainerRef.current, {
                center: mapCenter,
                zoom: 16,
                zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                touchZoom: false,
                dragging: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 16,
                attribution: '© OpenStreetMap contributors',
            }).addTo(mapInstance.current);
        } else {
            mapInstance.current.setView(mapCenter);
        }

        markersData.forEach(markerData => {
            const marker = addMarker(markerData);
            marker.on('click', () => handleViewItem(markerData)); // Обработчик клика
        });
        

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [mapCenter]);



    const handleViewItem = (item) => {
        setItemData(item);
        setIsItemViewing(true);
    };

    const handleCloseView = () => {
        setIsItemViewing(false);
        setItemData(null);
    };



    // Функция добавления маркеров на карту
    const addMarker = (data) => {
        let currentImageIndex = 0;

        const customIcon = L.icon({
            iconUrl: data.iconUrl,
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -40],
        });

        const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(mapInstance.current);

        return marker; // Возвращаем маркер для дальнейшего использования
    };

    return (
        <div className="container">
            <div className="body_section">
                <section className="section">
                    <h2>{t('how_it_works')}</h2>
                    <p>{t('interactive_map')}</p>
                    <div id="map" ref={mapContainerRef} style={{ height: '400px', width: '100%' }}></div>
                </section>
                {isItemViewing && itemData && (
                    <ItemInfoPopup
                        itemData={itemData}
                        onClose={handleCloseView} 
                    />
                )}

                {/* <div className="section">
                    <h2>{t('get_access_now')}</h2>
                    <div className="pricing section">
                        <div className="card">
                            <h3>{t('cities.bucharest')}</h3>
                            <p>$500</p>
                            <p>
                                {t('pricing.current_info')} <br />
                                {t('pricing.billboards')} <br />
                                {t('pricing.as_of_today')} <br />
                                {t('pricing.history_from_2024')}
                            </p>                            
                            <a className="button">{t('get_access_now')}</a>
                        </div>
                        <div className="card">
                            <h3>{t('cities.brasov')}</h3>
                            <p>$400</p>
                            <p>
                                {t('pricing.current_info')} <br />
                                {t('pricing.billboards')} <br />
                                {t('pricing.as_of_today')} <br />
                                {t('pricing.history_from_2024')}
                            </p>       
                            <a className="button">{t('get_access_now')}</a>
                        </div>
                        <div className="card">
                            <h3>{t('cities.constanta')}</h3>
                            <p>$300</p>
                            <p>
                                {t('pricing.current_info')} <br />
                                {t('pricing.billboards')} <br /><br />
                                {t('pricing.as_of_today')} 
                                
                            </p>       
                            <a className="button">{t('get_access_now')}</a>
                        </div>
                    </div>
                </div> */}

                <div className="section">
                    <h2>{t('what_you_will_get')}</h2>
                    <ul>
                        <li>{t('features.personal_account')}</li>
                        <li>{t('features.advertising_map')}</li>
                        <li>{t('features.current_creative')}</li>
                        <li>{t('features.creative_history')}</li>
                        <li>{t('features.creative_analytics')}</li>
                        <li>{t('features.advertiser_analytics')}</li>
                        <li>{t('features.coverage_diagrams')}</li>
                    </ul>
                </div>

                <div className="section">
                    <h2>{t('about_us.title')}</h2>
                    <p>{t('about_us.content')}</p>
                </div>

                <div className="section">
                    <h2>{t('our_values.title')}</h2>
                    <p><b>{t('our_values.accuracy')}</b> {t('our_values.accuracy_text')}</p>
                    <p><b>{t('our_values.independence')}</b> {t('our_values.independence_text')}</p>
                    <p><b>{t('our_values.innovation')}</b> {t('our_values.innovation_text')}</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
