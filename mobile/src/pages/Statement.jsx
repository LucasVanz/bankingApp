import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Statement.css';

export function Statement() {
    const [transactions, setTransactions] = useState([]);
    const [idUser, setIdUser] = useState("");
    const [typeStatement, setTypeStatement] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleAllStatement = () => {
        setTypeStatement("ALL");
        const url = "/users/me/transactions";
        handleStatement(url);
    }
    const handleExpensesStatement = () => {
        setTypeStatement("EXPENSES");
        const url = "/users/me/transactions/expenses";
        handleStatement(url);
    }
    const handleIncomeStatement = () => {
        setTypeStatement("INCOME");
        const url = "/users/me/transactions/income";
        handleStatement(url);
    }
    const handleBackStatement = () => {
        navigate("/dashboard");
    }

    const handleStatement = async (url) => {
        setErrorMsg("");
        setTransactions([]);
        try {
            const responseName = await api.get("/users/me");
            setIdUser(responseName.data.id);
            const response = await api.get(url);
            setTransactions(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
    }

    // Chama a requisição para indicar todos os extratos no primeiro acesso aos extratos
    if (typeStatement === ""){
        handleAllStatement();
    }
    
    
    return (
        <div className='statement-page-wrapper'>
            <div className='statement-container'>
                <div>
                <button className="back-statement" onClick={handleBackStatement}>
                       <span>Back to dashboard</span>
                </button>
                </div>
                <div className='statement-filters'>
                    <button className={`all-statement ${typeStatement === "ALL" ? "active" : ""}`} onClick={handleAllStatement}>
                       <span>All</span>
                    </button>
                    <button className={`expenses-statement ${typeStatement === "EXPENSES" ? "active" : ""}`} onClick={handleExpensesStatement}>
                        <span>Expenses</span>
                    </button>
                    <button className={`income-statement ${typeStatement === "INCOME" ? "active" : ""}`} onClick={handleIncomeStatement}>
                       <span>Income</span>
                    </button>
                </div>
                    {transactions.map((transaction) => {
                        const corAtual = transaction.type === 'DEPOSIT' || transaction.receiverWallet.user.id === idUser ? '#11bd36' : '#c01010ff';
                        return (
                        <div key={transaction.id} className="statement-transaction-card">
                            <div className="statement-amount-text" style={{color: corAtual}}>
                                R$ {transaction.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </div>
                            <div className="statement-details-text">
                                <strong>{transaction.type}</strong><br />
                                    {transaction.type === 'TRANSFER' && (
                                    <>
                                        <span>To: {transaction.receiverWallet?.user?.name}</span><br />
                                        <span>From: {transaction.wallet?.user?.name}</span><br />
                                    </>
                                    )}
                                Date: {transaction.createdAt}    
                            </div>
                        </div>
                    )})}
            </div>
        </div>
    )
}