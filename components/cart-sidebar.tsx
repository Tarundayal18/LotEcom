"use client"

import { X, Trash2, ShoppingCart, Trash } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onRemove: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onClearAll: () => void
  onCheckout: () => void
}

export function CartSidebar({ isOpen, onClose, items, onRemove, onUpdateQuantity, onClearAll, onCheckout }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingCart size={48} className="text-muted mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Your cart is empty</p>
              <p className="text-muted-foreground">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-4 bg-muted rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Qty:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity > 1 ? item.quantity - 1 : 1)}
                          className="w-6 h-6 flex items-center justify-center bg-background border border-border rounded hover:bg-muted transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-background border border-border rounded hover:bg-muted transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm font-semibold text-primary mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors ml-4"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-muted/50 sticky bottom-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg font-bold text-foreground">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={onClearAll}
                className="w-full px-4 py-3 bg-destructive/20 text-destructive rounded-lg font-semibold hover:bg-destructive/30 transition-colors flex items-center justify-center gap-2"
              >
                <Trash size={20} />
                Clear All Cart
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
