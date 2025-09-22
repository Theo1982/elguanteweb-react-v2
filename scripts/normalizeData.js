// scripts/normalizeData.js
import fs from "fs";
import path from "path";

// Función para normalizar precios (convertir a número y validar)
function normalizarPrecio(precio) {
  if (typeof precio === 'string') {
    // Remover símbolos de moneda y espacios
    const precioLimpio = precio.replace(/[$\s]/g, '');
    const precioNumerico = parseFloat(precioLimpio);
    return isNaN(precioNumerico) ? 0 : precioNumerico;
  }
  return typeof precio === 'number' ? precio : 0;
}

// Función para normalizar stock (convertir a número y validar)
function normalizarStock(stock) {
  if (typeof stock === 'string') {
    const stockNumerico = parseFloat(stock);
    return isNaN(stockNumerico) ? 0 : stockNumerico;
  }
  return typeof stock === 'number' ? stock : 0;
}

// Función para normalizar texto (trim y validar)
function normalizarTexto(texto) {
  if (typeof texto === 'string') {
    return texto.trim();
  }
  return '';
}

// Función para validar producto
function validarProductoNormalizado(producto) {
  const errores = [];

  if (!producto.nombre || producto.nombre.length === 0) {
    errores.push('Nombre faltante');
  }

  if (!producto.precio || producto.precio <= 0) {
    errores.push('Precio inválido');
  }

  if (producto.stock < 0) {
    errores.push('Stock negativo');
  }

  if (!producto.categoria || producto.categoria.length === 0) {
    errores.push('Categoría faltante');
  }

  return errores;
}

// Función para fusionar datos de ambos archivos
function fusionarProductos(productosBasicos, productosCompletos) {
  console.log("🔄 Fusionando datos de productos...");

  const productosFusionados = new Map();

  // Procesar productos básicos
  productosBasicos.forEach(producto => {
    const key = `${producto.Nombre?.trim()}-${producto.REF?.trim()}`;
    productosFusionados.set(key, {
      fuente: 'productos.json',
      datos: producto
    });
  });

  // Procesar productos completos y fusionar
  productosCompletos.forEach(producto => {
    const key = `${producto.Nombre?.trim()}-${producto.REF?.trim()}`;

    if (productosFusionados.has(key)) {
      // Producto existe, fusionar datos
      const existente = productosFusionados.get(key);
      productosFusionados.set(key, {
        fuente: 'fusionado',
        datos: { ...existente.datos, ...producto }
      });
    } else {
      // Producto nuevo
      productosFusionados.set(key, {
        fuente: 'export_items_full.json',
        datos: producto
      });
    }
  });

  return productosFusionados;
}

