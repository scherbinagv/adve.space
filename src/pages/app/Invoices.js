import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InvoiceInfo from './InvoiceInfo';
import config from '../../config'; 

const Invoices = () => {
  const [invoices, setInvoices] = useState({ pending: [], paid: [] });
  const [popupData, setPopupData] = useState(null);
  const { t, i18n } = useTranslation();
  

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${config.api}/invoices/`, {
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

    fetchInvoices();
  }, []);

  const handleRowClick = (invoiceId) => {
    setPopupData({ id: invoiceId }); // Передаем только ID инвойса
    console.log(popupData)
  };

  const closePopup = () => {
    setPopupData(null);
  };

  // return (
  //   <div className="invoices-container">
  //     {/* Попап */}
  //     {popupData && (
  //         <InvoiceInfo
  //             invoiceId={popupData.id}                        
  //             onClose={() => setPopupData(null)}
  //         />
  //     )}

  //       {(invoices.pending.length + invoices.paid.length) > 0 ? (
  //         <div className="section">
  //         <>
  //           {/* Pending invoices */}
  //           {invoices.pending.length > 0 && (
  //             <div>
  //               <h2>Ожидают оплаты</h2>
  //               <table className="invoice-table">
  //                 <thead>
  //                   <tr>
  //                     <th>№ Инвойса</th>
  //                     <th>Дата Инвойса</th>
  //                     <th>Услуги</th>
  //                     <th>Общая сумма</th>
  //                     <th>Дата оплаты</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {invoices.pending.map((invoice, index) => (
  //                     <tr key={index} onClick={() => handleRowClick(invoice.id)}>
  //                       <td>{invoice.invoice_number}</td>
  //                       <td>{invoice.invoice_date}</td>
  //                       <td>{invoice.items.map((item) => item.description).join(', ')}</td>
  //                       <td>{invoice.final_amount} {invoice.currency}</td>
  //                       <td>{invoice.due_date}</td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //           {/* Paid invoices */}
  //           {invoices.paid.length > 0 && (
  //             <div>
  //               <h2>Оплаченные инвойсы</h2>
  //               <table className="invoice-table">
  //                 <thead>
  //                   <tr>
  //                     <th>№ Инвойса</th>
  //                     <th>Дата Инвойса</th>
  //                     <th>Услуги</th>
  //                     <th>Общая сумма</th>
  //                     <th>Дата оплаты</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {invoices.paid.map((invoice, index) => (
  //                     <tr key={index} onClick={() => handleRowClick(invoice.id)}>
  //                       <td>{invoice.invoice_number}</td>
  //                       <td>{invoice.invoice_date}</td>
  //                       <td>{invoice.items.map((item) => item.description).join(', ')}</td>
  //                       <td>{invoice.final_amount} {invoice.currency}</td>
  //                       <td>{invoice.due_date}</td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </>
  //       </div>
  //       ) : (
  //         <p>Нет инвойсов</p> // Message when no invoices (pending or paid)
          
  //       )}

  //   </div>
  // );

  return (
    <div className="invoices-container">
      {/* Попап */}
      {popupData && (
        <InvoiceInfo
          invoiceId={popupData.id}
          onClose={() => setPopupData(null)}
        />
      )}
  
      {(invoices.pending.length + invoices.paid.length) > 0 ? (
        <div className="section">
          <>
            {/* Pending invoices */}
            {invoices.pending.length > 0 && (
              <div>
                <h2>{t('invoices.pending_title')}</h2>
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>{t('invoices.invoice_number')}</th>
                      <th>{t('invoices.invoice_date')}</th>
                      <th>{t('invoices.services')}</th>
                      <th>{t('invoices.total_amount')}</th>
                      <th>{t('invoices.due_date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.pending.map((invoice, index) => (
                      <tr key={index} onClick={() => handleRowClick(invoice.id)}>
                        <td>{invoice.invoice_number}</td>
                        <td>{invoice.invoice_date}</td>
                        <td>{invoice.items.map((item) => item.description).join(', ')}</td>
                        <td>{invoice.final_amount} {invoice.currency}</td>
                        <td>{invoice.due_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Paid invoices */}
            {invoices.paid.length > 0 && (
              <div>
                <h2>{t('invoices.paid_title')}</h2>
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>{t('invoices.invoice_number')}</th>
                      <th>{t('invoices.invoice_date')}</th>
                      <th>{t('invoices.services')}</th>
                      <th>{t('invoices.total_amount')}</th>
                      <th>{t('invoices.due_date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.paid.map((invoice, index) => (
                      <tr key={index} onClick={() => handleRowClick(invoice.id)}>
                        <td>{invoice.invoice_number}</td>
                        <td>{invoice.invoice_date}</td>
                        <td>{invoice.items.map((item) => item.description).join(', ')}</td>
                        <td>{invoice.final_amount} {invoice.currency}</td>
                        <td>{invoice.due_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        </div>
      ) : (
        <p>{t('invoices.no_invoices')}</p> // Message when no invoices (pending or paid)
      )}
    </div>
  );  
};

export default Invoices;
