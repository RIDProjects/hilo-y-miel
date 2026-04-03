import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const hasDatabase = !!process.env.DATABASE_URL

// GET /api/products/[id] - Obtener producto por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!hasDatabase) {
    return NextResponse.json({ error: 'Base de datos no disponible' }, { status: 503 })
  }

  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!hasDatabase) {
    return NextResponse.json({ error: 'Base de datos no disponible' }, { status: 503 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        category: body.category,
        isActive: body.isActive,
        needsReview: body.needsReview,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Eliminar (soft delete) producto
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!hasDatabase) {
    return NextResponse.json({ error: 'Base de datos no disponible' }, { status: 503 })
  }

  try {
    const { id } = await params

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}