// Función principal para normalizar datos
function normalizarDatos() {
  try {
    console.log("🚀 Iniciando normalización de datos...");

    // Leer archivos de datos
    const productosBasicosPath = path.join(process.cwd(), 'src/data/productos.json');
    const productosCompletosPath = path.join(process.cwd(), 'src/data/export_items_full.json');

    console.log("📂 Leyendo archivos de datos...");
    const productosBasicos = JSON.parse(fs.readFileSync(productosBasicosPath, 'utf8'));
    const productosCompletos = JSON.parse(fs.readFileSync(productosCompletosPath, 'utf8'));

    console.log(`📊 Productos básicos: ${productosBasicos.length}`);
    console.log(`📊 Productos completos: ${productosCompletos.length}`);

    // Fusionar productos
    const productosFusionados = fusionarProductos(productosBasicos, productosCompletos);

    console.log(`🔄 Total productos después de fusión: ${productosFusionados.size}`);

    // Normalizar y validar productos
    const productosNormalizados = [];
    const productosInvalidos = [];
    const estadisticas = {
      total: productosFusionados.size,
      validos: 0,
      invalidos: 0,
      fuentes: {
        'productos.json': 0,
        'export_items_full.json': 0,
        'fusionado': 0
      }
    };

    productosFusionados.forEach((item, key) => {
      const productoOriginal = item.datos;

      // Normalizar campos
      const productoNormalizado = {
        // Campos básicos
        nombre: normalizarTexto(productoOriginal.Nombre || productoOriginal.nombre),
        precio: normalizarPrecio(productoOriginal['Precio [El Guante]'] || productoOriginal.Precio || productoOriginal.precio),
        stock: normalizarStock(productoOriginal['En inventario [El Guante]'] || productoOriginal.Stock || productoOriginal.stock),
        categoria: normalizarTexto(productoOriginal.Categoria || productoOriginal.categoria),

        // Campos adicionales
        descripcion: normalizarTexto(productoOriginal.Descripción || productoOriginal.descripcion || ''),
        imagen: normalizarTexto(productoOriginal.imagen || ''),

        // Campos de export_items_full.json
        handle: normalizarTexto(productoOriginal.Handle || productoOriginal.handle || ''),
        ref: normalizarTexto(productoOriginal.REF || productoOriginal.ref || ''),
        costo: normalizarPrecio(productoOriginal.Coste || productoOriginal.costo || 0),
        codigoBarras: normalizarTexto(productoOriginal['Codigo de barras'] || productoOriginal.codigoBarras || ''),
        vendidoPorPeso: productoOriginal['Vendido por peso'] === 'Y' || productoOriginal.vendidoPorPeso === true,

        // Metadatos
        fuente: item.fuente,
        fechaNormalizacion: new Date().toISOString(),
        activo: true
      };

      // Validar producto normalizado
      const errores = validarProductoNormalizado(productoNormalizado);

      if (errores.length === 0) {
        productosNormalizados.push(productoNormalizado);
        estadisticas.validos++;
        estadisticas.fuentes[item.fuente]++;
      } else {
        productosInvalidos.push({
          key,
          producto: productoNormalizado,
          errores,
          fuente: item.fuente
        });
        estadisticas.invalidos++;
      }
    });

    // Crear archivos de salida
    const outputDir = path.join(process.cwd(), 'src/data');
    const productosNormalizadosPath = path.join(outputDir, 'productos_normalizados.json');
    const productosInvalidosPath = path.join(outputDir, 'productos_invalidos.json');
    const estadisticasPath = path.join(outputDir, 'estadisticas_normalizacion.json');

    // Guardar productos normalizados
    fs.writeFileSync(productosNormalizadosPath, JSON.stringify(productosNormalizados, null, 2));
    console.log(`✅ Productos normalizados guardados: ${productosNormalizadosPath}`);

    // Guardar productos inválidos (si hay)
    if (productosInvalidos.length > 0) {
      fs.writeFileSync(productosInvalidosPath, JSON.stringify(productosInvalidos, null, 2));
      console.log(`⚠️  Productos inválidos guardados: ${productosInvalidosPath}`);
    }

    // Guardar estadísticas
    fs.writeFileSync(estadisticasPath, JSON.stringify(estadisticas, null, 2));
    console.log(`📊 Estadísticas guardadas: ${estadisticasPath}`);

    // Mostrar resumen
    console.log("\n🎉 ¡Normalización completada!");
    console.log(`📈 Estadísticas:`);
    console.log(`   • Total productos procesados: ${estadisticas.total}`);
    console.log(`   • Productos válidos: ${estadisticas.validos}`);
    console.log(`   • Productos inválidos: ${estadisticas.invalidos}`);
    console.log(`   • Fuentes:`);
    console.log(`     - productos.json: ${estadisticas.fuentes['productos.json']}`);
    console.log(`     - export_items_full.json: ${estadisticas.fuentes['export_items_full.json']}`);
    console.log(`     - Fusionados: ${estadisticas.fuentes['fusionado']}`);

    return {
      productosNormalizados,
      productosInvalidos,
      estadisticas
    };

  } catch (error) {
    console.error("❌ Error en normalización de datos:", error.message);
    throw error;
  }
}

// Ejecutar normalización
normalizarDatos().then(() => {
  console.log("🏁 Script de normalización completado.");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});

export { normalizarDatos, normalizarPrecio, normalizarStock, normalizarTexto, validarProductoNormalizado };
