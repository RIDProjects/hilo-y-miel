import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@hiloymiel.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@Hilo2024!";

  const existing = await prisma.customer.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.customer.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: "Administrador",
        role: "admin",
      },
    });
    console.log(`  ✓ Admin creado: ${adminEmail}`);
  } else if (existing.role !== "admin") {
    await prisma.customer.update({
      where: { email: adminEmail },
      data: { role: "admin" },
    });
    console.log(`  ✓ Admin role asignado a: ${adminEmail}`);
  } else {
    console.log(`  ✓ Admin ya existe: ${adminEmail}`);
  }

  console.log("\nSeed completado.");
  console.log("  Credenciales admin:");
  console.log(`    Email:    ${adminEmail}`);
  console.log(`    Password: (definido en ADMIN_PASSWORD o "Admin@Hilo2024!" por defecto)`);
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
