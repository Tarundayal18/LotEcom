"use client"

import { useState, useMemo } from "react"
import { Filter } from "lucide-react"
import { ProductCard } from "./product-card"

const PRODUCTS = [
  {
    id: "1",
    name: "Intel Core i9-14900K",
    category: "Processors",
    price: 689,
    rating: 4.9,
    reviews: 342,
    image: "/intel-processor.jpg",
    specs: "24 Cores, 5.8GHz Turbo",
  },
  {
    id: "2",
    name: "AMD Ryzen 9 7950X",
    category: "Processors",
    price: 549,
    rating: 4.8,
    reviews: 298,
    image: "/amd-processor.jpg",
    specs: "16 Cores, 5.7GHz Turbo",
  },
  {
    id: "3",
    name: "NVIDIA RTX 4090",
    category: "Graphics Cards",
    price: 1999,
    rating: 4.9,
    reviews: 567,
    image: "/graphics-card.jpg",
    specs: "24GB GDDR6X Memory",
  },
  {
    id: "4",
    name: "Corsair Vengeance 64GB DDR5",
    category: "Memory",
    price: 299,
    rating: 4.7,
    reviews: 189,
    image: "/ram-memory.jpg",
    specs: "6000MHz, RGB Lighting",
  },
  {
    id: "5",
    name: "Samsung 990 Pro 4TB NVMe",
    category: "Storage",
    price: 399,
    rating: 4.8,
    reviews: 421,
    image: "/ssd-storage.jpg",
    specs: "7450MB/s Read Speed",
  },
  {
    id: "6",
    name: "Crucial P5 Plus 2TB SSD",
    category: "Storage",
    price: 169,
    rating: 4.6,
    reviews: 234,
    image: "/ssd-crucial.jpg",
    specs: "6600MB/s Read Speed",
  },
  {
    id: "7",
    name: "EVGA SuperNOVA 1000W PSU",
    category: "Power Supply",
    price: 189,
    rating: 4.8,
    reviews: 342,
    image: "/power-supply.jpg",
    specs: "80 PLUS Gold Certified",
  },
  {
    id: "8",
    name: "Noctua NH-D15 CPU Cooler",
    category: "Cooling",
    price: 99,
    rating: 4.9,
    reviews: 567,
    image: "/cpu-cooler.jpg",
    specs: "LGA1700 Compatible",
  },
]

interface ProductListingProps {
  onAddToCart: (product: { id: string; name: string; price: number }) => void
}

export function ProductListing({ onAddToCart }: ProductListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("featured")
  const [filterOpen, setFilterOpen] = useState(false)

  const categories = useMemo(() => Array.from(new Set(PRODUCTS.map((p) => p.category))), [])

  const filteredProducts = useMemo(() => {
    const products = selectedCategory ? PRODUCTS.filter((p) => p.category === selectedCategory) : PRODUCTS

    switch (sortBy) {
      case "price-low":
        return products.sort((a, b) => a.price - b.price)
      case "price-high":
        return products.sort((a, b) => b.price - a.price)
      case "rating":
        return products.sort((a, b) => b.rating - a.rating)
      default:
        return products
    }
  }, [selectedCategory, sortBy])

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

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => onAddToCart(product)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
