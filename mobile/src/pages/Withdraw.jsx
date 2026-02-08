import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './css/Withdraw.css';
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
        <div className="withdraw-page-wrapper"> {/* Wrapper de escopo */}
            <h2>Withdraw by QRCode</h2>
            {withdrawConfirmed ? (
                renderConfirmationScreen()
            ) : !transactionId ? (
                <form onSubmit={handleWithdraw} className="balance-card">
                    <ErrorMessage message={errorMsg} />
                    <p style={{textAlign:"center"}}>Enter the amount to withdraw:</p>
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
                </form>
            ) : (
                <div className="balance-card" style={{textAlign: 'center'}}>
                    <p>Scan to confirm <strong>R$ {formatMoneyDisplay(amount)}</strong></p>
                    <div className="qr-wrapper">                 
                        <QRCodeSVG 
                           value={`${window.location.origin}/confirmTransaction/${transactionId}`} 
                           size={200}
                           marginSize={true} 
                        />
                    </div>
                    <button onClick={() => setTransactionId(null)} className="action-btn">
                        New Withdraw
                    </button>
                </div>
            )}
        </div>
    );

}