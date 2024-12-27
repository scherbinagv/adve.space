import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ItemInfo from './app/ItemInfo'; // Импортируем Popup компонент
import ReportView from './app/ReportView';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useMemo } from "react";




import '../style/application.css'; 
import L from 'leaflet';  // Подключаем Leaflet
import config from '../config'; 

function Application() {
    const { t, i18n } = useTranslation();
    // const mapRef = useRef(null); // ref для контейнера карты
    // const mapInstance = useRef(null); // ref для самой карты
    const [items, setItems] = useState([]); // Список конструкций
    const [advertisers, setAdvertisers] = useState([]);
    const [advertiserCategories, setAdvertiserCategories] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [itemData, setItemData] = useState(null); // Состояние для попапа
    const [isItemViewing, setIsItemViewing] = useState(false); // Состояние для отображения формы просмотра
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [filteredAdvertisers, setFilteredAdvertisers] = useState(advertisers);
    const [advertiserFilters, setAdvertiserFilters] = useState([]);
    const [advertiserCategoryFilters, setAdvertiserCategoryFilters] = useState([]);
    const [availabilityFilters, setAvailabilityFilters] = useState([]); // свободное/занятое место
    const [searchText, setSearchText] = useState('');
    const openReport = () => setIsReportOpen(true);
    const closeReport = () => setIsReportOpen(false);
    const savedCenter = JSON.parse(localStorage.getItem('mapCenter'));
    const savedZoom = localStorage.getItem('mapZoom');
    const [recentSearches, setRecentSearches] = useState([]);
    const [demoTariff, setDemoTariff] = useState(null) 
    const navigate = useNavigate();
    
    const [demoCoordinates] = useState([
        {
            it: {
                lat: 41.859045909371936,
                lng: 12.476434707641603,
                zoom: 15
            },
            ro: {
                lat: 44.431297618574575,
                lng: 26.089696884155273,
                zoom: 15
            },
            bg: {
                lat: 42.67221299476742,
                lng: 23.36440086364746,
                zoom: 15
            },
            ru: {
                lat: 44.431297618574575,
                lng: 26.089696884155273,
                zoom: 15
            },
            en: {
                lat: 44.431297618574575,
                lng: 26.089696884155273,
                zoom: 15
            }
        }
    ]);

    const currentLocale = localStorage.getItem('i18nextLng') || 'en'; // Получаем текущую локаль
    const localeCoordinates = demoCoordinates[0][currentLocale.slice(0, 2)] || demoCoordinates[0]['en']; // Берём координаты для локали
    

    const getIconUrl = (itemTypeId) => {
        switch(itemTypeId) {
            case 1: return '/images/bb1.svg';
            case 2: return '/images/bb2.svg';
            case 3: return '/images/bb3.svg';
            default: return '/images/bb1.svg';  
        }
    };


    const updateRecentSearches = (newSearch) => {
        // Проверяем, если newSearch пустой, ставим "Без фильтра"
        const displaySearch = newSearch ? newSearch : "app.noFilter";
    
        setRecentSearches((prevSearches) => {
            // Добавляем новый поиск в начало массива
            const updatedSearches = [displaySearch, ...prevSearches].filter(Boolean);
            // Обрезаем массив, оставляя только последние 5 элементов
            return updatedSearches.slice(0, 7);
        });
    };

    const handleRecentSearchClick = (search) => {
        // const filters = search.split(',').map((item) => item.trim());
    
        // // Reset filters
        // setAdvertiserFilters([]);
        // setAdvertiserCategoryFilters([]);
        // setAvailabilityFilters([]);
    
        // // Apply the filters based on the clicked search string
        // filters.forEach((filter) => {
        //     if (filter.startsWith('Category:')) {
        //         const categoryIds = filter.replace('Category:', '').split(',').map((id) => parseInt(id.trim()));
        //         setAdvertiserCategoryFilters(categoryIds);
        //     } else if (filter.startsWith('Advertiser:')) {
        //         const advertiserIds = filter.replace('Advertiser:', '').split(',').map((id) => parseInt(id.trim()));
        //         setAdvertiserFilters(advertiserIds);
        //     } else if (filter.startsWith('Availability:')) {
        //         const availability = filter.replace('Availability:', '').trim();
        //         setAvailabilityFilters((prev) => [...prev, availability]);
        //     }
        // });
    };
    

    useEffect(() => {
        // fetchActiveTariffs();
        fetchAdvertisers();
        fetchCategory()
    }, []);

    useEffect(() => {
        fetchFilteredItems();
    }, [advertiserFilters, advertiserCategoryFilters, availabilityFilters, searchText]);

    const fetchAdvertisers = async () => {
        try {
          const response = await fetch(`${config.api}/advertisers/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem('authToken')}`,
              'Accept-Language': currentLocale
            },
          });
          if (response.ok) {
            const data = await response.json();
            setAdvertisers(data);
            setFilteredAdvertisers(data);
          } else {
            throw new Error('Ошибка загрузки Рекламодателей');
          }
        } catch (error) {
          console.error('Ошибка:', error);
        }
      };

    const fetchCategory = async () => {
        try {
            const response = await fetch(`${config.api}/advertiser-category/`, {
                headers: {
                Authorization: `Token ${localStorage.getItem("authToken")}`,
                'Accept-Language': currentLocale
            },
            });
            if (response.ok) {
            const data = await response.json();
            setAdvertiserCategories(data);
            } else {
            throw new Error("Не удалось загрузить категории");
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    const categoryNames = useMemo(() => {
        return Object.fromEntries(advertiserCategories.map(({ id, name }) => [id, name]));
    }, [advertiserCategories]);

    const advertiserNames = useMemo(() => {
        return Object.fromEntries(advertisers.map(({ id, name }) => [id, name]));
    }, [advertisers]);

    
    const fetchFilteredItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            // Создаем параметры для URL
            const params = new URLSearchParams({
                // search_text: searchText || "",
                ...advertiserFilters.length && { advertisers: advertiserFilters.join(",") },
                ...advertiserCategoryFilters.length && { advertiser_categories: advertiserCategoryFilters.join(",") },
                ...availabilityFilters.length && { availability: availabilityFilters.join(",") },
            });
    
            const url = `${config.api}/items/?${params.toString()}`;
    
            // Формируем заголовки запроса
            const headers = {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            };

            // Добавляем язык только если он определен
            if (currentLocale) {
                headers['Accept-Language'] = currentLocale;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            const alldata = await response.json();


            const currentFilter = [
                advertiserCategoryFilters.length > 0 && `${t("app.categories")}: ${[
                    ...new Set(
                        advertiserCategoryFilters.map((id) => t(`categories.${categoryNames[id]}`)).filter(Boolean)
                    ),
                ].join(", ")}`,
                advertiserFilters.length > 0 && `${t("app.advertisers")}: ${[
                    ...new Set(
                        advertiserFilters.map((id) => advertiserNames[id]).filter(Boolean)
                    ),
                ].join(", ")}`,
                availabilityFilters.length > 0 && `${t("app.availabilities")}: ${[
                    ...new Set(availabilityFilters)
                ].join(", ")}`,
            ]
            .filter(Boolean)
            .join(", ");
    
            updateRecentSearches(currentFilter);

            const categ = alldata.categories;
            const advs = alldata.advertisers;
            const data = alldata.results;
            const availability = alldata.availability
            const demoTariff = alldata.demo_tariff

            setAvailabilities(availability)
            const markers = data.map(item => ({
                id: item.id,
                lat: item.lat,
                lng: item.lng,
                iconUrl: getIconUrl(item.item_type.id),
            }));
    
            setItems(markers);
            setDemoTariff(demoTariff);

        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };
    


    const MapEventHandler = () => {
        useMapEvents({
            moveend: (event) => {
                const map = event.target;

                const center = map.getCenter();
                const zoom = map.getZoom();

                localStorage.setItem('mapCenter', JSON.stringify(center));
                localStorage.setItem('mapZoom', zoom);
            },
        });
        return null;
    };

    const handleAdvertiserCategoryFilterChange = (advertiserCategoryId) => {
        setAdvertiserCategoryFilters((prev) => {
            return prev.includes(advertiserCategoryId)
                ? prev.filter((id) => id !== advertiserCategoryId)
                : [...prev, advertiserCategoryId];
        });
    };

    const handleAdvertiserFilterChange = (advertiserId) => {
        setAdvertiserFilters((prev) => {
            return prev.includes(advertiserId)
                ? prev.filter((id) => id !== advertiserId)
                : [...prev, advertiserId];
        });
    };
    

    const handleAvailabilityFilterChange = (filter) => {
        setAvailabilityFilters((prev) => {
            return prev.includes(filter)
                ? prev.filter((item) => item !== filter)
                : [...prev, filter];
        });
    };

    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    };
    
    const handleAdvertiserSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = advertisers.filter(advertiser =>
            advertiser.name.toLowerCase().includes(query)
        );
        setFilteredAdvertisers(filtered);
    };

    const handleViewItem = (item) => {
        setItemData(item);
        setIsItemViewing(true);
    };

    const handleCloseView = () => {
        setIsItemViewing(false);
        setItemData(null);
    };


    return (
        <div className="dashboard">
            {/* Browser Window */}
            <div className="left-sidebar">
                <h3>{t('app.filter')}</h3>
                <div className="filter-block">
                    <div className="filter-header">
                        <label>{t('app.categories')}</label>
                        <div className="filter-count">{advertiserCategories.length}</div>
                    </div>    
                    <ul className="filter-list scrollable-list">
                        {advertiserCategories.map(advertiserCategory => (
                            <label className="checkbox-label" key={advertiserCategory.id} >
                                <li className="filter-item">
                                    <input 
                                        type="checkbox" 
                                        checked={advertiserCategoryFilters.includes(advertiserCategory.id)} 
                                        onChange={() => handleAdvertiserCategoryFilterChange(advertiserCategory.id)} 
                                    />
                                    <span className="result-label">{t(`categories.${advertiserCategory.name}`)}</span>
                                    <span className="result-count">{advertiserCategory.available_count}</span>
                                </li>
                            </label>
                        ))}
                    </ul>
                </div>

                <div className="filter-block">
                    <div className="filter-header">
                        <label>{t('app.advertisers')}</label>
                        <div className="filter-count">{advertisers.length}</div>
                    </div>    
                    <input 
                        type="text" 
                        placeholder={t('app.searchAdvertisers')} 
                        onChange={handleAdvertiserSearch} 
                    />
                    <ul className="filter-list scrollable-list">
                        {filteredAdvertisers.map(advertiser => (
                            <label className="checkbox-label"  key={advertiser.id}>
                                <li className="filter-item">
                                    <input 
                                        type="checkbox" 
                                        checked={advertiserFilters.includes(advertiser.id)} 
                                        onChange={() => handleAdvertiserFilterChange(advertiser.id)} 
                                    />
                                    <span className="result-label">{advertiser.name}</span>
                                    <span className="result-count">{advertiser.available_count}</span>
                                </li>
                            </label>
                        ))}
                    </ul>
                </div>

                <div className="filter-block">
                    <div className="filter-header">
                        <label>{t('app.availabilityLabel')}</label>
                        <div className="filter-count">{availabilities.free + availabilities.occupied}</div>
                    </div>
                    <ul className="filter-list scrollable-list">
                        <label className="checkbox-label">
                            <li className="filter-item">
                                <input 
                                    type="checkbox" 
                                    checked={availabilityFilters.includes('free')}
                                    onChange={() => handleAvailabilityFilterChange('free')}
                                />
                                <span className="result-label">{t('app.freeSpace')}</span>
                                <span className="result-count">{availabilities.free}</span>
                            </li>
                        </label>
                        <label className="checkbox-label">
                            <li className="filter-item">
                                <input 
                                    type="checkbox" 
                                    checked={availabilityFilters.includes('occupied')}
                                    onChange={() => handleAvailabilityFilterChange('occupied')}
                                />
                                <span className="result-label">{t('app.occupiedSpace')}</span>
                                <span className="result-count">{availabilities.occupied}</span>
                            </li>
                        </label>
                    </ul>
                </div>
            </div>


            {/* Map */}
            <div className="center">
              {/* Поиск по городу, рекламодателю, креативу */}
                        
                {demoTariff &&  (
                    <div className="demo-tariff-panel">
                        <div className="demo-tariff-info">
                            <p>{t('app.demoTariffMessage')}: {demoTariff.name}</p>
                            <p>{t('app.demoTariffDetails')}</p>
                        </div>
                        <button
                            className="tariff-button"
                            onClick={() => navigate('./' + i18n.language + '/tariffs')} 
                        >
                            {t('app.viewTariffs')}
                        </button>
                    </div>
                )}
                {/* <div className="search-box">
                    <input
                        type="text"
                        placeholder={t('app.searchPlaceholder')}
                        value={searchText}
                        onChange={handleSearchInputChange}
                    />
                </div> */}

                <div id="map">
                    <MapContainer

                        center={[
                            savedCenter?.lat || localeCoordinates?.lat || 44.4268, 
                            savedCenter?.lng || localeCoordinates?.lng || 26.1025
                        ]}
                        zoom={savedZoom || localeCoordinates?.zoom || 16}
                        style={{ height: '100%', margin: '10px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapEventHandler />
                        {/* <MarkerClusterGroup
                             showCoverageOnHover={false}
                             maxClusterRadius={50}
                             iconCreateFunction={(cluster) => {
                               const count = cluster.getChildCount();
                               return new L.DivIcon({
                                 html: `<div class="cluster-icon">${count}</div>`,
                                 className: 'custom-cluster-icon',
                                 iconSize: L.point(40, 40),
                               });
                             }}
                        > */}
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
                        {/* </MarkerClusterGroup> */}
                    </MapContainer>
                </div>

                {isItemViewing && itemData && (
                    <ItemInfo
                        data={itemData}
                        itemId={itemData.id}
                        onClose={handleCloseView} 
                        />
                )}
                
                {/* <div>
                    <div className="button" onClick={openReport}>
                        {t('app.getReport')}
                    </div>
                    {isReportOpen && <ReportView onClose={closeReport} />}
                </div> */}

            </div>

            {/* Правая колонка с последними поисками */}
            <div className="right-sidebar">
                <div className="recent-searches">
                    <h3>{t('app.recentSearches')}</h3>
                    <ul>
                        {recentSearches.map((search, index) => (
                            <li key={index} onClick={() => handleRecentSearchClick(search)}>
                                {t(search)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Application;
