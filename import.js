import fs from "fs";
import csv from "csv-parser";
import admin from "firebase-admin";

console.log("🚀 Iniciando importación de productos...");

// Inicializar Firebase con credenciales
try {
  const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase inicializado correctamente");
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error.message);
  process.exit(1);
}

const db = admin.firestore();
const filePath = "./productos.csv";

console.log(`📂 Leyendo archivo CSV: ${filePath}`);

// Función para validar y convertir datos
function validarProducto(row) {
  const producto = {
    categoria: row["Categoria"]?.trim() || "",
    descripcion: row["Descripción"]?.trim() || "",
    imagen: "", // vacío por ahora
    nombre: row["Nombre"]?.trim() || "",
    precio: parseFloat(row["Precio [El Guante]"]) || 0,
    alertaStock: parseFloat(row["Existencias bajas [El Guante]"]) || 0,
    stock: parseFloat(row["En inventario [El Guante]"]) || 0,
    fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
    activo: true
  };

  // Validaciones básicas
  if (!producto.nombre) {
    throw new Error("Nombre faltante");
  }
  if (isNaN(producto.precio) || producto.precio <= 0) {
    throw new Error(`Precio inválido: ${row["Precio [El Guante]"]}`);
  }
  if (isNaN(producto.stock) || producto.stock < 0) {
    throw new Error(`Stock inválido: ${row["En inventario [El Guante]"]}`);
  }

  return producto;
}

// Leer CSV y mapear a los campos
let productosProcesados = 0;
let productosAgregados = 0;
let errores = 0;
const productosValidos = [];
const batchSize = 500; // Firestore batch limit is 500

console.log("📊 Procesando productos...");

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    productosProcesados++;
    try {
      const producto = validarProducto(row);
      productosValidos.push(producto);
      console.log(`📦 Producto ${productosProcesados} validado: ${producto.nombre}`);
    } catch (error) {
      errores++;
      console.error(`❌ Error validando producto ${productosProcesados} (${row["Nombre"]}): ${error.message}`);
    }
  })
  .on("end", async () => {
    console.log(`✅ Validación completada: ${productosValidos.length} productos válidos, ${errores} errores`);

    if (productosValidos.length === 0) {
      console.log("🚫 No hay productos válidos para importar");
      process.exit(0);
    }

    console.log("📤 Iniciando carga por lotes...");

    // Procesar en lotes
    for (let i = 0; i < productosValidos.length; i += batchSize) {
      const lote = productosValidos.slice(i, i + batchSize);
      const batch = db.batch();

      lote.forEach((producto) => {
        const docRef = db.collection("productos").doc(); // ID automático
        batch.set(docRef, producto);
      });

      try {
        await batch.commit();
        productosAgregados += lote.length;
        console.log(`✅ Lote ${Math.floor(i / batchSize) + 1} completado: ${lote.length} productos agregados`);
      } catch (error) {
        console.error(`❌ Error en lote ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        // Intentar individualmente si falla el lote
        for (const producto of lote) {
          try {
            await db.collection("productos").add(producto);
            productosAgregados++;
          } catch (err) {
            console.error(`❌ Error individual: ${producto.nombre} - ${err.message}`);
          }
        }
      }
    }

    console.log("🚀 Importación completada");
    console.log(`📊 Total procesados: ${productosProcesados}`);
    console.log(`✅ Agregados: ${productosAgregados}`);
    console.log(`❌ Errores: ${errores}`);
    process.exit(0);
  })
  .on("error", (error) => {
    console.error("❌ Error leyendo CSV:", error);
    process.exit(1);
  });
