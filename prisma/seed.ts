import { PrismaClient } from "@prisma/client";

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

  console.log("\nSeed completado.");
  console.log("\nPara configurar el admin:");
  console.log("  Agregá en .env:");
  console.log("    ADMIN_EMAIL=tu@email.com");
  console.log("    ADMIN_PASSWORD=tu_password_segura");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
