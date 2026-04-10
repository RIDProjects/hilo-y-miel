import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Limpia tanto el token unificado como el legacy de admin
  response.cookies.delete("hilo-customer-token");
  response.cookies.delete("hilo-admin-session");
  return response;
}
