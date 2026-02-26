import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/InvestWallet.css';

export function InvestWallet() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvestment, setSelectedInvestment] = useState(null); // investimento clicado
    const [quantity, setQuantity] = useState(1); // quantidade a vender
    const [showModal, setShowModal] = useState(false); // controle do modal de venda
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

    // abrir modal de venda
    const handleOpenSellModal = (investment) => {
        setSelectedInvestment(investment);
        setQuantity(1);
        setShowModal(true);
    };

    // fechar modal de venda
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedInvestment(null);
    };

    const confirmSale = async () => {
        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }
        if (quantity > selectedInvestment.quantity) {
            alert("Quantity to sell cannot exceed what you own.");
            return;
        }

        const investmentData = {
            ticker: selectedInvestment.ticker,
            quantity: parseInt(quantity)
        };
        try {
            const response = await api.post('/transaction/investmentSell', investmentData);
            const transactionId = response.data;
            navigate(`/confirmTransaction/${transactionId}`);

            setInvestments(prev =>
                prev
                    .map(inv => {
                        if (inv.id === selectedInvestment.id) {
                            const remaining = inv.quantity - quantity;
                            return { ...inv, quantity: remaining };
                        }
                        return inv;
                    })
                    .filter(inv => inv.quantity > 0)
            );
        } catch (error) {
            console.error("Error selling investment", error);
        } finally {
            handleCloseModal();
        }
    };

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
                                    <button className="btn-sell" onClick={() => handleOpenSellModal(inv)}>
                                        Sell Asset
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            {/* --- MODAL DE VENDA --- */}
            {showModal && selectedInvestment && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <header className="modal-header">
                            <h3>Confirm Sale</h3>
                            <button className="close-x" onClick={handleCloseModal}>&times;</button>
                        </header>

                        <div className="modal-body">
                            <div className="asset-summary">
                                <strong>{selectedInvestment.ticker}</strong>
                                <span>{selectedInvestment.name}</span>
                            </div>

                            <div className="input-field">
                                <label>Quantity to sell</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedInvestment.quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="investment-details">
                                <div className="detail-row">
                                    <span>Unit Price:</span>
                                    <span>R$ {selectedInvestment.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="detail-row total">
                                    <span>Estimated Total:</span>
                                    <span>R$ {(selectedInvestment.currentPrice * (quantity || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        <footer className="modal-footer">
                            <button className="btn-confirm" onClick={confirmSale}>Confirm Sale</button>
                            <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}