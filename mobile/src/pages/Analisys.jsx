import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './css/Analisys.css';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const COLORS_MAP = {
    deposit: '#00C49F',    // Verde
    received: '#0088FE',   // Azul
    withdraw: '#FFBB28',   // Laranja
    sent: '#FF4444',       // Vermelho
    investment: '#3b3b98'  // Roxo (Identidade visual do app)
};

export function Analisys() {
    const [analisysData, setAnalisysData] = useState(null);
    const navigate = useNavigate();

    const loadAnalisys = async () => {
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

    // 1. Dados de Volume (Valores em R$)
    const dataValores = analisysData ? [
        { name: 'Deposits', value: analisysData.totalAmountDeposit || 0, color: COLORS_MAP.deposit },
        { name: 'Received', value: analisysData.totalAmountTransferReceived || 0, color: COLORS_MAP.received },
        { name: 'Sent', value: analisysData.totalAmountTransferSent || 0, color: COLORS_MAP.sent },
        { name: 'Withdraws', value: analisysData.totalAmountWithdraw || 0, color: COLORS_MAP.withdraw },
        { name: 'Investments', value: analisysData.totalAmountInvestment || 0, color: COLORS_MAP.investment },
    ] : [];

    // 2. Dados de Frequência (Quantidade de operações)
    const dataQuantidades = analisysData ? [
        { name: 'Deposits', value: analisysData.countDeposit || 0, color: COLORS_MAP.deposit },
        { name: 'Received', value: analisysData.countTransferReceived || 0, color: COLORS_MAP.received },
        { name: 'Sent', value: analisysData.countTransferSent || 0, color: COLORS_MAP.sent },
        { name: 'Withdraws', value: analisysData.countWithdraw || 0, color: COLORS_MAP.withdraw },
        { name: 'Investments', value: analisysData.countInvestment || 0, color: COLORS_MAP.investment },
    ] : [];

    // Filtros para evitar que o PieChart quebre com valores zero
    const filteredValores = dataValores.filter(d => d.value > 0);
    const filteredQuantidades = dataQuantidades.filter(d => d.value > 0);

    const totalCashFlow = dataValores.reduce((acc, curr) => acc + curr.value, 0);
    const totalTransactions = dataQuantidades.reduce((acc, curr) => acc + curr.value, 0);

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
                           Total flow: R$ {totalCashFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                       </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={filteredValores}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="85%"
                                paddingAngle={filteredValores.length > 1 ? 5 : 0}
                            >
                                {filteredValores.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                            <Legend 
                                verticalAlign="bottom" 
                                align="center"
                                content={(props) => (
                                    <ul className="custom-2-column-legend">
                                        {dataValores.map((entry, index) => (
                                            <li key={`item-${index}`} className="legend-item">
                                                <span className="dot" style={{ backgroundColor: entry.color }}></span>
                                                <span className="label">{entry.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </section>

                {/* Gráfico 2: Quantidade */}
                <section className="chart-section">
                    <div className="chart-header-inline">
                        <h3>Transactions Count</h3>
                        <div className="total-badge">Total: {totalTransactions}</div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={filteredQuantidades}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="85%"
                                paddingAngle={filteredQuantidades.length > 1 ? 5 : 0}
                            >
                                {filteredQuantidades.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} operations`} />
                            <Legend 
                                verticalAlign="bottom" 
                                align="center"
                                content={(props) => (
                                    <ul className="custom-2-column-legend">
                                        {dataQuantidades.map((entry, index) => (
                                            <li key={`item-${index}`} className="legend-item">
                                                <span className="dot" style={{ backgroundColor: entry.color }}></span>
                                                <span className="label">{entry.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </section>
            </main>
            <button className="analisys-back-button" onClick={() => navigate('/dashboard')}>Back</button>
        </div>
    );
}