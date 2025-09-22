# 🧤 ElGuanteWeb - E-commerce React

Una aplicación de e-commerce moderna y completa construida con React, Firebase y MercadoPago, especializada en productos de limpieza.

## ✨ Características Principales

### 🔐 Autenticación y Autorización
- ✅ Registro e inicio de sesión con Firebase Auth
- ✅ Verificación de email
- ✅ Recuperación de contraseña
- ✅ Roles de usuario (admin/usuario)
- ✅ Rutas protegidas por rol
- ✅ Persistencia de sesión

### 🛒 E-commerce Completo
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras persistente
- ✅ Sistema de niveles y puntos
- ✅ Descuentos por nivel de usuario
- ✅ Integración con MercadoPago
- ✅ Historial de pedidos
- ✅ Gestión de stock

### 👨‍💼 Panel de Administración
- ✅ CRUD completo de productos
- ✅ Gestión de usuarios
- ✅ Cambio de roles
- ✅ Estadísticas y métricas
- ✅ Control de inventario

### 🎨 Experiencia de Usuario
- ✅ Diseño responsive
- ✅ Loading states y skeletons
- ✅ Notificaciones toast
- ✅ Manejo de errores
- ✅ Navegación intuitiva
- ✅ Estados de carga

### ⚡ Performance y Optimización (FASE 2)
- ✅ **Lazy Loading**: Carga diferida de productos e imágenes
- ✅ **Scroll Infinito**: Navegación fluida sin recargas
- ✅ **Cache Inteligente**: Optimización de consultas Firestore
- ✅ **Imágenes WebP**: Compresión automática y conversión
- ✅ **Service Worker**: Funcionalidad offline completa
- ✅ **PWA Ready**: Instalable como aplicación nativa
- ✅ **Índices Optimizados**: Consultas Firestore ultra-rápidas

### 🔒 Seguridad Avanzada
- ✅ Variables de entorno
- ✅ Validación de datos
- ✅ Rate limiting
- ✅ Sanitización de inputs
- ✅ Protección CORS
- ✅ Batch operations seguras
- ✅ Logging estructurado

### 🧪 Calidad de Código Enterprise
- ✅ Testing con Vitest (cobertura completa)
- ✅ ESLint y Prettier
- ✅ PropTypes
- ✅ Estructura modular
- ✅ Hooks personalizados
- ✅ Error boundaries
- ✅ Retry logic automático

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **React Router DOM** - Enrutamiento
- **Firebase** - Backend as a Service
- **Vite** - Build tool y dev server
- **CSS3** - Estilos personalizados

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MercadoPago SDK** - Procesamiento de pagos
- **Express Rate Limit** - Limitación de requests
- **CORS** - Cross-Origin Resource Sharing

### Testing y Calidad
- **Vitest** - Framework de testing
- **Testing Library** - Utilidades de testing
- **ESLint** - Linter de JavaScript
- **Prettier** - Formateador de código

### Base de Datos
- **Firestore** - Base de datos NoSQL
- **Firebase Auth** - Autenticación
- **Firebase Storage** - Almacenamiento de archivos

## 📦 Instalación

### Prerrequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0
- Cuenta de Firebase
- Cuenta de MercadoPago (para pagos)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/elguanteweb-react.git
cd elguanteweb-react
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# MercadoPago Configuration
MP_ACCESS_TOKEN=tu_access_token_de_mercadopago

# App Configuration
VITE_APP_NAME=ElGuanteWeb
VITE_API_URL=http://localhost:3001
```

4. **Configurar Firebase**
- Crear proyecto en [Firebase Console](https://console.firebase.google.com)
- Habilitar Authentication (Email/Password)
- Crear base de datos Firestore
- Configurar reglas de seguridad

5. **Configurar MercadoPago**
- Crear cuenta en [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
- Obtener Access Token de prueba/producción
- Configurar webhooks (opcional)

## 🏃‍♂️ Uso

### Desarrollo
```bash
# Iniciar frontend y backend simultáneamente
npm start

# Solo frontend
npm run dev

# Solo backend
npm run backend
```

### Testing
```bash
# Ejecutar tests
npm test

# Tests con interfaz
npm run test:ui

# Coverage
npm run test:coverage
```

### Linting y Formateo
```bash
# Linter
npm run lint

# Arreglar problemas de linting
npm run lint:fix

