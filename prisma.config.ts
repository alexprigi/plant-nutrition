import 'dotenv/config'
import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    // DIRECT_URL per migrazioni (connessione diretta, senza pooler)
    url: process.env.DIRECT_URL!,
  },
})
