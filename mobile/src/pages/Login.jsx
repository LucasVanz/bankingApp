import React, { useState } from 'react';
import api from '../services/api';

export function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { cpf, password });
      localStorage.setItem('token', response.data.token);
      alert('Login feito com sucesso!');
    } catch (error) {
      alert('Erro ao logar');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Acessar Banco</h2>
      <form onSubmit={handleSubmit}>
        <input type="cpf" placeholder="CPF" onChange={e => setCpf(e.target.value)} /><br/>
        <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}