# Formatear código
npm run format
```

### Producción
```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
elguanteweb-react/
├── backend/                 # Servidor Express
│   └── server.js           # Configuración del servidor
├── public/                 # Archivos estáticos
│   └── img/               # Imágenes de productos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes de UI básicos
│   │   ├── forms/        # Componentes de formularios
│   │   └── layout/       # Componentes de layout
│   ├── context/          # Contextos de React
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/            # Hooks personalizados
│   │   ├── useToast.js
│   │   ├── useErrorHandler.js
│   │   └── useCreateUserDoc.js
│   ├── pages/            # Páginas de la aplicación
│   ├── services/         # Servicios de API
│   ├── styles/           # Archivos de estilos
│   ├── test/             # Tests y configuración
│   ├── utils/            # Utilidades
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Punto de entrada
│   └── firebase.js       # Configuración de Firebase
├── .env.example          # Ejemplo de variables de entorno
├── .env.local            # Variables de entorno (no commitear)
├── .eslintrc.cjs         # Configuración de ESLint
├── .prettierrc           # Configuración de Prettier
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
├── vitest.config.js      # Configuración de Vitest
└── README.md             # Este archivo
```

## 🔧 Configuración Avanzada

### Firebase Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Productos - lectura pública, escritura solo admin
    match /productos/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Órdenes - solo el usuario propietario o admin
    match /ordenes/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.usuarioId == request.auth.uid || 
         get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Puntos - solo lectura para el usuario, escritura para admin
    match /puntos/{pointId} {
      allow read: if request.auth != null && resource.data.usuario == request.auth.uid;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Deployment

#### Vercel (Recomendado para Frontend)
1. Conectar repositorio en [Vercel](https://vercel.com)
2. Configurar variables de entorno
3. Deploy automático en cada push

#### Railway/Render (Para Backend)
1. Conectar repositorio
2. Configurar variables de entorno
3. Configurar comando de inicio: `node backend/server.js`

## 🧪 Testing

### Estructura de Tests
```
src/test/
├── setup.js              # Configuración global
├── __mocks__/            # Mocks
├── components/           # Tests de componentes
├── hooks/               # Tests de hooks
├── utils/               # Tests de utilidades
└── integration/         # Tests de integración
```

### Ejecutar Tests Específicos
```bash
# Test específico
npm test ProductCard

# Tests en modo watch
npm test -- --watch

# Tests con coverage
npm run test:coverage
```

## 📊 Métricas y Monitoreo

### Analytics (Opcional)
- Google Analytics 4
- Eventos personalizados
- Conversiones de e-commerce

### Error Tracking (Recomendado)
- Sentry para tracking de errores
- Logs estructurados
- Alertas automáticas

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Estándares de Código
- Usar ESLint y Prettier
- Escribir tests para nuevas funcionalidades
- Documentar funciones complejas
- Seguir convenciones de naming

## 📝 Changelog

### v0.1.0 (Actual)
- ✅ Implementación completa de autenticación
- ✅ Sistema de carrito con persistencia
- ✅ Integración con MercadoPago
- ✅ Panel de administración
- ✅ Sistema de niveles y puntos
- ✅ Testing básico
- ✅ Mejoras de seguridad
- ✅ Optimizaciones de rendimiento

### 🚀 Fase 2: Optimizaciones Avanzadas (COMPLETADA)
- ✅ **Performance Ultra-Optimizado**: Lazy loading, cache inteligente, índices Firestore
- ✅ **PWA Completa**: Service Worker, manifest, instalación offline
- ✅ **Imágenes Optimizadas**: WebP automático, compresión, carga diferida
- ✅ **Cache Inteligente**: Estrategias múltiples, invalidación automática
- ✅ **SEO Mejorado**: Meta tags completos, Open Graph, Twitter Cards

### Próximas Versiones
- 🔄 Notificaciones push avanzadas
- 🔄 Chat de soporte en tiempo real
- 🔄 Sistema de reviews y calificaciones
- 🔄 Wishlist personalizada
- 🔄 Comparador de productos inteligente
- 🔄 Analytics avanzado con Google Analytics 4

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador Principal** - [Tu Nombre](https://github.com/tu-usuario)

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación](#-instalación)
2. Busca en [Issues](https://github.com/tu-usuario/elguanteweb-react/issues)
3. Crea un nuevo issue si es necesario

## 🙏 Agradecimientos

- Firebase por el backend
- MercadoPago por el procesamiento de pagos
- React team por la excelente biblioteca
- Vite por el tooling moderno
- Comunidad open source

---

⭐ **¡No olvides dar una estrella al proyecto si te fue útil!**
