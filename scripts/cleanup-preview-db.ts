import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const [clients, clientUsers, appointments, subscriptions, adminUsers, blocks] =
    await Promise.all([
      prisma.client.count(),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.appointment.count(),
      prisma.subscription.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.availabilityBlock.count(),
    ]);

  console.log("\n--- STATO ATTUALE ---");
  console.log(`Clients:            ${clients}`);
  console.log(`Subscriptions:      ${subscriptions}`);
  console.log(`Appointments:       ${appointments}`);
  console.log(`Users CLIENT:       ${clientUsers}`);
  console.log(`Users ADMIN:        ${adminUsers}  ← mantenuti`);
  console.log(`AvailabilityBlocks: ${blocks}  ← mantenuti`);

  if (clients === 0 && clientUsers === 0) {
    console.log("\nNiente da eliminare.");
    return;
  }

  console.log("\n--- ELIMINAZIONE IN CORSO ---");

  // Cascade: elimina Client → Subscription + Appointment
  const deletedClients = await prisma.client.deleteMany();
  console.log(`Eliminati ${deletedClients.count} client (subscriptions + appointments in cascade)`);

  const deletedUsers = await prisma.user.deleteMany({ where: { role: "CLIENT" } });
  console.log(`Eliminati ${deletedUsers.count} user CLIENT`);

  console.log("\n--- VERIFICA FINALE ---");
  const [c, s, a, u] = await Promise.all([
    prisma.client.count(),
    prisma.subscription.count(),
    prisma.appointment.count(),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);
  console.log(`Clients rimasti:       ${c}`);
  console.log(`Subscriptions rimaste: ${s}`);
  console.log(`Appointments rimaste:  ${a}`);
  console.log(`Users CLIENT rimasti:  ${u}`);
  console.log("\nPulizia completata.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
