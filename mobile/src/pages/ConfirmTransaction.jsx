import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatMoneyDisplay } from '../utils/formatters';
import './css/ConfirmTransaction.css'; // Importando o novo estilo

export function ConfirmTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/transaction/details/${id}`);
                setTransaction(response.data);
            } catch (err) {
                setError("Transaction not found or expired.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleConfirm = async () => {
        setConfirming(true);
        try {
            await api.post(`/transaction/confirm/${id}`);
            // Removi o alert genérico para usar algo mais fluido se quiser depois
            navigate('/dashboard', { state: { success: true } });
        } catch (err) {
            setError("Error processing confirmation. Verify your wallet.");
            setConfirming(false);
        }
    };

    if (loading) return <div className="loader">Loading secure connection...</div>;

    return (
        <div className="confirm-container">
            <div className="confirm-card">
                <span className="transaction-badge">{transaction?.type || 'Operation'}</span>
                <h2>Confirm Details</h2>
                
                {error ? (
                    <div className="error-box">
                        <p className="error-msg">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="amount-display">
                            R$ {formatMoneyDisplay(transaction.amount * 100)}
                        </div>

                        <div className="details-list">
                            <div className="detail-row">
                                <span>Status</span>
                                <strong>{transaction.status}</strong>
                            </div>

                            {transaction.financialAsset && (
                                <div className="detail-row">
                                    <span>Asset</span>
                                    <strong>{transaction.financialAsset.ticker}</strong>
                                </div>
                            )}
                            
                            <div className="detail-row">
                                <span>ID</span>
                                <small>{id.substring(0, 8)}...</small>
                            </div>
                        </div>

                        <div className="actions-group">
                            <button 
                                onClick={handleConfirm} 
                                className="btn-confirm"
                                disabled={confirming}
                            >
                                {confirming ? "Processing..." : "Confirm Payment"}
                            </button>
                            
                            <button onClick={() => navigate('/dashboard')} className="btn-back">
                                Cancel and Back
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}