import React from 'react';
import { useTranslation } from 'react-i18next';

function ItemInfoPopup({ itemData, onClose }) {
  const { t } = useTranslation();

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('popup')) {
      onClose();
    }
  };

  const openFullscreenImage = (url) => {
    // Открыть изображение в полном экране
  };

  return (
    <div className="popup" onClick={handleOverlayClick}>
      <div className="popup-container">
        {/* <div className="popup-header">
          <h3>{itemData.id || t('itemInfo.defaultName')}</h3>
          <button onClick={onClose} className="popup-close-button">
            &times;
          </button>
        </div> */}
        <div className="popup-content">
          <div className="popup-image-section">
            <img
                src={itemData.images[0] || '/placeholder.png'}
                alt={t('itemInfo.imageAlt', { name: itemData.id || '' })}
                className="popup-photo"
                onClick={() => openFullscreenImage(itemData.id || '/placeholder.png')}
            />
          </div>
          <div className="popup-details">
            <p>
              <strong>{t('itemInfo.lastUpdate')}:</strong>{' '}
              {itemData.lastUpdate || t('itemInfo.noData')}
            </p>
            <p>
              <strong>{t('itemInfo.advertiser')}:</strong>{' '}
              {itemData.advertiser || t('itemInfo.none')}
            </p>
          </div>
        </div>
        <div className="popup-footer">
          <button onClick={onClose} className="popup-close-button">
            {t('itemInfo.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemInfoPopup;
