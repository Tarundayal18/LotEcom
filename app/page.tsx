"use client"

import { useState } from "react"
import { ShoppingCart, LogOut, Menu, X, User } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { ProductListing } from "@/components/product-listing"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProfilePage } from "@/components/profile-page"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState("products")
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([])
  const [userData, setUserData] = useState<any>(null)

  const handleLogin = (data: any) => {
    setUserData(data)
    setIsLoggedIn(true)
    setCurrentPage("products")
  }

  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const handleClearAllCart = () => {
    if (window.confirm("Are you sure you want to clear all items from your cart?")) {
      setCartItems([])
    }
  }

  const handleUpdateProfile = (data: any) => {
    setUserData(data)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                ⚡
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">TechHub</span>
            </div>

            {/* Mobile Menu Button */}
            {/* <button
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button> */}

            {/* Desktop Navigation */}
            {/* {isLoggedIn && (
              <nav className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => setCurrentPage("products")}
                  className={`font-medium transition-colors ${
                    currentPage === "products" ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  Products
                </button>
              </nav>
            )} */}

            {/* Cart & Auth */}
            <div className="flex items-center gap-4">
              {isLoggedIn && (
                <>
                  <button
                    onClick={() => setCurrentPage("profile")}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === "profile"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <User size={24} />
                  </button>
                  <button
                    onClick={() => setCartOpen(!cartOpen)}
                    className="relative p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <ShoppingCart size={24} />
                    {cartItems.length > 0 && (
                      <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setIsLoggedIn(false)
                  setCurrentPage("products")
                  setCartItems([])
                  setUserData(null)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLoggedIn ? "bg-destructive/20 text-destructive hover:bg-destructive/30" : "hidden"
                }`}
              >
                <LogOut size={20} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {!isLoggedIn ? (
          <LoginForm onLogin={handleLogin} />
        ) : currentPage === "profile" ? (
          <ProfilePage userData={userData} onUpdate={handleUpdateProfile} onBack={() => setCurrentPage("products")} />
        ) : (
          <ProductListing onAddToCart={handleAddToCart} />
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onClearAll={handleClearAllCart}
      />

      {/* Footer */}
      {isLoggedIn && (
        <footer className="border-t border-border bg-card mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg text-foreground mb-4">TechHub</h3>
                <p className="text-muted-foreground text-sm">Your trusted B2B electronics supplier.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Products</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <button className="hover:text-primary transition-colors">Processors</button>
                  </li>
                  <li>
                    <button className="hover:text-primary transition-colors">Memory</button>
                  </li>
                  <li>
                    <button className="hover:text-primary transition-colors">Storage</button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <button className="hover:text-primary transition-colors">Contact</button>
                  </li>
                  <li>
                    <button className="hover:text-primary transition-colors">FAQ</button>
                  </li>
                  <li>
                    <button className="hover:text-primary transition-colors">Shipping Info</button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 TechHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
