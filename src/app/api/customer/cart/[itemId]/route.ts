import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyCustomerToken } from "@/lib/jwt";

async function getCustomerFromRequest(request: NextRequest) {
  const token = request.cookies.get("hilo-customer-token")?.value;
  return token ? await verifyCustomerToken(token) : null;
}

async function getOwnedItem(customerId: string, itemId: string) {
  return prisma.cartItem.findFirst({
    where: { id: itemId, cart: { customer_id: customerId } },
  });
}

const patchSchema = z.object({
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

/** PATCH /api/customer/cart/[itemId] — actualiza cantidad/notas */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const payload = await getCustomerFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { itemId } = await params;
  const item = await getOwnedItem(payload.customerId, itemId);
  if (!item) {
    return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: parsed.data,
    include: {
      product: { select: { id: true, name: true, price: true, images: true } },
    },
  });

  return NextResponse.json({ item: updated });
}

/** DELETE /api/customer/cart/[itemId] — elimina un item del carrito */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const payload = await getCustomerFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { itemId } = await params;
  const item = await getOwnedItem(payload.customerId, itemId);
  if (!item) {
    return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}
