import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin settings por defecto
  const defaultSettings: Array<{ key: string; value: object }> = [
    {
      key: "whatsapp_number",
      value: { number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491155555555" },
    },
    {
      key: "store_name",
      value: { name: "Hilo & Miel" },
    },
    {
      key: "store_tagline",
      value: { tagline: "Bisutería hecha con intención" },
    },
    {
      key: "order_notifications",
      value: { enabled: true },
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.adminSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
    console.log(`  ✓ Setting: ${setting.key}`);
  }

  // Admin por defecto
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@hiloymiel.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@Hilo2024!";
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({ data: { email: adminEmail, password: hashed } });
    console.log(`  ✓ Admin: ${adminEmail}`);
  }

  console.log("\nSeed completado.");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
