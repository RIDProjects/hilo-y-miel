import { NextResponse } from "next/server";

// AdminSettings fue eliminado del schema.
// La configuración ahora se maneja via variables de entorno.
export async function GET() {
  return NextResponse.json({
    whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    message_template: "",
    base_price: 0,
  });
}

export async function POST() {
  return NextResponse.json(
    { error: "La configuración se gestiona vía variables de entorno (.env)" },
    { status: 400 }
  );
}
