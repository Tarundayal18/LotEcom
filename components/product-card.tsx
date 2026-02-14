"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { ImageViewer } from "./image-viewer"

interface ProductCardProps {
  product: {
    id: string
    name: string
    category: string
    price: number
    originalPrice?: number
    discountPercentage?: number
    mainImage?: {
      public_id: string
      url: string
    }
    quantity: number
    isActive: boolean
  }
  onAddToCart: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  
  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0
  const discountPercentage = product.discountPercentage || 
    (product.originalPrice ? Math.round((discountAmount / product.originalPrice) * 100) : 0)
  
  const imageUrl = product.mainImage?.url || "/placeholder.svg"

  const openImageViewer = () => {
    setIsImageViewerOpen(true)
  }

  const closeImageViewer = () => {
    setIsImageViewerOpen(false)
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Image Container */}
        <div className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer" onClick={openImageViewer}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              {discountPercentage}% OFF
            </div>
          )}

          {/* View Image Hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Click to view image</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-lg text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              Rs. {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                Rs. {product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ImageViewer
        isOpen={isImageViewerOpen}
        onClose={closeImageViewer}
        imageUrl={imageUrl}
        productName={product.name}
      />
    </>
  )
}
