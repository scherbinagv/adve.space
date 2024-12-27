import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut,faCog,faMapMarker, faDollarSign, faFileInvoice, faUser, faGlobe } from '@fortawesome/free-solid-svg-icons';




function UserMenu({ username, handleLogoutClick }) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate(); 
  const permissions = localStorage.getItem('permissions') || [];

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleAppClick = () => {
    navigate('/' + i18n.language + '/app'); 
    setMenuOpen(false);
  };

  const handleTariffsClick = () => {
    navigate('/' + i18n.language + '/tariffs'); 
    setMenuOpen(false);
  };

  const handleInvoicesClick = () => {
    navigate('/' + i18n.language + '/invoices'); 
    setMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/' + i18n.language + '/settings'); 
    setMenuOpen(false);
  };

  const handleAdminPanelClick = () => {
    navigate('/' + i18n.language + '/admin/'); 
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef}> 
      <button className="auth-button" onClick={toggleMenu}> <FontAwesomeIcon icon={faUser} className="icons" />
       {username} 
        <span className="dropdown-icon">▼</span>
      </button>
      
      {menuOpen && (
        <div className="username-menu">
          <ul>
            <li>
              <a onClick={handleAppClick}><FontAwesomeIcon icon={faMapMarker} className="icons"/>{i18n.t('user_menu.application')}</a>
            </li>
            <li>
              <a onClick={handleTariffsClick}><FontAwesomeIcon icon={faDollarSign} className="icons"/>{i18n.t('user_menu.tariffs')}</a>
            </li>
            <li>
              <a onClick={handleInvoicesClick}><FontAwesomeIcon icon={faFileInvoice} className="icons"/>{i18n.t('user_menu.invoices')}</a>
            </li>
            <li>
              <a onClick={handleSettingsClick}><FontAwesomeIcon icon={faCog} className="icons"/>{i18n.t('user_menu.settings')}</a>
            </li>
            {permissions.includes('admin') && ( // Показываем пункт меню только для администраторов
              <li>
                <a onClick={handleAdminPanelClick}>
                  <FontAwesomeIcon icon={faGlobe} className="icons"/>
                  {i18n.t('user_menu.admin')}
                </a>
              </li>
            )}
            <li>
              <a onClick={handleLogoutClick}><FontAwesomeIcon icon={faSignOut} className="icons"/>{i18n.t('user_menu.logout')}</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
