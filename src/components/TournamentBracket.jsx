import React from 'react';

const TournamentBracket = () => {
  // Let's create a beautiful static-dynamic structure for the Play-offs (Liguilla)
  // This will represent the Semifinal and Final matches of the Torneo Nocturno Azteca
  
  const bracketData = {
    semifinals: [
      {
        id: 'sf1',
        team1: { name: 'Joga Bonito FC', logo: '🇧🇷', score: 5 },
        team2: { name: 'Samba Kings', logo: '🥁', score: 3 },
        status: 'finished',
        date: '08 Jun, 20:00 Cancha 1'
      },
      {
        id: 'sf2',
        team1: { name: 'Real Azteca', logo: '👑', score: 4 },
        team2: { name: 'Atlético Cuautepec', logo: '⚽', score: 2 },
        status: 'finished',
        date: '08 Jun, 21:00 Cancha 1'
      }
    ],
    final: {
      team1: { name: 'Joga Bonito FC', logo: '🇧🇷', score: null },
      team2: { name: 'Real Azteca', logo: '👑', score: null },
      status: 'scheduled',
      date: '12 Jun, 21:00 Cancha 1'
    },
    champion: {
      name: 'Por Definirse',
      logo: '🏆'
    }
  };

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: '24px', overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          Fase Final / Liguilla
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
          Camino a la Gloria - Torneo Nocturno Azteca 2026
        </p>
      </div>

      <div className="bracket-wrapper" style={{ display: 'flex', gap: '32px', minWidth: '700px', justifyContent: 'center', alignItems: 'center', padding: '10px 0' }}>
        
        {/* SEMIFINALS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', textAlign: 'center' }}>
            Semifinales (Vuelta)
          </div>
          
          {bracketData.semifinals.map((match) => (
            <div key={match.id} className="bracket-match" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              
              {/* Team 1 */}
              <div className={`bracket-team ${match.team1.score > match.team2.score ? 'winner' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{match.team1.logo}</span>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{match.team1.name}</span>
                </div>
                <span className="bracket-score">{match.team1.score}</span>
              </div>
              
              {/* Team 2 */}
              <div className={`bracket-team ${match.team2.score > match.team1.score ? 'winner' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{match.team2.logo}</span>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{match.team2.name}</span>
                </div>
                <span className="bracket-score">{match.team2.score}</span>
              </div>
              
              {/* Match details */}
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px', textAlign: 'right' }}>
                {match.date}
              </div>
            </div>
          ))}
        </div>

        {/* CONNECTING LINES - SIMULATED WITH MARGIN / SPACING */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', color: 'var(--primary)', fontSize: '1.2rem' }}>
          <span>➔</span>
          <br /><br /><br />
          <span>➔</span>
        </div>

        {/* FINAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', textAlign: 'center' }}>
            Gran Final Azteca
          </div>
          
          <div className="bracket-match" style={{ 
            borderColor: 'var(--primary)', 
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.15)',
            backgroundColor: 'rgba(251, 191, 36, 0.04)'
          }}>
            {/* Team 1 */}
            <div className="bracket-team">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{bracketData.final.team1.logo}</span>
                <span style={{ fontWeight: '600' }}>{bracketData.final.team1.name}</span>
              </div>
              <span className="bracket-score" style={{ color: 'var(--primary)' }}>
                {bracketData.final.team1.score !== null ? bracketData.final.team1.score : '-'}
              </span>
            </div>
            
            {/* Team 2 */}
            <div className="bracket-team">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{bracketData.final.team2.logo}</span>
                <span style={{ fontWeight: '600' }}>{bracketData.final.team2.name}</span>
              </div>
              <span className="bracket-score" style={{ color: 'var(--primary)' }}>
                {bracketData.final.team2.score !== null ? bracketData.final.team2.score : '-'}
              </span>
            </div>
            
            {/* Final date */}
            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', borderTop: '1px solid rgba(251, 191, 36, 0.1)', paddingTop: '6px', textAlign: 'center', fontWeight: '600' }}>
              🌟 {bracketData.final.date} 🌟
            </div>
          </div>
        </div>

        {/* CONNECTING LINE */}
        <div style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
          ➔
        </div>

        {/* CHAMPION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 0.8, alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', width: '100%', textAlign: 'center' }}>
            Campeón
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(16, 185, 129, 0.1))',
            border: '2px dashed var(--primary)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            width: '100%',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(251, 191, 36, 0.05)'
          }}>
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.5))' }}>🏆</span>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {bracketData.champion.name}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Espera el silbatazo final
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentBracket;
