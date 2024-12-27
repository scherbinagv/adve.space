import React, { useState, useEffect } from 'react';
import InvoiceInfo from '../InvoiceInfo';
import config from '../../../config'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faBan } from '@fortawesome/free-solid-svg-icons'; 

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);
  
  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${config.api}/admin/invoices/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        throw new Error('Ошибка загрузки инвойсов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleRowClick = (invoiceId) => {
    setPopupData({ id: invoiceId }); // Передаем только ID инвойса
  };

  const closePopup = () => {
    setPopupData(null);
  };

  const handleConfirmPayment = async (invoiceId) => {
    try {
      // Отправляем запрос на сервер для подтверждения оплаты
      const response = await fetch(`${config.api}/admin/invoices/confirm-payment/${invoiceId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Оплата подтверждена:', data);
        // Обновляем инвойс в состоянии
        fetchInvoices(); // Обновляем список инвойсов с сервера
        alert('Оплата успешно подтверждена!');
      } else {
        const errorData = await response.json();
        console.error('Ошибка подтверждения оплаты:', errorData);
        alert('Ошибка подтверждения оплаты.');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      alert('Произошла ошибка при отправке запроса.');
    }
  };
  
  
  const handleCancelInvoice = async (invoiceId) => {
    // Запрашиваем подтверждение от пользователя
    const isConfirmed = window.confirm('Вы уверены, что хотите отменить этот инвойс?');

    // Если пользователь нажал "Отмена", прекращаем выполнение
    if (!isConfirmed) {
        return;
    }
    try {
      const response = await fetch(`${config.api}/admin/invoices/cancel/${invoiceId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const updatedInvoice = await response.json();
        console.log(`Инвойс ${invoiceId} отменен. Новый статус: ${updatedInvoice.status}`);
        // Обновляем состояние инвойсов на фронтенде
        fetchInvoices(); // Обновляем список инвойсов с сервера
      } else {
        console.error('Ошибка отмены инвойса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
  
  

  return (
    <div className="invoices-container">
      {/* Попап */}
      {popupData && (
        <InvoiceInfo
            invoiceId={popupData.id}
            onClose={() => setPopupData(null)}
        />
      )}

      {(invoices.length > 0) ? (
        <div className="section">
          <h2>Все Инвойсы</h2>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>№ Инвойса</th>
                <th>Дата Инвойса</th>
                <th>Услуги</th>
                <th>Общая сумма</th>
                <th>Статус</th>
                <th>Дата оплаты</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                    <tr key={index} onClick={() => handleRowClick(invoice.id)}>
                    <td>{invoice.user}</td>
                    <td>{invoice.invoice_number}</td>
                    <td>{invoice.invoice_date}</td>
                    <td>{invoice.items.map((item) => item.description).join(', ')}</td>
                    <td>{invoice.final_amount} {invoice.currency}</td>
                    <td>{invoice.status}</td>
                    <td>{invoice.due_date}</td>
                    <td>
                        {invoice.status === 'Pending' && (
                        <>
                            <button onClick={(e) =>  {
                                e.stopPropagation();  // Останавливаем всплытие события
                                handleConfirmPayment(invoice.id)}
                            }>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                            <button onClick={(e) => {
                                e.stopPropagation();  // Останавливаем всплытие события
                                handleCancelInvoice(invoice.id)}
                            }>
                            <FontAwesomeIcon icon={faBan} />
                            </button>
                        </>
                        )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Нет инвойсов</p> // Message when no invoices
      )}
    </div>
  );
};

export default AdminInvoices;
