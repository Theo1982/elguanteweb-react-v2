// src/pages/Success.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Success() {
  const params = new URLSearchParams(useLocation().search);
  const puntos = params.get("points") || 0;
  const nivel = params.get("level") || "Sin nivel";

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#2ea44f" }}>🎉 ¡Pago Exitoso!</h1>
      <p>Tu compra fue procesada correctamente. Muchas gracias por confiar en nosotros.</p>
      
      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        🔥 Has ganado <b>{puntos}</b> puntos.
        Actualmente estás en el nivel <b>{nivel}</b>.
      </p>

      <div style={styles.infoBox}>
        <h3>ℹ️ Sistema de Niveles:</h3>
        <ul style={{ textAlign: "left", margin: "0 auto", maxWidth: "400px" }}>
          <li>✅ Cada $1000 gastados = 1 punto</li>
          <li>🥉 25 puntos → Bronce (5% descuento)</li>
          <li>🥈 50 puntos → Plata (10% descuento)</li>
          <li>🥇 100 puntos → Oro (15% descuento)</li>
          <li>⚠️ Los puntos expiran a los 60 días</li>
        </ul>
      </div>

      <Link to="/" style={styles.button}>
        🏠 Volver a la Tienda
      </Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
  },
  button: {
    display: "inline-block",
    marginTop: "20px",
    backgroundColor: "#2ea44f",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "6px",
    textDecoration: "none",
  },
  infoBox: {
    marginTop: "30px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
};
