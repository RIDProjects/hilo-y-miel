export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  images: string[];
  is_available: boolean;
  is_custom: boolean;
  components: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
  tags: string[];
  featured: boolean;
}

export interface ProductCardProps {
  product: Product;
  onAddToOrder?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
}
