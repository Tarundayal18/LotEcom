"use client"

import { useState, useEffect, useMemo } from "react"
import { Filter } from "lucide-react"
import { ProductCard } from "./product-card"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  rating?: number
  numberOfReviews?: number
  mainImage?: {
    public_id: string
    url: string
  }
  quantity: number
  isActive: boolean
}

interface ProductListingProps {
  onAddToCart: (product: { id: string; name: string; price: number }) => void
  isAddingToCart?: boolean
}

export function ProductListing({ onAddToCart, isAddingToCart = false }: ProductListingProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("featured")
  const [filterOpen, setFilterOpen] = useState(false)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://lot-ecom-backend.onrender.com/api/v1/products?page=${currentPage}&limit=10`)
        
        if (!response.ok) {
          if (response.status === 429) {
            // Rate limited, wait and retry once
            console.log('Rate limited, waiting 2 seconds...')
            await new Promise(resolve => setTimeout(resolve, 2000))
            const retryResponse = await fetch(`https://lot-ecom-backend.onrender.com/api/v1/products?page=${currentPage}&limit=10`)
            if (retryResponse.ok) {
              const data = await retryResponse.json()
              setProducts(data.products || data.data || [])
              setTotalPages(data.totalPages || Math.ceil((data.total || data.count) / 10))
            } else {
              throw new Error('Still rate limited after retry')
            }
          } else {
            throw new Error(`HTTP ${response.status}`)
          }
        } else {
          const data = await response.json()
          setProducts(data.products || data.data || [])
          setTotalPages(data.totalPages || Math.ceil((data.total || data.count) / 10))
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        if (errorMessage.includes('429') || errorMessage.includes('Too many requests')) {
          setError('Too many requests. Please wait a moment...')
        } else {
          setError('Failed to fetch products')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage])

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))]

  // Filter products by category
  const filteredProducts = useMemo(() => {
    const filtered = selectedCategory 
      ? products.filter(product => product.category === selectedCategory)
      : products

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a: Product, b: Product) => a.price - b.price)
      case "price-high":
        return filtered.sort((a: Product, b: Product) => b.price - a.price)
      default:
        return filtered
    }
  }, [products, selectedCategory, sortBy])

  const handleAddToCart = (product: Product) => {
    onAddToCart({
      id: product._id,
      name: product.name,
      price: product.price
    })
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary/20 animate-gradient border-b border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance animate-bounce-subtle">Premium Electronics</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Browse our curated selection of enterprise-grade components and systems
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className={`${filterOpen ? "block" : "hidden"} lg:block lg:col-span-1`}>
            <div className="bg-gradient-to-br from-card to-secondary/5 border border-border rounded-xl p-6 sticky top-20 glow-secondary-hover transition-all duration-300">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-primary-foreground">
                  <Filter size={16} />
                </div>
                Filters
              </h2>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4 text-lg">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium transform hover:scale-[1.02] ${
                      selectedCategory === null
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shine-effect glow-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/20 hover:translate-x-1"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium transform hover:scale-[1.02] ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shine-effect glow-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/20 hover:translate-x-1"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 text-lg">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-primary/50"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shine-effect glow-primary-hover transform hover:scale-[1.02]"
              >
                <Filter size={20} className="animate-bounce-subtle" />
                {filterOpen ? "Hide" : "Show"} Filters
              </button>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
              </p>
            </div>

            {/* Products Grid */}
            <div className="bg-gradient-to-br from-card to-secondary/5 border border-border rounded-xl p-6 glow-secondary-hover transition-all duration-300">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={{
                          id: product._id,
                          name: product.name,
                          category: product.category,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          discountPercentage: product.discountPercentage,
                          mainImage: product.mainImage,
                          quantity: product.quantity,
                          isActive: product.isActive
                        }}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shine-effect glow-primary-hover transform hover:scale-[1.02] disabled:transform-none"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shine-effect glow-primary-hover transform hover:scale-[1.02] disabled:transform-none"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
