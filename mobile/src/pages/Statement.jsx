import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "./ErrorMessage";
import { SuccessMessage } from "./SuccessMessage";
import "./css/Statement.css";

export function Statement() {
  const [transactions, setTransactions] = useState([]);
  const [idUser, setIdUser] = useState("");
  const [typeStatement, setTypeStatement] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Limpando mensagem de sucesso após exibição
  useEffect(() => {
    if (!successMsg) return;

    const timeout = setTimeout(() => {
      setSuccessMsg("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [successMsg]);

  // Função para formatar data para YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Inicializar datas padrão e fazer a requisição inicial
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(formatDate(thirtyDaysAgo));
    setEndDate(formatDate(today));
    setTypeStatement("ALL");
    setIsInitialized(true);
  }, []);

  // Fazer requisição apenas na primeira inicialização
  useEffect(() => {
    if (isInitialized && startDate && endDate && typeStatement) {
      handleAllStatement();
    }
  }, [isInitialized]);

  const handleAllStatement = () => {
    setTypeStatement("ALL");
    const url = `/users/me/transactions?type=ALL${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`;
    handleStatement(url);
  };

  const handleExpensesStatement = () => {
    setTypeStatement("EXPENSES");
    const url = `/users/me/transactions?type=EXPENSES${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`;
    handleStatement(url);
  };

  const handleIncomeStatement = () => {
    setTypeStatement("INCOME");
    const url = `/users/me/transactions?type=INCOME${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`;
    handleStatement(url);
  };

  const handleBackStatement = () => {
    navigate("/dashboard");
  };

  const handleApplyFilter = () => {
    // Aplicar filtro com o tipo atual
    if (typeStatement === "ALL") {
      handleAllStatement();
    } else if (typeStatement === "EXPENSES") {
      handleExpensesStatement();
    } else if (typeStatement === "INCOME") {
      handleIncomeStatement();
    } else {
      handleAllStatement(); // Default
    }
  };

  const handleSendEmail = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);
    try {
      const url = `/users/me/transactions/email?type=${typeStatement}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`;
      const response = await api.get(url);
      setSuccessMsg("Email sent successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data || "Failed to send email";
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatement = async (url) => {
    setErrorMsg("");
    setTransactions([]);
    try {
      const responseName = await api.get("/users/me");
      setIdUser(responseName.data.id);
      const response = await api.get(url);
      setTransactions(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      setErrorMsg(errorMessage);
    }
  };

  return (
    <div className="statement-page-wrapper">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Sending email...</p>
        </div>
      )}
      <div className="statement-container">
        <div>
          <button className="back-statement" onClick={handleBackStatement}>
            <span>Back to dashboard</span>
          </button>
        </div>
        <ErrorMessage message={errorMsg} />
        <SuccessMessage message={successMsg} />
        <div className="statement-filters">
          <button
            className={`all-statement ${typeStatement === "ALL" ? "active" : ""}`}
            onClick={handleAllStatement}
          >
            <span>All</span>
          </button>
          <button
            className={`expenses-statement ${typeStatement === "EXPENSES" ? "active" : ""}`}
            onClick={handleExpensesStatement}
          >
            <span>Expenses</span>
          </button>
          <button
            className={`income-statement ${typeStatement === "INCOME" ? "active" : ""}`}
            onClick={handleIncomeStatement}
          >
            <span>Income</span>
          </button>
        </div>
        <div className="date-filters">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button onClick={handleApplyFilter}>Apply Filter</button>
          <button onClick={handleSendEmail}>Send Statement by Email</button>
        </div>
        {transactions.map((transaction) => {
          const corAtual =
            transaction.type === "DEPOSIT" ||
            transaction.type == "INVESTMENT_SELL" ||
            transaction.receiverWallet?.user?.id === idUser
              ? "#11bd36"
              : "#c01010ff";
          return (
            <div key={transaction.id} className="statement-transaction-card">
              <div
                className="statement-amount-text"
                style={{ color: corAtual }}
              >
                R${" "}
                {transaction.amount.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="statement-details-text">
                <strong>{transaction.type}</strong>
                <br />
                {transaction.type === "TRANSFER" && (
                  <>
                    <span>To: {transaction.receiverWallet?.user?.name}</span>
                    <br />
                    <span>From: {transaction.wallet?.user?.name}</span>
                    <br />
                  </>
                )}
                Date: {transaction.createdAt}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

