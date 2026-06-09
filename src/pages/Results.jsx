import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import MatchCard from '../components/MatchCard';
import { Search, Calendar, MapPin, Trophy, EyeOff } from 'lucide-react';

const Results = ({ setCurrentTab, setSelectedEditMatch }) => {
  const { matches, tournaments, fields } = useDatabase();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedTournament, setSelectedTournament] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Finished matches only
  const finishedMatches = matches.filter(m => m.status === 'finished');
  
  // Unique dates from finished matches
  const uniqueDates = [...new Set(finishedMatches.map(m => m.dateTime.split('T')[0]))].sort().reverse(); // Show newest first

  const filteredMatches = finishedMatches.filter(match => {
    // 1. Search by team name
    const { teams } = useDatabase();
    const homeTeam = teams.find(t => t.id === match.homeTeamId)?.name.toLowerCase() || '';
    const awayTeam = teams.find(t => t.id === match.awayTeamId)?.name.toLowerCase() || '';
    const query = searchTerm.toLowerCase();
    const matchesSearch = homeTeam.includes(query) || awayTeam.includes(query);

    // 2. Filter by field
    const matchesField = selectedField === 'all' || match.fieldId === selectedField;

    // 3. Filter by tournament
    const matchesTournament = selectedTournament === 'all' || match.tournamentId === selectedTournament;

    // 4. Filter by date
    const matchesDate = !selectedDate || match.dateTime.startsWith(selectedDate);

    return matchesSearch && matchesField && matchesTournament && matchesDate;
  }).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)); // Sort newest results first

  const handleEditRedirect = (match) => {
    setSelectedEditMatch(match);
    setCurrentTab('admin');
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--secondary)', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Resultados de Partidos
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Historial de marcadores, estadísticas y detalles de los encuentros finalizados.
        </p>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Filters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          <style>{`
            @media (min-width: 640px) {
              .filters-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
          `}</style>
          <div className="filters-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            
            {/* Tournament Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}><Trophy size={12} /> Torneo</label>
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="all">Todos los Torneos</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Field Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}><MapPin size={12} /> Cancha</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="all">Todas las Canchas</option>
                {fields.map(f => (
                  <option key={f.id} value={f.id}>{f.name.split(' - ')[0]}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}><Calendar size={12} /> Fecha</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="">Cualquier Fecha</option>
                {uniqueDates.map(date => {
                  const dateObj = new Date(date + 'T00:00:00');
                  const formatted = dateObj.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
                  return (
                    <option key={date} value={date}>{formatted}</option>
                  );
                })}
              </select>
            </div>

          </div>
        </div>

      </div>

      {/* RESULTS LIST */}
      {filteredMatches.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <EyeOff size={40} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No hay resultados registrados que coincidan con los filtros seleccionados.
          </span>
          <button 
            className="btn-outline" 
            onClick={() => { setSearchTerm(''); setSelectedField('all'); setSelectedTournament('all'); setSelectedDate(''); }}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} onEditClick={handleEditRedirect} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Results;
