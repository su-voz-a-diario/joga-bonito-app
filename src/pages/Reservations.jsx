import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Clock, Calendar, Check, X, Phone, User, MessageCircle, Info } from 'lucide-react';

const Reservations = () => {
  const { addReservation, checkCollision, fields } = useDatabase();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:00');
  const [fieldId, setFieldId] = useState('1');
  const [duration, setDuration] = useState(1);
  const [comments, setComments] = useState('');
  
  // Feedback States
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Time slots for quick selection / grid
  const timeSlots = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    if (!name || !phone || !date || !time) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Attempt to add reservation (will be created as pending)
    const newReservation = {
      name,
      phone,
      date,
      time,
      fieldId,
      duration: Number(duration),
      comments,
      status: 'pending',
      paymentStatus: 'unpaid'
    };

    // Pre-check if collision just to warn user in prompt
    const collisionType = checkCollision(fieldId, date, time, Number(duration));

    const result = addReservation(newReservation);
    
    if (result.success) {
      if (collisionType) {
        setStatusMsg('Solicitud enviada. Nota: El horario seleccionado ya está reservado o en juego. Tu reserva queda PENDIENTE y el administrador podría ofrecerte horarios alternos.');
      } else {
        setStatusMsg('¡Solicitud registrada con éxito! Tu reservación queda en estado PENDIENTE. En breve nos comunicaremos contigo o puedes acelerar la aprobación haciendo clic en el botón de WhatsApp abajo.');
      }
      
      // Reset Form
      setName('');
      setPhone('');
      setComments('');
    } else {
      setErrorMsg(result.error || 'Error al procesar la reserva.');
    }
  };

  const getSlotStatus = (slotTime) => {
    // Check if slot is occupied
    const collision = checkCollision(fieldId, date, slotTime, 1);
    return collision ? 'occupied' : 'free';
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', borderLeft: '4px solid var(--primary)', paddingLeft: '8px', textTransform: 'uppercase' }}>
          Reservación de Canchas
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Consulta disponibilidad de horarios en tiempo real y solicita tu reserva.
        </p>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .res-layout {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
      <div className="res-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* LEFT PANEL: TIMELINE & AVAILABILITY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              1. Ver Disponibilidad
            </h3>
            
            {/* Quick selectors for timetable */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Fecha de Consulta</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Selecciona Cancha</label>
                <select
                  value={fieldId}
                  onChange={(e) => setFieldId(e.target.value)}
                  className="form-select"
                >
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timetable Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Horarios para el {new Date(date + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {timeSlots.map(slot => {
                  const status = getSlotStatus(slot);
                  const isFree = status === 'free';
                  return (
                    <div 
                      key={slot} 
                      onClick={() => isFree && setTime(slot)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: isFree ? 'rgba(16, 185, 129, 0.04)' : 'rgba(239, 68, 68, 0.04)',
                        border: `1px solid ${isFree ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                        cursor: isFree ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s',
                        borderLeftWidth: '4px',
                        borderLeftColor: isFree ? 'var(--secondary)' : '#EF4444'
                      }}
                      className={isFree && time === slot ? 'active-slot' : ''}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} style={{ color: isFree ? 'var(--secondary)' : '#F87171' }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>{slot} hrs</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: isFree ? 'var(--secondary)' : '#F87171', textTransform: 'uppercase' }}>
                          {isFree ? 'Disponible' : 'Ocupado'}
                        </span>
                        {isFree ? <Check size={14} style={{ color: 'var(--secondary)' }} /> : <X size={14} style={{ color: '#F87171' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom active slot CSS */}
            <style>{`
              .active-slot {
                background-color: rgba(16, 185, 129, 0.15) !important;
                border-color: var(--secondary) !important;
              }
            `}</style>

          </div>
        </div>

        {/* RIGHT PANEL: RESERVATION REQUEST FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              2. Solicitar Reserva
            </h3>
            
            {statusMsg && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(16,185,129,0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span>{statusMsg}</span>
                <a 
                  href={`https://api.whatsapp.com/send?phone=5512345678&text=${encodeURIComponent(`Hola, solicité una reserva en Joga Bonito. Nombre: ${name || 'Cliente'}, Fecha: ${date}, Hora: ${time}. ¿Podrías confirmarla?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', alignSelf: 'flex-start', textDecoration: 'none' }}
                >
                  <MessageCircle size={14} /> Confirmar por WhatsApp
                </a>
              </div>
            )}

            {errorMsg && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Nombre del Responsable *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono de Contacto (WhatsApp) *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  placeholder="Ej. 5512345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            {/* Selected Summary Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Hora seleccionada:</span>
                <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem', marginTop: '2px' }}>
                  {time} hrs
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Duración estándar:</span>
                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '2px' }}>
                  1 Hora
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Comentarios o Indicaciones Especiales</label>
              <textarea
                placeholder="Ej. Traemos uniformes oscuros, ¿tienen balones de renta?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="form-textarea"
                rows={2}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%', padding: '12px' }}>
              Solicitar Reservación Pendiente
            </button>
          </form>

          {/* RESERVATION INFO WARNING */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: 'rgba(251, 191, 36, 0.03)', borderColor: 'rgba(251, 191, 36, 0.15)' }}>
            <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Políticas de Reservación:</strong>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                <li>Toda reservación queda sujeta a la aprobación del administrador tras confirmar depósito o anticipo.</li>
                <li>Cancelaciones válidas únicamente con 24 horas de anticipación para abono de saldo a favor.</li>
                <li>Los partidos oficiales de la Liga Azteca Cuautepec tienen prioridad absoluta sobre los horarios de las canchas.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reservations;
