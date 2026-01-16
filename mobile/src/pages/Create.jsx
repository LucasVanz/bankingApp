import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Create.css'

export function Create() {
    const[cpf, setCpf] = useState('');
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
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
      const response = await api.post('/users/create', { cpf: cpf.replace(/\D/g, ''), name, email, password });
      alert('Account created succesfully!');
      navigate('/');
    } catch (error) {
      alert('Error: Verify if CPF or Email already exists!');
    }
  };

return (
  <div className="create-auth-container">
    <h2>Create your account</h2>
    <form className='create-form' onSubmit={handleSubmit}>
      <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} />
      <input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Create Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="btn-primary">Finish</button>
      <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Back to login</button>
    </form>
  </div>
);
}