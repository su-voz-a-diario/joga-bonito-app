import React, { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext();

// Default Pre-loaded Mock Data
const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Varonil Libre' },
  { id: '2', name: 'Femenil Libre' },
  { id: '3', name: 'Mixto' },
  { id: '4', name: 'Infantil' },
  { id: '5', name: 'Juvenil' },
  { id: '6', name: 'Veteranos' },
  { id: '7', name: 'Infantil 8-10' },
  { id: '8', name: 'Infantil 11-13' },
  { id: '9', name: 'Infantil 14-16' }
];

const DEFAULT_TEAMS = [
  { id: '1', name: 'Atlético Cuautepec', logo: '⚽', captainName: 'Ricardo García', captainPhone: '5512345678', categoryId: '1', players: ['Carlos Ortiz', 'Javier López', 'Mauricio Pineda', 'Roberto Solís', 'Daniel Vega', 'Fabián Ruiz'] },
  { id: '2', name: 'Real Azteca', logo: '👑', captainName: 'Hugo Sánchez', captainPhone: '5587654321', categoryId: '1', players: ['Luis Mendoza', 'Ángel Cruz', 'Esteban Marín', 'Gabriel Soto', 'Pedro Damián', 'Arturo Ortiz'] },
  { id: '3', name: 'Joga Bonito Femenil', logo: '🇧🇷', captainName: 'Alex Silva', captainPhone: '5599887766', categoryId: '2', players: ['Ronaldo N.', 'Ronaldinho G.', 'Kaká D.', 'Adriano I.', 'Robinho S.', 'Neymar J.'] },
  { id: '4', name: 'Samba Queens', logo: '🥁', captainName: 'Diego Torres', captainPhone: '5522334455', categoryId: '2', players: ['Claudio P.', 'Marcelo V.', 'Dani A.', 'Thiago S.', 'Casemiro C.', 'Fred B.'] },
  { id: '5', name: 'Deportivo Brasil Mixto', logo: '🦖', captainName: 'Juan Carlos', captainPhone: '5577889900', categoryId: '3', players: ['Julio C.', 'Lúcio F.', 'Juan S.', 'Cafu M.', 'Roberto C.', 'Emerson F.'] },
  { id: '6', name: 'Cariocas Mixto', logo: '🏖️', captainName: 'Mateo Gómez', captainPhone: '5544556677', categoryId: '3', players: ['Bebeto A.', 'Romario F.', 'Rivaldo V.', 'Dunga C.', 'Taffarel C.', 'Aldair S.'] },
  { id: '7', name: 'La Raza Juvenil', logo: '🇲🇽', captainName: 'Jesús Corona', captainPhone: '5566778899', categoryId: '5', players: ['Memo O.', 'Chicharito H.', 'Raúl J.', 'Andrés G.', 'Hector H.', 'Tecatito C.'] },
  { id: '8', name: 'Guerreros Juvenil', logo: '🏹', captainName: 'Fernando Torres', captainPhone: '5533221100', categoryId: '5', players: ['Iker C.', 'Carles P.', 'Sergio R.', 'Xavi H.', 'Andrés I.', 'David V.'] },
  { id: '9', name: 'Galácticos Veteranos', logo: '🌌', captainName: 'Zinedine Zidane', captainPhone: '5511223344', categoryId: '6', players: ['Luis F.', 'Ronaldo F.', 'David B.', 'Roberto C.', 'Raúl G.', 'Iker C.'] },
  { id: '10', name: 'Fluminense Veteranos', logo: '🔴', captainName: 'Fred Guedes', captainPhone: '5588990011', categoryId: '6', players: ['Ganso P.', 'Marcelo S.', 'German C.', 'Felipe M.', 'Keno A.', 'Fabio D.'] }
];

