import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Dashboard.css';
import logoImg from './images/Logo.png';
import depositImage from './images/Deposit.png';
import withdrawImage from './images/Withdraw.png';
import transferImage from './images/Transfer.png';
import statementImage from './images/Statement.png';
import analisysImage from './images/Analisys.png';
import userImage from './images/User.png';

export function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [showBalance, setShowBalance] = useState(true);
    const navigate = useNavigate();

    // Area dos dados do usuário
    const showUserArea = async () => {
        navigate('/userDetails', { 
            state: { 
                name: userData.name, 
                email: userData.email,
                phone: userData.phone,
                photo: userData.photoBase64
            }
        });
    };
    // Depósito
    const handleDeposit = async () => {
        navigate('/deposit');
    };
    // Transferência
    const handleTransfer = async () => {
        navigate('/transfer');
    };
    // Saque
    const handleWithdraw = async () => {
        navigate('/withdraw');
    };
    // Extrato
    const handleStatement = async () => {
        navigate('/statement');
    };
    // Extrato
    const handleAnalisys = async () => {
        navigate('/analisys');
    };
    // Login
    const handleLogin = async () => {
        navigate('/');
    };
    // Menu Inicial    
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
                alert('Session expired or not authorized');
                navigate('/');
            }
        };
        fetchUserData();
    }, [navigate]);

    if (!userData || !walletData) {
    return <div>Loading...</div>;
    }

    return (
    <div className="dashboard-container">
        <header style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <img 
                src={logoImg} 
                alt="LBank Logo" 
                style={{ display: 'flex', width: '200px', objectFit: 'contain' }} 
            />
        </header>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1 style={{ color: '#1a1a2e', margin: '5px 4px', fontSize: '17px'}}>Hello, {userData.name}!</h1>
                <p style={{ color: '#7b7f9e', margin: '5px 4px', fontSize: '14px' }}>
                    Agency {userData.agency} | Account {userData.account}-{userData.verificationDigit}
                </p>
            </div>
            <div style={{background: 'none', padding: '10px', fontSize: '2px' }}>
                <button className='user-button' onClick={showUserArea}>
                    <img src={userImage} alt="User image" style={{
                        width: '35px',   // Ajuste este valor conforme desejar
                        height: '35px', 
                        objectFit: 'cover',
                        borderRadius: '80%'
                    }}/>
                </button>
            </div>
        </header>

        <div className="balance-card">
            <span style={{ opacity: 0.8, fontSize: '14px', fontWeight: '500' }}>Available Balance</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <h2 style={{ color: '#ffffffff', fontSize: '20px', margin: 0, fontWeight: '500' }}>
                    {showBalance ? `R$ ${walletData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'R$ •••••'}
                </h2>
                <button 
                    onClick={() => setShowBalance(!showBalance)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',width: 'fit-content'}}
                >
                    {showBalance ? 'Hide' : 'Show'}
                </button>
            </div>
        </div>
        <div className="actions-grid">
            <button className="dashboard-action-btn" onClick={handleDeposit}>
                <div className="icon-box">
                    <img src={depositImage} 
                    alt="Deposit image" 
                    style={{ display: 'flex', width: '50px', objectFit: 'contain' }}
                    />
                </div>
                <span>Deposit</span>
            </button>
            <button className="dashboard-action-btn" onClick={handleTransfer}>
                <div className="icon-box">
                    <img src={transferImage} 
                    alt="Transfer image" 
                    style={{ display: 'flex', width: '50px', objectFit: 'contain' }}
                    />
                </div>
                <span>Transfer</span>
            </button>
            <button className="dashboard-action-btn" onClick={handleWithdraw}>
                <div className="icon-box">
                    <img src={withdrawImage} 
                    alt="Withdraw image" 
                    style={{ display: 'flex', width: '50px', objectFit: 'contain' }}
                    />
                </div>
                <span>Withdraw</span>
            </button>
            <button className="dashboard-action-btn" onClick={handleStatement}>
                <div className="icon-box">
                    <img src={statementImage} 
                    alt="Statement image" 
                    style={{ display: 'flex', width: '50px', objectFit: 'contain' }}
                    />
                </div>
                <span>Statement</span>
            </button>
            <button className="dashboard-action-btn" onClick={handleAnalisys}>
                <div className="icon-box">
                    <img src={analisysImage} 
                    alt="Statement image" 
                    style={{ display: 'flex', width: '50px', objectFit: 'contain' }}
                    />
                </div>
                <span>Financial Analisys</span>
            </button>
            <button className="dashboard-action-btn" onClick={handleLogin}>
                <div className="icon-box">↪</div>
                <span>Exit</span>
            </button>
        </div>
    </div>
    );
}