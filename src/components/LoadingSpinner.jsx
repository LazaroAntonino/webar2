export const LoadingSpinner = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "16px"
  }}>
    <div style={{
      width: "48px",
      height: "48px",
      border: "4px solid rgba(28, 46, 81, 0.1)",
      borderTopColor: "#1c2e51",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
    <p style={{
      fontSize: "16px",
      color: "#666",
      margin: 0
    }}>
      Cargando inmuebles...
    </p>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