const DEFAULT_TOURNAMENTS = [
  { id: '1', name: 'Torneo Nocturno Azteca', categoryId: '1', status: 'active', pointsConfig: { win: 3, draw: 1, loss: 0 } },
  { id: '2', name: 'Copa Femenil Azteca', categoryId: '2', status: 'active', pointsConfig: { win: 3, draw: 1, loss: 0 } },
  { id: '3', name: 'Liga Mixta Cuautepec', categoryId: '3', status: 'active', pointsConfig: { win: 3, draw: 1, loss: 0 } },
  { id: '4', name: 'Torneo Juvenil Azteca', categoryId: '5', status: 'active', pointsConfig: { win: 3, draw: 1, loss: 0 } },
  { id: '5', name: 'Copa Veteranos Azteca', categoryId: '6', status: 'active', pointsConfig: { win: 3, draw: 1, loss: 0 } }
];

const DEFAULT_ANNOUNCEMENTS = [
  { id: '1', title: '🏆 ¡Gran Final del Torneo Nocturno!', content: 'Este viernes 12 de junio a las 21:00 hrs se jugará la Gran Final en la Cancha 1 entre Atlético Cuautepec y Real Azteca. ¡Habrá premiación especial, música y sorpresas!', date: '2026-06-09', isImportant: true },
  { id: '2', title: '📝 Inscripciones Abiertas', content: 'Ya puedes inscribir a tu equipo para el próximo Torneo Sabatino. Envíanos un mensaje por WhatsApp para reservar tu cupo. Cupo limitado a 12 equipos.', date: '2026-06-07', isImportant: false },
  { id: '3', title: '⚠️ Mantenimiento Preventivo', content: 'La Cancha 2 estará cerrada el próximo lunes de 8:00 AM a 2:00 PM por cambio de pasto sintético en las áreas de portería. Agradecemos su comprensión.', date: '2026-06-05', isImportant: false }
];

// Seed matches around the current date (June 9, 2026)
const DEFAULT_MATCHES = [
  // Category 1: Varonil Libre
  { id: '1', tournamentId: '1', categoryId: '1', fieldId: '1', dateTime: '2026-06-05T19:00', homeTeamId: '1', awayTeamId: '2', homeScore: 3, awayScore: 2, status: 'finished', comments: 'Excelente partido de ida.' },
  { id: '2', tournamentId: '1', categoryId: '1', fieldId: '1', dateTime: '2026-06-09T20:30', homeTeamId: '2', awayTeamId: '1', homeScore: null, awayScore: null, status: 'scheduled', comments: 'Clásico de Cuautepec.' },
  
  // Category 2: Femenil Libre
  { id: '3', tournamentId: '2', categoryId: '2', fieldId: '2', dateTime: '2026-06-05T20:00', homeTeamId: '3', awayTeamId: '4', homeScore: 5, awayScore: 3, status: 'finished', comments: 'Excelente juego de samba.' },
  { id: '4', tournamentId: '2', categoryId: '2', fieldId: '2', dateTime: '2026-06-09T21:30', homeTeamId: '4', awayTeamId: '3', homeScore: null, awayScore: null, status: 'scheduled', comments: 'Entrenamiento femenil.' },

  // Category 3: Mixto
  { id: '5', tournamentId: '3', categoryId: '3', fieldId: '1', dateTime: '2026-06-06T19:00', homeTeamId: '5', awayTeamId: '6', homeScore: 2, awayScore: 2, status: 'finished', comments: 'Empate de último minuto.' },
  { id: '6', tournamentId: '3', categoryId: '3', fieldId: '2', dateTime: '2026-06-10T19:00', homeTeamId: '6', awayTeamId: '5', homeScore: null, awayScore: null, status: 'scheduled', comments: 'Liga mixta jornada 2.' },

  // Category 5: Juvenil
  { id: '7', tournamentId: '4', categoryId: '5', fieldId: '2', dateTime: '2026-06-06T20:00', homeTeamId: '7', awayTeamId: '8', homeScore: 1, awayScore: 4, status: 'finished', comments: 'Dominio absoluto de Guerreros.' },
  { id: '8', tournamentId: '4', categoryId: '5', fieldId: '1', dateTime: '2026-06-10T20:00', homeTeamId: '8', awayTeamId: '7', homeScore: null, awayScore: null, status: 'scheduled', comments: 'Liga juvenil.' },

  // Category 6: Veteranos
  { id: '9', tournamentId: '5', categoryId: '6', fieldId: '1', dateTime: '2026-06-07T18:00', homeTeamId: '9', awayTeamId: '10', homeScore: 4, awayScore: 1, status: 'finished', comments: 'Veteranos en acción.' },
  { id: '10', tournamentId: '5', categoryId: '6', fieldId: '2', dateTime: '2026-06-08T19:00', homeTeamId: '10', awayTeamId: '9', homeScore: null, awayScore: null, status: 'postponed', comments: 'Reprogramado por acuerdo de capitanes.' }
];

