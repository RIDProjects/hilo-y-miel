import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.adminSettings.findMany();
    const settingsMap: Record<string, unknown> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Error fetching settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    for (const [key, value] of Object.entries(body)) {
      await prisma.adminSettings.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Error saving settings" }, { status: 500 });
  }
}
