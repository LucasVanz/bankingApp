import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatMoneyDisplay } from '../utils/formatters';

export function ConfirmTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState("");

    // 1. Busca os detalhes da transação para mostrar na tela
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/transaction/details/${id}`); // Endpoint que retorna o objeto Transaction
                setTransaction(response.data);
            } catch (err) {
                setError("Transaction not found");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    // 2. Executa o POST de confirmação
    const handleConfirm = async () => {
        setConfirming(true);
        try {
            await api.post(`/transaction/confirm/${id}`);
            alert("Transaction done!");
            navigate('/dashboard');
        } catch (err) {
            setError("Error processing confirmation. Verify your wallet.");
            setConfirming(false);
        }
    };

    if (loading) return <div className="loader">Loading details...</div>;

    return (
        <div className="deposit-page-wrapper">
            <div className="balance-card">
                <h2>Confirm Operation</h2>
                
                {error ? (
                    <p className="error-msg">{error}</p>
                ) : (
                    <div className="transaction-details">
                        <p><strong>Type:</strong> {transaction.type}</p>
                        <p><strong>Amount:</strong> R$ {formatMoneyDisplay(transaction.amount * 100)}</p>
                        
                        {/* Se for investimento, mostra o ativo */}
                        {transaction.financialAsset && (
                            <p><strong>Asset:</strong> {transaction.financialAsset.ticker}</p>
                        )}

                        <button 
                            onClick={handleConfirm} 
                            className="action-btn"
                            disabled={confirming}
                        >
                            {confirming ? "Processando..." : "Confirmar Agora"}
                        </button>
                    </div>
                )}
                
                <button onClick={() => navigate('/dashboard')} className="btn-cancel">
                    Back
                </button>
            </div>
        </div>
    );
}