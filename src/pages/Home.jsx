import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import MatchCard from '../components/MatchCard';
import StandingsTable from '../components/StandingsTable';
import { Calendar, Clock, Trophy, MapPin, AlertCircle, MessageSquare } from 'lucide-react';

const Home = ({ setCurrentTab }) => {
  const { announcements, matches, getStandings, currentRole } = useDatabase();

  // Filter today's matches or matches on June 9, 2026 (our current simulated date)
  const todayStr = '2026-06-09';
  const todaysMatches = matches.filter(m => m.dateTime.startsWith(todayStr));
  
  // Standings preview of tournament 1 (Nocturno)
  const standingsPreview = getStandings('1').slice(0, 4);

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(0, 155, 58, 0.4), rgba(0, 39, 118, 0.7)), url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop") center/cover no-repeat',
        borderRadius: '16px',
        padding: '40px 24px',
        textAlign: 'center',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        {/* Subtle decorative overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <span style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'var(--text-dark)', 
            padding: '4px 12px', 
            borderRadius: '99px', 
            fontSize: '0.75rem', 
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            ¡Bienvenido a la Pasión del Fútbol Rápido!
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.8)', color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            JOGA BONITO FUT 7
          </h2>
          <p style={{ fontSize: '1rem', color: '#E5E7EB', textShadow: '0 1px 2px rgba(0,0,0,0.8)', maxWidth: '600px', margin: '0 auto 8px auto' }}>
            Fútbol rápido, torneos mensuales de alto nivel, roles oficiales y la mejor pasión por el juego en Cuautepec.
          </p>

          {/* Quick Buttons Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
            <button onClick={() => setCurrentTab('schedule')} className="btn-primary">
              <Calendar size={18} /> Ver Rol de Juegos
            </button>
            <button onClick={() => setCurrentTab('reservations')} className="btn-secondary">
              <Clock size={18} /> Reservar Cancha
            </button>
            <button onClick={() => setCurrentTab('tournaments')} className="btn-outline">
              <Trophy size={18} /> Ver Torneos
            </button>
            <button onClick={() => setCurrentTab('contact')} className="btn-outline" style={{ border: 'none' }}>
              <MapPin size={18} /> Ubicación
            </button>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTICE BANNER */}
      {announcements.filter(a => a.isImportant).slice(0, 1).map((announce) => (
        <div key={announce.id} className="glass-panel" style={{
          padding: '16px',
          borderColor: 'var(--primary)',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(22, 28, 45, 0.8))',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          boxShadow: '0 4px 15px rgba(251, 191, 36, 0.1)'
        }}>
          <AlertCircle size={24} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.95rem', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
              {announce.title}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
              {announce.content}
            </p>
          </div>
        </div>
      ))}

      {/* TODAY'S MATCHES AND STANDINGS WRAPPER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <style>{`
          @media (min-width: 1024px) {
            .grid-home-split {
              grid-template-columns: 1.6fr 1fr !important;
            }
          }
        `}</style>
        <div className="grid-home-split" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* TODAY'S MATCHES TICKER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', borderLeft: '4px solid var(--secondary)', paddingLeft: '8px' }}>
                Partidos de Hoy ({todaysMatches.length})
              </h3>
              <button 
                onClick={() => setCurrentTab('schedule')} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Ver rol completo →
              </button>
            </div>

            {todaysMatches.length === 0 ? (
              <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No hay partidos programados para el día de hoy.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todaysMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>

          {/* STANDINGS QUICK LOOK */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', borderLeft: '4px solid var(--accent-light)', paddingLeft: '8px' }}>
                Tabla General (Top 4)
              </h3>
              <button 
                onClick={() => setCurrentTab('standings')} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Ver posiciones →
              </button>
            </div>

            <StandingsTable standings={standingsPreview} />
          </div>

        </div>
      </div>

      {/* RECENT ANNOUNCEMENTS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', borderLeft: '4px solid var(--primary)', paddingLeft: '8px' }}>
          Avisos y Noticias Recientes
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <style>{`
            @media (min-width: 768px) {
              .announcement-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
          <div className="announcement-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {announcements.filter(a => !a.isImportant).slice(0, 2).map((announce) => (
              <div key={announce.id} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    📅 Publicado: {announce.date}
                  </span>
                </div>
                <h4 style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>
                  {announce.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, flex: 1 }}>
                  {announce.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
