// Descarga el dataset de personajes (versión fija 0.3.0) y lo guarda minificado en src/assets/data/heroes.json.
// Uso: npm run data
import { mkdir, writeFile } from 'node:fs/promises';

const SOURCE = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json';
const OUT_DIR = new URL('../src/assets/data/', import.meta.url);

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`${res.status} al descargar ${SOURCE}`);
const heroes = await res.json();

// Una respuesta parcial no debe pisar un dataset bueno.
if (!Array.isArray(heroes) || heroes.length < 500) {
  throw new Error(`Dataset incompleto (${heroes?.length ?? 0} personajes): no se escribe.`);
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(new URL('heroes.json', OUT_DIR), JSON.stringify(heroes));
console.log(`heroes.json: ${heroes.length} personajes`);
