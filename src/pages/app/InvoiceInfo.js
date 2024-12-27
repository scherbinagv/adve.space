import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import config from '../../config'; 


function InvoiceInfo({ invoiceId, onClose }) {
  const [invoiceData, setInvoiceData] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get(`${config.api}/invoice/${invoiceId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`,
          }
        });
        setInvoiceData(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных инвойса:', error);
      }
    };

    fetchInvoiceData();
  }, [invoiceId]);

  if (!invoiceData) {
    return <p>Загрузка данных инвойса...</p>;
  }

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-content">
          <div className="invoice">
            <h3>{t("invoice.title")}</h3>
  
            <div className="invoice-details">
              <p><strong>{t("invoice.recipient")}:</strong> {invoiceData.recipient}</p>
              <p><strong>{t("invoice.invoice_number")}:</strong> {invoiceData.invoice_number}</p>
              <p><strong>{t("invoice.invoice_date")}:</strong> {invoiceData.invoice_date}</p>
              <p><strong>{t("invoice.due_date")}:</strong> {invoiceData.due_date}</p>
              <p><strong>{t("invoice.bank")}:</strong> {invoiceData.bank}</p>
              <p><strong>{t("invoice.account_details")}:</strong> {invoiceData.account_details}</p>
            </div>
  
            <table className="services-table">
              <thead>
                <tr>
                  <th>{t("invoice.service")}</th>
                  <th>{t("invoice.price")}</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((service, index) => (
                  <tr key={index}>
                    <td>{service.description}</td>
                    <td>{service.price} {service.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
  
            <div className="total">
              <p><strong>{t("invoice.total_amount")}: </strong>{invoiceData.final_amount} {invoiceData.currency}</p>
              {invoiceData.status_id === 1 && (
                <button className="payment-button">{t("invoice.pay_button")}</button>
              )}
            </div>
  
            <p className="comment">{t("invoice.comment")}</p>
          </div>
        </div>
        <div className="popup-footer">
          <button onClick={onClose} className="popup-close-button">
            {t("invoice.close_button")}
          </button>
        </div>
      </div>
    </div>
  );  
}

export default InvoiceInfo;
