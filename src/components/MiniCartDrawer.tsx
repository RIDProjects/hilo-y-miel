"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/order";

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export default function MiniCartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: MiniCartDrawerProps) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--color-bg)] z-50 flex flex-col"
          >
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-display text-[var(--color-text)]">Tu pedido</h2>
                <span className="text-sm text-[var(--color-text-muted)]">({cart.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-[var(--color-border)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)] mb-4" />
                  <p className="text-[var(--color-text-muted)]">Tu pedido está vacío</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Agrega productos del catálogo
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 bg-[#FAFAF7] rounded-lg"
                    >
                      <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--brand-cream-dark)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                            Sin img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[var(--color-text)] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-[var(--brand-green)]">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-1 rounded border border-[var(--color-border)] hover:bg-[var(--color-border)] disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 rounded border border-[var(--color-border)] hover:bg-[var(--color-border)]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onRemove(item.product.id)}
                            className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-[var(--color-border)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--color-text)]">Total</span>
                  <span className="text-xl font-display text-[var(--brand-green)]">
                    {formatPrice(total)}
                  </span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-3 bg-[var(--brand-green)] text-[#FAFAF7] rounded-md hover:bg-[var(--brand-green-mid)] transition-colors font-body"
                >
                  Confirmar pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
