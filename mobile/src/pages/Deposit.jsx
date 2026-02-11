import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './css/Deposit.css';
import { ErrorMessage } from './ErrorMessage';
import { parseMoneyInput, formatMoneyDisplay } from '../utils/formatters';

export function Deposit() {
    const [amount, setAmount] = useState(0);
    const [transactionId, setTransactionId] = useState(null);
    const [depositConfirmed, setDepositConfirmed] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    
    const handleAmountChange = (e) => {
        setAmount(parseMoneyInput(e.target.value));
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            // O backend retorna o UUID da transação PENDING
            const response = await api.post('/transaction/deposit', { amount: parseFloat(amount) / 100});
            setTransactionId(response.data);
            setDepositConfirmed(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
    };

    // Polling: Verifica o status da transação a cada 2 segundos
    useEffect(() => {
        let interval;
        if (transactionId && !depositConfirmed){
            interval = setInterval(async () => {
                try{
                    const response = await api.get(`/transaction/status/${transactionId}`);
                    // Quando o usuário confirmar na outra tela, o status vira 'COMPLETED'
                    if (response.data === 'COMPLETED'){
                        setDepositConfirmed(true);
                        clearInterval(interval);
                    }
                } catch(error){
                    console.error("Erro ao verificar status: " + error);
                }
            }, 2000)
        }
        return () => clearInterval(interval);
    }, [transactionId, depositConfirmed]); // Removido 'navigate' das dependências para evitar loops

    const renderConfirmationScreen = () => (
        <div className="balance-card success-card">
            <div className="checkmark-wrapper">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <h2>Deposit confirmed!</h2>
            <p>You deposited <strong>R$ {formatMoneyDisplay(amount)}</strong> successfully!</p>
            <button 
                onClick={() => navigate('/dashboard')} 
                className="action-btn btn-success-return"
            >
                Back to dashboard
            </button>
        </div>
    )

    return (
        <div className="deposit-page-wrapper">
            <h2>Deposit by QRCode</h2>
        
        {depositConfirmed ? (
            renderConfirmationScreen()
        ) : !transactionId ? (
            <form onSubmit={handleDeposit} className="balance-card">
                <ErrorMessage message={errorMsg} />
                <p style={{textAlign: 'center'}}>Enter the amount to deposit:</p>
                <input 
                    type="text"
                    className="money-input"
                    value={`R$ ${formatMoneyDisplay(amount)}`}
                    onChange={handleAmountChange}
                    placeholder="R$ 0,00"
                />
                <button type="submit" className="action-btn">
                    Generate Code
                </button>
                <button className="deposit-back-button" onClick={() => navigate('/dashboard')}>
                    Back
                </button>
            </form>
        ) : (
            <div className="balance-card qr-container">
                <p>Scan to confirm <strong>R$ {formatMoneyDisplay(amount)}</strong></p>
                <div className="qr-wrapper">
                    <QRCodeSVG 
                       value={`${window.location.origin}/confirmTransaction/${transactionId}`} 
                       size={200}
                       marginSize={true}
                    />
                </div>
                <p className="qr-hint">After scanning, confirm the payment on your phone.</p>
                <button onClick={() => setTransactionId(null)} className="action-btn btn-secondary">
                    Cancel / New Deposit
                </button>
            </div>
        )}
    </div>
);
}