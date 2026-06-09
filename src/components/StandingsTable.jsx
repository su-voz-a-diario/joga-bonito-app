import React from 'react';

const StandingsTable = ({ standings }) => {
  if (!standings || standings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
        No hay datos suficientes para generar la tabla de posiciones en este momento.
      </div>
    );
  }

  return (
    <div className="table-container animate-fade-in">
      <table className="sports-table">
        <thead>
          <tr>
            <th className="center" style={{ width: '50px' }}>Pos</th>
            <th>Equipo</th>
            <th className="center" title="Juegos Jugados">JJ</th>
            <th className="center hide-mobile" title="Juegos Ganados">JG</th>
            <th className="center hide-mobile" title="Juegos Empatados">JE</th>
            <th className="center hide-mobile" title="Juegos Perdidos">JP</th>
            <th className="center hide-mobile" title="Goles a Favor">GF</th>
            <th className="center hide-mobile" title="Goles en Contra">GC</th>
            <th className="center" title="Diferencia de Goles">DG</th>
            <th className="center" style={{ fontWeight: '700', color: 'var(--primary)' }} title="Puntos Totales">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((stat, index) => {
            const pos = index + 1;
            
            // Dynamic styling for top positions (Zone for Liguilla/Qualifying)
            let rowStyle = {};
            let posBadgeColor = 'var(--text-muted)';
            
            if (pos <= 4) {
              posBadgeColor = 'var(--secondary)'; // Qualify area (green)
            }
            if (pos === 1) {
              posBadgeColor = 'var(--primary)'; // Leader (gold)
            }

            return (
              <tr key={stat.teamId} style={rowStyle}>
                
                {/* Position */}
                <td className="center" style={{ fontWeight: '700' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: pos <= 4 ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                    color: posBadgeColor,
                    border: pos <= 4 ? `1px solid ${posBadgeColor}44` : 'none',
                    fontSize: '0.8rem'
                  }}>
                    {pos}
                  </span>
                </td>
                
                {/* Team Name */}
                <td style={{ fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{stat.teamLogo}</span>
                    <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {stat.teamName}
                    </span>
                  </div>
                </td>
                
                {/* Stats */}
                <td className="center" style={{ fontWeight: '500' }}>{stat.played}</td>
                <td className="center hide-mobile">{stat.won}</td>
                <td className="center hide-mobile">{stat.drawn}</td>
                <td className="center hide-mobile">{stat.lost}</td>
                <td className="center hide-mobile" style={{ color: 'var(--text-muted)' }}>{stat.goalsFor}</td>
                <td className="center hide-mobile" style={{ color: 'var(--text-muted)' }}>{stat.goalsAgainst}</td>
                
                {/* Goal Difference */}
                <td className="center" style={{ 
                  fontWeight: '600', 
                  color: stat.goalDifference > 0 ? 'var(--secondary)' : stat.goalDifference < 0 ? '#F87171' : 'var(--text-muted)'
                }}>
                  {stat.goalDifference > 0 ? `+${stat.goalDifference}` : stat.goalDifference}
                </td>
                
                {/* Points */}
                <td className="center" style={{ 
                  fontWeight: '800', 
                  fontSize: '1rem', 
                  color: 'var(--primary)',
                  backgroundColor: 'rgba(251, 191, 36, 0.05)'
                }}>
                  {stat.points}
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Embedded CSS for responsive column hiding */}
      <style>{`
        @media (max-width: 640px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StandingsTable;
