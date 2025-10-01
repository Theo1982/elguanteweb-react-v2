// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mercadopago from "mercadopago";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// Middleware de seguridad
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tu-dominio.com']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por ventana
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Rate limiting específico para pagos
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 intentos de pago por IP
  message: {
    error: 'Demasiados intentos de pago, intenta de nuevo más tarde.',
  },
});

const PORT = process.env.PORT || 3001;

// Validar configuración de MercadoPago
let mp = null;
const isDevelopment = process.env.NODE_ENV !== 'production';
const isTestToken = process.env.MP_ACCESS_TOKEN === 'TEST-1234567890-123456-abcdef123456789-12345678';

if (!process.env.MP_ACCESS_TOKEN) {
  if (isDevelopment) {
    console.log('⚠️ MP_ACCESS_TOKEN no configurado - ejecutando en modo demo');
  } else {
    console.error('❌ Error: MP_ACCESS_TOKEN no está configurado');
    process.exit(1);
  }
} else if (isTestToken && isDevelopment) {
  console.log('⚠️ Usando token de prueba - modo demo activado');
} else {
  // ⚡ Configuración Mercado Pago
  mp = new mercadopago.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });
  console.log('✅ MercadoPago configurado correctamente');
}

// Middleware de validación para crear preferencia
const validatePreferenceData = (req, res, next) => {
  const { items, usuarioId } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'Items requeridos',
      details: 'Debe proporcionar al menos un item'
    });
  }

  if (!usuarioId) {
    return res.status(400).json({
      error: 'Usuario ID requerido',
      details: 'Debe proporcionar un ID de usuario válido'
    });
  }

  // Validar cada item
  for (const item of items) {
    if (!item.title || !item.unit_price || !item.quantity) {
      return res.status(400).json({
        error: 'Datos de item inválidos',
        details: 'Cada item debe tener title, unit_price y quantity'
      });
    }

    if (Number(item.unit_price) <= 0 || Number(item.quantity) <= 0) {
      return res.status(400).json({
        error: 'Valores inválidos',
        details: 'El precio y cantidad deben ser mayores a 0'
      });
    }
  }

  next();
};

// Middleware de logging
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

app.use(logRequest);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 👉 Crear preferencia de pago
app.post("/create_preference", paymentLimiter, validatePreferenceData, async (req, res) => {
  try {
    const { items, usuarioId, metadata = {} } = req.body;

    // Calcular total para validación
    const total = items.reduce((sum, item) => sum + (Number(item.unit_price) * Number(item.quantity)), 0);
    
    if (total > 999999) { // Límite de MercadoPago
      return res.status(400).json({
        error: 'Monto excede el límite permitido',
        details: 'El total no puede exceder $999,999'
      });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:5173';

    // Modo demo - sin MercadoPago real
    if (!mp || isTestToken) {
      console.log(`🎭 Modo demo - Simulando preferencia - Usuario: ${usuarioId} - Total: $${total}`);
      
      const demoId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return res.json({
        id: demoId,
        init_point: `${baseUrl}/success?payment_id=${demoId}&status=approved&points=${Math.floor(total/100)}&level=Bronce`,
        sandbox_init_point: `${baseUrl}/success?payment_id=${demoId}&status=approved&points=${Math.floor(total/100)}&level=Bronce`,
        demo: true
      });
    }

    const preference = {
      items: items.map((item) => ({
        title: String(item.title).substring(0, 256), // Límite de MercadoPago
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        currency_id: "ARS",
      })),
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/failure`,
        pending: `${baseUrl}/pending`,
      },
      auto_return: "approved",
      metadata: {
        usuarioId,
        timestamp: new Date().toISOString(),
        ...metadata
      },
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    };

    const result = await new mercadopago.Preference(mp).create({ body: preference });

    // Log de la transacción
    console.log(`✅ Preferencia creada: ${result.id} - Usuario: ${usuarioId} - Total: $${total}`);

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    console.error("❌ Error en create_preference:", error);
    
    // No exponer detalles internos en producción
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor'
      : error.message;

    res.status(500).json({
      error: "Error creando preferencia de pago",
      details: errorMessage,
    });
  }
});

// 👉 Consultar pago por ID
app.get("/payment/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea numérico
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        error: 'ID de pago inválido',
        details: 'El ID debe ser numérico'
      });
    }

    const result = await new mercadopago.Payment(mp).get({ id });

    // Log de la consulta
    console.log(`📋 Consulta de pago: ${id} - Estado: ${result.status}`);

    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      transaction_amount: result.transaction_amount,
      currency_id: result.currency_id,
      date_created: result.date_created,
      date_approved: result.date_approved,
      metadata: result.metadata
    });
  } catch (error) {
    console.error("❌ Error al obtener pago:", error);
    
    if (error.status === 404) {
      return res.status(404).json({
        error: "Pago no encontrado",
        details: "El ID de pago proporcionado no existe"
      });
    }

    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Error consultando pago'
      : error.message;

    res.status(500).json({
      error: "Error consultando pago",
      details: errorMessage,
    });
  }
});

// 👉 Webhook de MercadoPago (para notificaciones)
app.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      console.log(`🔔 Webhook recibido - Pago: ${paymentId}`);
      
      // Aquí podrías actualizar el estado en tu base de datos
      // const payment = await new mercadopago.Payment(mp).get({ id: paymentId });
      // await updatePaymentStatus(paymentId, payment.status);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).send('Error');
  }
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);
  
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor'
    : error.message;

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check disponible en http://localhost:${PORT}/health`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
