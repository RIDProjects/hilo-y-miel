import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const hasDatabase = !!process.env.DATABASE_URL

// GET /api/admin/orders - Listar todos los pedidos
export async function GET() {
  if (!hasDatabase) {
    return NextResponse.json([])
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
      },
    })

    // Parse items JSON for each order
    const ordersWithParsedItems = orders.map((order: any) => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    }))

    return NextResponse.json(ordersWithParsedItems)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders - Actualizar estado de un pedido
export async function PUT(request: Request) {
  if (!hasDatabase) {
    return NextResponse.json(
      { error: 'Función no disponible sin base de datos' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      )
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Error al actualizar pedido' },
      { status: 500 }
    )
  }
}