import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

/*import PacientesListPage from './pages/PacientesListPage';*/
import './pages/PacientesListPage.css';
import PesquisaPacientesPage from './pages/PesquisaPacientesPage';
import './pages/PesquisaPacientesPage.css';
import CadastroPacientePage from './pages/CadastroPaciente';
import './pages/CadastroPaciente.css';
import EditarPacientePage from './pages/EditarPacientePage';

function HomePage() {
  return(
    <div
      style={{
        backgroundImage: "url('/lab.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.8,
      }}
    >
      <h1 style={{ color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.7)", fontSize: "3rem" }}>Gestão de Pacientes</h1>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {}
        <nav style={{ padding: '2rem', backgroundColor: '#333', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'white', margin: '0 15px', textDecoration: 'none', fontWeight: 'bold'}}>Início</Link>
          <Link to="/pacientes/novo" style={{ color: 'white', margin: '0 15px', textDecoration: 'none', fontWeight: 'bold'}}>Cadastrar Paciente</Link>
          <Link to="/pacientes/pesquisar" style={{ color: 'white', margin: '0 15px', textDecoration: 'none', fontWeight: 'bold'}}>Pesquisar Pacientes</Link>
        </nav>
      </header>
      
      <main>
        {/* Gerenciador de Rotas */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pacientes/novo" element={<CadastroPacientePage />} />
          <Route path="/pacientes/pesquisar" element={<PesquisaPacientesPage />} />
          <Route path="/pacientes/editar/:id" element={<EditarPacientePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;