// scripts/csv2json.js
import fs from 'fs'
import { parse } from 'csv-parse/sync'

// Uso: node scripts/csv2json.js input.csv output.json

if (process.argv.length < 3) {
  console.error('Uso: node scripts/csv2json.js <archivo.csv> [salida.json]')
  process.exit(1)
}

const input = process.argv[2]
const output = process.argv[3] || 'src/data/productos.json'

// Leer CSV
const csv = fs.readFileSync(input, 'utf8')

// Parsear a JSON
const records = parse(csv, {
  columns: true,          // Usa la primera fila como cabeceras
  skip_empty_lines: true  // Ignora filas vacías
})

// Guardar como JSON
fs.writeFileSync(output, JSON.stringify(records, null, 2))
console.log(`✅ Archivo convertido: ${output}`)
