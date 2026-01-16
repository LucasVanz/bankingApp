import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { formatCPF, stripNonDigits } from '../utils/formatters';
import './css/Login.css'

export function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Formata o CPF
  const handleCpfChange = (e) => {
        const maskedValue = formatCPF(e.target.value)
        setCpf(maskedValue);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { cpf: stripNonDigits(cpf), password });
      localStorage.setItem('token', response.data);
      alert('Login success!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error: Verify if CPF or password are correct!');
    }
  };

  return (
  <div className="login-auth-container">
    <h2>LBank</h2>
    <p>Access your account</p>
    <form className="login-form" onSubmit={handleSubmit}>
      <input type="cpf" placeholder="CPF" value = {cpf} onChange={handleCpfChange} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="btn-primary">Login</button>
      <button type="button" className="btn-secondary" onClick={() => navigate('/create')}>
        Create a free account
      </button>
    </form>
  </div>
);
}