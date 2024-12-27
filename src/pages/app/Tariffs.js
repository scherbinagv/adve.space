import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InvoiceInfo from './InvoiceInfo'; 
import config from '../../config'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';



const Tariffs = () => {
    const { t } = useTranslation();
    const [popupData, setPopupData] = useState(null); // Состояние для попапа
    const [activeTariffs, setActiveTariffs] = useState([]); // Список активных тарифов
    const [availableTariffs, setAvailableTariffs] = useState([]); // Список доступных тарифов
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки
    const [cart, setCart] = useState([]);

    const addToCart = async (tariffId) => {
        try {
            const response = await fetch(`${config.api}/cart/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ tariff_id: tariffId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            const data = await response.json();

            // setAvailableTariffs((prevTariffs) =>
            //     prevTariffs.filter((tariff) => tariff.id !== tariffId)
            // );

            // Обновляем состояние корзины (опционально)
            fetchCart();
            fetchTariffs(); // Запрашиваем доступные тарифы
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromCart = async (tariffId) => {
        try {
            const response = await fetch(`${config.api}/cart/remove/${tariffId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${localStorage.getItem('authToken')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to remove from cart');
            }    
            // Обновляем корзину и доступные тарифы
            await fetchCart();  // Запрашиваем корзину
            await fetchTariffs(); // Запрашиваем доступные тарифы
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    };
    

    const fetchCart = async () => {
        try {
            const response = await fetch(`${config.api}/cart/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('authToken')}`,
                },
            });

            const data = await response.json();
            setCart(data);

            const cartTariffIds = data.map((item) => item.tariff_id);
            setAvailableTariffs((prevTariffs) =>
                prevTariffs.filter((tariff) => !cartTariffIds.includes(tariff.id))
            );
        } catch (err) {
            console.error(err);
        }
    };

    // Функция для загрузки тарифов
    const fetchTariffs = async () => {
        try {
            setLoading(true);
            // Пример запросов к API
            const activeResponse = await fetch(`${config.api}/tariffs/active/`, {
                headers: {
                  Authorization: `Token ${localStorage.getItem('authToken')}`, // Используем токен из localStorage
                },
              });
            const availableResponse = await fetch(`${config.api}/tariffs/available/`, {
                headers: {
                  Authorization: `Token ${localStorage.getItem('authToken')}`, // Используем токен из localStorage
                },
              });
            const activeData = await activeResponse.json();
            const availableData = await availableResponse.json();

            setActiveTariffs(activeData);
            setAvailableTariffs(availableData);
        } catch (err) {
            console.error('Error fetching tariffs:', err);
            setError(t('errors.load_failed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTariffs();
        fetchCart();
    }, []);

    const handleGetInvoiceClick = async () => {
        try {
            const response = await fetch(`${config.api}/create-invoice/`, {
                method: 'POST',
                headers: {
                    Authorization: `Token ${localStorage.getItem('authToken')}`, // Используем токен из localStorage
                },
            });
    
            if (response.ok) {
                const data = await response.json(); // Извлекаем JSON из ответа
                const invoiceId = data.invoice_id; // Достаём invoice_id из ответа
    
                await fetchCart();  // Запрашиваем корзину
                await fetchTariffs(); // Запрашиваем доступные тарифы
    
                setPopupData({ id: invoiceId }); // Передаем ID инвойса в popupData
    
            } else {
                throw new Error('Ошибка при создании инвойса');
            }
        } catch (error) {
            console.error('Ошибка при создании инвойса:', error);
        }
    };
    

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.total_price, 0);
    };

    if (loading) return <p>{t('loading')}</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard2">
            <div className="section">
                {/* Активные тарифы */}
                {activeTariffs.length > 0 && (
                    <div className="section">
                        <h2>{t('tariffs.active_tarrifs')}</h2>
                        <div className="tariffs section">
                            {activeTariffs.map((tariff) => {
                                const purchaseDate = new Date(tariff.purchase_date);
                                const formattedDate = purchaseDate.toLocaleDateString('ru-RU'); // Форматирование даты в формат dd.mm.yyyy

                                return (
                                    <div className="card" key={tariff.id}>
                                        <h3>{tariff.name}</h3>
                                        <p>{t('tariffs.tracked_panels')}: {tariff.subitems_count}</p>
                                        <p>{t('tariffs.purchase_date')}: {formattedDate}</p>
                                        {tariff.new_images > 0 && (
                                            <p>{t('tariffs.updates_count')}: {tariff.new_images}</p>
                                        )}

                                        {tariff.update_price && tariff.update_price > 0 && (
                                            <a className="button" onClick={() => addToCart(tariff.tariff_id)}>
                                                {t('tariffs.update_button')} {tariff.update_price} {tariff.currency}
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Доступные тарифы */}
                <div className="section">
                    <h2>{t('tariffs.options_tarrifs')}</h2>
                    <div className="tariffs section">
                        {availableTariffs.length > 0 ? (
                            availableTariffs.map((tariff) => (
                                <div className="card" key={tariff.id}>
                                    <h3>{tariff.name}</h3>
                                    <p>{t('tariffs.tracked_panels')}: {tariff.subitem_count}</p>
                                    <p></p>
                                    <button className="button" onClick={() => addToCart(tariff.id)}>
                                        {t('tariffs.buy_button')} {tariff.price} {tariff.currency}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>{t('tariffs.no_more_options')}</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Корзина */}
            <div className="cart-sidebar">
                <h3>{t('cart.title')}</h3>
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item.id}>
                            <p>
                                {item.tariff_name} - ${item.total_price}
                            </p>
                            <button className="remove-btn" onClick={() => removeFromCart(item.id)} >
                                <FontAwesomeIcon icon={faTrash} className="icons" />
                                {t('cart.remove_button')}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>{t('cart.empty')}</p>
                )}

                {cart.length > 0 && (
                    <div className="cart-total">
                        <p><strong>{t('cart.total')}: ${calculateTotal()}</strong></p>
                    </div>
                )}

                {cart.length > 0 && (
                    <a className="button" onClick={handleGetInvoiceClick}>
                        {t('cart.get_invoice')}
                    </a>
                )}

                {popupData && (
                    <InvoiceInfo
                        invoiceId={popupData.id}                        
                        onClose={() => setPopupData(null)}
                    />
                )}
            </div>

        </div>
    );
};

export default Tariffs;
