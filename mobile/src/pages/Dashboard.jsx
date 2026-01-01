import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [showBalance, setShowBalance] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Endpoint que precisamos criar no Java para retornar os dados do logado
                const responseUser = await api.get('/users/me'); 
                const responseWallet = await api.get('/users/me/wallet');
                setUserData(responseUser.data);
                setWalletData(responseWallet.data);
            } catch (error) {
                console.error(error);
                alert('Sessão expirada ou não autorizado');
                navigate('/');
            }
        };
        fetchUserData();
    }, [navigate]);

    if (!userData || !walletData) {
    return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container" style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <header>
                <h2>Hello, {userData.name}!</h2>
                <p>Agency {userData.agency} | Account {userData.account}-{userData.verificationDigit}</p>
            </header>

            <div className="balance-card" style={{ backgroundColor: '#3b3b98', color: 'white', padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
                <span>Balance</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3>{showBalance ? `R$ ${walletData.balance.toFixed(2)}` : 'R$ •••••'}</h3>
                    <button onClick={() => setShowBalance(!showBalance)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '5px', padding: '5px 10px' }}>
                        {showBalance ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '30px' }}>
                <button className="action-btn">Deposit</button>
                <button className="action-btn">Transfer</button>
                <button className="action-btn">Withdraw</button>
                <button className="action-btn">Bank statement</button>
            </div>
        </div>
    );
}