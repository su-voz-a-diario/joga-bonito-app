import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Globe, ArrowRight } from 'lucide-react';

const Contact = () => {
  const handleOpenMaps = () => {
    // Open Google Maps search for Cuautepec soccer field
    window.open('https://maps.google.com/?q=Cuautepec+Barrio+Bajo+CDMX+Futbol+7', '_blank');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hola Joga Bonito Fut 7, me interesa solicitar informes sobre inscripciones a los torneos y renta de canchas.');
    window.open(`https://api.whatsapp.com/send?phone=5512345678&text=${text}`, '_blank');
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--primary)', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Ubicación y Contacto
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Ven a jugar con nosotros o contáctanos directamente para inscripciones y dudas generales.
        </p>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
      <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* CONTACT INFO AND CHANNELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Medios de Contacto
            </h3>

            {/* Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* WhatsApp */}
              <div 
                onClick={handleWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <MessageSquare size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>WhatsApp Oficial</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>55 1234 5678</div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--secondary)' }} />
              </div>

              {/* Phone */}
              <a 
                href="tel:5587654321"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37, 99, 235, 0.05)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <Phone size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Teléfono Fijo Canchas</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>55 8765 4321</div>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--accent-light)' }} />
              </a>

              {/* Address */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Dirección</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '600', color: '#fff', marginTop: '2px' }}>
                    Av. Juventino Rosas S/N, Col. Barrio Alto Cuautepec, Gustavo A. Madero, CDMX.
                  </div>
                </div>
              </div>

            </div>

            {/* Social Networks */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: '6px' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: '6px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
              </a>
            </div>

          </div>
        </div>

        {/* WORK HOURS & MAP PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Work Hours Card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--primary)' }} /> Horarios de Atención
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Lunes a Viernes:</span>
                <span style={{ fontWeight: '600' }}>4:00 PM - 11:30 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sábados (Torneo Sabatino):</span>
                <span style={{ fontWeight: '600' }}>8:00 AM - 10:00 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Domingos (Eventos/Copa):</span>
                <span style={{ fontWeight: '600' }}>8:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Map mockup */}
          <div className="glass-panel" style={{
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            height: '220px',
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop") center/cover no-repeat',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            <MapPin size={36} style={{ color: '#EF4444', filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))' }} />
            <div style={{ zIndex: 1 }}>
              <h4 style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>¿Cómo llegar?</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '250px', margin: '4px 0 10px 0' }}>
                Ubicados en el corazón de Cuautepec Barrio Alto.
              </p>
              <button onClick={handleOpenMaps} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                Abrir en Google Maps
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;
