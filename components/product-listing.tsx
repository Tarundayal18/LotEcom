"use client"

import { useState, useEffect, useMemo } from "react"
import { Filter, ShoppingCart } from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  quantity: number
}

interface ProductListingProps {
  onAddToCart: (product: { id: string; name: string; price: number }) => void
}

export function ProductListing({ onAddToCart }: ProductListingProps) {
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
        if (error.message.includes('429') || error.message.includes('Too many requests')) {
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
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Premium Electronics</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Browse our curated selection of enterprise-grade components and systems
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className={`${filterOpen ? "block" : "hidden"} lg:block lg:col-span-1`}>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h2>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4">Category</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors font-medium ${
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors font-medium ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Filter size={20} />
                {filterOpen ? "Hide" : "Show"} Filters
              </button>
            </div>

            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
              </p>
            </div>

            {/* Products Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : (
                <>
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Quantity</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">${product.price}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{product.quantity}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              <ShoppingCart size={16} />
                              Add to Cart
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 bg-muted border-t border-border flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
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
