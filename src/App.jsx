import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';

// Page Imports
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Results from './pages/Results';
import Standings from './pages/Standings';
import Teams from './pages/Teams';
import Tournaments from './pages/Tournaments';
import Finals from './pages/Finals';
import Reservations from './pages/Reservations';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedEditMatch, setSelectedEditMatch] = useState(null);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home setCurrentTab={setCurrentTab} />;
      case 'schedule':
        return (
          <Schedule 
            setCurrentTab={setCurrentTab} 
            setSelectedEditMatch={setSelectedEditMatch} 
          />
        );
      case 'results':
        return (
          <Results 
            setCurrentTab={setCurrentTab} 
            setSelectedEditMatch={setSelectedEditMatch} 
          />
        );
      case 'standings':
        return <Standings />;
      case 'teams':
        return <Teams />;
      case 'tournaments':
        return <Tournaments setCurrentTab={setCurrentTab} />;
      case 'finals':
        return <Finals />;
      case 'reservations':
        return <Reservations />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return (
          <AdminPanel 
            selectedEditMatch={selectedEditMatch} 
            setSelectedEditMatch={setSelectedEditMatch} 
          />
        );
      default:
        return <Home setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="app-wrapper">
      <Header />
      
      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main className="main-content" style={{ padding: '20px 0' }}>
        {renderTabContent()}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '24px 16px',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'rgba(11, 15, 23, 0.4)',
        marginTop: 'auto'
      }}>
        <div className="container">
          <p>© 2026 Joga Bonito Fut 7 & Liga de Fútbol Rápido Azteca Cuautepec. Todos los derechos reservados.</p>
          <p style={{ marginTop: '4px', fontSize: '0.65rem' }}>Desarrollado para alto rendimiento deportivo y gestión digital.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
