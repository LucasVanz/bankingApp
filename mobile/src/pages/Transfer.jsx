import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Deposit.css';
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

    // Formata o CPF
    const handleCpfChange = (e) => {
        setDestinationCpf(formatCPF(e.target.value));
    };

    // Carrega o valor da transação
    const handleAmountChange = (e) => {
        setAmount(parseMoneyInput(e.target.value));
    };

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

    // Configuração dos campos do saque
    return (
        <div className="dashboard-container">
            <h2 style={{ color: '#1a1a2e', textAlign:"center"}}>Transfer</h2>
                {transferConfirmed ? (
                    renderConfirmationScreen()
                ) : !transactionId ? (
                <form onSubmit={handleTransfer} className="balance-card" style={{ background: 'white', color: '#333' }}>
                    <ErrorMessage message={errorMsg} />
                    <p style={{textAlign:"center"}}>Enter the data to transfer:</p>
                    <input 
                        type="text"
                        value={`R$ ${formatMoneyDisplay(amount)}`}
                        onChange={handleAmountChange}
                        placeholder="Amount"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd',
                            fontSize: '20px',
                            textAlign: 'center'
                        }}
                    />
                    <input 
                        type="cpf"
                        value = {destinationCpf}
                        onChange={handleCpfChange}
                        placeholder="Destination CPF"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd',
                            fontSize: '20px',
                            textAlign: 'center'
                        }}
                    />
                    <button type="submit" className="action-btn" style={{ width: '100%', marginTop: '15px', backgroundColor: '#c4c4ddff'}}>
                        Confirm transfer
                    </button>
                </form>
            ) : (
                <div className="balance-card" style={{ background: 'white', textAlign: 'center', color: '#333' }}>
                    <p>Type your password to confirm</p>
                    <input 
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            border: '1px solid #ddd',
                            fontSize: '20px',
                            textAlign: 'center'
                        }}
                    />
                </div>
            )}
        </div>
    );
} 