export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { prisma } = await import("@/lib/prisma");
      const bcrypt = await import("bcryptjs");

      const email = process.env.ADMIN_EMAIL ?? "admin@hiloymiel.com";
      const password = process.env.ADMIN_PASSWORD ?? "Admin@Hilo2024!";

      const existing = await prisma.customer.findUnique({ where: { email } });

      if (!existing) {
        const hashed = await bcrypt.hash(password, 12);
        await prisma.customer.create({
          data: { email, password: hashed, name: "Administrador", role: "admin" },
        });
        console.log(`[startup] Admin creado automáticamente: ${email}`);
      } else if (existing.role !== "admin") {
        await prisma.customer.update({
          where: { email },
          data: { role: "admin" },
        });
        console.log(`[startup] Role admin asignado a: ${email}`);
      }
    } catch (error) {
      console.error("[startup] Error al inicializar admin:", error);
    }
  }
}
