import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { formatCPF, formatPhoneNumber } from '../utils/formatters';
import { ErrorMessage } from './ErrorMessage';
import './css/Create.css'

export function Create() {
    const[cpf, setCpf] = useState('');
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[phone, setPhone] = useState('');
    const[password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
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
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await api.post('/users/create', { cpf: cpf.replace(/\D/g, ''), name, email, phone: phone.replace(/\D/g, ''), password });
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verify if CPF or Email already exists!';
      setErrorMsg(errorMessage);
    }
  };

return (
  <div className="create-auth-container">
    <h2>Create your account</h2>
    <ErrorMessage message={errorMsg} />
    {successMsg && <div style={{
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      padding: '10px',
      borderRadius: '8px',
      marginBottom: '15px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid #81c784'
    }}>{successMsg}</div>}
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