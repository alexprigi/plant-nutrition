import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Pool } from "pg";
import { assertPreviewDatabase } from "../lib-db-guard";

// Crea l utente admin usato dai test e2e (scripts/e2e/preview.ts).
// Genera una password casuale, la scrive in .env.e2e.local (ignorato da git) e stampa lo SQL con il solo hash bcrypt.
// Senza --apply non si connette a nessun database: lo SQL va incollato nell'SQL Editor di Supabase (progetto PREVIEW).
// Con --apply lo esegue direttamente, ma solo sul database di preview registrato (vedi lib-db-guard.ts).
//   npx tsx scripts/e2e/admin-user.ts                    # crea/aggiorna (stampa lo SQL)
//   npx tsx scripts/e2e/admin-user.ts --apply            # crea/aggiorna sul database di preview
//   npx tsx scripts/e2e/admin-user.ts --remove [--apply] # rimuove l'utente

const EMAIL = "e2e-admin@example.test";
const OUT_FILE = ".env.e2e.local";

const REMOVE_SQL = `DELETE FROM "users" WHERE "email" = '${EMAIL}'`;

async function run(sql: string, params: unknown[] = []) {
  assertPreviewDatabase();
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(sql, params);
    console.log(`Eseguito sul database di preview (${res.rowCount} riga/e).`);
  } finally {
    await pool.end();
  }
}

async function main() {
  const apply = process.argv.includes("--apply");

  if (process.argv.includes("--remove")) {
    if (apply) await run(REMOVE_SQL);
    else console.log(`\n${REMOVE_SQL};\n`);
    return;
  }

  const password = randomBytes(18).toString("base64url");
  const hash = await bcrypt.hash(password, 12);

  const current = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8") : "";
  const kept = current.split("\n").filter((l) => l && !l.startsWith("E2E_ADMIN_"));
  writeFileSync(OUT_FILE, [...kept, `E2E_ADMIN_EMAIL=${EMAIL}`, `E2E_ADMIN_PASSWORD=${password}`].join("\n") + "\n");
  console.log(`Credenziali scritte in ${OUT_FILE} (non vengono stampate).`);
  const insert = `INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt", "isDeleted")
VALUES (gen_random_uuid()::text, $1, $2, 'E2E Admin', 'ADMIN', now(), now(), false)
ON CONFLICT ("email") DO UPDATE
  SET "password" = EXCLUDED."password", "role" = 'ADMIN', "isDeleted" = false, "updatedAt" = now()`;
  if (apply) {
    await run(insert, [EMAIL, hash]);
    return;
  }
  console.log("\nIncolla questo nell'SQL Editor di Supabase (progetto PREVIEW):\n");
  console.log(insert.replace("$1", `'${EMAIL}'`).replace("$2", `'${hash}'`) + ";\n");
}

main();
