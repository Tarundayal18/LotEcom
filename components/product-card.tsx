"use client"

import { ShoppingCart, Star } from "lucide-react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    rating: number
    reviews: number
    image: string
    specs: string
  }
  onAddToCart: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
      {/* Image Container */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ${product.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product.specs}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} <span className="text-xs">({product.reviews})</span>
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
