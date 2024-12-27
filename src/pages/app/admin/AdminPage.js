import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faFileInvoice, faUserTie, faPaintBrush, faImages } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import ItemsMap from './adminItems';
import AdminInvoices from './adminInvoices';
import AdminCreatives from './adminCreatives';
import AdminAdvertisers from './adminAdvertisers';
import AdminImages from './adminImages';


const AdminPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();  

  const handleItemsClick = () => {
    navigate(`/${i18n.language}/admin/items`);
  };

  const handleInvoicesClick = () => {
    navigate(`/${i18n.language}/admin/invoices`);
  };

  const handleAdvertisersClick = () => {
    navigate(`/${i18n.language}/admin/advertisers`);
  };

  const handleCreativesClick = () => {
    navigate(`/${i18n.language}/admin/creatives`);
  };

  const handleImagesClick = () => {
    navigate(`/${i18n.language}/admin/images`);
  };

  return (
    <div className="admin-page">
      {/* Панель меню */}
      <div className="admin-sidebar">
        <ul>
          <li>
            <a 
              onClick={handleItemsClick} 
            >
              <FontAwesomeIcon icon={faGlobe} className="icons" />
              {i18n.t('admin_panel.items')}
            </a>
          </li>
          <li>
            <a 
              onClick={handleInvoicesClick} 
            >
              <FontAwesomeIcon icon={faFileInvoice} className="icons" />
              {i18n.t('admin_panel.invoices')}
            </a>
          </li>
          <li>
            <a 
              onClick={handleAdvertisersClick} 
            >
              <FontAwesomeIcon icon={faUserTie} className="icons" />
              {i18n.t('admin_panel.advertisers')}
            </a>
          </li>
          <li>
            <a 
              onClick={handleCreativesClick} 
            >
              <FontAwesomeIcon icon={faPaintBrush} className="icons" />
              {i18n.t('admin_panel.creatives')}
            </a>
          </li>
          <li>
            <a 
              onClick={handleImagesClick} 
            >
              <FontAwesomeIcon icon={faImages} className="icons" />
              {i18n.t('admin_panel.images')}
            </a>
          </li>
        </ul>
      </div>


      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="/:lang/admin/items" />} />  {/* Переход по умолчанию */}
          <Route path="/items" element={<ItemsMap />} />
          <Route path="/invoices" element={<AdminInvoices />} />
          <Route path="/advertisers" element={<AdminAdvertisers />} />
          <Route path="/creatives" element={<AdminCreatives />} />
          <Route path="/images" element={<AdminImages />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
