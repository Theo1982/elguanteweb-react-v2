// scripts/createTestUsers.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDwBsZkqx4haBxlClFRVD03SwUIn6Rk2bM",
  authDomain: "el-guante-web.firebaseapp.com",
  projectId: "el-guante-web",
  storageBucket: "el-guante-web.firebasestorage.app",
  messagingSenderId: "69861948228",
  appId: "1:69861948228:web:da203ba6acfb87aed87511",
  measurementId: "G-X5PYXV3J5H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Usuarios de ejemplo
const usuariosEjemplo = [
  {
    email: "admin@demo.com",
    password: "123456",
    displayName: "Administrador",
    role: "admin"
  },
  {
    email: "user@demo.com",
    password: "123456",
    displayName: "Usuario Demo",
    role: "usuario"
  }
];

async function crearUsuarios() {
  try {
    console.log("👥 Creando usuarios de ejemplo...");
    
    for (const usuario of usuariosEjemplo) {
      try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          usuario.email, 
          usuario.password
        );
        
        // Actualizar perfil con displayName
        await updateProfile(userCredential.user, {
          displayName: usuario.displayName
        });
        
        // Crear documento en Firestore
        await setDoc(doc(db, "usuarios", userCredential.user.uid), {
          nombre: usuario.displayName,
          email: usuario.email,
          role: usuario.role,
          creado: new Date(),
        });
        
        console.log(`✅ Usuario creado: ${usuario.email} (${usuario.role})`);
        
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  Usuario ya existe: ${usuario.email}`);
        } else {
          console.error(`❌ Error creando usuario ${usuario.email}:`, error.message);
        }
      }
    }
    
    console.log("🎉 ¡Usuarios de ejemplo creados exitosamente!");
    console.log("\n📋 Credenciales de acceso:");
    console.log("👑 Admin: admin@demo.com / 123456");
    console.log("👤 Usuario: user@demo.com / 123456");
    
  } catch (error) {
    console.error("❌ Error general:", error);
  }
}

// Ejecutar el script
crearUsuarios().then(() => {
  console.log("🏁 Script de usuarios completado.");
  process.exit(0);
});
