export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { prisma } = await import("@/lib/prisma");
      const bcrypt = await import("bcryptjs");

      const adminCount = await prisma.admin.count();
      if (adminCount === 0) {
        const email = process.env.ADMIN_EMAIL ?? "admin@hiloymiel.com";
        const password = process.env.ADMIN_PASSWORD ?? "Admin@Hilo2024!";
        const hashed = await bcrypt.hash(password, 12);
        await prisma.admin.create({ data: { email, password: hashed } });
        console.log(`[startup] Admin creado automáticamente: ${email}`);
        console.log(`[startup] Cambiá la contraseña en producción con ADMIN_EMAIL y ADMIN_PASSWORD`);
      }
    } catch (error) {
      console.error("[startup] Error al inicializar admin:", error);
    }
  }
}
