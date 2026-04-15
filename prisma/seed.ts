import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DIRECT_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'arianna@vivaplantnutrition.com'
  const password = 'arianna2025'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('✅ Admin già esistente:', email)
    return
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: 'Arianna Ciervo',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin creato!')
  console.log('   Email:   ', email)
  console.log('   Password:', password)
  console.log('\n⚠️  Ricordati di cambiare la password dopo il primo accesso!')
}

main()
  .catch(console.error)
  .finally(() => pool.end())
