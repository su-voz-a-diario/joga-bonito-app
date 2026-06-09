import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { 
  Settings, Shield, Plus, Edit2, Check, X, Trash2, 
  Calendar, Users, Trophy, Bell, CreditCard, Award, Play, Tag 
} from 'lucide-react';

const AdminPanel = ({ selectedEditMatch, setSelectedEditMatch }) => {
  const {
    currentRole,
    teams,
    tournaments,
    matches,
    reservations,
    announcements,
    fields,
    handleLogin,
    handleLogout,
    
    // Categories
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    
    // CRUD Operations
    addMatch,
    updateMatch,
    deleteMatch,
    addTeam,
    updateTeam,
    deleteTeam,
    addTournament,
    updateTournament,
    deleteTournament,
    updateReservation,
    deleteReservation,
    addAnnouncement,
    deleteAnnouncement
  } = useDatabase();

  // Simulated Login Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Sub-tab
  const [activeSubTab, setActiveSubTab] = useState('matches'); // matches, results, teams, tournaments, reservations, announcements, categories

  // MATCH FORM STATES
  const [matchId, setMatchId] = useState('');
  const [matchTournament, setMatchTournament] = useState('');
  const [matchField, setMatchField] = useState('1');
  const [matchDateTime, setMatchDateTime] = useState('');
  const [matchHomeTeam, setMatchHomeTeam] = useState('');
  const [matchAwayTeam, setMatchAwayTeam] = useState('');
  const [matchStatus, setMatchStatus] = useState('scheduled');
  const [matchComments, setMatchComments] = useState('');
  const [matchCategoryId, setMatchCategoryId] = useState('');
  const [matchError, setMatchError] = useState('');
  const [matchSuccess, setMatchSuccess] = useState('');

  // RESULTS FORM STATES
  const [selectedResultMatchId, setSelectedResultMatchId] = useState('');
  const [resultHomeScore, setResultHomeScore] = useState('');
  const [resultAwayScore, setResultAwayScore] = useState('');
  const [resultComments, setResultComments] = useState('');
  const [resultSuccess, setResultSuccess] = useState('');
  const [resultError, setResultError] = useState('');

  // TEAM FORM STATES
  const [teamId, setTeamId] = useState(''); // Empty means create, filled means edit
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('⚽');
  const [teamCaptain, setTeamCaptain] = useState('');
  const [teamPhone, setTeamPhone] = useState('');
  const [teamPlayersStr, setTeamPlayersStr] = useState('');
  const [teamSuccess, setTeamSuccess] = useState('');
  const [teamError, setTeamError] = useState('');

  // TOURNAMENT FORM STATES
  const [tourId, setTourId] = useState(''); // Empty means create, filled means edit
  const [tourName, setTourName] = useState('');
  const [tourCatId, setTourCatId] = useState('');
  const [tourStatus, setTourStatus] = useState('active');
  const [tourSuccess, setTourSuccess] = useState('');
  const [tourError, setTourError] = useState('');

  // CATEGORY FORM STATES
  const [catId, setCatId] = useState(''); // Empty means create, filled means edit
  const [catName, setCatName] = useState('');
  const [catSuccess, setCatSuccess] = useState('');
  const [catError, setCatError] = useState('');

  // ANNOUNCEMENT FORM STATES
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annImportant, setAnnImportant] = useState(false);
  const [annSuccess, setAnnSuccess] = useState('');

  // Load selected edit match if redirected from Schedule/Results
  useEffect(() => {
    if (selectedEditMatch) {
      setActiveSubTab('matches');
      setMatchId(selectedEditMatch.id);
      setMatchTournament(selectedEditMatch.tournamentId);
      setMatchField(selectedEditMatch.fieldId);
      setMatchDateTime(selectedEditMatch.dateTime);
      setMatchHomeTeam(selectedEditMatch.homeTeamId);
      setMatchAwayTeam(selectedEditMatch.awayTeamId);
      setMatchStatus(selectedEditMatch.status);
      setMatchComments(selectedEditMatch.comments || '');
      setMatchCategoryId(selectedEditMatch.categoryId || '');
      setMatchSuccess('');
      setMatchError('');
      
      // Focus scroll or view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedEditMatch]);

  // Set default form values once data loads
  useEffect(() => {
    if (tournaments.length > 0 && !matchTournament) {
      setMatchTournament(tournaments[0].id);
    }
    if (teams.length >= 2) {
      if (!matchHomeTeam) setMatchHomeTeam(teams[0].id);
      if (!matchAwayTeam) setMatchAwayTeam(teams[1].id);
    }
    if (categories.length > 0 && !tourCatId) {
      setTourCatId(categories[0].id);
    }
  }, [tournaments, teams, categories]);

  // Inherit category from tournament automatically when tournament changes (only when creating a new match)
  useEffect(() => {
    if (matchTournament && !matchId) {
      const selectedTour = tournaments.find(t => t.id === matchTournament);
      if (selectedTour) {
        setMatchCategoryId(selectedTour.categoryId || '');
      }
    }
  }, [matchTournament, tournaments, matchId]);

  // Handle Login Form Submit
  const handleFormLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = handleLogin(username, password);
    if (!res.success) {
      setLoginError(res.error);
    }
  };

  // Handle Match Submit (Add or Edit Details)
  const handleMatchSubmit = (e) => {
    e.preventDefault();
    setMatchError('');
    setMatchSuccess('');

    if (matchHomeTeam === matchAwayTeam) {
      setMatchError('El equipo local y el equipo visitante no pueden ser el mismo.');
      return;
    }

    const resolvedCategoryId = matchCategoryId || tournaments.find(t => t.id === matchTournament)?.categoryId || '';

    const payload = {
      tournamentId: matchTournament,
      fieldId: matchField,
      dateTime: matchDateTime,
      homeTeamId: matchHomeTeam,
      awayTeamId: matchAwayTeam,
      status: matchStatus,
      comments: matchComments,
      categoryId: resolvedCategoryId
    };

    if (matchId) {
      // EDIT MODE
      const res = updateMatch(matchId, payload);
      if (res.success) {
        setMatchSuccess('Partido actualizado exitosamente.');
        handleResetMatchForm();
      } else {
        setMatchError(res.error);
      }
    } else {
      // CREATE MODE
      const res = addMatch(payload);
      if (res.success) {
        setMatchSuccess('Partido programado exitosamente.');
        handleResetMatchForm();
      } else {
        setMatchError(res.error);
      }
    }
  };

  const handleResetMatchForm = () => {
    setMatchId('');
    setSelectedEditMatch(null);
    setMatchComments('');
    setMatchStatus('scheduled');
    setMatchCategoryId('');
  };

  // Handle Results Form Submit (Score Capture)
  const handleResultSubmit = (e) => {
    e.preventDefault();
    setResultError('');
    setResultSuccess('');

    if (resultHomeScore === '' || resultAwayScore === '') {
      setResultError('Por favor introduce los goles de ambos equipos.');
      return;
    }

    const payload = {
      homeScore: Number(resultHomeScore),
      awayScore: Number(resultAwayScore),
      status: 'finished',
      comments: resultComments || 'Partido finalizado.'
    };

    const res = updateMatch(selectedResultMatchId, payload);
    if (res.success) {
      setResultSuccess('Resultado oficial guardado. La tabla de posiciones se ha actualizado.');
      setSelectedResultMatchId('');
      setResultHomeScore('');
      setResultAwayScore('');
      setResultComments('');
    } else {
      setResultError(res.error || 'Error al guardar el marcador.');
    }
  };

  // Handle Team Create / Edit
  const handleTeamSubmit = (e) => {
    e.preventDefault();
    setTeamSuccess('');
    setTeamError('');

    const playerList = teamPlayersStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const payload = {
      name: teamName,
      logo: teamLogo,
      captainName: teamCaptain,
      captainPhone: teamPhone,
      players: playerList
    };

    if (teamId) {
      // Update Mode
      const res = updateTeam(teamId, payload);
      if (res.success) {
        setTeamSuccess('Equipo actualizado exitosamente.');
        handleResetTeamForm();
      } else {
        setTeamError(res.error || 'Error al actualizar equipo.');
      }
    } else {
      // Create Mode
      const res = addTeam(payload);
      if (res.success) {
        setTeamSuccess('Equipo registrado exitosamente.');
        handleResetTeamForm();
      } else {
        setTeamError(res.error || 'Error al registrar equipo.');
      }
    }
  };

  const handleResetTeamForm = () => {
    setTeamId('');
    setTeamName('');
    setTeamCaptain('');
    setTeamPhone('');
    setTeamPlayersStr('');
    setTeamLogo('⚽');
  };

  const handleLoadEditTeam = (team) => {
    setTeamId(team.id);
    setTeamName(team.name);
    setTeamLogo(team.logo);
    setTeamCaptain(team.captainName || '');
    setTeamPhone(team.captainPhone || '');
    setTeamPlayersStr(team.players ? team.players.join(', ') : '');
    setTeamSuccess('');
    setTeamError('');
  };

  // Handle Tournament Create / Edit
  const handleTournamentSubmit = (e) => {
    e.preventDefault();
    setTourSuccess('');
    setTourError('');

    const selectedCategoryObj = categories.find(c => c.id === tourCatId);
    const payload = {
      name: tourName,
      categoryId: tourCatId,
      category: selectedCategoryObj ? selectedCategoryObj.name : '',
      status: tourStatus
    };

    if (tourId) {
      // Update
      const res = updateTournament(tourId, payload);
      if (res.success) {
        setTourSuccess('Torneo actualizado exitosamente.');
        handleResetTourForm();
      } else {
        setTourError(res.error || 'Error al actualizar el torneo.');
      }
    } else {
      // Create
      const res = addTournament(payload);
      if (res.success) {
        setTourSuccess('Torneo creado exitosamente.');
        handleResetTourForm();
      } else {
        setTourError(res.error || 'Error al crear el torneo.');
      }
    }
  };

  const handleResetTourForm = () => {
    setTourId('');
    setTourName('');
    setTourCatId(categories.length > 0 ? categories[0].id : '');
    setTourStatus('active');
  };

  const handleLoadEditTour = (tour) => {
    setTourId(tour.id);
    setTourName(tour.name);
    setTourCatId(tour.categoryId || (categories.find(c => c.name === tour.category)?.id || ''));
    setTourStatus(tour.status || 'active');
    setTourSuccess('');
    setTourError('');
  };

  // Handle Category Create / Edit
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    setCatSuccess('');
    setCatError('');

    if (!catName.trim()) {
      setCatError('El nombre de la categoría es requerido.');
      return;
    }

    const payload = {
      name: catName.trim()
    };

    if (catId) {
      // Update
      const res = updateCategory(catId, payload);
      if (res.success) {
        setCatSuccess('Categoría actualizada exitosamente.');
        handleResetCatForm();
      } else {
        setCatError(res.error || 'Error al actualizar la categoría.');
      }
    } else {
      // Create
      const res = addCategory(payload);
      if (res.success) {
        setCatSuccess('Categoría creada exitosamente.');
        handleResetCatForm();
      } else {
        setCatError(res.error || 'Error al crear la categoría.');
      }
    }
  };

  const handleResetCatForm = () => {
    setCatId('');
    setCatName('');
  };

  const handleLoadEditCat = (cat) => {
    setCatId(cat.id);
    setCatName(cat.name);
    setCatSuccess('');
    setCatError('');
  };

  // Handle Announcement Create
  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    setAnnSuccess('');

    const payload = {
      title: annTitle,
      content: annContent,
      isImportant: annImportant
    };

    const res = addAnnouncement(payload);
    if (res.success) {
      setAnnSuccess('Aviso publicado exitosamente.');
      setAnnTitle('');
      setAnnContent('');
      setAnnImportant(false);
    }
  };

  // Render Login page if user is not Admin or Auxiliar
  if (currentRole === 'public') {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <form onSubmit={handleFormLogin} className="glass-panel" style={{ padding: '24px', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
            <Shield size={36} style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.3))' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
              Acceso Administrativo
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Solo personal autorizado de Joga Bonito Fut 7.
            </p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="admin o auxiliar"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Contraseña demo"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
            Iniciar Sesión
          </button>

          <div className="glass-panel" style={{ padding: '10px', fontSize: '0.72rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
            <strong>Credenciales Demo para Pruebas:</strong>
            <div style={{ marginTop: '4px' }}>Admin: <code>admin</code> / <code>admin123</code></div>
            <div>Auxiliar: <code>auxiliar</code> / <code>aux123</code></div>
            <div style={{ marginTop: '6px', color: 'var(--primary)' }}>
              (O usa el selector de rol en la cabecera)
            </div>
          </div>

        </form>
      </div>
    );
  }

  // Active sub-tabs configurations
  const allSubTabs = [
    { id: 'matches', label: 'Partidos / Rol', icon: Calendar },
    { id: 'results', label: 'Resultados', icon: Award },
    { id: 'reservations', label: 'Reservaciones', icon: CreditCard },
    { id: 'teams', label: 'Equipos', icon: Users },
    { id: 'tournaments', label: 'Torneos', icon: Trophy },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'announcements', label: 'Avisos', icon: Bell }
  ];

  const subTabs = currentRole === 'auxiliar'
    ? allSubTabs.filter(tab => tab.id !== 'announcements')
    : allSubTabs;

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--secondary)', paddingLeft: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={22} /> Panel de Control
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Administra ligas, horarios de canchas, capturación de marcadores y solicitudes de reserva.
          </p>
        </div>
        <button onClick={handleLogout} className="btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          Cerrar Sesión
        </button>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { 
                setActiveSubTab(tab.id); 
                handleResetMatchForm();
                handleResetTeamForm();
                handleResetTourForm();
                handleResetCatForm();
                setSelectedResultMatchId('');
              }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '10px 16px',
                fontWeight: '600',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s, border-color 0.2s'
              }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB CONTENTS */}
      <div style={{ minHeight: '300px' }}>
        
        {/* TAB 1: MATCHES / ROL (ADD & EDIT DETAILS) */}
        {activeSubTab === 'matches' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <style>{`
              @media (min-width: 1024px) {
                .matches-admin-layout {
                  grid-template-columns: 1.1fr 1fr !important;
                }
              }
            `}</style>
            <div className="matches-admin-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Add/Edit Form */}
              <form onSubmit={handleMatchSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  {matchId ? '✏️ Editar Detalles de Partido' : '➕ Programar Nuevo Partido'}
                </h3>
                
                {matchSuccess && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {matchSuccess}
                  </div>
                )}
                {matchError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {matchError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Torneo</label>
                  <select value={matchTournament} onChange={(e) => setMatchTournament(e.target.value)} className="form-select" required>
                    {tournaments.map(t => {
                      const cat = categories.find(c => c.id === t.categoryId)?.name || t.category || '';
                      return (
                        <option key={t.id} value={t.id}>
                          {t.name} {cat ? `(${cat})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría del Partido</label>
                  <select value={matchCategoryId} onChange={(e) => setMatchCategoryId(e.target.value)} className="form-select" required>
                    <option value="">-- Seleccionar Categoría --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Por defecto toma la categoría del torneo seleccionado.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Cancha</label>
                    <select value={matchField} onChange={(e) => setMatchField(e.target.value)} className="form-select" required>
                      {fields.map(f => <option key={f.id} value={f.id}>{f.name.split(' - ')[0]}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha y Hora</label>
                    <input type="datetime-local" value={matchDateTime} onChange={(e) => setMatchDateTime(e.target.value)} className="form-input" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Equipo Local</label>
                    <select value={matchHomeTeam} onChange={(e) => setMatchHomeTeam(e.target.value)} className="form-select" required>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.logo} {t.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Equipo Visitante</label>
                    <select value={matchAwayTeam} onChange={(e) => setMatchAwayTeam(e.target.value)} className="form-select" required>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.logo} {t.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado de Partido</label>
                  <select value={matchStatus} onChange={(e) => setMatchStatus(e.target.value)} className="form-select" required>
                    <option value="scheduled">Programado</option>
                    <option value="live">En Vivo / En Juego</option>
                    <option value="finished">Finalizado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="postponed">Reprogramado (Pospuesto)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Comentarios o Crónica</label>
                  <input type="text" placeholder="Ej. Duelo importante." value={matchComments} onChange={(e) => setMatchComments(e.target.value)} className="form-input" />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {matchId ? 'Guardar Cambios' : 'Crear Partido'}
                  </button>
                  {matchId && (
                    <button type="button" onClick={handleResetMatchForm} className="btn-outline" style={{ border: 'none' }}>
                      Cancelar Edición
                    </button>
                  )}
                </div>
              </form>

              {/* Matches List Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderLeft: '3px solid var(--primary)', paddingLeft: '6px' }}>
                  Rol General de Partidos ({matches.length})
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
                  {matches.sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime)).map(match => {
                    const hTeam = teams.find(t => t.id === match.homeTeamId) || { name: 'Local' };
                    const aTeam = teams.find(t => t.id === match.awayTeamId) || { name: 'Visitante' };
                    const mTour = tournaments.find(t => t.id === match.tournamentId) || { categoryId: '', category: '' };
                    const mCatId = match.categoryId || mTour.categoryId;
                    const mCatName = categories.find(c => c.id === mCatId)?.name || mTour.category || 'Sin Categoría';
                    
                    return (
                      <div key={match.id} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                            {hTeam.name} vs {aTeam.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {new Date(match.dateTime).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} | {new Date(match.dateTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs | Cat: <strong>{mCatName}</strong>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                            <span className="badge" style={{ padding: '2px 6px', fontSize: '0.6rem' }}>
                              {match.status}
                            </span>
                            {(match.homeScore !== null && match.awayScore !== null) && (
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                                Marcador: {match.homeScore} - {match.awayScore}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => {
                              setSelectedEditMatch(match);
                            }}
                            className="btn-outline"
                            style={{ padding: '6px', borderRadius: '6px' }}
                            title="Editar Datos"
                          >
                            <Edit2 size={12} />
                          </button>
                          {currentRole === 'admin' && (
                            <button
                              onClick={() => {
                                if (window.confirm('¿Seguro que deseas eliminar este partido?')) {
                                  deleteMatch(match.id);
                                }
                              }}
                              className="btn-outline"
                              style={{ padding: '6px', borderRadius: '6px', color: '#EF4444' }}
                              title="Eliminar"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: RESULTS (CAPTURE MATCH SCORES) */}
        {activeSubTab === 'results' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <style>{`
              @media (min-width: 1024px) {
                .results-admin-layout {
                  grid-template-columns: 1fr 1.1fr !important;
                }
              }
            `}</style>
            <div className="results-admin-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Score capture Form */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  🏆 Capturar Marcador Oficial
                </h3>

                {resultSuccess && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {resultSuccess}
                  </div>
                )}
                {resultError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {resultError}
                  </div>
                )}

                {selectedResultMatchId ? (
                  (() => {
                    const match = matches.find(m => m.id === selectedResultMatchId);
                    const hTeam = teams.find(t => t.id === match?.homeTeamId) || { name: 'Local' };
                    const aTeam = teams.find(t => t.id === match?.awayTeamId) || { name: 'Visitante' };

                    return (
                      <form onSubmit={handleResultSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        
                        <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Partido Seleccionado:</span>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '4px' }}>
                            {hTeam.logo} {hTeam.name} vs {aTeam.logo} {aTeam.name}
                          </div>
                        </div>

                        {/* Scores Grid Inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Goles Local ({hTeam.name})</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={resultHomeScore}
                              onChange={(e) => setResultHomeScore(e.target.value)}
                              className="form-input"
                              style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}
                              required
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Goles Visitante ({aTeam.name})</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={resultAwayScore}
                              onChange={(e) => setResultAwayScore(e.target.value)}
                              className="form-input"
                              style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Nota o Resumen del Juego</label>
                          <input
                            type="text"
                            placeholder="Ej. Partido finalizado, hat-trick del capitán."
                            value={resultComments}
                            onChange={(e) => setResultComments(e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="submit" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                            <Check size={16} /> Guardar Resultado Oficial
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedResultMatchId('');
                              setResultHomeScore('');
                              setResultAwayScore('');
                              setResultComments('');
                            }}
                            className="btn-outline"
                            style={{ border: 'none' }}
                          >
                            Cancelar
                          </button>
                        </div>

                      </form>
                    );
                  })()
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                    Selecciona un partido de la lista de la derecha para capturar su marcador final.
                  </div>
                )}

              </div>

              {/* Match List for score capturing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderLeft: '3px solid var(--secondary)', paddingLeft: '6px' }}>
                  Partidos Disponibles para Marcador
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto' }}>
                  {matches.filter(m => m.status !== 'cancelled').sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime)).map(match => {
                    const hTeam = teams.find(t => t.id === match.homeTeamId) || { name: 'Local' };
                    const aTeam = teams.find(t => t.id === match.awayTeamId) || { name: 'Visitante' };
                    
                    return (
                      <div 
                        key={match.id} 
                        onClick={() => {
                          setSelectedResultMatchId(match.id);
                          setResultHomeScore(match.homeScore !== null ? match.homeScore : '');
                          setResultAwayScore(match.awayScore !== null ? match.awayScore : '');
                          setResultComments(match.comments || '');
                          setResultSuccess('');
                          setResultError('');
                        }}
                        className="glass-panel"
                        style={{ 
                          padding: '10px 14px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          cursor: 'pointer',
                          borderColor: selectedResultMatchId === match.id ? 'var(--primary)' : 'var(--border-color)',
                          backgroundColor: selectedResultMatchId === match.id ? 'rgba(251, 191, 36, 0.05)' : 'rgba(22, 28, 45, 0.75)'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                            {hTeam.name} vs {aTeam.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {new Date(match.dateTime).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} | Estatus: <strong>{match.status}</strong>
                          </div>
                          {(match.homeScore !== null && match.awayScore !== null) && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: '700' }}>
                              Marcador actual: {match.homeScore} - {match.awayScore}
                            </span>
                          )}
                        </div>
                        <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.72rem', pointerEvents: 'none' }}>
                          <Play size={10} style={{ marginRight: '4px' }} /> Capturar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: TEAMS (CRUD) */}
        {activeSubTab === 'teams' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <style>{`
              @media (min-width: 1024px) {
                .teams-admin-layout {
                  grid-template-columns: 1fr 1.2fr !important;
                }
              }
            `}</style>
            <div className={currentRole === 'admin' ? "teams-admin-layout" : ""} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Add/Edit Team form */}
              {currentRole === 'admin' && (
                <form onSubmit={handleTeamSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {teamId ? '✏️ Editar Datos de Equipo' : '➕ Registrar Nuevo Equipo'}
                  </h3>

                {teamSuccess && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {teamSuccess}
                  </div>
                )}
                {teamError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {teamError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Nombre del Equipo *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Deportivo Azteca" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)} 
                    className="form-input" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Escudo / Logo (Emoji)</label>
                    <select value={teamLogo} onChange={(e) => setTeamLogo(e.target.value)} className="form-select">
                      <option value="⚽">⚽ Balón</option>
                      <option value="👑">👑 Corona</option>
                      <option value="🇧🇷">🇧🇷 Brasil</option>
                      <option value="🥁">🥁 Tambor</option>
                      <option value="🐆">🐆 Jaguar</option>
                      <option value="🦅">🦅 Águila</option>
                      <option value="🔴">🔴 Rojo</option>
                      <option value="🟢">🟢 Verde</option>
                      <option value="🔵">🔵 Azul</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capitán *</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Carlos Ortiz" 
                      value={teamCaptain} 
                      onChange={(e) => setTeamCaptain(e.target.value)} 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono de Capitán</label>
                  <input 
                    type="tel" 
                    placeholder="Ej. 5512345678" 
                    value={teamPhone} 
                    onChange={(e) => setTeamPhone(e.target.value)} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lista de Jugadores (Separados por coma)</label>
                  <textarea 
                    placeholder="Ej. Juan Pérez, Carlos García, Raúl Jiménez" 
                    value={teamPlayersStr} 
                    onChange={(e) => setTeamPlayersStr(e.target.value)} 
                    className="form-textarea" 
                    rows={3} 
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Separa con coma los nombres completos.</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {teamId ? 'Guardar Cambios' : 'Registrar Club'}
                  </button>
                  {teamId && (
                    <button type="button" onClick={handleResetTeamForm} className="btn-outline" style={{ border: 'none' }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
              )}

              {/* Roster list with Edit & Delete */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderLeft: '3px solid var(--primary)', paddingLeft: '6px' }}>
                  Equipos Registrados ({teams.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
                  {teams.map(team => (
                    <div key={team.id} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{team.logo}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{team.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Capitán: {team.captainName || 'Sin asignar'}
                          </div>
                        </div>
                      </div>
                      {currentRole === 'admin' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleLoadEditTeam(team)}
                            className="btn-outline"
                            style={{ padding: '6px', borderRadius: '6px' }}
                            title="Editar Equipo"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Seguro que deseas eliminar a ${team.name}?`)) {
                                const res = deleteTeam(team.id);
                                if (!res.success) alert(res.error);
                              }
                            }}
                            className="btn-outline"
                            style={{ padding: '6px', borderRadius: '6px', color: '#EF4444' }}
                            title="Eliminar Equipo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TOURNAMENTS (CRUD) */}
        {activeSubTab === 'tournaments' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <style>{`
              @media (min-width: 768px) {
                .tournaments-admin-layout {
                  grid-template-columns: 1fr 1fr !important;
                }
              }
            `}</style>
            <div className={currentRole === 'admin' ? "tournaments-admin-layout" : ""} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Form */}
              {currentRole === 'admin' && (
                <form onSubmit={handleTournamentSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {tourId ? '✏️ Editar Torneo' : '➕ Crear Nuevo Torneo'}
                  </h3>

                {tourSuccess && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {tourSuccess}
                  </div>
                )}
                {tourError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {tourError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Nombre del Torneo *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Torneo Nocturno de Fin de Año" 
                    value={tourName} 
                    onChange={(e) => setTourName(e.target.value)} 
                    className="form-input" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría *</label>
                  <select value={tourCatId} onChange={(e) => setTourCatId(e.target.value)} className="form-select" required>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {tourId && (
                  <div className="form-group">
                    <label className="form-label">Estatus del Torneo</label>
                    <select value={tourStatus} onChange={(e) => setTourStatus(e.target.value)} className="form-select" required>
                      <option value="active">Activo</option>
                      <option value="upcoming">Inscripciones Abiertas</option>
                      <option value="completed">Finalizado</option>
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {tourId ? 'Guardar Cambios' : 'Crear Torneo'}
                  </button>
                  {tourId && (
                    <button type="button" onClick={handleResetTourForm} className="btn-outline" style={{ border: 'none' }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
              )}

              {/* Tournament List with Edit & Delete */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderLeft: '3px solid var(--primary)', paddingLeft: '6px' }}>
                  Torneos Disponibles ({tournaments.length})
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tournaments.map(t => {
                    const catObj = categories.find(c => c.id === t.categoryId);
                    const catName = catObj ? catObj.name : t.category || 'Sin Categoría';
                    return (
                      <div key={t.id} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{t.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Cat: {catName} | Estado: <strong>{t.status || 'active'}</strong>
                          </div>
                        </div>
                        {currentRole === 'admin' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handleLoadEditTour(t)}
                              className="btn-outline"
                              style={{ padding: '6px', borderRadius: '6px' }}
                              title="Editar Torneo"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Seguro que deseas eliminar el torneo ${t.name}?`)) {
                                  const res = deleteTournament(t.id);
                                  if (!res.success) alert(res.error);
                                }
                              }}
                              className="btn-outline"
                              style={{ padding: '6px', borderRadius: '6px', color: '#EF4444' }}
                              title="Eliminar Torneo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: RESERVATIONS (APPROVE / REJECT) */}
        {activeSubTab === 'reservations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderLeft: '3px solid var(--secondary)', paddingLeft: '6px' }}>
              Gestión de Solicitudes de Reservación
            </h3>

            {reservations.length === 0 ? (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No hay solicitudes de reservación registradas.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reservations.sort((a,b) => b.id.localeCompare(a.id)).map(res => {
                  const field = fields.find(f => f.id === res.fieldId) || { name: 'Cancha' };
                  const isPending = res.status === 'pending';
                  const isPaid = res.paymentStatus === 'paid';

                  return (
                    <div 
                      key={res.id} 
                      className="glass-panel animate-fade-in" 
                      style={{ 
                        padding: '16px', 
                        borderLeftWidth: '4px',
                        borderLeftColor: res.status === 'approved' ? 'var(--secondary)' : res.status === 'rejected' ? '#EF4444' : 'var(--primary)' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>
                        
                        {/* Details */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>{res.name}</h4>
                            <span className="badge" style={{
                              fontSize: '0.62rem',
                              backgroundColor: res.status === 'approved' ? 'rgba(16, 185, 129, 0.12)' : res.status === 'rejected' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(251, 191, 36, 0.12)',
                              color: res.status === 'approved' ? 'var(--secondary)' : res.status === 'rejected' ? '#F87171' : 'var(--primary)',
                              border: 'none'
                            }}>
                              {res.status === 'approved' ? 'Aprobado' : res.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                            <span>📞 Teléfono: <strong>{res.phone}</strong></span>
                            <span>🏟️ Cancha: <strong>{field.name.split(' - ')[0]}</strong></span>
                            <span>📅 Horario: <strong>{new Date(res.date + 'T00:00:00').toLocaleDateString('es-MX')} a las {res.time} hrs</strong> ({res.duration} hora/s)</span>
                            {res.comments && <span>💬 Comentarios: <em>"{res.comments}"</em></span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                          
                          {/* Payment Flag */}
                          <button
                            onClick={() => {
                              updateReservation(res.id, { paymentStatus: isPaid ? 'unpaid' : 'paid' });
                            }}
                            className="btn-outline"
                            style={{ 
                              padding: '4px 8px', 
                              fontSize: '0.7rem', 
                              color: isPaid ? 'var(--secondary)' : 'var(--text-muted)',
                              borderColor: isPaid ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)',
                              backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                            }}
                          >
                            💰 {isPaid ? 'Pagado' : 'Pendiente Pago'}
                          </button>

                          {/* Approval / Rejection buttons */}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => {
                                    const result = updateReservation(res.id, { status: 'approved' });
                                    if (!result.success) alert(result.error);
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '6px' }}
                                >
                                  <Check size={12} /> Aprobar
                                </button>
                                <button
                                  onClick={() => updateReservation(res.id, { status: 'rejected' })}
                                  className="btn-outline"
                                  style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '6px', color: '#EF4444' }}
                                >
                                  <X size={12} /> Rechazar
                                </button>
                              </>
                            ) : (
                              // Delete request from list (Admin only)
                              currentRole === 'admin' ? (
                                <button
                                  onClick={() => {
                                    if (window.confirm('¿Deseas eliminar esta solicitud de reservación?')) {
                                      deleteReservation(res.id);
                                    }
                                  }}
                                  className="btn-outline"
                                  style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '6px', color: 'var(--text-muted)' }}
                                >
                                  <Trash2 size={12} /> Eliminar
                                </button>
                              ) : null
                            )}

                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeSubTab === 'categories' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <style>{`
              @media (min-width: 1024px) {
                .categories-admin-layout {
                  grid-template-columns: 1fr 1.2fr !important;
                }
              }
            `}</style>
            <div className={currentRole === 'admin' ? "categories-admin-layout" : ""} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Form (Admin only) */}
              {currentRole === 'admin' && (
                <form onSubmit={handleCategorySubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {catId ? '✏️ Editar Categoría' : '➕ Crear Nueva Categoría'}
                  </h3>

                  {catSuccess && (
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      {catSuccess}
                    </div>
                  )}
                  {catError && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      {catError}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Nombre de la Categoría *</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Femenil Libre" 
                      value={catName} 
                      onChange={(e) => setCatName(e.target.value)} 
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      {catId ? 'Guardar Cambios' : 'Crear Categoría'}
                    </button>
                    {catId && (
                      <button type="button" onClick={handleResetCatForm} className="btn-outline" style={{ border: 'none' }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderLeft: '3px solid var(--primary)', paddingLeft: '6px' }}>
                  Categorías Registradas ({categories.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
                  {categories.map(cat => (
                    <div key={cat.id} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{cat.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          ID: {cat.id}
                        </div>
                      </div>
                      {currentRole === 'admin' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleLoadEditCat(cat)}
                            className="btn-outline"
                            style={{ padding: '6px', borderRadius: '6px' }}
                            title="Editar Categoría"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Seguro que deseas eliminar la categoría ${cat.name}?`)) {
                                const res = deleteCategory(cat.id);
                                if (!res.success) {
                                  alert(res.error);
                                } else {
                                  setCatSuccess('Categoría eliminada con éxito.');
                                }
                              }
                            }}
                            className="btn-outline"
                            style={{ padding: '6px', borderRadius: '6px', color: '#EF4444' }}
                            title="Eliminar Categoría"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: ANNOUNCEMENTS */}
        {activeSubTab === 'announcements' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <style>{`
              @media (min-width: 768px) {
                .announce-admin-layout {
                  grid-template-columns: 1fr 1fr !important;
                }
              }
            `}</style>
            <div className="announce-admin-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Form */}
              <form onSubmit={handleAnnouncementSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  📣 Publicar Nuevo Aviso Importante
                </h3>

                {annSuccess && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {annSuccess}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Título del Anuncio *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. ¡Nueva premiación en efectivo!" 
                    value={annTitle} 
                    onChange={(e) => setAnnTitle(e.target.value)} 
                    className="form-input" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contenido *</label>
                  <textarea 
                    placeholder="Redacta la noticia para el tablero de la pantalla de inicio..." 
                    value={annContent} 
                    onChange={(e) => setAnnContent(e.target.value)} 
                    className="form-textarea" 
                    rows={3} 
                    required 
                  />
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    checked={annImportant} 
                    onChange={(e) => setAnnImportant(e.target.checked)} 
                    id="ann-check" 
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }} 
                  />
                  <label htmlFor="ann-check" style={{ fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}>
                    ✨ Destacar anuncio como IMPORTANTE (Borde dorado en Inicio)
                  </label>
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px' }}>
                  Publicar Anuncio
                </button>
              </form>

              {/* List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderLeft: '3px solid var(--primary)', paddingLeft: '6px' }}>
                  Noticias Publicadas ({announcements.length})
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {announcements.map(ann => (
                    <div key={ann.id} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, marginRight: '8px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: ann.isImportant ? 'var(--primary)' : 'inherit' }}>
                          {ann.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>{ann.content}</div>
                      </div>
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="btn-outline"
                        style={{ padding: '6px', borderRadius: '6px', color: '#EF4444', flexShrink: 0 }}
                        title="Eliminar Anuncio"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminPanel;
