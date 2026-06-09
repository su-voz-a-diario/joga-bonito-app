import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import TournamentBracket from '../components/TournamentBracket';
import { Trophy, Flame, Calendar, MapPin, Clock } from 'lucide-react';

const Finals = () => {
  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--primary)', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Finales y Partidos Especiales
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          La liguilla y los enfrentamientos decisivos que definen a los campeones. ¡No te pierdas ningún partidazo!
        </p>
      </div>

      {/* LIGUILLA BRACKET */}
      <TournamentBracket />

      {/* SPECIAL EVENT POSTER (CARTEL DEPORTIVO) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          Próximo Evento Estelar
        </h3>
        
        {/* Dynamic Sport Poster Card */}
        <div className="glass-panel" style={{
          background: 'radial-gradient(circle at top right, rgba(251, 191, 36, 0.15), rgba(11, 15, 23, 0.9)), linear-gradient(135deg, rgba(0, 155, 58, 0.2), rgba(0, 39, 118, 0.4))',
          borderColor: 'var(--primary)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Subtle Background Glow */}
          <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', filter: 'blur(50px)', top: '-50px', right: '-50px', zIndex: 0 }}></div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            
            {/* Title / Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '6px 16px', borderRadius: '99px', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              <Flame size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>
                Gran Final de Copa Azteca 2026
              </span>
            </div>

            {/* Match Teams */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '500px', margin: '20px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '40%', textAlign: 'center' }}>
                <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>🇧🇷</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Joga Bonito FC</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Líder general</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', border: '2px solid var(--primary)', backgroundColor: 'rgba(0,0,0,0.4)', letterSpacing: '0.05em' }}>
                  VS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '40%', textAlign: 'center' }}>
                <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>👑</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Real Azteca</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sublíder general</span>
              </div>
            </div>

            {/* Event Details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingWidth: '100%', paddingTop: '16px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} style={{ color: 'var(--secondary)' }} />
                <span>Viernes, 12 de Junio</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: 'var(--primary)' }} />
                <span>21:00 hrs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} style={{ color: 'var(--accent-light)' }} />
                <span>Cancha 1 - Joga Bonito</span>
              </div>
            </div>

            {/* Decorative Slogan */}
            <p style={{ fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>
              "¡La gloria se decide en el pasto sintético! Se premiará al campeón goleador y mejor portero del torneo."
            </p>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Finals;
