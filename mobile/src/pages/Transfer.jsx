import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Transfer.css';
import { ErrorMessage } from './ErrorMessage';
import { formatCPF, stripNonDigits, parseMoneyInput, formatMoneyDisplay } from '../utils/formatters';

export function Transfer() {
    const [amount, setAmount] = useState(0);
    const [destinationCpf, setDestinationCpf] = useState("");
    const [transactionId, setTransactionId] = useState(null);
    const [transferConfirmed, setTransferConfirmed] = useState(false);
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();


    // Cria a transação de saque
    const handleTransfer = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try{
            const response = await api.post('/transaction/transfer', { amount: parseFloat(amount) / 100, receiverCpf: stripNonDigits(destinationCpf)});
            setTransactionId(response.data);
            setTransferConfirmed(false);
        }catch(error){
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
    };

    const handleConfirmTransfer = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try{
            await api.post(`/transaction/transfer/confirm/${transactionId}`, { password: password });
            setTransferConfirmed(true);
        }catch(error){
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
    }

    // Atualiza a tela de transferência indicando que a transação foi realizada
    const renderConfirmationScreen = () => (
        <div className="balance-card success-card">
            <div className="checkmark-wrapper">
             <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
             </svg>
            </div>
            <h2>Transfer realized!</h2>
            <p>You transfer <strong>R$ {formatMoneyDisplay(amount)}</strong> successfully!</p>
            <button 
                onClick={() => navigate('/dashboard')} 
                className="action-btn btn-success-return"
            >
                Back to dashboard
            </button>
        </div>
    )

    // Configuração dos campos do saque
    return (
    <div className="transfer-page"> {/* Classe de escopo adicionada */}
        <h2>Transfer</h2>
        
        {transferConfirmed ? (
            renderConfirmationScreen()
        ) : !transactionId ? (
            <form onSubmit={handleTransfer} className="balance-card">
                <ErrorMessage message={errorMsg} />
                <p style={{ textAlign: "center", marginBottom: "15px" }}>Enter the data to transfer:</p>
                
                <input 
                    type="text"
                    value={`R$ ${formatMoneyDisplay(amount)}`}
                    onChange={e => setAmount(parseMoneyInput(e.target.value))}
                    placeholder="Amount"
                />
                
                <input 
                    type="text"
                    value={destinationCpf}
                    onChange={e => setDestinationCpf(formatCPF(e.target.value))}
                    placeholder="Destination CPF"
                />
                
                <button type="submit" className="action-btn">
                    Confirm transfer
                </button>
            </form>
        ) : (
            <form onSubmit={handleConfirmTransfer} className="balance-card">
                <ErrorMessage message={errorMsg} />
                <p style={{ textAlign: "center", marginBottom: "15px" }}>Type your password to confirm</p>
                
                <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
                
                <button type="submit" className="action-btn">
                    Confirm
                </button>
            </form>
        )}
    </div>
);
} 