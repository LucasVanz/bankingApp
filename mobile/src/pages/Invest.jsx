import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ErrorMessage } from "./ErrorMessage";
import "./css/Invest.css";

export function Invest() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null); // Ativo clicado
  const [quantity, setQuantity] = useState(1); // Quantidade no modal
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [errorMsg, setErrorMsg] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [investmentConfirmed, setInvestmentConfirmed] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmingWithPassword, setConfirmingWithPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get("/financialAssets/homebroker");
        setAssets(response.data);
      } catch (error) {
        console.error("Erro ao carregar ativos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  // Polling: Verifica o status da transação a cada 2 segundos
  useEffect(() => {
    let interval;
    if (transactionId && !investmentConfirmed) {
      interval = setInterval(async () => {
        try {
          const response = await api.get(
            `/transaction/status/${transactionId}`,
          );
          if (response.data === "COMPLETED") {
            setInvestmentConfirmed(true);
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Erro ao verificar status: " + error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [transactionId, investmentConfirmed]);

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
      <h2>Investment confirmed!</h2>
      <p>
        You invested in <strong>{selectedAsset?.ticker}</strong> successfully!
      </p>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="action-btn btn-success-return"
      >
        Back to dashboard
      </button>
    </div>
  );

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
      setErrorMsg("Please enter a valid quantity.");
      return;
    }
    setErrorMsg("");

    const investmentData = {
      ticker: selectedAsset.ticker,
      quantity: parseInt(quantity),
    };

    try {
      const response = await api.post(
        "/transaction/investment",
        investmentData,
      );
      setTransactionId(response.data);
      setInvestmentConfirmed(false);
      setShowPasswordField(false);
      setPassword("");
      setShowModal(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Unknown error processing investment";
      setErrorMsg("Error processing investment: " + errorMessage);
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
      setInvestmentConfirmed(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password incorrect or transaction failed.";
      setErrorMsg(errorMessage);
    } finally {
      setConfirmingWithPassword(false);
    }
  };

  return (
    <>
      <div className="broker-screen">
        {investmentConfirmed ? (
          renderConfirmationScreen()
        ) : transactionId ? (
          <div className="balance-card qr-container">
            <p>
              Scan to confirm investment in <strong>{selectedAsset?.ticker}</strong>
            </p>
            <div className="qr-wrapper">
              <QRCodeSVG
                value={`${window.location.origin}/confirmTransaction/${transactionId}`}
                size={200}
                marginSize={true}
              />
            </div>
            <p className="qr-hint">
              After scanning, confirm the investment on your phone.
            </p>
            {!showPasswordField ? (
              <button
                type="button"
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
                  type="button"
                  onClick={handleConfirmWithPassword}
                  disabled={confirmingWithPassword}
                  className="action-btn"
                >
                  {confirmingWithPassword ? "Confirming..." : "Confirm"}
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setTransactionId(null);
                setShowPasswordField(false);
                setPassword("");
              }}
              className="action-btn btn-secondary"
            >
              Cancel / New Investment
            </button>
          </div>
        ) : (
          <div className="broker-container">
            <header className="broker-header">
              <h2>Home Broker</h2>
              <button
                type="button"
                className="btn-portfolio"
                onClick={() => navigate("/investWallet")}
              >
                My wallet
              </button>
              <p>Select asset to invest</p>
            </header>

            {loading ? (
              <p className="loading-text">Loading assets...</p>
            ) : (
              <div className="assets-grid">
                {assets.map((asset) => (
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
                        R${" "}
                        {asset.currentPrice.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="yield">{asset.yieldPercentage}% yield</span>
                    </div>
                    <button
                      type="button"
                      className="btn-invest"
                      onClick={() => handleOpenModal(asset)}
                    >
                      Invest
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" className="btn-back" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* --- MODAL DE INVESTIMENTO --- */}
      {showModal && selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h3>Confirm Investment</h3>
              <button type="button" className="close-x" onClick={handleCloseModal}>
                &times;
              </button>
            </header>

            <ErrorMessage message={errorMsg} />
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
                  <span>
                    R${" "}
                    {selectedAsset.currentPrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="detail-row total">
                  <span>Estimated Total:</span>
                  <span>
                    R${" "}
                    {(
                      selectedAsset.currentPrice * (quantity || 0)
                    ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <footer className="modal-footer">
              <button type="button" className="btn-confirm" onClick={confirmInvestment}>
                Confirm Purchase
              </button>
              <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
