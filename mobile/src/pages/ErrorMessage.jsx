export function ErrorMessage({ message }) {
    if (!message) return null;
    return (
        <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #ef9a9a'
        }}>
            {message}
        </div>
    );
}