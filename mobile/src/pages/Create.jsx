import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { formatCPF, formatPhoneNumber } from '../utils/formatters';
import './css/Create.css'

export function Create() {
    const[cpf, setCpf] = useState('');
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[phone, setPhone] = useState('');
    const[password, setPassword] = useState('');
    const navigate = useNavigate();

    // Formata o CPF
    const handleCpfChange = (e) => {
        const maskedCpf = formatCPF(e.target.value);
        setCpf(maskedCpf);
    };

    const handlePhoneChange = (e) => {
        const maskedPhone = formatPhoneNumber(e.target.value);
        setPhone(maskedPhone);
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/create', { cpf: cpf.replace(/\D/g, ''), name, email, phone: phone.replace(/\D/g, ''), password });
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
      <input type="tel" placeholder="(99) 99999-9999" value={phone} onChange={handlePhoneChange}/>
      <input type="password" placeholder="Create Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="btn-primary">Finish</button>
      <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Back to login</button>
    </form>
  </div>
);
}