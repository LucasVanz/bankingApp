import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { formatCPF, stripNonDigits } from "../utils/formatters";
import { ErrorMessage } from "./ErrorMessage";
import "./css/Login.css";
import logoImage from "./images/Logo.png";

export function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Formata o CPF
  const handleCpfChange = (e) => {
    const maskedValue = formatCPF(e.target.value);
    setCpf(maskedValue);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        cpf: stripNonDigits(cpf),
        password,
      });
      localStorage.setItem("token", response.data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Verify if CPF or password are correct!";
      setErrorMsg(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-auth-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      )}
      <header
        style={{
          marginBottom: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <img
          src={logoImage}
          alt="LBank Logo"
          style={{ display: "flex", width: "200px", objectFit: "contain" }}
        />
      </header>
      <p>Access your account</p>
      <ErrorMessage message={errorMsg} />
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="cpf"
          placeholder="CPF"
          value={cpf}
          onChange={handleCpfChange}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/create")}
          disabled={isLoading}
        >
          Create a free account
        </button>
      </form>
    </div>
  );
}
