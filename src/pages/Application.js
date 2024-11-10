import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainPage from './app/MainPage';
import Invoices from './app/Invoices';
import Notifications from './app/Notifications';
import Settings from './app/Settings';
import '../style/application.css'; 
import L from 'leaflet';  // Подключаем Leaflet

function Application() {
    const { t } = useTranslation();
    const mapRef = useRef(null); // ref для контейнера карты


    const [cities, setCities] = useState([]);
    const [advertisers, setAdvertisers] = useState([]);
    const [creatives, setCreatives] = useState([]);
    
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedAdvertiser, setSelectedAdvertiser] = useState('');
    const [selectedCreative, setSelectedCreative] = useState('');

    const recentSearches = [
      "Бухарест",
      "Брашов",
      "ТОВ Креатив",
      "Бухарест"
    ];

    useEffect(() => {
      // Моковые данные
      setCities([
        { id: 1, name: "Бухарест" },
        { id: 2, name: "Брашов" },
        { id: 3, name: "Констанца" },
        { id: 4, name: "Еще" }
      ]);
      setAdvertisers([
        { id: 1, name: "ТОВ Креатив" },
        { id: 2, name: "Компания ABC" },
        { id: 3, name: "ТОВ Агентство" }
      ]);
      setCreatives([
        { id: 1, name: "Свободное место" },
        { id: 2, name: "Новое объявление" }
      ]);

      // Проверка на существование карты
      if (mapRef.current && !mapRef.current._leaflet_id) {
        const map = L.map(mapRef.current, {
            center: [44.4268, 26.1025],
            zoom: 16,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const markersData = [
            {
                lat: 44.4279,
                lng: 26.1014,
                images: ['/images/bb_free.png', '/images/bb_free2.png', '/images/bb_free3.png'],
                iconUrl: '/images/bb1.svg',
                lastUpdate: 'Сегодня',
                creative: 'Свободное место',
                advertiser: 'Нет',
                agent: 'ТОВ Креатив'
            },
            {
                lat: 44.4268,
                lng: 26.1025,
                images: ['/images/bb_free2.png', '/images/bb_free.png'],
                iconUrl: '/images/bb2.svg',
                lastUpdate: 'Сегодня',
                creative: 'Свободное место',
                advertiser: 'Нет',
                agent: 'ТОВ Креатив'
            },
            {
                lat: 44.4257,
                lng: 26.1032,
                images: ['/images/bb_free.png', '/images/bb_free3.png'],
                iconUrl: '/images/bb3.svg',
                lastUpdate: 'Вчера',
                creative: 'Новое объявление',
                advertiser: 'Компания ABC',
                agent: 'ТОВ Агентство'
            }
        ];

        function addMarker(lat, lng, data) {
            let currentImageIndex = 0;

            function getPopupContent() {
                return `
                    <div style="width: 300px; line-height: 1.2; display: flex; align-items: center; justify-content: space-between;">
                    <button onclick="previousImage(${data.lat}, ${data.lng})" style="border: none; background: none;">&#9664;</button>
                    <img id="popupImage-${lat}-${lng}" src="${data.images[currentImageIndex]}" style="width: 80%; height: auto; border-radius: 5px;" alt="Рекламная конструкция">
                    <button onclick="nextImage(${data.lat}, ${data.lng})" style="border: none; background: none;">&#9654;</button>
                    </div>
                    <p style="margin: 5px 0;"><strong>Последнее обновление:</strong> ${data.lastUpdate}</p>
                    <p style="margin: 5px 0;"><strong>Креатив:</strong> ${data.creative}</p>
                    <p style="margin: 5px 0;"><strong>Рекламодатель:</strong> ${data.advertiser}</p>
                    <p style="margin: 5px 0;"><strong>Агент:</strong> ${data.agent}</p>
                `;
            }

            const customIcon = L.icon({
                iconUrl: data.iconUrl,
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -40]
            });

            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
                .bindPopup(getPopupContent());

            window.nextImage = function(lat, lng) {
                if (data.lat === lat && data.lng === lng) {
                    currentImageIndex = (currentImageIndex + 1) % data.images.length;
                    document.getElementById(`popupImage-${lat}-${lng}`).src = data.images[currentImageIndex];
                }
            };

            window.previousImage = function(lat, lng) {
                if (data.lat === lat && data.lng === lng) {
                    currentImageIndex = (currentImageIndex - 1 + data.images.length) % data.images.length;
                    document.getElementById(`popupImage-${lat}-${lng}`).src = data.images[currentImageIndex];
                }
            };
        }

        markersData.forEach(markerData => {
            addMarker(markerData.lat, markerData.lng, markerData);
        });
      } else {
        console.warn('Map container is already initialized or invalid reference.');
      }
    }, []); 

    return (
        <div className="dashboard">
            {/* Browser Window */}
            <div className="left-sidebar">
                <div className="search-filters">
                    <div className="filter-block">
                        <label>{t('app.cityLabel')}</label>
                        <ul className="filter-list">
                            {cities.map(city => (
                                <li 
                                    key={city.id} 
                                    onClick={() => setSelectedCity(city.name)} 
                                    className={selectedCity === city.name ? 'selected' : ''}
                                >
                                    {city.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-block">
                        <label>{t('app.advertiserLabel')}</label>
                        <ul className="filter-list">
                            {advertisers.map(advertiser => (
                                <li 
                                    key={advertiser.id} 
                                    onClick={() => setSelectedAdvertiser(advertiser.name)} 
                                    className={selectedAdvertiser === advertiser.name ? 'selected' : ''}
                                >
                                    {advertiser.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-block">
                        <label>{t('app.creativeLabel')}</label>
                        <ul className="filter-list">
                            {creatives.map(creative => (
                                <li 
                                    key={creative.id} 
                                    onClick={() => setSelectedCreative(creative.name)} 
                                    className={selectedCreative === creative.name ? 'selected' : ''}
                                >
                                    {creative.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


            {/* Map */}
            <div className="map">
              {/* Поиск по городу, рекламодателю, креативу */}
              <div className="search-box">
                    <input type="text" placeholder={t('app.searchPlaceholder')} />
                </div>
                <div id="map" ref={mapRef}></div>
                <div className="button">
                    {t('app.getReport')}
                </div>

            </div>

            {/* Правая колонка с последними поисками */}
            <div className="right-sidebar">
                <div className="recent-searches">
                    <h3>{t('app.recentSearches')}</h3>
                    <ul>
                        {recentSearches.map((search, index) => (
                            <li key={index}>{search}</li>
                        ))}
                    </ul>
                </div>
            </div>


            {/* Routes */}
            <Routes>
                <Route path="main" element={<MainPage />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
        </div>
    );
}

export default Application;
