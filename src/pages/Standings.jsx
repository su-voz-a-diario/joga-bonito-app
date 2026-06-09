import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import StandingsTable from '../components/StandingsTable';
import { Award } from 'lucide-react';

const Standings = () => {
  const { tournaments, getStandings } = useDatabase();
  
  // Set first tournament as active by default if available
  const [activeTournamentId, setActiveTournamentId] = useState(
    tournaments.length > 0 ? tournaments[0].id : ''
  );

  const activeTournament = tournaments.find(t => t.id === activeTournamentId);
  const standings = activeTournamentId ? getStandings(activeTournamentId) : [];

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--primary)', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Tablas de Posiciones
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Sigue el puntaje, diferencia de goles y rendimiento de cada escuadra jornada a jornada.
        </p>
      </div>

      {/* TOURNAMENT TABS */}
      {tournaments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No hay torneos activos para mostrar posiciones.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
            {tournaments.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTournamentId(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTournamentId === t.id ? '2px solid var(--secondary)' : '2px solid transparent',
                  color: activeTournamentId === t.id ? 'var(--secondary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s, border-color 0.2s'
                }}
              >
                {t.name} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '400' }}>({t.category})</span>
              </button>
            ))}
          </div>

          {/* STANDINGS AND CAPTION */}
          {activeTournament && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} style={{ color: 'var(--primary)' }} />
                  Torneo Activo • Formato de Puntos: Victoria (+{activeTournament.pointsConfig?.win || 3} pts), Empate (+{activeTournament.pointsConfig?.draw || 1} pts).
                </span>
              </div>

              {/* Table */}
              <StandingsTable standings={standings} />

              {/* Legend */}
              <div className="glass-panel" style={{ padding: '12px 16px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Clasificación:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    <span>1° Lugar (Líder General)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></span>
                    <span>2° al 4° Lugar (Zona de Liguilla Directa)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid var(--text-muted)' }}></span>
                    <span>5° Lugar en adelante (Fase Regular)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Standings;
