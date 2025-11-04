'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import ProductCard from '@/components/ProductCard'

export default function CustomerProducts() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(false)

  // Fetch products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products', {
        params: { search, category },
      })
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch initially when search/category changes (with debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts()
    }, 400)
    return () => clearTimeout(delayDebounce)
  }, [search, category])

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Browse Products</h1>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search for milk, butter, cheese..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-1/3 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
        >
          <option value="All">All Categories</option>
          <option value="Milk">Milk</option>
          <option value="Curd">Curd</option>
          <option value="Butter">Butter</option>
          <option value="Cheese">Cheese</option>
          <option value="Ghee">Ghee</option>
          <option value="Paneer">Paneer</option>
          <option value="Flavored Milk">Flavored Milk</option>
          <option value="Fruit">Fruit</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Dry Fruit">Dry Fruit</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-center text-gray-600 col-span-full">
            Loading products...
          </p>
        ) : products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No products found.
          </p>
        )}
      </div>
    </div>
  )
}
