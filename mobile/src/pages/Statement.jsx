import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Statement.css';
import { formatCPF, stripNonDigits, formatMoneyDisplay } from '../utils/formatters';
import { ErrorMessage } from './ErrorMessage';

export function Statement() {
    const [transactions, setTransactions] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleAllStatement = () => {
        const url = "/users/me/transactions";
        handleStatement(url);
    }
    const handleExpensesStatement = () => {
        const url = "/users/me/transactions/expenses";
        handleStatement(url);
    }
    const handleIncomeStatement = () => {
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
            const response = await api.get(url);
            setTransactions(response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setErrorMsg(errorMessage);
        }
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
                    <button className="all-statement" onClick={handleAllStatement}>
                       <span>All</span>
                    </button>
                    <button className="expenses-statement" onClick={handleExpensesStatement}>
                        <span>Expenses</span>
                    </button>
                    <button className="income-statement" onClick={handleIncomeStatement}>
                       <span>Income</span>
                    </button>
                </div>
                    {transactions.map((transaction) => {
                        const corAtual = transaction.type === 'DEPOSIT' ? '#11bd36' : '#c01010ff';
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