export function SuccessMessage({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        backgroundColor: "#e8f5e8",
        color: "#2e7d32",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "15px",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "500",
        border: "1px solid #81c784",
      }}
    >
      {message}
    </div>
  );
}