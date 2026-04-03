import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const hasDatabase = !!process.env.DATABASE_URL

// GET /api/products - Listar productos activos
export async function GET(request: Request) {
  // Dev mode without database
  if (!hasDatabase) {
    return NextResponse.json([])
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = {
      isActive: true,
      ...(category && { category: category as any }),
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST /api/products - Crear producto (para admin)
export async function POST(request: Request) {
  // Dev mode without database
  if (!hasDatabase) {
    return NextResponse.json(
      { error: 'Función no disponible sin base de datos' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        category: body.category,
        isCustomDesign: body.isCustomDesign || false,
        components: body.components,
        componentsHash: body.componentsHash,
        isActive: body.isActive !== undefined ? body.isActive : true,
        needsReview: body.needsReview || false,
        createdFromOrder: body.createdFromOrder || false,
        orderId: body.orderId,
        customerEmail: body.customerEmail,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}