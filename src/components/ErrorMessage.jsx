export const ErrorMessage = ({ message, onRetry }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "16px",
    textAlign: "center"
  }}>
    <span style={{ fontSize: "48px" }}>⚠️</span>
    <h3 style={{
      fontSize: "20px",
      color: "#1c2e51",
      margin: 0
    }}>
      Error al cargar los datos
    </h3>
    <p style={{
      fontSize: "15px",
      color: "#666",
      margin: 0,
      maxWidth: "400px"
    }}>
      {message}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: "12px 24px",
          background: "#1c2e51",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          marginTop: "8px"
        }}
      >
        Reintentar
      </button>
    )}
  </div>
);
