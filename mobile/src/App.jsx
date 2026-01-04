import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Create } from './pages/Create';
import { Dashboard } from './pages/Dashboard';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Transfer } from './pages/Transfer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define a tela inicial como o Login */}
        <Route path="/" element={<Login />} />
        {/* Rota para a tela de cadastro */}
        <Route path="/create" element={<Create />} />
        {/* Rota para a tela de dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Rota para a tela de depósito */}
        <Route path="/deposit" element={<Deposit />} />
        {/* Rota para a tela de saque */}
        <Route path="/withdraw" element={<Withdraw />} />
        {/* Rota para a tela de transferência */}
        <Route path="/transfer" element={<Transfer />} />
        {/* Redireciona qualquer rota inexistente para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;