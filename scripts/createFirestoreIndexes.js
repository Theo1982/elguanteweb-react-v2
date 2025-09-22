// scripts/createFirestoreIndexes.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, where } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Definición de índices necesarios
const FIRESTORE_INDEXES = [
  // Índice compuesto para productos por categoría y nombre (orden alfabético)
  {
    collection: "productos",
    fields: [
      { fieldPath: "categoria", order: "ASCENDING" },
      { fieldPath: "nombre", order: "ASCENDING" }
    ],
    description: "Productos ordenados por categoría y nombre"
  },

  // Índice para productos por precio (orden ascendente)
  {
    collection: "productos",
    fields: [
      { fieldPath: "precio", order: "ASCENDING" }
    ],
    description: "Productos ordenados por precio ascendente"
  },

  // Índice para productos por precio (orden descendente)
  {
    collection: "productos",
    fields: [
      { fieldPath: "precio", order: "DESCENDING" }
    ],
    description: "Productos ordenados por precio descendente"
  },

  // Índice compuesto para productos con stock > 0
  {
    collection: "productos",
    fields: [
      { fieldPath: "stock", order: "DESCENDING" },
      { fieldPath: "nombre", order: "ASCENDING" }
    ],
    description: "Productos con stock disponible ordenados por nombre"
  },

  // Índice para productos por fecha de creación (si se agrega en el futuro)
  {
    collection: "productos",
    fields: [
      { fieldPath: "createdAt", order: "DESCENDING" }
    ],
    description: "Productos ordenados por fecha de creación (futuro)"
  }
];

// Función para generar archivo de configuración de índices de Firestore
function generateFirestoreIndexesConfig() {
  const indexesConfig = {
    indexes: FIRESTORE_INDEXES.map(index => ({
      collectionGroup: index.collection,
      queryScope: "COLLECTION",
      fields: index.fields
    })),
    fieldOverrides: []
  };

  const configPath = path.join(process.cwd(), "firestore.indexes.json");

  try {
    fs.writeFileSync(configPath, JSON.stringify(indexesConfig, null, 2));
    console.log("✅ Archivo firestore.indexes.json generado exitosamente");
    console.log(`📁 Ubicación: ${configPath}`);
  } catch (error) {
    console.error("❌ Error generando archivo de índices:", error);
  }
}

// Función para probar las consultas optimizadas
async function testOptimizedQueries() {
  console.log("\n🧪 Probando consultas optimizadas...");

  try {
    // Prueba 1: Consulta por categoría
    console.log("📊 Probando consulta por categoría...");
    const categoryQuery = query(
      collection(db, "productos"),
      where("categoria", "==", "LIMPIEZA Y DESINFECCIÓN"),
      orderBy("nombre"),
      limit(5)
    );

    const categorySnapshot = await getDocs(categoryQuery);
    console.log(`✅ Consulta por categoría: ${categorySnapshot.size} productos encontrados`);

    // Prueba 2: Consulta por precio ascendente
    console.log("📊 Probando consulta por precio ascendente...");
    const priceAscQuery = query(
      collection(db, "productos"),
      orderBy("precio", "asc"),
      limit(5)
    );

    const priceAscSnapshot = await getDocs(priceAscQuery);
    console.log(`✅ Consulta por precio ascendente: ${priceAscSnapshot.size} productos encontrados`);

    // Prueba 3: Consulta por stock disponible
    console.log("📊 Probando consulta por stock disponible...");
    const stockQuery = query(
      collection(db, "productos"),
      where("stock", ">", 0),
      orderBy("stock", "desc"),
      limit(5)
    );

    const stockSnapshot = await getDocs(stockQuery);
    console.log(`✅ Consulta por stock: ${stockSnapshot.size} productos encontrados`);

  } catch (error) {
    console.error("❌ Error probando consultas:", error);
    console.log("\n💡 Posibles soluciones:");
    console.log("1. Ejecuta: firebase deploy --only firestore:indexes");
    console.log("2. O crea los índices manualmente en Firebase Console");
    console.log("3. Revisa la documentación: https://firebase.google.com/docs/firestore/query-data/indexing");
  }
}

// Función principal
async function main() {
  console.log("🔥 Configurando índices de Firestore para ElGuanteWeb");
  console.log("=" .repeat(50));

  // Generar archivo de configuración
  console.log("\n📝 Generando archivo de configuración de índices...");
  generateFirestoreIndexesConfig();

  // Mostrar información de índices
  console.log("\n📋 Índices configurados:");
  FIRESTORE_INDEXES.forEach((index, i) => {
    console.log(`${i + 1}. ${index.description}`);
    console.log(`   Colección: ${index.collection}`);
    console.log(`   Campos: ${index.fields.map(f => `${f.fieldPath} (${f.order})`).join(', ')}`);
    console.log("");
  });

  // Probar consultas
  await testOptimizedQueries();

  console.log("\n🚀 Próximos pasos:");
  console.log("1. Desplegar índices: firebase deploy --only firestore:indexes");
  console.log("2. Verificar en Firebase Console > Firestore > Índices");
  console.log("3. Monitorear performance de consultas");

  console.log("\n✅ Configuración de índices completada!");
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { FIRESTORE_INDEXES, generateFirestoreIndexesConfig, testOptimizedQueries };
