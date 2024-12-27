import React, { useEffect, useRef } from 'react';
import '../style/homepage.css'; // Импорт стилей
import L from 'leaflet';  // Подключаем Leaflet
import { useTranslation } from 'react-i18next';


const HomePage = () => {
    const { t } = useTranslation();
    const mapRef = useRef(null); // ref для контейнера карты

    useEffect(() => {
        // Проверка на существование карты
        if (mapRef.current && !mapRef.current._leaflet_id) {
        const map = L.map(mapRef.current, {
            center: [44.4268, 26.1025],
            zoom: 16,
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false
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
        <div className="container">
            <div className="body_section">
                <section className="section">
                    <h2>{t('how_it_works')}</h2>
                    <p>{t('interactive_map')}</p>
                    <div id="map" ref={mapRef}></div>
                </section>
            </div>

            <div className="section">
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
