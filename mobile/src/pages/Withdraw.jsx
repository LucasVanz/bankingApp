import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './css/Deposit.css';
import { ErrorMessage } from './ErrorMessage';
import { parseMoneyInput, formatMoneyDisplay } from '../utils/formatters';

export function Withdraw() {
    const [amount, setAmount] = useState(0);
    const [transactionId, setTransactionId] = useState(null);
    const [withdrawConfirmed, setWithdrawConfirmed] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    // Carrega o valor da transação
    const handleAmountChange = (e) => {
         setAmount(parseMoneyInput(e.target.value));
    };

    // Cria a transação de saque
    const handleWithdraw = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try{
            const response = await api.post('/transaction/withdraw', { amount: parseFloat(amount) / 100});
            setTransactionId(response.data);
            setWithdrawConfirmed(false);
        }catch(error){
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
    };

    // Verifica se a transação foi realizada
    useEffect(() => {
        let interval;
        if (transactionId && !withdrawConfirmed){
            interval = setInterval(async () => {
                try{
                    const response = await api.get(`/transaction/status/${transactionId}`);
                    if (response.data == 'COMPLETED'){
                        setWithdrawConfirmed(true);
                        clearInterval(interval);
                    }
                }catch(error){
                    console.error("Erro ao verificar status: ", error);
                    clearInterval(interval);
                }
            }, 2000)
        }
        return () => clearInterval(interval);
    }, [transactionId, withdrawConfirmed, navigate])

    // Atualiza a tela de saque indicando que a transação foi realizada
    const renderConfirmationScreen = () => (
        <div className="balance-card success-card">
            <div className="checkmark-wrapper">
             <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
             </svg>
            </div>
            <h2>Withdraw realized!</h2>
            <p>You withdrew <strong>R$ {formatMoneyDisplay(amount)}</strong> successfully!</p>
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
        <div className="dashboard-container">
            <h2 style={{ color: '#1a1a2e', textAlign:"center"}}>Withdraw by QRCode</h2>
            {withdrawConfirmed ? ( // Se confirmado, mostra a animação
                renderConfirmationScreen()
            ) : !transactionId ? (
                <form onSubmit={handleWithdraw} className="balance-card" style={{ background: 'white', color: '#333' }}>
                    <ErrorMessage message={errorMsg} />
                    <p style={{textAlign:"center"}}>Enter the amount to withdraw:</p>
                    <input 
                        type="text"
                        value={`R$ ${formatMoneyDisplay(amount)}`}
                        onChange={handleAmountChange}
                        placeholder="R$ 0,00"
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
                        Generate Code
                    </button>
                </form>
            ) : (
                <div className="balance-card" style={{ background: 'white', textAlign: 'center', color: '#333' }}>
                    <p>Scan to confirm <strong>R$ {formatMoneyDisplay(amount)}</strong></p>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '20px', 
                        background: 'white', 
                        borderRadius: '15px' 
                    }}>                 
                        <QRCodeSVG 
                           value={`http://localhost:8080/transaction/confirm/${transactionId}`} 
                           size={200}
                           marginSize={true} 
                        />
                    </div>
                    <button onClick={() => setTransactionId(null)} className="action-btn" style={{ marginTop: '20px' , backgroundColor: '#c4c4ddff'}}>
                        New Withdraw
                    </button>
                </div>
            )}
        </div>
    );

}