import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ErrorMessage } from "./ErrorMessage";
import "./css/InvestWallet.css";

export function InvestWallet() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState(null); // investimento clicado
  const [quantity, setQuantity] = useState(1); // quantidade a vender
  const [showModal, setShowModal] = useState(false); // controle do modal de venda
  const [errorMsg, setErrorMsg] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [saleConfirmed, setSaleConfirmed] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmingWithPassword, setConfirmingWithPassword] = useState(false);
  const navigate = useNavigate();

  // Limpar erro após 5 segundos
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        // Endpoint conforme sua estrutura de User/Me
        const response = await api.get("/users/me/investmentWallet");
        setInvestments(response.data);
      } catch (error) {
        console.error("Error loading wallet", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  // Polling: Verifica o status da transação a cada 2 segundos
  useEffect(() => {
    let interval;
    if (transactionId && !saleConfirmed) {
      interval = setInterval(async () => {
        try {
          const response = await api.get(
            `/transaction/status/${transactionId}`,
          );
          if (response.data === "COMPLETED") {
            setSaleConfirmed(true);
            // Update investments
            setInvestments((prev) =>
              prev
                .map((inv) => {
                  if (inv.id === selectedInvestment.id) {
                    const remaining = inv.quantity - quantity;
                    return { ...inv, quantity: remaining };
                  }
                  return inv;
                })
                .filter((inv) => inv.quantity > 0),
            );
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Erro ao verificar status: " + error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [transactionId, saleConfirmed, selectedInvestment, quantity]);

  const renderConfirmationScreen = () => (
    <div className="balance-card success-card">
      <div className="checkmark-wrapper">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      <h2>Sale confirmed!</h2>
      <p>
        You sold <strong>{selectedInvestment?.ticker}</strong> successfully!
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="action-btn btn-success-return"
      >
        Back to dashboard
      </button>
    </div>
  );

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
      setErrorMsg("Please enter a valid quantity.");
      return;
    }
    if (quantity > selectedInvestment.quantity) {
      setErrorMsg("Quantity to sell cannot exceed what you own.");
      return;
    }
    setErrorMsg("");

    const investmentData = {
      ticker: selectedInvestment.ticker,
      quantity: parseInt(quantity),
    };
    try {
      const response = await api.post(
        "/transaction/investmentSell",
        investmentData,
      );
      setTransactionId(response.data);
      setSaleConfirmed(false);
      setShowPasswordField(false);
      setPassword("");
      setShowModal(false);
    } catch (error) {
      console.error("Error selling investment", error);
      setErrorMsg("Error selling investment. Please try again.");
    }
  };

  const handleConfirmWithPassword = async () => {
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }
    setConfirmingWithPassword(true);
    setErrorMsg("");
    try {
      await api.post(`/transaction/confirmWithPassword/${transactionId}`, {
        password,
      });
      setSaleConfirmed(true);
      // Update investments
      setInvestments((prev) =>
        prev
          .map((inv) => {
            if (inv.id === selectedInvestment.id) {
              const remaining = inv.quantity - quantity;
              return { ...inv, quantity: remaining };
            }
            return inv;
          })
          .filter((inv) => inv.quantity > 0),
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password incorrect or transaction failed.";
      setErrorMsg(errorMessage);
    } finally {
      setConfirmingWithPassword(false);
    }
  };

  // Cálculo do patrimônio total baseado no preço ATUAL dos ativos
  const totalEquity = investments.reduce(
    (acc, inv) => acc + inv.quantity * inv.currentPrice,
    0,
  );

  return (
    <>
      <div className="wallet-screen">
        {saleConfirmed ? (
          renderConfirmationScreen()
        ) : transactionId ? (
          <div className="balance-card qr-container">
            <p>
              Scan to confirm sale of <strong>{selectedInvestment?.ticker}</strong>
            </p>
            <div className="qr-wrapper">
              <QRCodeSVG
                value={`${window.location.origin}/confirmTransaction/${transactionId}`}
                size={200}
                marginSize={true}
              />
            </div>
            <p className="qr-hint">
              After scanning, confirm the sale on your phone.
            </p>
            {!showPasswordField ? (
              <button
                onClick={() => setShowPasswordField(true)}
                className="action-btn btn-secondary"
              >
                Confirm with Password
              </button>
            ) : (
              <div className="password-confirmation">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password-input"
                />
                <button
                  onClick={handleConfirmWithPassword}
                  disabled={confirmingWithPassword}
                  className="action-btn"
                >
                  {confirmingWithPassword ? "Confirming..." : "Confirm"}
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setTransactionId(null);
                setShowPasswordField(false);
                setPassword("");
              }}
              className="action-btn btn-secondary"
            >
              Cancel / New Sale
            </button>
          </div>
        ) : (
          <div className="wallet-container">
        <header className="wallet-header">
          <h2>My Investment Wallet</h2>
          <div className="total-invested-card">
            <span>Current Equity</span>
            <h3>
              R${" "}
              {totalEquity.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
        </header>
        {loading ? (
          <p className="loading-text">Loading your assets...</p>
        ) : investments.length === 0 ? (
          <div className="empty-wallet">
            <p>You don't have any investments yet.</p>
            <button
              className="btn-go-invest"
              onClick={() => navigate("/invest")}
            >
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
                  <div className="quantity-badge">{inv.quantity} units</div>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span>Avg. Price:</span>
                    <span>
                      R${" "}
                      {inv.avaragePrice.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="info-row">
                    <span>Current Price:</span>
                    <span>
                      R${" "}
                      {inv.currentPrice.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="info-row highlight">
                    <span>Profitability:</span>
                    <span
                      className={
                        inv.profitability >= 0
                          ? "profit-positive"
                          : "profit-negative"
                      }
                    >
                      {inv.profitability > 0 ? "+" : ""}
                      {inv.profitability.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                      %
                    </span>
                  </div>
                  <div className="card-footer-price">
                    <span>Subtotal:</span>
                    <strong>
                      R${" "}
                      {(inv.quantity * inv.currentPrice).toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2 },
                      )}
                    </strong>
                  </div>
                  <button
                    className="btn-sell"
                    onClick={() => handleOpenSellModal(inv)}
                  >
                    Sell Asset
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

            <button className="btn-back" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* --- MODAL DE VENDA --- */}
      {showModal && selectedInvestment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h3>Confirm Sale</h3>
              <button className="close-x" onClick={handleCloseModal}>
                &times;
              </button>
            </header>

            <ErrorMessage message={errorMsg} />
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
                  <span>
                    R${" "}
                    {selectedInvestment.currentPrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="detail-row total">
                  <span>Estimated Total:</span>
                  <span>
                    R${" "}
                    {(
                      selectedInvestment.currentPrice * (quantity || 0)
                    ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <footer className="modal-footer">
              <button className="btn-confirm" onClick={confirmSale}>
                Confirm Sale
              </button>
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
