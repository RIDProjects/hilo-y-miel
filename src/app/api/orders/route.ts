import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const hasDatabase = !!process.env.DATABASE_URL

// GET /api/orders - Listar pedidos (para admin)
export async function GET() {
  if (!hasDatabase) {
    return NextResponse.json([])
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Crear nuevo pedido
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { customerName, customerEmail, customerPhone, notes, items } = body

    // Validar campos obligatorios
    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios' },
        { status: 400 }
      )
    }

    // Si hay base de datos, guardar el pedido
    if (hasDatabase) {
      const hasCustomDesigns = items.some(
        (item: { type: string }) => item.type === 'custom'
      )

      const order = await prisma.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          notes,
          items: JSON.stringify(items),
          isCustomDesign: hasCustomDesigns,
          status: 'PENDING',
        },
      })

      return NextResponse.json(order, { status: 201 })
    }

    // Sin base de datos, retornar éxito sin guardar
    return NextResponse.json(
      { message: 'Pedido procesado (sin base de datos)', success: true },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    )
  }
}