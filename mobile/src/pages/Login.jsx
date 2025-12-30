import React, { useState } from 'react';
import api from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
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
        <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} /><br/>
        <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} /><br/>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}