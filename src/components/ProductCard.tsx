"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToOrder?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToOrder, onViewDetail }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleAddToOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToOrder?.(product);
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetail?.(product);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`group relative bg-[#FAFAF7] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
        !product.is_available ? "opacity-70" : ""
      }`}
    >
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[var(--brand-cream-dark)]">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AtNMsbS80yzuLi3jlkkiDMzKCSfetaigURqAoAHQFeigURqAoAHQFeigURqAoAHQFeigURqAoAHQF//Z"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
              Sin imagen
            </div>
          )}

          {product.is_custom && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
              Diseño custom
            </span>
          )}

          {!product.is_available && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="px-3 py-1 bg-gray-700 text-white text-sm font-medium rounded-full">
                Agotado
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-display text-[var(--color-text)] mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[var(--brand-green)] font-medium mb-3">
            {formatPrice(product.price)}
          </p>

          <div className="flex gap-2">
            {product.is_available ? (
              <button
                onClick={handleAddToOrder}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--brand-green)] text-[#FAFAF7] rounded-md hover:bg-[var(--brand-green-mid)] transition-colors text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Agregar
              </button>
            ) : (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Agotado
              </button>
            )}
            <button
              onClick={handleViewDetail}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-[var(--brand-green)] text-[var(--brand-green)] rounded-md hover:bg-[var(--brand-green)]/5 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
