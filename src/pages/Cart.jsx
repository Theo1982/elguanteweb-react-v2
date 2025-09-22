// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; 
import { getUserLevel } from "../utils/getUserLevel";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [nivel, setNivel] = useState(null);

  const total = cart.reduce(
    (acc, product) => acc + Number(product.precio) * product.quantity,
    0
  );

  const totalConDescuento = nivel
    ? Math.round(total * (1 - nivel.descuento / 100))
    : total;

  useEffect(() => {
    const fetchNivel = async () => {
      if (user) {
        const data = await getUserLevel(user.uid);
        setNivel(data);
      }
    };
    fetchNivel();
  }, [user]);

  const handleCheckout = async (status = "success") => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = `/${status}?points=${Math.floor(totalConDescuento / 1000)}&level=${nivel?.nivel || "Sin nivel"}`;
    } catch (error) {
      alert("Error en la simulación de pago.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success" && cart.length > 0) {
      (async () => {
        try {
          const usuarioId = user?.uid || "guest";

          await addDoc(collection(db, "ordenes"), {
            productos: cart,
            total: totalConDescuento,
            fecha: serverTimestamp(),
            estado: "aprobado",
            usuario: usuarioId,
          });

          const puntos = Math.floor(totalConDescuento / 1000);

          if (puntos > 0 && usuarioId !== "guest") {
            await addDoc(collection(db, "puntos"), {
              usuario: usuarioId,
              valor: puntos,
              fecha: serverTimestamp(),
            });
          }

          clearCart();
        } catch (e) {
          console.error("❌ Error guardando orden/puntos:", e);
        }
      })();
    }
  }, [cart, totalConDescuento, clearCart, user]);

  if (cart.length === 0) {
    return <p style={{ padding: "20px" }}>🛒 Tu carrito está vacío.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Carrito</h1>

      {nivel && (
        <p style={{ marginBottom: "15px" }}>
          🎖️ Nivel:{" "}
          <span
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "help",
              position: "relative",
            }}
            title="Sistema de puntos: 
Cada $1000 = 1 punto. 
25 puntos = Bronce (5% desc).
50 puntos = Plata (10% desc).
100 puntos = Oro (15% desc).
Los puntos expiran a los 60 días."
          >
            {nivel.nivel}
          </span>{" "}
          | Puntos: <b>{nivel.puntos}</b> | Descuento:{" "}
          <b>{nivel.descuento}%</b>
        </p>
      )}

      {cart.map((product) => (
        <div
          key={product.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src={product.imagen}
            alt={product.nombre}
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
          <div style={{ flex: 1 }}>
            <h3>{product.nombre}</h3>
            <p>Precio unitario: ${product.precio}</p>
            <p>Subtotal: ${Number(product.precio) * product.quantity}</p>
          </div>
          <div>
            <input
              type="number"
              value={product.quantity}
              min="1"
              style={{ width: "60px" }}
              onChange={(e) =>
                updateQuantity(product.id, Number(e.target.value))
              }
            />
          </div>
          <button
            style={{
              marginLeft: "10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => removeFromCart(product.id)}
          >
            ❌ Eliminar
          </button>
        </div>
      ))}

      <h2 style={{ marginTop: "20px" }}>💵 Total: ${total}</h2>
      {nivel && nivel.descuento > 0 && (
        <h3 style={{ color: "green" }}>
          🎁 Con descuento {nivel.descuento}% → Total final: ${totalConDescuento}
        </h3>
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          style={{
            backgroundColor: "#2ea44f",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => handleCheckout("success")}
        >
          ✅ Proceder al Pago (Éxito)
        </button>
      </div>
    </div>
  );
}
