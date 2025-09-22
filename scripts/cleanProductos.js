import fs from 'fs';

// Leer productos desde el archivo JSON
const productosJson = JSON.parse(fs.readFileSync('./src/data/productos.json', 'utf8'));

// Campos a mantener
const camposMantener = [
  'Handle',
  'REF',
  'Nombre',
  'Categoria',
  'Descripción',
  'Precio [El Guante]',
  'En inventario [El Guante]',
  'imagen'
];

// Limpiar productos
const productosLimpios = productosJson.map(producto => {
  const productoLimpio = {};
  camposMantener.forEach(campo => {
    if (producto[campo] !== undefined) {
      productoLimpio[campo] = producto[campo];
    }
  });
  return productoLimpio;
});

// Escribir el archivo limpio
fs.writeFileSync('./src/data/productos.json', JSON.stringify(productosLimpios, null, 2));

console.log('✅ Productos limpiados exitosamente.');
console.log(`📦 Se mantuvieron ${camposMantener.length} campos por producto.`);
console.log(`📊 Total de productos: ${productosLimpios.length}`);
