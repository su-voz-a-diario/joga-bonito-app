import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Share2, Clock, MapPin, Trophy } from 'lucide-react';

const MatchCard = ({ match, onEditClick }) => {
  const { teams, tournaments, fields, currentRole } = useDatabase();
  
  const homeTeam = teams.find(t => t.id === match.homeTeamId) || { name: 'Desconocido', logo: '⚽' };
  const awayTeam = teams.find(t => t.id === match.awayTeamId) || { name: 'Desconocido', logo: '⚽' };
  const tournament = tournaments.find(t => t.id === match.tournamentId) || { name: 'Torneo', category: '' };
  const field = fields.find(f => f.id === match.fieldId) || { name: 'Cancha General' };
  
  const isCanEdit = currentRole === 'admin' || currentRole === 'auxiliar';

  // Format Date and Time
  const formatMatchDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const dateObj = new Date(dateTimeStr);
    
    // Format options for Mexico Spanish locale
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    
    const dateFormatted = dateObj.toLocaleDateString('es-MX', dateOptions);
    const timeFormatted = dateObj.toLocaleTimeString('es-MX', timeOptions);
    
    return {
      date: dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1),
      time: timeFormatted + ' hrs'
    };
  };

  const dateTime = formatMatchDateTime(match.dateTime);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'finished':
        return <span className="badge badge-finished">Finalizado</span>;
      case 'live':
        return <span className="badge badge-live">En Vivo</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled">Cancelado</span>;
      case 'postponed':
        return <span className="badge badge-postponed">Reprogramado</span>;
      default:
        return <span className="badge badge-scheduled">Programado</span>;
    }
  };

  // WhatsApp Share Function
  const shareOnWhatsApp = () => {
    let headerText = '⚽ *JOGA BONITO FUT 7 / LIGA AZTECA* ⚽\n';
    let bodyText = '';
    
    const fieldName = field.name;
    const tournamentName = `${tournament.name} (${tournament.category})`;

    if (match.status === 'finished') {
      headerText += '🏆 *RESULTADO OFICIAL* 🏆\n';
      bodyText = `
*Torneo:* ${tournamentName}
*Sede:* ${fieldName}
-----------------------------
🏁 *${homeTeam.name}  [ ${match.homeScore} ]*
🏁 *${awayTeam.name}  [ ${match.awayScore} ]*
-----------------------------
_${match.comments || '¡Gran partido de fútbol rápido!'}_
`;
    } else if (match.status === 'live') {
      headerText += '🔥 *PARTIDO EN VIVO* 🔥\n';
      bodyText = `
*Torneo:* ${tournamentName}
*Sede:* ${fieldName}
-----------------------------
⚡ *${homeTeam.name}  [ ${match.homeScore} ]*
⚡ *${awayTeam.name}  [ ${match.awayScore} ]*
-----------------------------
_${match.comments || '¡Partido al rojo vivo! Sigue el marcador en tiempo real.'}_
`;
    } else {
      headerText += '📅 *PRÓXIMO PARTIDO* 📅\n';
      bodyText = `
*Torneo:* ${tournamentName}
*Sede:* ${fieldName}
*Fecha:* ${dateTime.date}
*Hora:* ${dateTime.time}
-----------------------------
🏃 *${homeTeam.name}*  vs  *${awayTeam.name}*
-----------------------------
_${match.comments || '¡Ven a apoyar a tu equipo favorito!'}_
`;
    }

    const footerText = '\n📲 _Consulta roles y resultados en nuestra App Web Oficial._';
    const finalMsg = encodeURIComponent(headerText + bodyText + footerText);
    window.open(`https://api.whatsapp.com/send?text=${finalMsg}`, '_blank');
  };

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
      
      {/* Tournament, Field and Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Trophy size={14} style={{ color: 'var(--primary)' }} />
          <span>{tournament.name} • {tournament.category}</span>
        </div>
        {getStatusBadge(match.status)}
      </div>

      {/* Scoreboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
        
        {/* Home Team */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '38%', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem' }}>{homeTeam.logo}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.7em', lineHeight: '1.35' }}>
            {homeTeam.name}
          </span>
        </div>

        {/* VS / Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '24%' }}>
          {match.status === 'finished' || match.status === 'live' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: match.status === 'live' ? '#EF4444' : 'var(--primary)', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                {match.homeScore}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>-</span>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: match.status === 'live' ? '#EF4444' : 'var(--primary)', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                {match.awayScore}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem', fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: 'var(--primary)', letterSpacing: '0.05em' }}>
              VS
            </span>
          )}
          
          {match.status === 'live' && (
            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EN JUEGO
            </span>
          )}
        </div>

        {/* Away Team */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '38%', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem' }}>{awayTeam.logo}</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.7em', lineHeight: '1.35' }}>
            {awayTeam.name}
          </span>
        </div>

      </div>

      {/* Date, Time and Field */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} style={{ color: 'var(--secondary)' }} />
          <span>
            {match.status === 'postponed' ? (
              <span style={{ color: 'var(--primary)' }}>Pendiente de reprogramación</span>
            ) : (
              `${dateTime.date} | ${dateTime.time}`
            )}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} style={{ color: 'var(--accent-light)' }} />
          <span style={{ fontWeight: '500' }}>{field.name.split(' - ')[0]}</span>
        </div>
      </div>

      {/* Actions (WhatsApp Share & Edit option for Admin) */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button
          onClick={shareOnWhatsApp}
          className="btn-outline"
          style={{ flex: 1, padding: '6px 12px', fontSize: '0.75rem', justifyContent: 'center', borderRadius: '8px' }}
        >
          <Share2 size={14} /> Compartir
        </button>

        {isCanEdit && onEditClick && (
          <button
            onClick={() => onEditClick(match)}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.75rem', justifyContent: 'center', borderRadius: '8px', background: 'linear-gradient(135deg, var(--secondary), #047857)', color: '#fff' }}
          >
            Editar Juego
          </button>
        )}
      </div>

    </div>
  );
};

export default MatchCard;
