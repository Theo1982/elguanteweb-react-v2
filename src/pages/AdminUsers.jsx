// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Cargar todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "usuarios"));
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(usersData);
    } catch (error) {
      console.error("❌ Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🔄 Cambiar rol
  const cambiarRol = async (id, nuevoRol) => {
    try {
      const ref = doc(db, "usuarios", id);
      await updateDoc(ref, { role: nuevoRol });
      alert(`✅ Rol actualizado a ${nuevoRol}`);
      fetchUsuarios(); // refrescar lista
    } catch (error) {
      console.error("❌ Error cambiando rol:", error);
      alert("Error al cambiar el rol");
    }
  };

  // 🗑️ Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!window.confirm("⚠️ ¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const ref = doc(db, "usuarios", id);
      await deleteDoc(ref);
      alert("🗑️ Usuario eliminado con éxito");
      fetchUsuarios(); // refrescar lista
    } catch (error) {
      console.error("❌ Error eliminando usuario:", error);
      alert("Error al eliminar el usuario");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>⏳ Cargando usuarios...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>👥 Gestión de Usuarios</h1>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>UID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== "admin" && (
                  <button
                    onClick={() => cambiarRol(u.id, "admin")}
                    style={{ marginRight: 10, backgroundColor: "#2ea44f", color: "#fff", padding: "5px 10px", border: "none", borderRadius: 6, cursor: "pointer" }}
                  >
                    🔑 Hacer Admin
                  </button>
                )}
                {u.role !== "usuario" && (
                  <button
                    onClick={() => cambiarRol(u.id, "usuario")}
                    style={{ marginRight: 10, backgroundColor: "#6c757d", color: "#fff", padding: "5px 10px", border: "none", borderRadius: 6, cursor: "pointer" }}
                  >
                    👤 Hacer Usuario
                  </button>
                )}
                <button
                  onClick={() => eliminarUsuario(u.id)}
                  style={{ backgroundColor: "#dc3545", color: "#fff", padding: "5px 10px", border: "none", borderRadius: 6, cursor: "pointer" }}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
