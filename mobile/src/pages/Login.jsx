import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Formata o CPF
  const handleCpfChange = (e) => {
        let val = e.target.value.replace(/\D/g, "");
        val = val.replace(/(\d{3})(\d)/, "$1.$2")
                 .replace(/(\d{3})(\d)/, "$1.$2")
                 .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        setCpf(val.substring(0, 14));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { cpf: cpf.replace(/\D/g, ''), password });
      localStorage.setItem('token', response.data);
      alert('Login success!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error: Verify if CPF or password are correct!');
    }
  };

  return (
  <div className="auth-container">
    <h2>LBank</h2>
    <p>Access your account</p>
    <form onSubmit={handleSubmit}>
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