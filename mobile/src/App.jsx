import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Create } from './pages/Create';
import { Dashboard } from './pages/Dashboard';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Transfer } from './pages/Transfer';
import { Statement } from './pages/Statement';
import { Analisys } from './pages/Analisys';
import { UserDetails } from './pages/UserDetails';
import { ConfirmTransaction } from './pages/confirmTransaction';

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
        {/* Rota para a tela de extrato */}
        <Route path="/statement" element={<Statement />} />
        {/* Rota para a tela de análise financeira */}
        <Route path="/analisys" element={<Analisys />} />
        {/* Rota para a tela de detalhes do usuário */}
        <Route path="/userDetails" element={<UserDetails />} />
        {/* Rota para a tela de confirmação */}
        <Route path="/confirmTransaction/:id" element={<ConfirmTransaction />} />
        {/* Redireciona qualquer rota inexistente para o login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;