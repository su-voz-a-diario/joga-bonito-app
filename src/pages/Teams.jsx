import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Search, User, Phone, Users, ShieldAlert, ChevronDown, ChevronUp, Trophy } from 'lucide-react';

const Teams = () => {
  const { teams, matches, categories, globalCategoryFilter, setGlobalCategoryFilter } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = globalCategoryFilter === 'all' || team.categoryId === globalCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  // Find next match for a team
  const getNextMatch = (teamId) => {
    const upcoming = matches.filter(m => 
      (m.homeTeamId === teamId || m.awayTeamId === teamId) && 
      m.status === 'scheduled'
    );
    if (upcoming.length === 0) return null;
    
    // Sort chronologically and return nearest
    return upcoming.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))[0];
  };

  // Basic statistics aggregator for the team
  const getTeamStatsSummary = (teamId) => {
    const finished = matches.filter(m => 
      (m.homeTeamId === teamId || m.awayTeamId === teamId) && 
      m.status === 'finished'
    );

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let gf = 0;
    let gc = 0;

    finished.forEach(m => {
      const isHome = m.homeTeamId === teamId;
      const teamScore = isHome ? m.homeScore : m.awayScore;
      const oppScore = isHome ? m.awayScore : m.homeScore;

      gf += teamScore;
      gc += oppScore;

      if (teamScore > oppScore) wins += 1;
      else if (teamScore < oppScore) losses += 1;
      else draws += 1;
    });

    return {
      played: finished.length,
      wins,
      draws,
      losses,
      gf,
      gc,
      diff: gf - gc,
      points: wins * 3 + draws * 1
    };
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--primary)', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Equipos Registrados
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Directorio de clubes, capitanes, plantillas oficiales y estadísticas acumuladas.
        </p>
      </div>

      {/* SEARCH BAR & CATEGORY FILTER */}
      <div className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar equipo por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>
        <div style={{ minWidth: '180px' }}>
          <select 
            value={globalCategoryFilter} 
            onChange={(e) => setGlobalCategoryFilter(e.target.value)} 
            className="form-select"
            style={{ height: '100%', minHeight: '38px', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TEAMS GRID */}
      {filteredTeams.length === 0 ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No se encontraron equipos registrados con ese nombre.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTeams.map(team => {
            const isExpanded = expandedTeamId === team.id;
            const stats = getTeamStatsSummary(team.id);
            const nextMatch = getNextMatch(team.id);
            const nextMatchDate = nextMatch ? new Date(nextMatch.dateTime) : null;
            
            // Get opposing team logo/name for next match
            let oppTeam = null;
            if (nextMatch) {
              const oppId = nextMatch.homeTeamId === team.id ? nextMatch.awayTeamId : nextMatch.homeTeamId;
              oppTeam = teams.find(t => t.id === oppId);
            }

            return (
              <div 
                key={team.id} 
                className="glass-panel" 
                style={{ 
                  padding: '16px', 
                  cursor: 'pointer',
                  borderColor: isExpanded ? 'var(--secondary)' : 'var(--border-color)',
                  boxShadow: isExpanded ? '0 4px 20px rgba(16, 185, 129, 0.1)' : 'none'
                }}
                onClick={() => toggleExpand(team.id)}
              >
                
                {/* Compact Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2.2rem' }}>{team.logo}</span>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                        {team.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} /> Capitán: {team.captainName || 'Sin asignar'}
                        </p>
                        <span className="badge" style={{ fontSize: '0.62rem', padding: '1px 6px', opacity: 0.85 }}>
                          {categories.find(c => c.id === team.categoryId)?.name || 'Sin categoría'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: 'var(--primary)' }}>
                      {stats.points} PTS
                    </span>
                    {isExpanded ? <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div 
                    style={{ 
                      marginTop: '16px', 
                      borderTop: '1px solid var(--border-color)', 
                      paddingTop: '16px', 
                      display: 'grid', 
                      gridTemplateColumns: '1fr', 
                      gap: '20px',
                      cursor: 'default'
                    }}
                    onClick={(e) => e.stopPropagation()} // Stop click from closing
                  >
                    <style>{`
                      @media (min-width: 768px) {
                        .expand-grid {
                          grid-template-columns: 1fr 1fr !important;
                        }
                      }
                    `}</style>
                    <div className="expand-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                      
                      {/* Left: Contact & Roster */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        {/* Contact info */}
                        {team.captainPhone && (
                          <div className="glass-panel" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <Phone size={14} style={{ color: 'var(--secondary)' }} />
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Contacto:</span>
                            <a href={`tel:${team.captainPhone}`} style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: '600', textDecoration: 'none' }}>
                              {team.captainPhone}
                            </a>
                          </div>
                        )}

                        {/* Roster */}
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={14} /> Plantilla Oficial ({team.players.length})
                          </h4>
                          
                          {team.players.length === 0 ? (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No hay jugadores inscritos.</p>
                          ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {team.players.map((player, idx) => (
                                <span key={idx} style={{
                                  fontSize: '0.78rem',
                                  backgroundColor: 'rgba(255,255,255,0.05)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  color: 'var(--text-main)'
                                }}>
                                  🏃‍♂️ {player}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Stats & Next Match */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        
                        {/* Statistics Grid */}
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Trophy size={14} /> Estadísticas Acumuladas
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>JJ</div>
                              <div style={{ fontSize: '1rem', fontWeight: '700' }}>{stats.played}</div>
                            </div>
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '6px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.1)' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>JG</div>
                              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--secondary)' }}>{stats.wins}</div>
                            </div>
                            <div style={{ background: 'rgba(251, 191, 36, 0.05)', padding: '6px', borderRadius: '6px', border: '1px solid rgba(251,191,36,0.1)' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>JE</div>
                              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{stats.draws}</div>
                            </div>
                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '6px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.1)' }}>
                              <div style={{ fontSize: '0.7rem', color: '#F87171' }}>JP</div>
                              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#F87171' }}>{stats.losses}</div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', marginTop: '8px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Goles F</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{stats.gf}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Goles C</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{stats.gc}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Dif</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: stats.diff > 0 ? 'var(--secondary)' : stats.diff < 0 ? '#EF4444' : 'inherit' }}>{stats.diff}</div>
                            </div>
                          </div>
                        </div>

                        {/* Next Match */}
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                            Próximo Partido
                          </h4>
                          {nextMatch ? (
                            <div className="glass-panel" style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderColor: 'rgba(37, 99, 235, 0.2)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1.2rem' }}>{oppTeam?.logo || '⚽'}</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: '600' }}>vs {oppTeam?.name}</span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                <div>{nextMatchDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</div>
                                <div>{nextMatchDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</div>
                              </div>
                            </div>
                          ) : (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ShieldAlert size={12} /> Sin partidos programados próximamente.
                            </p>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Teams;
