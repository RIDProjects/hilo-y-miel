import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const hasDatabase = !!process.env.DATABASE_URL

// GET /api/admin/products - Listar todos los productos (incluyendo inactivos)
export async function GET() {
  if (!hasDatabase) {
    return NextResponse.json([])
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Crear nuevo producto
export async function POST(request: Request) {
  if (!hasDatabase) {
    return NextResponse.json(
      { error: 'Función no disponible sin base de datos' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { name, description, price, category, imageUrl } = body

    if (!name || !price || !category || !imageUrl) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price,
        category,
        imageUrl,
        isCustomDesign: false,
        isActive: true,
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