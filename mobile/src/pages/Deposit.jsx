import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './css/Deposit.css';

export function Deposit() {
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [depositConfirmed, setDepositConfirmed] = useState(false);
    const navigate = useNavigate();
    // Cria a transação de depósito
    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
        const response = await api.post('/transaction/deposit', { amount: parseFloat(amount) });
        setTransactionId(response.data);
        setDepositConfirmed(false);
        } catch (error) {
      alert('Error: Deposit denied!');
        }
    };
    // Verifica se a transação foi realizada
    useEffect(() => {
        let interval;
        if (transactionId && !depositConfirmed){
            interval = setInterval(async () => {
                try{
                    const response = await api.get(`/transaction/status/${transactionId}`);
                    if (response.data == 'COMPLETED'){
                        setDepositConfirmed(true);
                        clearInterval(interval);
                    }
                } catch(error){
                    console.error("Erro ao verificar status:", error);
                    clearInterval(interval);
                }
            }, 2000)
        }
        return () => clearInterval(interval);
    }, [transactionId, depositConfirmed, navigate])
    // Atualiza a tela de depósito indicando que a transação foi realizada
    const renderConfirmationScreen = () => (
        <div className="balance-card success-card">
            <div className="checkmark-wrapper">
             <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
             </svg>
            </div>
            <h2>Deposit confirmed!</h2>
            <p>You deposited <strong>R$ {amount}</strong> successfully!</p>
            <button 
                onClick={() => navigate('/dashboard')} 
                className="action-btn btn-success-return"
            >
                Back to dashboard
            </button>
        </div>
    )
    
    return (
        <div className="dashboard-container">
            <h2 style={{ color: '#1a1a2e' }}>Deposit by QRCode</h2>
            {depositConfirmed ? ( // Se confirmado, mostra a animação
                renderConfirmationScreen()
            ) : !transactionId ? (
                <form onSubmit={handleDeposit} className="balance-card" style={{ background: 'white', color: '#333' }}>
                    <p>Enter the amount to deposit:</p>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                    <button type="submit" className="action-btn" style={{ width: '100%', marginTop: '15px' }}>
                        Generate Code
                    </button>
                </form>
            ) : (
                <div className="balance-card" style={{ background: 'white', textAlign: 'center', color: '#333' }}>
                    <p>Scan to confirm <strong>R$ {amount}</strong></p>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '20px', 
                        background: 'white', // Fundo branco para o QR contrastar
                        borderRadius: '15px' 
                    }}>                 
                        <QRCodeSVG 
                           value={`http://localhost:8080/transaction/confirm/${transactionId}`} 
                           size={200}
                           includeMargin={true} // Ajuda a destacar o código
                        />
                    </div>
                    <button onClick={() => setTransactionId(null)} className="action-btn" style={{ marginTop: '20px' }}>
                        New Deposit
                    </button>
                </div>
            )}
        </div>
    );
}

