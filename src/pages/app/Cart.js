import React, { useEffect } from 'react';

function Cart({ onClose }) {

  useEffect(() => {
    // Блокировка прокрутки при открытии попапа
    document.body.classList.add('popup-active');
    return () => {
      // Возврат прокрутки при закрытии попапа
      document.body.classList.remove('popup-active');
    };
  }, []);

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-content">
          
        </div>

        {/* Кнопка закрытия */}
        <div className="popup-footer">
          <button onClick={onClose} className="popup-close-button">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
