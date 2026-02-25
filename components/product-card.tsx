"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { ImageViewer } from "./image-viewer"

interface ProductCardProps {
  product: {
    id: string
    name: string
    category: string
    productCode?: string
    moq?: number
    price: number
    totalPrice?: number
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
  
  // Debug: Check totalPrice
  console.log('ProductCard - totalPrice:', product.totalPrice)
  console.log('ProductCard - moq:', product.moq)
  console.log('ProductCard - price:', product.price)
  
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
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] hover:-translate-y-1 glow-primary-hover">
        {/* Image Container */}
        <div className="relative h-64 bg-muted overflow-hidden cursor-pointer" onClick={openImageViewer}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-bold shine-effect">
              {discountPercentage}% OFF
            </div>
          )}

          {/* View Image Hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg transform translate-y-2 group-hover:translate-y-0">
              <span className="text-sm font-medium text-foreground">Click to view image</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            {product.category}
            {product.productCode && (
              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary rounded-full text-xs font-semibold">
                {product.productCode}
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-lg text-foreground mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Price and MOQ */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                Rs. {product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  Rs. {product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {/* MOQ and Total Price */}
            {product.moq && product.moq > 1 && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">MOQ:</span>
                  <span className="text-sm font-bold text-primary">{product.moq} units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Price:</span>
                  <span className="text-sm font-bold text-foreground">
                    Rs. {(product.price * product.moq).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 active:scale-95 transition-all duration-300 shine-effect glow-primary-hover transform hover:-translate-y-0.5"
          >
            <ShoppingCart size={20} className="animate-bounce-subtle" />
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
