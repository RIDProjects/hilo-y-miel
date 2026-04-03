'use client'

import { CATEGORY_OPTIONS, type Category } from '@/types'

interface CategoryFilterProps {
  selectedCategory: Category | null
  onSelectCategory: (category: Category | null) => void
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-[#2C4A2E] dark:bg-[#7CB97C] text-white'
            : 'bg-white dark:bg-[#242B24] text-[#2C4A2E] dark:text-[#E8E6DE] border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20 hover:border-[#2C4A2E] dark:hover:border-[#7CB97C]'
        }`}
      >
        Todos
      </button>

      {CATEGORY_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelectCategory(option.value as Category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === option.value
              ? 'bg-[#2C4A2E] dark:bg-[#7CB97C] text-white'
              : 'bg-white dark:bg-[#242B24] text-[#2C4A2E] dark:text-[#E8E6DE] border border-[#2C4A2E]/20 dark:border-[#7CB97C]/20 hover:border-[#2C4A2E] dark:hover:border-[#7CB97C]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}