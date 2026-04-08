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
    stock?: number
    isActive: boolean
  }
  onAddToCart: () => void
  onRemoveFromCart?: (productId: string) => void
  onUpdateQuantity?: (productId: string, quantity: number) => void
  cartQuantity?: number
  isAddingToCart?: boolean
  isRemovingFromCart?: boolean
  isUpdatingQuantity?: boolean
}

export function ProductCard({ product, onAddToCart, onRemoveFromCart, onUpdateQuantity, cartQuantity = 0, isAddingToCart = false, isRemovingFromCart = false, isUpdatingQuantity = false }: ProductCardProps) {
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

  const isOutOfStock = product.stock === 0 || product.quantity === 0
  
  return (
    <>
      <div className={`bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 group glow-primary-hover relative ${
        isOutOfStock 
          ? 'opacity-80 hover:scale-100 hover:-translate-y-0' 
          : 'hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1'
      }`}>
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

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl z-10">
              <div className="text-center">
                <div className="bg-destructive text-white px-4 py-2 rounded-full font-bold text-lg mb-2">
                  Out of Stock
                </div>
                <p className="text-white text-sm">This product is currently unavailable</p>
              </div>
            </div>
          )}

          {/* Add to Cart / Quantity Controls */}
          <div className="flex gap-2">
            {isOutOfStock ? (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-muted text-muted-foreground rounded-xl font-semibold cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Out of Stock
              </button>
            ) : cartQuantity > 0 ? (
              <>
                {/* Show quantity controls if item is in cart */}
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg p-2">
                  <button
                    onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, Math.max(1, cartQuantity - 1))}
                    disabled={isUpdatingQuantity || cartQuantity <= 1}
                    className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm font-medium">-</span>
                  </button>
                  <span className="flex-1 text-center font-semibold text-foreground">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, cartQuantity + 1)}
                    disabled={isUpdatingQuantity}
                    className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm font-medium">+</span>
                  </button>
                </div>
                <button
                  onClick={() => onRemoveFromCart && onRemoveFromCart(product.id)}
                  disabled={isRemovingFromCart}
                  className="px-3 py-2 bg-destructive/20 text-destructive rounded-lg font-medium hover:bg-destructive/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRemovingFromCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Removing...
                    </>
                  ) : (
                    <>
                      <span className="text-sm">Remove from Cart</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Show Add to Cart button if item is not in cart */}
                <button
                  onClick={onAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 active:scale-95 transition-all duration-300 shine-effect glow-primary-hover transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} className="animate-bounce-subtle" />
                      Add to Cart
                    </>
                  )}
                </button>
              </>
            )}
          </div>
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