const DEFAULT_RESERVATIONS = [
  { id: '1', name: 'Carlos Fuentes', phone: '5511223344', date: '2026-06-10', time: '18:00', fieldId: '1', duration: 1, status: 'approved', paymentStatus: 'paid', comments: 'Retas familiares.' },
  { id: '2', name: 'Laura Martínez', phone: '5522334455', date: '2026-06-10', time: '21:00', fieldId: '2', duration: 1, status: 'pending', paymentStatus: 'unpaid', comments: 'Entrenamiento femenil.' },
  { id: '3', name: 'Pedro Ochoa', phone: '5577665544', date: '2026-06-11', time: '20:00', fieldId: '1', duration: 2, status: 'approved', paymentStatus: 'unpaid', comments: 'Torneo interno de empresa.' }
];

export const DatabaseProvider = ({ children }) => {
  // Load initial data from localStorage if exists, else seed defaults
  const [categories, setCategories] = useState(() => {
    const data = localStorage.getItem('jb_categories');
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  });

  const [teams, setTeams] = useState(() => {
    const data = localStorage.getItem('jb_teams');
    return data ? JSON.parse(data) : DEFAULT_TEAMS;
  });

  const [tournaments, setTournaments] = useState(() => {
    const data = localStorage.getItem('jb_tournaments');
    return data ? JSON.parse(data) : DEFAULT_TOURNAMENTS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const data = localStorage.getItem('jb_announcements');
    return data ? JSON.parse(data) : DEFAULT_ANNOUNCEMENTS;
  });

  const [matches, setMatches] = useState(() => {
    const data = localStorage.getItem('jb_matches');
    return data ? JSON.parse(data) : DEFAULT_MATCHES;
  });

  const [reservations, setReservations] = useState(() => {
    const data = localStorage.getItem('jb_reservations');
    return data ? JSON.parse(data) : DEFAULT_RESERVATIONS;
  });

  // Current session/role simulator
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('jb_role') || 'public'; // public, admin, auxiliar
  });

  // Global Category filter for public views coordination
  const [globalCategoryFilter, setGlobalCategoryFilter] = useState('all');

  const [fields] = useState([
    { id: '1', name: 'Cancha 1 - Joga Bonito' },
    { id: '2', name: 'Cancha 2 - Azteca' }
  ]);

  // Synchronize with localStorage when state changes
  useEffect(() => {
    localStorage.setItem('jb_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('jb_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('jb_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('jb_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('jb_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('jb_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('jb_role', currentRole);
  }, [currentRole]);

  // Dynamic Standing Calculation
  const getStandings = (tournamentId) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return [];

    const tournamentMatches = matches.filter(m => m.tournamentId === tournamentId && m.status === 'finished');
    const tournamentTeams = teams.filter(t => t.categoryId === tournament.categoryId);

    const statsMap = {};
    tournamentTeams.forEach(team => {
      statsMap[team.id] = {
        teamId: team.id,
        teamName: team.name,
        teamLogo: team.logo,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    const ptsWin = tournament.pointsConfig?.win || 3;
    const ptsDraw = tournament.pointsConfig?.draw || 1;
    const ptsLoss = tournament.pointsConfig?.loss || 0;

    tournamentMatches.forEach(match => {
      const hId = match.homeTeamId;
      const aId = match.awayTeamId;

      // Ensure stats entries exist (in case teams list updated)
      if (!statsMap[hId] || !statsMap[aId]) return;

      statsMap[hId].played += 1;
      statsMap[aId].played += 1;

      statsMap[hId].goalsFor += match.homeScore;
      statsMap[hId].goalsAgainst += match.awayScore;
      statsMap[aId].goalsFor += match.awayScore;
      statsMap[aId].goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        statsMap[hId].won += 1;
        statsMap[hId].points += ptsWin;
        statsMap[aId].lost += 1;
        statsMap[aId].points += ptsLoss;
      } else if (match.homeScore < match.awayScore) {
        statsMap[aId].won += 1;
        statsMap[aId].points += ptsWin;
        statsMap[hId].lost += 1;
        statsMap[hId].points += ptsLoss;
      } else {
        statsMap[hId].drawn += 1;
        statsMap[hId].points += ptsDraw;
        statsMap[aId].drawn += 1;
        statsMap[aId].points += ptsDraw;
      }
    });

    // Post-process differences and convert to array
    const standingsList = Object.values(statsMap).map(teamStats => {
      teamStats.goalDifference = teamStats.goalsFor - teamStats.goalsAgainst;
      return teamStats;
    });

    // Sort by Points desc, Goal Diff desc, Goals For desc, Name asc
    return standingsList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    });
  };

  // Helper to check for match or reservation schedule collision
  const checkCollision = (fieldId, dateStr, timeStr, durationHours = 1, excludeId = null) => {
    const startTarget = new Date(`${dateStr}T${timeStr}`);
    const endTarget = new Date(startTarget.getTime() + durationHours * 60 * 60 * 1000);

    const matchCollision = matches.some(match => {
      if (match.id === excludeId) return false;
      if (match.fieldId !== fieldId) return false;
      if (match.status === 'cancelled' || match.status === 'postponed') return false;

      const mStart = new Date(match.dateTime);
      const mEnd = new Date(mStart.getTime() + 1 * 60 * 60 * 1000); // Matches default to 1 hr

      return (startTarget < mEnd && endTarget > mStart);
    });

    if (matchCollision) return 'match-collision';

    const resCollision = reservations.some(res => {
      if (res.id === excludeId) return false;
      if (res.fieldId !== fieldId) return false;
      if (res.status !== 'approved') return false;

      const rStart = new Date(`${res.date}T${res.time}`);
      const rEnd = new Date(rStart.getTime() + res.duration * 60 * 60 * 1000);

      return (startTarget < rEnd && endTarget > rStart);
    });

    if (resCollision) return 'reservation-collision';

    return null;
  };

  // CATEGORIES CRUD
  const addCategory = (catData) => {
    const newCat = {
      id: Date.now().toString(),
      ...catData
    };
    setCategories(prev => [...prev, newCat]);
    return { success: true, category: newCat };
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    return { success: true };
  };

  const deleteCategory = (id) => {
    const hasTournaments = tournaments.some(t => t.categoryId === id);
    const hasMatches = matches.some(m => m.categoryId === id);
    const hasTeams = teams.some(t => t.categoryId === id);
    if (hasTournaments || hasMatches || hasTeams) {
      return { 
        success: false, 
        error: 'No se puede eliminar la categoría: está asociada a equipos, torneos o partidos activos.' 
      };
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    return { success: true };
  };

  // MATCHES
  const addMatch = (matchData) => {
    const datePart = matchData.dateTime.split('T')[0];
    const timePart = matchData.dateTime.split('T')[1];
    
    const collision = checkCollision(matchData.fieldId, datePart, timePart, 1);
    if (collision) {
      return { success: false, error: 'Horario ocupado por otro partido o reserva aprobada en esta cancha.' };
    }

    const newMatch = {
      id: Date.now().toString(),
      homeScore: null,
      awayScore: null,
      comments: '',
      ...matchData
    };
    setMatches(prev => [...prev, newMatch]);
    return { success: true, match: newMatch };
  };

  const updateMatch = (id, updatedFields) => {
    if (updatedFields.dateTime || updatedFields.fieldId) {
      const match = matches.find(m => m.id === id);
      const newField = updatedFields.fieldId || match.fieldId;
      const newDateTime = updatedFields.dateTime || match.dateTime;
      
      const datePart = newDateTime.split('T')[0];
      const timePart = newDateTime.split('T')[1];
      
      const collision = checkCollision(newField, datePart, timePart, 1, id);
      if (collision) {
        return { success: false, error: 'Conflicto de horario: la cancha está reservada o tiene otro juego en esa fecha.' };
      }
    }

    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    return { success: true };
  };

  const deleteMatch = (id) => {
    setMatches(prev => prev.filter(m => m.id !== id));
    return { success: true };
  };

  // TEAMS
  const addTeam = (teamData) => {
    const newTeam = {
      id: Date.now().toString(),
      logo: '🛡️',
      players: [],
      captainName: '',
      captainPhone: '',
      ...teamData
    };
    setTeams(prev => [...prev, newTeam]);
    return { success: true, team: newTeam };
  };

  const updateTeam = (id, updatedFields) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    return { success: true };
  };

  const deleteTeam = (id) => {
    const hasMatches = matches.some(m => m.homeTeamId === id || m.awayTeamId === id);
    if (hasMatches) {
      return { success: false, error: 'No se puede eliminar: el equipo tiene partidos registrados.' };
    }
    setTeams(prev => prev.filter(t => t.id !== id));
    return { success: true };
  };

  // TOURNAMENTS
  const addTournament = (tournamentData) => {
    const newTournament = {
      id: Date.now().toString(),
      status: 'upcoming',
      pointsConfig: { win: 3, draw: 1, loss: 0 },
      ...tournamentData
    };
    setTournaments(prev => [...prev, newTournament]);
    return { success: true, tournament: newTournament };
  };

  const updateTournament = (id, updatedFields) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    return { success: true };
  };

  const deleteTournament = (id) => {
    const hasMatches = matches.some(m => m.tournamentId === id);
    if (hasMatches) {
      return { success: false, error: 'No se puede eliminar: el torneo tiene juegos programados.' };
    }
    setTournaments(prev => prev.filter(t => t.id !== id));
    return { success: true };
  };

  // RESERVATIONS
  const addReservation = (resData) => {
    const newRes = {
      id: Date.now().toString(),
      status: 'pending',
      paymentStatus: 'unpaid',
      comments: '',
      ...resData
    };
    setReservations(prev => [...prev, newRes]);
    return { success: true, reservation: newRes };
  };

  const updateReservation = (id, updatedFields) => {
    if (updatedFields.status === 'approved') {
      const res = reservations.find(r => r.id === id);
      const targetField = updatedFields.fieldId || res.fieldId;
      const targetDate = updatedFields.date || res.date;
      const targetTime = updatedFields.time || res.time;
      const duration = updatedFields.duration || res.duration;
      
      const collision = checkCollision(targetField, targetDate, targetTime, duration, id);
      if (collision) {
        return { 
          success: false, 
          error: 'No se puede aprobar: este horario colisiona con un partido oficial u otra reserva ya aprobada.' 
        };
      }
    }

    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
    return { success: true };
  };

  const deleteReservation = (id) => {
    setReservations(prev => prev.filter(r => r.id !== id));
    return { success: true };
  };

  // ANNOUNCEMENTS
  const addAnnouncement = (announceData) => {
    const newAnnounce = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      isImportant: false,
      ...announceData
    };
    setAnnouncements(prev => [newAnnounce, ...prev]);
    return { success: true, announcement: newAnnounce };
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    return { success: true };
  };

  // Simulate authentication for Demo purposes
  const handleLogin = (username, password) => {
    if (username.toLowerCase() === 'admin' && password === 'admin123') {
      setCurrentRole('admin');
      return { success: true, role: 'admin' };
    } else if (username.toLowerCase() === 'auxiliar' && password === 'aux123') {
      setCurrentRole('auxiliar');
      return { success: true, role: 'auxiliar' };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos.' };
  };

  const handleLogout = () => {
    setCurrentRole('public');
  };

  return (
    <DatabaseContext.Provider value={{
      categories,
      teams,
      tournaments,
      matches,
      reservations,
      announcements,
      fields,
      currentRole,
      setCurrentRole,
      globalCategoryFilter,
      setGlobalCategoryFilter,
      getStandings,
      checkCollision,
      
      // Operations
      addCategory,
      updateCategory,
      deleteCategory,
      addMatch,
      updateMatch,
      deleteMatch,
      addTeam,
      updateTeam,
      deleteTeam,
      addTournament,
      updateTournament,
      deleteTournament,
      addReservation,
      updateReservation,
      deleteReservation,
      addAnnouncement,
      deleteAnnouncement,
      
      // Auth
      handleLogin,
      handleLogout
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
