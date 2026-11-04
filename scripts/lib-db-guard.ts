import * as dotenv from "dotenv";
import { appendFileSync, existsSync, readFileSync } from "fs";

// Protezione per gli script che scrivono sul database (pulizia, utente admin di prova).
// Quando girano dal computer usano il DATABASE_URL di .env.local: se un giorno puntasse alla produzione,
// cancellerebbero dati veri. Per questo accettano solo l'host del database di PREVIEW, registrato una volta
// in .env.e2e.local (ignorato da git) con `--remember-host`. Se l'host cambia, gli script si rifiutano di girare.
//   npx tsx scripts/cleanup-preview-db.ts --remember-host   # una tantum, su una macchina che punta alla preview

const ENV_FILE = ".env.e2e.local";
const KEY = "E2E_PREVIEW_DB_HOST";

dotenv.config({ path: ".env.local", quiet: true });

function currentHost(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL non trovato in .env.local");
  return new URL(url).host;
}

function savedHost(): string | undefined {
  if (!existsSync(ENV_FILE)) return undefined;
  return dotenv.parse(readFileSync(ENV_FILE, "utf8"))[KEY];
}

// Lancia se il database non è quello di preview registrato; con --remember-host lo registra (senza stamparlo)
export function assertPreviewDatabase(): void {
  const host = currentHost();
  if (process.argv.includes("--remember-host")) {
    const saved = savedHost();
    if (saved && saved !== host) throw new Error(`${KEY} è già registrato con un altro host: toglilo da ${ENV_FILE} per sostituirlo`);
    if (!saved) appendFileSync(ENV_FILE, `${KEY}=${host}\n`);
    console.log(`Host del database registrato in ${ENV_FILE} (non viene stampato).`);
    return;
  }
  const saved = savedHost();
  if (!saved) throw new Error(`Host del database di preview non registrato. Se .env.local punta alla preview, esegui lo script con --remember-host.`);
  if (saved !== host) throw new Error(`Rifiuto di girare: DATABASE_URL non punta al database di preview registrato in ${ENV_FILE}.`);
}
