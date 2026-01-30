"use client"

import { useState, useEffect } from "react"
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
  const [loading, setLoading] = useState(true)
  const [quantityUpdateTimeout, setQuantityUpdateTimeout] = useState<NodeJS.Timeout | null>(null)

  // Check for existing token on page load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken')
      console.log('Checking auth status on page load, token:', token)
      
      if (token) {
        // Simple check: if token exists, keep user logged in
        console.log('Token found, keeping user logged in')
        setIsLoggedIn(true)
        setLoading(false)
        
        // Fetch cart data immediately when token is found
        fetchCartData()
        
        // Optional: Validate token with API (but don't logout if it fails)
        fetch('https://lot-ecom-backend.onrender.com/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          console.log('Token validation response status:', response.status)
          return response.json()
        })
        .then(data => {
          console.log('Token validation response data:', data)
          console.log('Data keys:', Object.keys(data))
          
          // Handle nested data structure
          const apiData = data.data || data.user || data
          console.log('API Data:', apiData)
          
          // More flexible validation - check for any user data
          const hasUserData = apiData.username || apiData.email || apiData.id || apiData.name || apiData.companyName
          console.log('Has user data:', hasUserData)
          
          if (hasUserData) {
            // Token is valid, update user data
            setUserData(apiData)
            console.log('User data updated:', apiData)
          } else {
            console.log('Token validation failed, but keeping user logged in')
          }
        })
        .catch(error => {
          console.error('Token validation error:', error)
          console.log('API validation failed, but keeping user logged in')
        })
      } else {
        setLoading(false)
        console.log('No token found, showing login')
      }
    }

    checkAuthStatus()
  }, [])

  // Fetch cart data when user is on products page
  useEffect(() => {
    if (isLoggedIn && currentPage === "products") {
      fetchCartData()
    }
  }, [isLoggedIn, currentPage])

  const handleLogin = async (data: any) => {
    setUserData(data)
    setIsLoggedIn(true)
    setCurrentPage("products")
    
    // Fetch cart data after login
    await fetchCartData()
  }

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      console.log('Fetching cart data')
      
      const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait and retry once
          console.log('Cart API rate limited, waiting 2 seconds...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          const retryResponse = await fetch('https://lot-ecom-backend.onrender.com/api/v1/cart', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
          if (!retryResponse.ok) {
            throw new Error('Cart API still rate limited')
          }
          const data = await retryResponse.json()
          processCartData(data)
        } else {
          throw new Error(`Cart API HTTP ${response.status}`)
        }
      } else {
        const data = await response.json()
        processCartData(data)
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
      // Don't show alerts for cart errors to avoid spam
    }
  }

  const processCartData = (data: any) => {
    console.log('Cart data response:', data)
    
    if (data.success && data.data && data.data.items) {
      // Handle the correct API response structure
      const cartItems = data.data.items
      console.log('Cart items array:', cartItems)
      
      const formattedItems = cartItems.map((item: any) => {
        console.log('Processing cart item:', item)
        return {
          id: item.productId.id || item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity
        }
      })
      
      console.log('Formatted cart items:', formattedItems)
      setCartItems(formattedItems)
    } else {
      console.log('No cart data found or invalid response')
    }
  }

  const handleAddToCart = async (product: { id: string; name: string; price: number }) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Please login to add items to cart')
        return
      }

      console.log('Adding to cart:', product)
      
      const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      })
      
      const data = await response.json()
      console.log('Add to cart response:', data)
      
      if (response.ok) {
        // Refresh cart data from API to get the updated state
        await fetchCartData()
        alert('Product added to cart!')
      } else {
        alert(data.message || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        // Fallback to local state if no token
        setCartItems((prev) => prev.filter((item) => item.id !== productId))
        return
      }

      console.log('Removing from cart:', productId)
      
      const response = await fetch(`https://lot-ecom-backend.onrender.com/api/v1/cart/item/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      console.log('Remove from cart response:', data)
      
      if (response.ok) {
        // Refresh cart data from API to get the updated state
        await fetchCartData()
      } else {
        alert(data.message || 'Failed to remove from cart')
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    // Clear any existing timeout
    if (quantityUpdateTimeout) {
      clearTimeout(quantityUpdateTimeout)
    }

    // Update UI immediately for better UX
    setCartItems((prev) => 
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )

    // Debounce API call to prevent rapid requests
    const timeout = setTimeout(async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          return
        }

        console.log('Debounced update cart quantity:', productId, quantity)
        
        if (quantity === 0) {
          // Remove item if quantity is 0
          await handleRemoveFromCart(productId)
          return
        }

        // Try PUT API first, if it fails, fallback to POST API to add item with new quantity
        try {
          const response = await fetch(`https://lot-ecom-backend.onrender.com/api/v1/cart/item/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log('Update quantity response:', data)
            // Refresh cart data from API to get the updated state
            fetchCartData() // Don't await, let it run in background
          } else {
            // PUT API not available, use fallback silently
            throw new Error('PUT API not available')
          }
        } catch (putError) {
          // Fallback: Remove item and add it again with new quantity
          try {
            // Remove the item first
            await fetch(`https://lot-ecom-backend.onrender.com/api/v1/cart/item/${productId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            })
            
            // Add it back with new quantity
            const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                productId: productId,
                quantity: quantity
              })
            })
            
            const data = await response.json()
            console.log('Add item with new quantity response:', data)
            
            if (response.ok) {
              // Refresh cart data from API to get the updated state
              fetchCartData() // Don't await, let it run in background
            }
          } catch (fallbackError) {
            console.error('Fallback approach failed:', fallbackError)
            // Revert UI change if API fails
            fetchCartData()
          }
        }
      } catch (error) {
        console.error('Update quantity error:', error)
        // Revert UI change on error
        fetchCartData()
      }
    }, 500) // 500ms debounce delay

    setQuantityUpdateTimeout(timeout)
  }

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Please login to checkout')
        return
      }

      if (cartItems.length === 0) {
        alert('Your cart is empty')
        return
      }

      console.log('Creating checkout estimate...')
      
      const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/estimate/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      })
      
      const data = await response.json()
      console.log('Checkout response:', data)
      
      if (response.ok) {
        alert('Order placed successfully! Estimate created.')
        setCartOpen(false)
        // Refresh cart data after successful checkout
        await fetchCartData()
        // Optionally clear cart after successful checkout
        // setCartItems([])
      } else {
        alert(data.message || 'Failed to create estimate')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleClearAllCart = async () => {
    if (!window.confirm("Are you sure you want to clear all items from your cart?")) {
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        // Fallback to local state if no token
        setCartItems([])
        return
      }

      console.log('Clearing entire cart')
      
      const response = await fetch('https://lot-ecom-backend.onrender.com/api/v1/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      console.log('Clear cart response:', data)
      
      if (response.ok) {
        // Refresh cart data from API to get the updated state
        await fetchCartData()
        alert('Cart cleared successfully!')
      } else {
        alert(data.message || 'Failed to clear cart')
      }
    } catch (error) {
      console.error('Clear cart error:', error)
      alert('Network error. Please try again.')
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
                  if (confirm("Are you sure you want to logout?")) {
                    // Clear localStorage
                    localStorage.removeItem('authToken')
                    
                    // Reset app state
                    setIsLoggedIn(false)
                    setCurrentPage("products")
                    setCartItems([])
                    setUserData(null)
                  }
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
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Checking authentication...</p>
            </div>
          </div>
        ) : !isLoggedIn ? (
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
        onUpdateQuantity={handleUpdateQuantity}
        onClearAll={handleClearAllCart}
        onCheckout={handleCheckout}
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
