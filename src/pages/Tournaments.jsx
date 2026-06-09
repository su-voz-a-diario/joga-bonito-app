import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Trophy, Calendar, Award, CheckCircle, Info } from 'lucide-react';

const Tournaments = ({ setCurrentTab }) => {
  const { tournaments, teams } = useDatabase();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-finished" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)' }}>Activo</span>;
      case 'upcoming':
        return <span className="badge badge-scheduled" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>Inscripciones Abiertas</span>;
      case 'completed':
        return <span className="badge badge-cancelled" style={{ backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#9CA3AF' }}>Finalizado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--primary)', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Torneos y Ligas
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Conoce los torneos activos, formatos de juego y las ligas por iniciar en Joga Bonito.
        </p>
      </div>

      {/* TOURNAMENTS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {tournaments.map(t => {
          // Preloaded mock details for specific tournaments
          const isNocturno = t.id === '1';
          const format = isNocturno ? 'Liga + Liguilla (Top 4)' : 'Fase de Grupos + Eliminación Directa';
          const startDate = isNocturno ? '01 de Mayo, 2026' : '15 de Mayo, 2026';
          
          return (
            <div key={t.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Row 1: Header & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(16, 185, 129, 0.15))',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Trophy size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                      {t.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Categoría: <strong>{t.category}</strong>
                    </span>
                  </div>
                </div>

                {getStatusBadge(t.status)}
              </div>

              {/* Row 2: Details Grid */}
              <style>{`
                @media (min-width: 640px) {
                  .tournament-details-grid {
                    grid-template-columns: repeat(3, 1fr) !important;
                  }
                }
              `}</style>
              <div className="tournament-details-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Formato de Torneo</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>{format}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fecha de Inicio</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} style={{ color: 'var(--secondary)' }} /> {startDate}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Puntuación</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={14} style={{ color: 'var(--primary)' }} /> Victoria: {t.pointsConfig?.win || 3} pts | Empate: {t.pointsConfig?.draw || 1} pts
                  </span>
                </div>
              </div>

              {/* Row 3: Registered Teams list preview */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--secondary)' }} /> Equipos Participantes ({teams.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {teams.map(team => (
                    <span key={team.id} style={{
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      color: 'var(--text-main)'
                    }}>
                      {team.logo} {team.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 4: Call to Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={() => setCurrentTab('standings')}
                  className="btn-primary"
                  style={{ flex: 1, padding: '8px 16px', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <Trophy size={16} /> Ver Tabla de Posiciones
                </button>
                <button
                  onClick={() => setCurrentTab('schedule')}
                  className="btn-outline"
                  style={{ flex: 1, padding: '8px 16px', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  Ver Calendario de Juegos
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* QUICK RULES CORNER */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', backgroundColor: 'rgba(37, 99, 235, 0.04)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
        <Info size={20} style={{ color: 'var(--accent-light)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.9rem', margin: '0 0 4px 0' }}>
            Reglamento General de la Liga
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>Duración de los partidos: 2 tiempos de 25 minutos con 5 minutos de descanso.</li>
            <li>Credenciales obligatorias para todos los jugadores antes de iniciar el partido.</li>
            <li>Tarjetas: Amarilla (castigo de 2 minutos fuera), Azul (expulsión temporal con cambio), Roja (expulsión definitiva sin cambio).</li>
            <li>Las apelaciones o cambios de roles deben ser solicitados por el capitán con al menos 48 horas de anticipación.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Tournaments;
