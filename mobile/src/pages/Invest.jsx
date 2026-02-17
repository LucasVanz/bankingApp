import { useEffect, useState } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import './css/Invest.css';

export function Invest() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const handleInvest = (asset) => {
        // Redireciona para uma tela de confirmação ou abre um prompt de quantidade
        const quantity = prompt(`Quantas unidades de ${asset.ticker} deseja comprar?`);
        
        if (quantity && !isNaN(quantity)) {
            const investmentData = {
                ticker: asset.ticker,
                quantity: parseInt(quantity)
            };

            api.post('/transaction/investment', investmentData)
                .then(response => {
                    const transactionId = response.data;
                    navigate(`/confirmTransaction/${transactionId}`);
                })
                .catch(err => alert("Erro ao processar investimento: " + err.response?.data?.message));
        }
    };

    return (
        <div className="broker-screen">
            <div className="broker-container">
                <header className="broker-header">
                    <h2>Home Broker</h2>
                    <p>Select asset to invest</p>
                </header>

                {loading ? <p>Loading assets...</p> : (
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
                                    <span className="price">R$ {asset.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    <span className="yield">{asset.yieldPercentage}% yield</span>
                                </div>
                                <button className="btn-invest" onClick={() => handleInvest(asset)}>
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
        </div>
    );
}
