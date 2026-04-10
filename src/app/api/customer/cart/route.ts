import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyCustomerToken } from "@/lib/jwt";

async function getCustomerFromRequest(request: NextRequest) {
  const token = request.cookies.get("hilo-customer-token")?.value;
  return token ? await verifyCustomerToken(token) : null;
}

/** GET /api/customer/cart — devuelve el carrito con items */
export async function GET(request: NextRequest) {
  const payload = await getCustomerFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({
    where: { customer_id: payload.customerId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              is_available: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ cart: cart ?? null });
}

const addItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  notes: z.string().optional(),
});

/** POST /api/customer/cart — agrega o incrementa un item */
export async function POST(request: NextRequest) {
  const payload = await getCustomerFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = addItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { productId, quantity, notes } = parsed.data;

  // Verificar que el producto existe y está disponible
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.is_available) {
    return NextResponse.json(
      { error: "Producto no disponible" },
      { status: 404 }
    );
  }

  // Upsert del carrito (crea si no existe)
  const cart = await prisma.cart.upsert({
    where: { customer_id: payload.customerId },
    create: { customer_id: payload.customerId },
    update: {},
  });

  // Buscar si ya existe el item en el carrito
  const existingItem = await prisma.cartItem.findFirst({
    where: { cart_id: cart.id, product_id: productId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity, notes },
    });
  } else {
    await prisma.cartItem.create({
      data: { cart_id: cart.id, product_id: productId, quantity, notes },
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, images: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ cart: updatedCart });
}

/** DELETE /api/customer/cart — vacía el carrito */
export async function DELETE(request: NextRequest) {
  const payload = await getCustomerFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await prisma.cartItem.deleteMany({
    where: { cart: { customer_id: payload.customerId } },
  });

  return NextResponse.json({ success: true });
}
