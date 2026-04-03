'use client'

import { useCartStore } from '@/store/cart'

interface CartIconProps {
  onClick?: () => void
}

export function CartIcon({ onClick }: CartIconProps) {
  const itemCount = useCartStore((state) => state.getTotalItems())

  return (
    <button
      onClick={onClick}
      className="relative rounded-lg bg-amber-500 dark:bg-amber-600 p-2 text-white hover:bg-amber-600 dark:hover:bg-amber-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  )
}