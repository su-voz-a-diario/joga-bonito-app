import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Shield, User, Eye, LogOut } from 'lucide-react';

const Header = ({ currentTab, setCurrentTab }) => {
  const { currentRole, setCurrentRole, handleLogout } = useDatabase();

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'admin':
        return (
          <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
            <Shield size={12} style={{ marginRight: '4px' }} /> Administrador
          </span>
        );
      case 'auxiliar':
        return (
          <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <User size={12} style={{ marginRight: '4px' }} /> Auxiliar
          </span>
        );
      default:
        return (
          <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <Eye size={12} style={{ marginRight: '4px' }} /> Público
          </span>
        );
    }
  };

  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        
        {/* Logos & Names */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '1.8rem',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            letterSpacing: '-0.03em'
          }}>
            ⚽ JOGA BONITO
          </div>
          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <div>
            <h1 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.02em', textTransform: 'uppercase', margin: 0 }}>
              Liga Azteca Cuautepec
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>
              Fútbol Rápido de Alto Rendimiento
            </p>
          </div>
        </div>

        {/* Role switcher for ease of testing MVP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {getRoleBadge()}
            
            {/* Quick selector dropdown */}
            <select
              value={currentRole}
              onChange={(e) => {
                const newRole = e.target.value;
                setCurrentRole(newRole);
                if (setCurrentTab) {
                  if (newRole === 'admin' || newRole === 'auxiliar') {
                    setCurrentTab('admin');
                  } else {
                    setCurrentTab('home');
                  }
                }
              }}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                padding: '4px 8px',
                outline: 'none',
                cursor: 'pointer'
              }}
              title="Simular Rol del Usuario"
            >
              <option value="public">Simular Público</option>
              <option value="auxiliar">Simular Auxiliar</option>
              <option value="admin">Simular Admin</option>
            </select>

            {currentRole !== 'public' && (
              <button 
                onClick={() => {
                  handleLogout();
                  if (setCurrentTab) setCurrentTab('home');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
