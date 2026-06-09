import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Home, Calendar, Trophy, ListOrdered, Flame, Users, BookOpen, Clock, MapPin, Settings } from 'lucide-react';

const Navigation = ({ currentTab, setCurrentTab }) => {
  const { currentRole } = useDatabase();
  const isAdminOrAux = currentRole === 'admin' || currentRole === 'auxiliar';

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'schedule', label: 'Rol', icon: Calendar },
    { id: 'results', label: 'Resultados', icon: Trophy },
    { id: 'standings', label: 'Tablas', icon: ListOrdered },
    { id: 'finals', label: 'Liguilla', icon: Flame },
    { id: 'teams', label: 'Equipos', icon: Users },
    { id: 'tournaments', label: 'Torneos', icon: BookOpen },
    { id: 'reservations', label: 'Reservar', icon: Clock },
    { id: 'contact', label: 'Contacto', icon: MapPin },
  ];


  // If Admin or Auxiliar, display Admin tab
  const allItems = isAdminOrAux 
    ? [...menuItems, { id: 'admin', label: 'Panel Admin', icon: Settings }]
    : menuItems;

  return (
    <>
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-nav">
        {/* We only display the 5 main navigation items on mobile to avoid overcrowding */}
        {menuItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        {/* Reservation Tab */}
        <button
          className={`mobile-nav-item ${currentTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setCurrentTab('reservations')}
        >
          <Clock size={20} />
          <span>Reservas</span>
        </button>

        {/* More/Admin Tab for mobile */}
        {isAdminOrAux ? (
          <button
            className={`mobile-nav-item ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentTab('admin')}
          >
            <Settings size={20} />
            <span>Admin</span>
          </button>
        ) : (
          <button
            className={`mobile-nav-item ${currentTab === 'contact' ? 'active' : ''}`}
            onClick={() => setCurrentTab('contact')}
          >
            <MapPin size={20} />
            <span>Contacto</span>
          </button>
        )}
      </nav>

      {/* DESKTOP HEADER NAVIGATION */}
      <nav className="glass-panel" style={{
        display: 'none',
        borderRadius: '0',
        borderLeft: 'none',
        borderRight: 'none',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        padding: '0 16px',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 99
      }}>
        <div className="container" style={{ display: 'flex', gap: '8px' }}>
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  padding: '16px 12px',
                  transition: 'color 0.2s, border-color 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Adding desktop nav visibility in media query */}
      <style>{`
        @media (min-width: 768px) {
          nav.glass-panel {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;
