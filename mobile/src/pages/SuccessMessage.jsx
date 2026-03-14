export function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="success-overlay">
      <div className="success-box">{message}</div>
    </div>
  );
}
