import { useEffect, useState } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import './css/Invest.css';

export function Invest() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState(null); // Ativo clicado
    const [quantity, setQuantity] = useState(1); // Quantidade no modal
    const [showModal, setShowModal] = useState(false); // Controle do modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await api.get('/financialAssets/homebroker');
                setAssets(response.data);
            } catch (error) {
                console.error("Erro ao carregar ativos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    // Abre o modal e limpa a quantidade
    const handleOpenModal = (asset) => {
        setSelectedAsset(asset);
        setQuantity(1);
        setShowModal(true);
    };

    // Fecha o modal e limpa o ativo selecionado
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAsset(null);
    };

    const confirmInvestment = async () => {
        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const investmentData = {
            ticker: selectedAsset.ticker,
            quantity: parseInt(quantity)
        };

        try {
            const response = await api.post('/transaction/investment', investmentData);
            const transactionId = response.data;
            navigate(`/confirmTransaction/${transactionId}`);
        } catch (err) {
            alert("Erro ao processar investimento: " + (err.response?.data?.message || "Erro desconhecido"));
        }
    };

    return (
        <div className="broker-screen">
            <div className="broker-container">
                <header className="broker-header">
                    <h2>Home Broker</h2>
                    <button className="btn-portfolio" onClick={() => navigate("/investWallet")}>
                        My wallet
                    </button>
                    <p>Select asset to invest</p>
                </header>

                {loading ? <p className="loading-text">Loading assets...</p> : (
                    <div className="assets-grid">
                        {assets.map(asset => (
                            <div className="asset-card" key={asset.ticker}>
                                <div className="asset-info">
                                    <span className={`asset-type ${asset.type.toLowerCase()}`}>
                                        {asset.type}
                                    </span>
                                    <h3>{asset.ticker}</h3>
                                    <p>{asset.name}</p>
                                </div>
                                <div className="asset-price">
                                    <span className="price">
                                        R$ {asset.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="yield">{asset.yieldPercentage}% yield</span>
                                </div>
                                <button className="btn-invest" onClick={() => handleOpenModal(asset)}>
                                    Invest
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            {/* --- MODAL DE INVESTIMENTO --- */}
            {showModal && selectedAsset && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <header className="modal-header">
                            <h3>Confirm Investment</h3>
                            <button className="close-x" onClick={handleCloseModal}>&times;</button>
                        </header>
                        
                        <div className="modal-body">
                            <div className="asset-summary">
                                <strong>{selectedAsset.ticker}</strong>
                                <span>{selectedAsset.name}</span>
                            </div>

                            <div className="input-field">
                                <label>Quantity</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="investment-details">
                                <div className="detail-row">
                                    <span>Unit Price:</span>
                                    <span>R$ {selectedAsset.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="detail-row total">
                                    <span>Estimated Total:</span>
                                    <span>R$ {(selectedAsset.currentPrice * (quantity || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        <footer className="modal-footer">
                            <button className="btn-confirm" onClick={confirmInvestment}>Confirm Purchase</button>
                            <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}