import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";

// Crea l utente admin usato dai test e2e (scripts/e2e/preview.ts).
// Non si connette a nessun database e non legge .env.local: genera una password casuale,
// la scrive in .env.e2e.local (ignorato da git) e stampa lo SQL da incollare nell'SQL Editor
// di Supabase del progetto PREVIEW. Lo SQL contiene solo l'hash bcrypt, non la password.
//   npx tsx scripts/e2e/admin-user.ts            # crea/aggiorna
//   npx tsx scripts/e2e/admin-user.ts --remove   # stampa lo SQL per rimuovere l'utente

const EMAIL = "e2e-admin@example.test";
const OUT_FILE = ".env.e2e.local";

async function main() {
  if (process.argv.includes("--remove")) {
    console.log(`\nDELETE FROM "users" WHERE "email" = '${EMAIL}';\n`);
    return;
  }

  const password = randomBytes(18).toString("base64url");
  const hash = await bcrypt.hash(password, 12);

  const current = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8") : "";
  const kept = current.split("\n").filter((l) => l && !l.startsWith("E2E_ADMIN_"));
  writeFileSync(OUT_FILE, [...kept, `E2E_ADMIN_EMAIL=${EMAIL}`, `E2E_ADMIN_PASSWORD=${password}`].join("\n") + "\n");
  console.log(`Credenziali scritte in ${OUT_FILE} (non vengono stampate).`);
  console.log("\nIncolla questo nell'SQL Editor di Supabase (progetto PREVIEW):\n");
  console.log(
    `INSERT INTO "users" ("id", "email", "password", "name", "role", "createdAt", "updatedAt", "isDeleted")
VALUES (gen_random_uuid()::text, '${EMAIL}', '${hash}', 'E2E Admin', 'ADMIN', now(), now(), false)
ON CONFLICT ("email") DO UPDATE
  SET "password" = EXCLUDED."password", "role" = 'ADMIN', "isDeleted" = false, "updatedAt" = now();
`,
  );
}

main();
