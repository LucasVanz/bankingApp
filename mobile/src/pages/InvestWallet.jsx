import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/InvestWallet.css';

export function InvestWallet() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                // Endpoint conforme sua estrutura de User/Me
                const response = await api.get('/users/me/investmentWallet');
                setInvestments(response.data);
            } catch (error) {
                console.error("Error loading wallet", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    // Cálculo do patrimônio total baseado no preço ATUAL dos ativos
    const totalEquity = investments.reduce((acc, inv) => acc + (inv.quantity * inv.currentPrice), 0);

    return (
        <div className="wallet-screen">
            <div className="wallet-container">
                <header className="wallet-header">
                    <h2>My Investment Wallet</h2>
                    <div className="total-invested-card">
                        <span>Current Equity</span>
                        <h3>R$ {totalEquity.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                </header>

                {loading ? (
                    <p className="loading-text">Loading your assets...</p>
                ) : investments.length === 0 ? (
                    <div className="empty-wallet">
                        <p>You don't have any investments yet.</p>
                        <button className="btn-go-invest" onClick={() => navigate('/invest')}>
                            Start Investing
                        </button>
                    </div>
                ) : (
                    <div className="investments-grid">
                        {investments.map((inv, index) => (
                            <div className="investment-card" key={index}>
                                <div className="card-top">
                                    <div>
                                        <span className="ticker-badge">{inv.ticker}</span>
                                        <p className="asset-name-small">{inv.name}</p>
                                    </div>
                                    <div className="quantity-badge">
                                        {inv.quantity} units
                                    </div>
                                </div>
                                
                                <div className="card-body">
                                    <div className="info-row">
                                        <span>Avg. Price:</span>
                                        <span>R$ {inv.avaragePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="info-row">
                                        <span>Current Price:</span>
                                        <span>R$ {inv.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="info-row highlight">
                                        <span>Profitability:</span>
                                        <span className={inv.profitability >= 0 ? "profit-positive" : "profit-negative"}>
                                            {inv.profitability > 0 ? "+" : ""}{inv.profitability.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%
                                        </span>
                                    </div>
                                    <div className="card-footer-price">
                                        <span>Subtotal:</span>
                                        <strong>R$ {(inv.quantity * inv.currentPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}