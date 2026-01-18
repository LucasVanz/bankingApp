import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Analisys.css';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const COLORS_MAP = {
    deposit: '#00C49F',    // Verde
    received: '#0088FE',   // Azul
    withdraw: '#FFBB28',  // Laranja
    sent: '#FF4444'       // Vermelho
};

export function Analisys() {
    const [analisysData, setAnalisysData] = useState(null);
    const navigate = useNavigate();

    const handleDashboard = async () => {
        navigate('/dashboard');
    }


    const loadAnalisys = async (e) => {
        try {
            const response = await api.get('users/me/analisys');
            setAnalisysData(response.data);
        } catch (error) {
            console.error("Erro ao carregar os dados do gráfico:", error);
        }
    };

    useEffect(() => {
        loadAnalisys();
    }, []);

    const dataGrafico = analisysData ? [
        { name: 'Transfers Sent Amount', value: analisysData.totalAmountTransferSent },
        { name: 'Transfers Received Amount', value: analisysData.totalAmountTransferReceived },
        { name: 'Withdraw Amount', value: analisysData.totalAmountWithdraw },
        { name: 'Deposit Amount', value: analisysData.totalAmountDeposit },
        { name: 'Total Transfers Sent', value: analisysData.countTransferSent },
        { name: 'Total Transfers Received', value: analisysData.countTransferReceived },
        { name: 'Total Withdraws', value: analisysData.countWithdraw },
        { name: 'Total Deposits', value: analisysData.countDeposit }
    ] : [];

    const dataValores = analisysData ? [
    { name: 'Deposits', value: analisysData.totalAmountDeposit, color: COLORS_MAP.deposit },
    { name: 'Received', value: analisysData.totalAmountTransferReceived, color: COLORS_MAP.received },
    { name: 'Sent', value: analisysData.totalAmountTransferSent, color: COLORS_MAP.sent },
    { name: 'Withdraws', value: analisysData.totalAmountWithdraw, color: COLORS_MAP.withdraw },
] : [];

    // Gráfico 2: Frequência (Quantidade de Transações)
    const dataQuantidades = analisysData ? [
        { name: 'Transfers Sent', value: analisysData.countTransferSent, color: COLORS_MAP.deposit },
        { name: 'Transfers Received', value: analisysData.countTransferReceived, color: COLORS_MAP.received },
        { name: 'Withdraws', value: analisysData.countWithdraw, color: COLORS_MAP.sent },
        { name: 'Deposits', value: analisysData.countDeposit, color: COLORS_MAP.withdraw },
    ] : [];

    const totalCashFlow = analisysData ? (
    analisysData.totalAmountDeposit + 
    analisysData.totalAmountTransferReceived + 
    analisysData.totalAmountTransferSent + 
    analisysData.totalAmountWithdraw
    ) : 0;

    const totalTransactions = analisysData ? (
    analisysData.countDeposit + 
    analisysData.countTransferReceived + 
    analisysData.countTransferSent + 
    analisysData.countWithdraw
    ) : 0;

    return (
    <div className="analisys-screen">
        <header className="analisys-header">
            
            <h2>Financial Analysis</h2>
        </header>

        <main className="charts-main-container">
            {/* Gráfico 1: Volume */}
            <section className="chart-section">
                <div className="chart-header-inline">
                    <h3>Money Volume (R$)</h3>
                    <div className="total-badge">
                        Total cash flow: R$ {totalCashFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataValores}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="85%"
                            paddingAngle={5}
                        >
                            {dataValores.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                        <Legend 
                            iconType="circle" 
                            layout="horizontal" 
                            verticalAlign="bottom" 
                            align="center"
                            wrapperStyle={{
                                paddingTop: "10px",
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                width: "100%"
                            }}
                            content={(props) => {
                                const { payload } = props;
                                return (
                                    <ul className="custom-2-column-legend">
                                        {payload.map((entry, index) => (
                                            <li key={`item-${index}`} className="legend-item">
                                                <span 
                                                    className="dot" 
                                                    style={{ backgroundColor: entry.color }}
                                                ></span>
                                                <span className="label">{entry.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </section>

            {/* Gráfico 2: Quantidade */}
            <section className="chart-section">
                <div className="chart-header-inline">
                    <h3>Transactions Count</h3>
                    <div className="total-badge">
                        Total transactions: {totalTransactions}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataQuantidades}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="85%"
                            paddingAngle={5}
                        >
                            {dataQuantidades.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} operations`} />
                        <Legend 
                            iconType="circle" 
                            layout="horizontal" 
                            verticalAlign="bottom" 
                            align="center"
                            wrapperStyle={{
                                paddingTop: "10px",
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                width: "100%"
                            }}
                            content={(props) => {
                                const { payload } = props;
                                return (
                                    <ul className="custom-2-column-legend">
                                        {payload.map((entry, index) => (
                                            <li key={`item-${index}`} className="legend-item">
                                                <span 
                                                    className="dot" 
                                                    style={{ backgroundColor: entry.color }}
                                                ></span>
                                                <span className="label">{entry.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </section>
        </main>
        <button className="analisys-back-button" onClick={handleDashboard}>Back</button>
    </div>
);
}