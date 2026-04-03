import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateComponentsHash } from '@/lib/utils'
import type { DesignComponents } from '@/types'

const hasDatabase = !!process.env.DATABASE_URL

// POST /api/designs/detect - Detectar si diseño es nuevo o existente
export async function POST(request: Request) {
  // Sin base de datos, siempre es diseño nuevo
  if (!hasDatabase) {
    return NextResponse.json({
      isNewDesign: true,
      matchedProductId: null,
      matchedProductName: null,
      message: 'Diseño personalizado nuevo (sin base de datos)',
    })
  }

  try {
    const body = await request.json()
    const { components } = body as { components: DesignComponents }

    // Generar hash de los componentes
    const hash = generateComponentsHash(components)

    // Buscar si existe un producto con este hash
    const existingProduct = await prisma.product.findFirst({
      where: {
        componentsHash: hash,
        isCustomDesign: true,
        isActive: true,
      },
    })

    if (existingProduct) {
      return NextResponse.json({
        isNewDesign: false,
        matchedProductId: existingProduct.id,
        matchedProductName: existingProduct.name,
        message: 'Diseño existente en el catálogo',
      })
    }

    // Diseño nuevo - verificar si existe pero inactivo
    const inactiveProduct = await prisma.product.findFirst({
      where: {
        componentsHash: hash,
        isCustomDesign: true,
        isActive: false,
      },
    })

    if (inactiveProduct) {
      return NextResponse.json({
        isNewDesign: false,
        matchedProductId: inactiveProduct.id,
        matchedProductName: inactiveProduct.name,
        message: 'Diseño existente (pendiente de activación)',
      })
    }

    return NextResponse.json({
      isNewDesign: true,
      matchedProductId: null,
      matchedProductName: null,
      message: 'Diseño personalizado nuevo',
    })
  } catch (error) {
    console.error('Error detecting design:', error)
    return NextResponse.json(
      { error: 'Error al detectar diseño' },
      { status: 500 }
    )
  }
}